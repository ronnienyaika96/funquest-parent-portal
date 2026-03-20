import React from 'react';
import { motion } from 'framer-motion';
import { getGameAssetUrl, BG_ASSET } from '@/lib/funquest-assets';

interface GameShellProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Shared game background wrapper using the Supabase background asset.
 * Provides consistent visual framing for all game screens.
 */
const GameShell: React.FC<GameShellProps> = ({ children, className = '' }) => {
  const bgUrl = getGameAssetUrl(BG_ASSET);

  return (
    <div
      className={`min-h-screen flex flex-col relative ${className}`}
      style={{
        backgroundImage: bgUrl ? `url(${bgUrl})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Soft overlay so content remains readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background/70 pointer-events-none" />
      <div className="relative z-10 flex flex-col flex-1">{children}</div>
    </div>
  );
};

export default GameShell;
