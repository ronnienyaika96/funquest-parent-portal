import { getGameAssetUrl } from './funquest-assets';

/**
 * Core game UI tile assets from Supabase "game assets" bucket.
 */
export const gameAssets = {
  choiceTileDefault: 'Tiles/choice_tile_default-01.svg',
  choiceTileSelected: 'Tiles/choice_tile_selected-01.svg',
  choiceTileCorrect: 'Tiles/choice_tile_correct-01.svg',
  choiceTileWrong: 'Tiles/choice_tile_wrong-01.svg',
  draggableTile: 'Tiles/draggable_tile-01.svg',
  dropZoneEmpty: 'Tiles/drop_zone_empty-01.svg',
  dropZoneCorrect: 'Tiles/drop_zone_correct-01.svg',
} as const;

export type TileState = 'default' | 'selected' | 'correct' | 'wrong';

const tileStateMap: Record<TileState, string> = {
  default: gameAssets.choiceTileDefault,
  selected: gameAssets.choiceTileSelected,
  correct: gameAssets.choiceTileCorrect,
  wrong: gameAssets.choiceTileWrong,
};

/** Returns the public URL for a choice tile in a given state. */
export function getChoiceAssetByState(state: TileState): string {
  return getGameAssetUrl(tileStateMap[state]);
}

/** Returns the public URL for a drag-drop asset. */
export function getDraggableAssetUrl(): string {
  return getGameAssetUrl(gameAssets.draggableTile);
}

export function getDropZoneAssetUrl(filled: boolean): string {
  return getGameAssetUrl(filled ? gameAssets.dropZoneCorrect : gameAssets.dropZoneEmpty);
}
