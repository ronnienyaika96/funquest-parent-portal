import { supabase } from '@/integrations/supabase/client';

const BUCKET = 'game assets';

export function getGameAssetUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

// Tile assets from Supabase storage
export const TILE_ASSETS = {
  choiceDefault: 'Tiles/choice_tile_default-01.svg',
  choiceSelected: 'Tiles/choice_tile_selected-01.svg',
  choiceCorrect: 'Tiles/choice_tile_correct-01.svg',
  choiceWrong: 'Tiles/choice_tile_wrong-01.svg',
  draggable: 'Tiles/draggable_tile-01.svg',
  dropZoneEmpty: 'Tiles/drop_zone_empty-01.svg',
  dropZoneCorrect: 'Tiles/drop_zone_correct-01.svg',
} as const;

export const BG_ASSET = 'UI background/main background.png';

// Category colors using design tokens
export const CATEGORY_COLORS = {
  letter: {
    bg: 'bg-funquest-blue/10',
    border: 'border-funquest-blue/30',
    text: 'text-funquest-blue',
    gradient: 'from-[hsl(217,91%,60%)] to-[hsl(217,91%,50%)]',
    emoji: '🔤',
  },
  number: {
    bg: 'bg-funquest-orange/10',
    border: 'border-funquest-orange/30',
    text: 'text-funquest-orange',
    gradient: 'from-[hsl(25,95%,55%)] to-[hsl(25,95%,45%)]',
    emoji: '🔢',
  },
  game: {
    bg: 'bg-funquest-purple/10',
    border: 'border-funquest-purple/30',
    text: 'text-funquest-purple',
    gradient: 'from-[hsl(262,83%,55%)] to-[hsl(262,83%,45%)]',
    emoji: '🎮',
  },
  story: {
    bg: 'bg-funquest-green/10',
    border: 'border-funquest-green/30',
    text: 'text-funquest-green',
    gradient: 'from-[hsl(142,69%,50%)] to-[hsl(142,69%,40%)]',
    emoji: '📖',
  },
  word: {
    bg: 'bg-funquest-pink/10',
    border: 'border-funquest-pink/30',
    text: 'text-funquest-pink',
    gradient: 'from-[hsl(330,81%,65%)] to-[hsl(330,81%,55%)]',
    emoji: '📝',
  },
} as const;

export function getCategoryConfig(type: string) {
  return CATEGORY_COLORS[type as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.game;
}
