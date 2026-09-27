import { Game } from '../types';
import { ESPORTS_GAMES } from './games/esports';
import { DEMANDING_GAMES } from './games/demanding';
import { POPULAR_GAMES } from './games/popular';
import { PLAYSTATION_PC_GAMES } from './games/playstationPcGms';
import { MODERN_AAA_GAMES } from './games/modernAaaGms';
import { OPEN_WORLD_RPG_GAMES } from './games/openWorldRpgGms';
import { POPULAR_ESPORTS_ADDITIONS } from './games/popularEsportsGms';

export { ESPORTS_GAMES } from './games/esports';
export { DEMANDING_GAMES } from './games/demanding';
export { POPULAR_GAMES } from './games/popular';
export { PLAYSTATION_PC_GAMES } from './games/playstationPcGms';
export { MODERN_AAA_GAMES } from './games/modernAaaGms';
export { OPEN_WORLD_RPG_GAMES } from './games/openWorldRpgGms';
export { POPULAR_ESPORTS_ADDITIONS } from './games/popularEsportsGms';

export type GameCategoryGroup = 'all' | 'esports' | 'demanding' | 'popular';

export interface GameCategoryTab {
  id: GameCategoryGroup;
  label: string;
  count: number;
}

/**
 * Consolidated catalog of all verified PC games.
 * Total: 57 rigorously benchmarked and researched titles.
 */
export const GAMES_DATABASE: Game[] = [
  ...DEMANDING_GAMES,
  ...PLAYSTATION_PC_GAMES,
  ...MODERN_AAA_GAMES,
  ...OPEN_WORLD_RPG_GAMES,
  ...ESPORTS_GAMES,
  ...POPULAR_GAMES,
  ...POPULAR_ESPORTS_ADDITIONS
];

export const GAME_CATEGORY_MAP: Record<string, GameCategoryGroup> = {
  // Demanding / AAA
  'spiderman-2': 'demanding',
  'spiderman-remastered': 'demanding',
  'spiderman-miles-morales': 'demanding',
  'cyberpunk-2077': 'demanding',
  'rdr2': 'demanding',
  'hogwarts-legacy': 'demanding',
  'alan-wake-2': 'demanding',
  'black-myth-wukong': 'demanding',
  'starfield': 'demanding',
  'the-last-of-us-part-1': 'demanding',
  'monster-hunter-wilds': 'demanding',
  'indiana-jones-great-circle': 'demanding',
  'assassins-creed-shadows': 'demanding',

  // PlayStation PC additions
  'god-of-war-2018': 'demanding',
  'god-of-war-ragnarok': 'demanding',
  'horizon-forbidden-west': 'demanding',
  'ghost-of-tsushima': 'demanding',
  'days-gone': 'demanding',
  'death-stranding-dc': 'demanding',
  'ratchet-clank-rift-apart': 'demanding',

  // Modern Demanding AAA additions
  'avatar-frontiers-of-pandora': 'demanding',
  'star-wars-jedi-survivor': 'demanding',
  'dragons-dogma-2': 'demanding',
  'silent-hill-2-remake': 'demanding',
  'resident-evil-4-remake': 'demanding',
  'assassins-creed-mirage': 'demanding',

  // Open World / Action RPG additions
  'elden-ring': 'demanding',
  'witcher-3-next-gen': 'demanding',
  'dying-light-2': 'demanding',
  'helldivers-2': 'demanding',

  // Esports & Competitive
  'cs2': 'esports',
  'valorant': 'esports',
  'league-of-legends': 'esports',
  'dota-2': 'esports',
  'overwatch-2': 'esports',
  'r6-siege': 'esports',
  'apex-legends': 'esports',
  'fortnite': 'esports',
  'rocket-league': 'esports',
  'pubg': 'esports',
  'cod-warzone': 'esports',

  // Popular & Mid-range
  'minecraft': 'popular',
  'roblox': 'popular',
  'terraria': 'popular',
  'stardew-valley': 'popular',
  'palworld': 'popular',
  'baldurs-gate-3': 'popular',
  'phasmophobia': 'popular',
  'poppy-playtime': 'popular',
  'lethal-company': 'popular',
  'euro-truck-simulator-2': 'popular',
  'gta-v': 'popular',

  // Popular additions
  'forza-horizon-5': 'popular',
  'dead-by-daylight': 'popular',
  'genshin-impact': 'popular',
  'hollow-knight': 'popular',
  'hades': 'popular'
};

