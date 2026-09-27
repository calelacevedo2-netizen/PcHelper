import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, ChevronDown, Check, Gamepad2, Sparkles, Trophy, Flame, Compass } from 'lucide-react';
import { Game } from '../types';
import { GAME_CATEGORY_MAP, GameCategoryGroup } from '../data/games';

interface GameSelectProps {
  id: string;
  games: Game[];
  selectedGame: Game | null;
  onSelectGame: (game: Game) => void;
}

export const GameSelect: React.FC<GameSelectProps> = ({
  id,
  games,
  selectedGame,
  onSelectGame
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<GameCategoryGroup>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const categoryCounts = useMemo(() => {
    return {
      all: games.length,
      demanding: games.filter((g) => GAME_CATEGORY_MAP[g.id] === 'demanding').length,
      esports: games.filter((g) => GAME_CATEGORY_MAP[g.id] === 'esports').length,
      popular: games.filter((g) => GAME_CATEGORY_MAP[g.id] === 'popular').length
    };
  }, [games]);

  const filteredGames = useMemo(() => {
    return games.filter((g) => {
      // Category filter
      if (activeCategory !== 'all') {
        const cat = GAME_CATEGORY_MAP[g.id];
        if (cat !== activeCategory) return false;
      }
      // Search query filter
      const q = query.toLowerCase().trim();
      if (!q) return true;
      return (
        g.name.toLowerCase().includes(q) ||
        (g.category && g.category.toLowerCase().includes(q))
      );
    });
  }, [games, activeCategory, query]);

  return (
    <div className="relative w-full" ref={dropdownRef} id={`container-${id}`}>
      <label htmlFor={id} className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <Gamepad2 className="w-4 h-4 text-sky-400" />
          Select Game
        </span>
        {selectedGame && (
          <span className="text-[11px] text-zinc-400">
            Min RAM: {selectedGame.minimumRequirements.ramGb}GB • {selectedGame.demandProfile.overallDemand} Demand
          </span>
        )}
      </label>

      {/* Trigger Button */}
      <div
        id={id}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full min-h-[46px] px-3.5 py-2.5 rounded-xl border bg-[#090c17] text-left cursor-pointer transition-all flex items-center justify-between gap-2.5 shadow-sm min-w-0 ${
          isOpen
            ? 'border-sky-500 ring-2 ring-sky-500/20 bg-[#0c1020]'
            : 'border-[#1f2842] hover:border-sky-500/50 hover:bg-[#0c1020]'
        }`}
        role="combobox"
        aria-expanded={isOpen}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen((prev) => !prev);
          }
        }}
      >
        <div className="flex-1 min-w-0 flex items-center">
          {selectedGame ? (
            <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
              <span className="text-white font-semibold text-sm sm:text-base shrink-0 whitespace-nowrap">
                {selectedGame.name}
              </span>
              {selectedGame.category && (
                <span className="text-xs text-sky-300 bg-sky-950/70 border border-sky-800/60 px-2 py-0.5 rounded-md truncate min-w-0 shrink">
                  {selectedGame.category}
                </span>
              )}
            </div>
          ) : (
            <span className="text-zinc-400 text-sm">Search and choose a game...</span>
          )}
        </div>

        <ChevronDown
          className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-sky-400' : ''
          }`}
        />
      </div>

      {/* Floating Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-1.5 w-full bg-[#0c0f1d] border border-[#202b48] rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl">
          {/* Search box */}
          <div className="p-2.5 border-b border-[#1f2842] bg-[#090c17]">
            <div className="relative">
              <Search className="w-4 h-4 text-sky-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id={`input-search-${id}`}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search 35+ verified games (e.g. CS2, Cyberpunk, Minecraft)..."
                className="w-full bg-[#070912] text-sm text-white pl-9 pr-3 py-2 rounded-lg border border-[#1f2842] focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 placeholder-zinc-500"
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          {/* Category Tabs */}
          <div className="px-2.5 pt-2 pb-1.5 border-b border-[#1f2842] bg-[#080b16] flex items-center gap-1.5 overflow-x-auto text-xs">
            <button
              type="button"
              id="category-tab-all"
              onClick={(e) => {
                e.stopPropagation();
                setActiveCategory('all');
              }}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors flex items-center gap-1.5 flex-shrink-0 cursor-pointer ${
                activeCategory === 'all'
                  ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/40'
                  : 'bg-[#101426] text-zinc-400 hover:text-zinc-200 hover:bg-[#161c36]'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              All Games ({categoryCounts.all})
            </button>

            <button
              type="button"
              id="category-tab-demanding"
              onClick={(e) => {
                e.stopPropagation();
                setActiveCategory('demanding');
              }}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors flex items-center gap-1.5 flex-shrink-0 cursor-pointer ${
                activeCategory === 'demanding'
                  ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/40'
                  : 'bg-[#101426] text-zinc-400 hover:text-zinc-200 hover:bg-[#161c36]'
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-purple-300" />
              AAA & Demanding ({categoryCounts.demanding})
            </button>

            <button
              type="button"
              id="category-tab-esports"
              onClick={(e) => {
                e.stopPropagation();
                setActiveCategory('esports');
              }}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors flex items-center gap-1.5 flex-shrink-0 cursor-pointer ${
                activeCategory === 'esports'
                  ? 'bg-sky-600 text-white shadow-sm shadow-sky-600/40'
                  : 'bg-[#101426] text-zinc-400 hover:text-zinc-200 hover:bg-[#161c36]'
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-emerald-400" />
              Esports ({categoryCounts.esports})
            </button>

            <button
              type="button"
              id="category-tab-popular"
              onClick={(e) => {
                e.stopPropagation();
                setActiveCategory('popular');
              }}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors flex items-center gap-1.5 flex-shrink-0 cursor-pointer ${
                activeCategory === 'popular'
                  ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/40'
                  : 'bg-[#101426] text-zinc-400 hover:text-zinc-200 hover:bg-[#161c36]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              Popular & Mid-Range ({categoryCounts.popular})
            </button>
          </div>

          {/* Quick pick chips if query is empty and showing all */}
          {!query && activeCategory === 'all' && (
            <div className="px-3 py-1.5 border-b border-[#1f2842] bg-[#070914]">
              <div className="text-[11px] font-medium text-zinc-400 mb-1 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-sky-400" /> Trending Picks:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {['Counter-Strike 2', 'Cyberpunk 2077', "Marvel's Spider-Man 2", 'Black Myth: Wukong', 'Valorant', 'Minecraft'].map((quickName) => {
                  const match = games.find((g) => g.name === quickName);
                  if (!match) return null;
                  return (
                    <button
                      key={match.id}
                      type="button"
                      onClick={() => {
                        onSelectGame(match);
                        setIsOpen(false);
                      }}
                      className="text-xs px-2 py-0.5 rounded-full bg-[#12172a] text-zinc-300 hover:bg-sky-600 hover:text-white transition-colors cursor-pointer border border-[#1f2842]"
                    >
                      {match.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Games list */}
          <div className="max-h-72 overflow-y-auto p-1.5 divide-y divide-[#1b233a]">
            {filteredGames.length > 0 ? (
              filteredGames.map((game) => {
                const isSelected = selectedGame?.id === game.id;
                const cat = GAME_CATEGORY_MAP[game.id];
                const badgeLabel =
                  cat === 'esports' ? 'Esports' : cat === 'demanding' ? 'AAA' : 'Popular';

                return (
                  <button
                    key={game.id}
                    id={`option-game-${game.id}`}
                    type="button"
                    onClick={() => {
                      onSelectGame(game);
                      setIsOpen(false);
                      setQuery('');
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-purple-950/60 text-purple-200 font-semibold border border-purple-800/60'
                        : 'text-zinc-200 hover:bg-[#12172b]'
                    }`}
                  >
                    <div className="flex flex-col gap-0.5 truncate">
                      <div className="flex items-center gap-2 truncate">
                        <span className="font-medium truncate">{game.name}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                          cat === 'demanding'
                            ? 'bg-purple-950/80 text-purple-300 border border-purple-800/60'
                            : cat === 'esports'
                            ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/50'
                            : 'bg-sky-950/60 text-sky-300 border border-sky-800/50'
                        }`}>
                          {badgeLabel}
                        </span>
                      </div>
                      {game.category && (
                        <span className="text-xs text-zinc-400 truncate">{game.category}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs text-zinc-400 bg-[#080b16] border border-[#1f2842] px-2 py-0.5 rounded">
                        Rec: {game.recommendedRequirements.ramGb}GB RAM
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-purple-400" />}
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="p-5 text-center text-sm text-zinc-400">
                No games found matching "{query}" in this category.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
