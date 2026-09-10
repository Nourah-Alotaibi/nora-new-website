import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react";
export type StudioAudioHandle = { start: () => void };
const StudioAudio = forwardRef<StudioAudioHandle, { intro: boolean }>(function StudioAudio({ intro }, ref) {
  const audio = useRef<HTMLAudioElement>(null);
  const pending = useRef(false);
  const started = useRef(false);
  const attempt = useCallback(() => {
    const track = audio.current;
    if (!track || !pending.current || started.current) return;
    void track.play().then(() => { started.current = true; pending.current = false; }).catch(() => {});
  }, []);
  const start = useCallback(() => { if (!started.current) { pending.current = true; attempt(); } }, [attempt]);
  useImperativeHandle(ref, () => ({ start }), [start]);
  useEffect(() => {
    const track = audio.current;
    if (track) { track.volume = 1; track.load(); }
    document.addEventListener("click", attempt, true);
    document.addEventListener("touchend", attempt, true);
    document.addEventListener("keydown", attempt, true);
    return () => {
      pending.current = false;
      track?.pause();
      document.removeEventListener("click", attempt, true);
      document.removeEventListener("touchend", attempt, true);
      document.removeEventListener("keydown", attempt, true);
    };
  }, [attempt]);
  useEffect(() => {
    if (intro) { pending.current = false; started.current = false; audio.current?.pause(); if (audio.current) audio.current.currentTime = 0; }
    else start();
  }, [intro, start]);
  return <audio ref={audio} src="/audio/studio-after-pour.mp3" preload="auto" />;
});
export default StudioAudio;
