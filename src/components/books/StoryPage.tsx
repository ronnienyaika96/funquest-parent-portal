import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ImageOff, Loader2 } from 'lucide-react';
import { getSignedBookUrl } from '@/lib/bookStorage';
import type { BookPage } from '@/hooks/useBooks';

interface StoryPageProps {
  page: BookPage | null;
  textSize: number; // px
  charIndex: number;
  charLength: number;
  speaking: boolean;
}

/** Splits text into words with their character offsets so we can highlight while speaking. */
function useWords(text: string) {
  return useMemo(() => {
    const words: { word: string; start: number; end: number }[] = [];
    const re = /\S+/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(text))) words.push({ word: m[0], start: m.index, end: m.index + m[0].length });
    return words;
  }, [text]);
}

const StoryPage: React.FC<StoryPageProps> = ({ page, textSize, charIndex, charLength, speaking }) => {
  const [img, setImg] = useState<string | null>(null);
  const [imgState, setImgState] = useState<'loading' | 'ok' | 'error'>('loading');
  const text = page?.extracted_text?.trim() || '';
  const words = useWords(text);

  useEffect(() => {
    let active = true;
    setImgState('loading');
    setImg(null);
    getSignedBookUrl(page?.image_url).then((url) => {
      if (!active) return;
      if (url) setImg(url);
      else setImgState('error');
    });
    return () => {
      active = false;
    };
  }, [page?.image_url]);

  const activeWordIndex = useMemo(() => {
    if (!speaking || charIndex < 0) return -1;
    return words.findIndex((w) => charIndex >= w.start && charIndex < Math.max(w.end, w.start + (charLength || 1)));
  }, [speaking, charIndex, charLength, words]);

  return (
    <div className="w-full flex flex-col lg:flex-row gap-4 lg:gap-6 items-stretch">
      {/* Illustration */}
      <motion.div
        key={page?.id || 'empty'}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="relative w-full lg:w-1/2 rounded-3xl overflow-hidden bg-card shadow-strong border-4 border-white/70 min-h-[220px] flex items-center justify-center"
      >
        {img ? (
          <img
            src={img}
            alt={`Illustration for page ${page?.page_number ?? ''}`}
            className="w-full h-full object-contain bg-white"
            onLoad={() => setImgState('ok')}
            onError={() => setImgState('error')}
          />
        ) : imgState === 'error' ? (
          <div className="flex flex-col items-center gap-2 p-8 text-muted-foreground">
            <ImageOff className="w-8 h-8" aria-hidden />
            <span className="text-sm font-semibold">Page picture unavailable</span>
          </div>
        ) : (
          <Loader2 className="w-8 h-8 animate-spin text-primary" aria-hidden />
        )}
      </motion.div>

      {/* Text */}
      <div className="w-full lg:w-1/2 rounded-3xl bg-[hsl(45,60%,97%)] shadow-strong border-4 border-white/70 p-5 sm:p-7 overflow-y-auto max-h-[60vh] lg:max-h-none">
        {text ? (
          <p className="leading-relaxed font-semibold text-foreground" style={{ fontSize: textSize }}>
            {words.map((w, i) => (
              <span
                key={`${w.start}-${i}`}
                className={
                  i === activeWordIndex
                    ? 'rounded-md bg-funquest-yellow/70 px-0.5 text-foreground'
                    : undefined
                }
              >
                {w.word}{' '}
              </span>
            ))}
          </p>
        ) : (
          <div className="text-center py-10">
            <span className="text-4xl block mb-2">🖼️</span>
            <p className="font-bold text-foreground">This page is a picture page</p>
            <p className="text-sm text-muted-foreground">There are no words to read aloud here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoryPage;
