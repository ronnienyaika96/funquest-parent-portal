import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const MUTE_KEY = 'funquest.audio.muted';
const VOLUME_KEY = 'funquest.audio.volume';

export type GameSoundEvent = 'tap' | 'correct' | 'drop' | 'drag' | 'match' | 'perfectMatch';

export const GAME_SOUND_FILES: Record<GameSoundEvent, string> = {
  tap: 'tap.mp3',
  correct: 'correct 1.mp3',
  drop: 'drop.mp3',
  drag: 'sliding 1.mp3',
  match: 'cartoon-music-soundtrack-glock-correct-answer-504462.mp3',
  perfectMatch: 'perfect match.mp3',
};

const GAME_SOUND_URLS = Object.fromEntries(
  Object.entries(GAME_SOUND_FILES).map(([event, file]) => [
    event,
    supabase.storage.from('audio').getPublicUrl(file).data.publicUrl,
  ])
) as Record<GameSoundEvent, string>;

interface GameAudioContextValue {
  muted: boolean;
  volume: number;
  setMuted: (m: boolean) => void;
  toggleMute: () => void;
  setVolume: (v: number) => void;
  /** Play an audio URL (e.g. a step's instruction_audio_url). No-op when muted or url empty. */
  play: (url: string | null | undefined) => Promise<void>;
  playTap: (interactionId?: string) => void;
  playCorrect: (interactionId?: string) => void;
  playDrop: (interactionId?: string) => void;
  playDrag: (interactionId?: string) => void;
  playMatch: (interactionId?: string) => void;
  playPerfectMatch: (interactionId?: string) => void;
  stopDrag: () => void;
  stopEffects: () => void;
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
  const effectRefs = useRef(new Set<HTMLAudioElement>());
  const dragRef = useRef<HTMLAudioElement | null>(null);
  const eventKeysRef = useRef(new Set<string>());

  const getAudio = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.preload = 'auto';
    }
    return audioRef.current;
  }, []);

  const stopInstruction = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    try {
      el.pause();
      el.currentTime = 0;
    } catch {
      /* noop */
    }
  }, []);

  const stopDrag = useCallback(() => {
    const el = dragRef.current;
    if (!el) return;
    try {
      el.pause();
      el.currentTime = 0;
    } catch { /* noop */ }
    dragRef.current = null;
  }, []);

  const stopEffects = useCallback(() => {
    effectRefs.current.forEach((el) => {
      try {
        el.pause();
        el.currentTime = 0;
      } catch { /* noop */ }
    });
    effectRefs.current.clear();
    eventKeysRef.current.clear();
    stopDrag();
  }, [stopDrag]);

  const stop = useCallback(() => {
    stopInstruction();
    stopEffects();
  }, [stopEffects, stopInstruction]);

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
    effectRefs.current.forEach((el) => {
      el.muted = muted;
      el.volume = volume;
    });
    if (dragRef.current) {
      dragRef.current.muted = muted;
      dragRef.current.volume = volume;
    }
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

  const playEvent = useCallback((event: GameSoundEvent, interactionId?: string) => {
    if (muted || volume === 0) return;
    const dedupeKey = interactionId ? `${event}:${interactionId}` : null;
    if (dedupeKey && eventKeysRef.current.has(dedupeKey)) return;
    if (dedupeKey) eventKeysRef.current.add(dedupeKey);

    const el = new Audio(GAME_SOUND_URLS[event]);
    el.preload = 'auto';
    el.muted = muted;
    el.volume = volume;

    const release = () => {
      effectRefs.current.delete(el);
      if (dragRef.current === el) dragRef.current = null;
    };
    el.addEventListener('ended', release, { once: true });
    el.addEventListener('error', () => {
      console.warn(`[GameAudio] could not load ${event}:`, GAME_SOUND_FILES[event]);
      release();
    }, { once: true });

    if (event === 'drag') {
      stopDrag();
      dragRef.current = el;
    } else {
      effectRefs.current.add(el);
    }

    void el.play().catch((err) => {
      console.warn(`[GameAudio] ${event} playback skipped:`, (err as Error)?.message, GAME_SOUND_FILES[event]);
      release();
    });
  }, [muted, stopDrag, volume]);

  const playTap = useCallback((id?: string) => playEvent('tap', id), [playEvent]);
  const playCorrect = useCallback((id?: string) => playEvent('correct', id), [playEvent]);
  const playDrop = useCallback((id?: string) => playEvent('drop', id), [playEvent]);
  const playDrag = useCallback((id?: string) => playEvent('drag', id), [playEvent]);
  const playMatch = useCallback((id?: string) => playEvent('match', id), [playEvent]);
  const playPerfectMatch = useCallback((id?: string) => playEvent('perfectMatch', id), [playEvent]);

  // Cleanup on unmount
  useEffect(() => () => {
    stop();
    audioRef.current = null;
  }, [stop]);

  const value = useMemo(
    () => ({
      muted, volume, setMuted, toggleMute, setVolume, play,
      playTap, playCorrect, playDrop, playDrag, playMatch, playPerfectMatch,
      stopDrag, stopEffects, stop,
    }),
    [
      muted, volume, setMuted, toggleMute, setVolume, play,
      playTap, playCorrect, playDrop, playDrag, playMatch, playPerfectMatch,
      stopDrag, stopEffects, stop,
    ]
  );

  return <GameAudioContext.Provider value={value}>{children}</GameAudioContext.Provider>;
}

export function useGameAudio() {
  const ctx = useContext(GameAudioContext);
  if (!ctx) throw new Error('useGameAudio must be used within a GameAudioProvider');
  return ctx;
}
