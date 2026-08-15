import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

const MUTE_KEY = 'funquest.audio.muted';
const VOLUME_KEY = 'funquest.audio.volume';

interface GameAudioContextValue {
  muted: boolean;
  volume: number;
  setMuted: (m: boolean) => void;
  toggleMute: () => void;
  setVolume: (v: number) => void;
  /** Play an audio URL (e.g. a step's instruction_audio_url). No-op when muted or url empty. */
  play: (url: string | null | undefined) => Promise<void>;
  stop: () => void;
}

const GameAudioContext = createContext<GameAudioContextValue | undefined>(undefined);

function readBool(key: string, fallback: boolean) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : raw === 'true';
  } catch {
    return fallback;
  }
}

function readNumber(key: string, fallback: number) {
  try {
    const raw = localStorage.getItem(key);
    const n = raw === null ? NaN : parseFloat(raw);
    return Number.isFinite(n) ? Math.min(1, Math.max(0, n)) : fallback;
  } catch {
    return fallback;
  }
}

export function GameAudioProvider({ children }: { children: React.ReactNode }) {
  const [muted, setMutedState] = useState(() => readBool(MUTE_KEY, false));
  const [volume, setVolumeState] = useState(() => readNumber(VOLUME_KEY, 0.8));
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const getAudio = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.preload = 'auto';
    }
    return audioRef.current;
  }, []);

  const stop = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    try {
      el.pause();
      el.currentTime = 0;
    } catch {
      /* noop */
    }
  }, []);

  const setMuted = useCallback((m: boolean) => {
    setMutedState(m);
    try { localStorage.setItem(MUTE_KEY, String(m)); } catch { /* noop */ }
  }, []);

  const toggleMute = useCallback(() => setMuted(!muted), [muted, setMuted]);

  const setVolume = useCallback((v: number) => {
    const clamped = Math.min(1, Math.max(0, v));
    setVolumeState(clamped);
    try { localStorage.setItem(VOLUME_KEY, String(clamped)); } catch { /* noop */ }
    if (clamped > 0 && muted) setMuted(false);
  }, [muted, setMuted]);

  // Keep the live element in sync with settings
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.muted = muted;
    el.volume = volume;
    if (muted) stop();
  }, [muted, volume, stop]);

  const play = useCallback(async (url: string | null | undefined) => {
    if (!url || muted || volume === 0) return;
    const el = getAudio();
    try {
      el.pause();
      el.src = url;
      el.muted = muted;
      el.volume = volume;
      el.currentTime = 0;
      await el.play();
    } catch (err) {
      // Autoplay restrictions or a missing file should never break gameplay.
      console.warn('[GameAudio] playback skipped:', (err as Error)?.message, url);
    }
  }, [getAudio, muted, volume]);

  // Cleanup on unmount
  useEffect(() => () => {
    try { audioRef.current?.pause(); } catch { /* noop */ }
    audioRef.current = null;
  }, []);

  const value = useMemo(
    () => ({ muted, volume, setMuted, toggleMute, setVolume, play, stop }),
    [muted, volume, setMuted, toggleMute, setVolume, play, stop]
  );

  return <GameAudioContext.Provider value={value}>{children}</GameAudioContext.Provider>;
}

export function useGameAudio() {
  const ctx = useContext(GameAudioContext);
  if (!ctx) throw new Error('useGameAudio must be used within a GameAudioProvider');
  return ctx;
}
