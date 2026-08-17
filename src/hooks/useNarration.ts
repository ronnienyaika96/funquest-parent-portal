import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export interface NarrationState {
  supported: boolean;
  speaking: boolean;
  paused: boolean;
  charIndex: number;
  charLength: number;
  voices: SpeechSynthesisVoice[];
  voiceURI: string | null;
  rate: number;
  volume: number;
  muted: boolean;
}

/**
 * Web Speech API narration with word-boundary reporting.
 * Narration is always stopped when the text changes or the component unmounts.
 */
export function useNarration(text: string, onEnd?: () => void) {
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const [speaking, setSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const [charIndex, setCharIndex] = useState(-1);
  const [charLength, setCharLength] = useState(0);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceURI, setVoiceURI] = useState<string | null>(null);
  const [rate, setRate] = useState(0.9);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);

  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);
  const onEndRef = useRef(onEnd);
  onEndRef.current = onEnd;

  useEffect(() => {
    if (!supported) return;
    const load = () => {
      const list = window.speechSynthesis.getVoices();
      if (list.length) setVoices(list);
    };
    load();
    window.speechSynthesis.addEventListener('voiceschanged', load);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', load);
  }, [supported]);

  const stop = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    utterRef.current = null;
    setSpeaking(false);
    setPaused(false);
    setCharIndex(-1);
    setCharLength(0);
  }, [supported]);

  const speak = useCallback(() => {
    if (!supported || !text?.trim()) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const voice = voices.find((v) => v.voiceURI === voiceURI);
    if (voice) u.voice = voice;
    u.rate = rate;
    u.pitch = 1.1;
    u.volume = muted ? 0 : volume;
    u.onboundary = (e) => {
      setCharIndex(e.charIndex);
      setCharLength((e as any).charLength || 0);
    };
    u.onstart = () => {
      setSpeaking(true);
      setPaused(false);
    };
    u.onend = () => {
      setSpeaking(false);
      setPaused(false);
      setCharIndex(-1);
      onEndRef.current?.();
    };
    u.onerror = () => {
      setSpeaking(false);
      setPaused(false);
      setCharIndex(-1);
    };
    utterRef.current = u;
    window.speechSynthesis.speak(u);
  }, [supported, text, voices, voiceURI, rate, volume, muted]);

  const pause = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.pause();
    setPaused(true);
  }, [supported]);

  const resume = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.resume();
    setPaused(false);
  }, [supported]);

  const toggle = useCallback(() => {
    if (!speaking) speak();
    else if (paused) resume();
    else pause();
  }, [speaking, paused, speak, resume, pause]);

  const restart = useCallback(() => {
    stop();
    // let the queue flush before re-speaking
    setTimeout(() => speak(), 60);
  }, [stop, speak]);

  // Stop narration whenever the page text changes or on unmount
  useEffect(() => {
    return () => {
      if (supported) window.speechSynthesis.cancel();
    };
  }, [supported, text]);

  const state: NarrationState = useMemo(
    () => ({ supported, speaking, paused, charIndex, charLength, voices, voiceURI, rate, volume, muted }),
    [supported, speaking, paused, charIndex, charLength, voices, voiceURI, rate, volume, muted],
  );

  return {
    ...state,
    speak,
    pause,
    resume,
    toggle,
    restart,
    stop,
    setVoiceURI,
    setRate,
    setVolume,
    setMuted,
  };
}
