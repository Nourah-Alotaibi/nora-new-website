import { audioContext } from "./pourAudio";

type Recording = "cookie" | "whisk" | "stir" | "pour";
const recordings: Partial<Record<Recording, AudioBuffer>> = {};
let loading: Promise<void> | undefined;
export function preloadDeskRecordings() {
  return loading ??= Promise.all((["cookie", "whisk", "stir", "pour"] as Recording[]).map(async name => {
    const response = await fetch(name === "pour" ? "/audio/matcha-pouring-ready.wav" : name === "stir" ? "/audio/desk-stir-ice.wav" : `/audio/desk-${name}.wav`);
    if (!response.ok) throw new Error("Desk recording unavailable");
    recordings[name] = await audioContext().decodeAudioData(await response.arrayBuffer());
  })).then(() => {}).catch(error => { loading = undefined; throw error; });
}

/** Prepared once when the desk loads; gestures only schedule audio nodes. */
export function createDeskSounds() {
  const ctx = audioContext();
  const noise = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
  const samples = noise.getChannelData(0);
  let seed = 73451;
  for (let i = 0; i < samples.length; i++) {
    seed = (Math.imul(seed, 1664525) + 1013904223) | 0;
    samples[i] = (seed >>> 0) / 2147483648 - 1;
  }
  const sources = new Set<AudioScheduledSourceNode>();
  const groups = new Map<string, Set<AudioScheduledSourceNode>>();
  const output = ctx.createGain();
  output.gain.value = .65;
  output.connect(ctx.destination);
  let disposed = false;
  function track(source: AudioScheduledSourceNode, group: string, nodes: AudioNode[]) {
    sources.add(source);
    if (!groups.has(group)) groups.set(group, new Set());
    groups.get(group)!.add(source);
    source.onended = () => {
      sources.delete(source); groups.get(group)?.delete(source);
      source.disconnect(); nodes.forEach(node => node.disconnect());
    };
  }
  function stop(group: string) {
    groups.get(group)?.forEach(source => { try { source.stop(); } catch {} });
    groups.delete(group);
  }
  function ready(group: string) {
    if (disposed) return false;
    // Do not await device resume: queue audio in this gesture immediately.
    if (ctx.state !== "running") void ctx.resume().catch(() => {});
    stop(group); return true;
  }
  function rustle(group: string, delay: number, duration: number, frequency: number, volume: number) {
    const source = ctx.createBufferSource(), filter = ctx.createBiquadFilter(), gain = ctx.createGain();
    source.buffer = noise;
    filter.type = "bandpass"; filter.frequency.value = frequency; filter.Q.value = .65;
    const t = ctx.currentTime + delay;
    gain.gain.setValueAtTime(.0001, t);
    gain.gain.exponentialRampToValueAtTime(volume, t + .003);
    gain.gain.exponentialRampToValueAtTime(.0001, t + duration);
    source.connect(filter); filter.connect(gain); gain.connect(output);
    track(source, group, [filter, gain]);
    source.start(t, Math.random() * .25); source.stop(t + duration);
  }
  function clink(group: string, delay: number, frequency: number, volume: number) {
    [1, 2.71].forEach((ratio, i) => {
      const source = ctx.createOscillator(), gain = ctx.createGain();
      const t = ctx.currentTime + delay;
      source.frequency.setValueAtTime(frequency * ratio, t);
      gain.gain.setValueAtTime(volume / (i + 1), t);
      gain.gain.exponentialRampToValueAtTime(.0001, t + .18);
      source.connect(gain); gain.connect(output); track(source, group, [gain]);
      source.start(t); source.stop(t + .2);
    });
  }
  function recording(name: Recording, group: string, volume: number, duration?: number) {
    if (!ready(group)) return;
    const buffer = recordings[name];
    if (!buffer) return; // Never queue a late sound or fall back to synthetic noise.
    const source = ctx.createBufferSource(), gain = ctx.createGain();
    source.buffer = buffer; gain.gain.value = volume;
    source.connect(gain); gain.connect(output); track(source, group, [gain]);
    const start = ctx.currentTime;
    source.start(start);
    if (duration) {
      gain.gain.setValueAtTime(volume, start + Math.max(0, duration - .025));
      gain.gain.linearRampToValueAtTime(0, start + duration);
      source.stop(start + duration);
    }
  }
  return {
    whisk() { recording("whisk", "ritual", .7); },
    pour() { recording("pour", "ritual", .85, 1.5); },
    ice(reduced = false) {
      if (!ready("ice")) return;
      clink("ice", 0, 1800, .075);
      [0, .15, .3].forEach((delay, i) => {
        clink("ice", reduced ? delay : .65 + delay, 2100 - i * 190, .095);
        rustle("ice", reduced ? delay : .65 + delay, .13, 750, .075);
      });
    },
    stir() { recording("stir", "stir", .65); },
    bite() { recording("cookie", "bite", .75); },
    dispose() {
      disposed = true;
      sources.forEach(source => { try { source.stop(); } catch {} });
      output.disconnect();
    }
  };
}
