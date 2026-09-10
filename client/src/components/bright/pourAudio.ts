let context: AudioContext | undefined;
let buffers: Promise<AudioBuffer[]> | undefined;
let decoded: AudioBuffer[] | undefined;
let pouring: AudioBufferSourceNode | undefined;
let relaxed: AudioBufferSourceNode | undefined;
export function audioContext() { return context ??= new AudioContext({ latencyHint: "interactive" }); }
export function preloadPourAudio() {
  const ctx = audioContext();
  return buffers ??= Promise.all(["matcha-pouring-ready.wav", "studio-after-pour.mp3"].map(async name => {
    const response = await fetch(`/audio/${name}`);
    if (!response.ok) throw new Error("Audio unavailable");
    const buffer = await ctx.decodeAudioData(await response.arrayBuffer());
    if (name !== "matcha-pouring.mp3") return buffer;
    // Skip leading recording silence, retaining a tiny natural attack.
    let first = buffer.length;
    for (let ch = 0; ch < buffer.numberOfChannels; ch++) {
      const samples = buffer.getChannelData(ch);
      for (let i = 0; i < samples.length; i++) {
        if (Math.abs(samples[i]) > 0.006) { first = Math.min(first, i); break; }
      }
    }
    const offset = Math.max(0, first - Math.round(buffer.sampleRate * 0.005));
    if (first === buffer.length || offset === 0) return buffer;
    const trimmed = ctx.createBuffer(buffer.numberOfChannels, buffer.length - offset, buffer.sampleRate);
    for (let ch = 0; ch < buffer.numberOfChannels; ch++) trimmed.copyToChannel(buffer.getChannelData(ch).subarray(offset), ch);
    return trimmed;
  })).then(result => { decoded = result; return result; }).catch(error => { buffers = undefined; throw error; });
}
export async function unlockPourAudio() {
  const ctx = audioContext();
  await Promise.all([ctx.resume(), preloadPourAudio()]);
  if (ctx.state !== "running") throw new Error("Audio needs a tap");
}
export function stopPourAudio() { pouring?.stop(); pouring = undefined; }
export function stopStudioAudio() { stopPourAudio(); relaxed?.stop(); relaxed = undefined; }
export function playPourAudio() {
  if (!decoded) throw new Error("Audio still loading");
  const [buffer] = decoded;
  stopStudioAudio();
  pouring = audioContext().createBufferSource();
  pouring.buffer = buffer; pouring.loop = true;
  pouring.connect(audioContext().destination); pouring.start();
}
export async function finishPourAudio() {
  const [,buffer] = await preloadPourAudio();
  stopPourAudio();
  relaxed = audioContext().createBufferSource(); relaxed.buffer = buffer;
  relaxed.connect(audioContext().destination); relaxed.start();
}

// Queue the decoded clip in the gesture itself, before waiting for device wake-up.
export async function startPourAudio() {
  const ctx = audioContext();
  const resumed = ctx.resume();
  if (decoded) playPourAudio();
  else { await preloadPourAudio(); playPourAudio(); }
  await resumed;
  if (ctx.state !== "running") { stopPourAudio(); throw new Error("Audio needs a tap"); }
}
