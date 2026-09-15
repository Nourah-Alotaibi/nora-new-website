let context: AudioContext | undefined;
const buffers = new Map<string, Promise<AudioBuffer>>();
let pouring: AudioBufferSourceNode | undefined;
let relaxed: AudioBufferSourceNode | undefined;
let pourRequest = 0;
let relaxRequest = 0;
export function audioContext() { return context ??= new AudioContext({ latencyHint: "interactive" }); }
function loadClip(name: string): Promise<AudioBuffer> {
  const existing = buffers.get(name);
  if (existing) return existing;
  const request = (async () => {
    const response = await fetch(`/audio/${name}`);
    if (!response.ok) throw new Error("Audio unavailable");
    return audioContext().decodeAudioData(await response.arrayBuffer());
  })().catch(error => { buffers.delete(name); throw error; });
  buffers.set(name, request);
  return request;
}
export function preloadPourAudio() {
  return Promise.all([loadClip("matcha-pouring-ready.wav"), loadClip("studio-after-pour.mp3")]);
}
export function stopPourAudio() { pourRequest++; pouring?.stop(); pouring = undefined; }
export function stopStudioAudio() { stopPourAudio(); relaxRequest++; relaxed?.stop(); relaxed = undefined; }
export async function finishPourAudio() {
  stopStudioAudio();
  const request = relaxRequest;
  const ctx = audioContext();
  const [, buffer] = await Promise.all([ctx.resume(), loadClip("studio-after-pour.mp3")]);
  if (request !== relaxRequest || ctx.state !== "running") return;
  relaxed = ctx.createBufferSource(); relaxed.buffer = buffer;
  relaxed.connect(ctx.destination); relaxed.start();
}
export async function startPourAudio() {
  stopStudioAudio();
  const request = pourRequest;
  const ctx = audioContext();
  // Resume inside the gesture; only the pouring clip is needed to begin.
  const [, buffer] = await Promise.all([ctx.resume(), loadClip("matcha-pouring-ready.wav")]);
  if (request !== pourRequest || ctx.state !== "running") return;
  pouring = ctx.createBufferSource(); pouring.buffer = buffer; pouring.loop = true;
  pouring.connect(ctx.destination); pouring.start();
}
