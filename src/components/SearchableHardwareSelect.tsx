import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, ChevronDown, Check, AlertCircle, Laptop } from 'lucide-react';

export interface SearchOption {
  id: string;
  name: string;
  subtitle?: string;
  badge?: string;
  isLaptop?: boolean;
  score?: number;
  vram?: number;
  aliases?: string[];
  generation?: string;
  family?: string;
}

interface SearchableHardwareSelectProps {
  id: string;
  label: string;
  placeholder: string;
  options: SearchOption[];
  selectedId: string | null;
  onSelect: (option: SearchOption) => void;
  onCustomEntry?: (name: string, tier: 'entry' | 'mid' | 'high') => void;
  customName?: string | null;
  type: 'GPU' | 'CPU';
}

export const SearchableHardwareSelect: React.FC<SearchableHardwareSelectProps> = ({
  id,
  label,
  placeholder,
  options,
  selectedId,
  onSelect,
  onCustomEntry,
  customName,
  type
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [customTier, setCustomTier] = useState<'entry' | 'mid' | 'high'>('mid');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.id === selectedId);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Intelligent multi-token & whole-word search with relevance ranking
  const filteredAndRanked = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return options;

    const cleanQ = q.replace(/[-_]/g, ' ').replace(/\s+/g, ' ');
    const qTokens = cleanQ.split(' ').filter(Boolean);

    const scored: Array<{ option: SearchOption; score: number }> = [];

    for (const opt of options) {
      const name = opt.name.toLowerCase();
      const cleanName = name.replace(/[-_]/g, ' ').replace(/\s+/g, ' ');
      const nameWithoutMfr = cleanName.replace(/^(amd|intel|nvidia|geforce)\s+/, '').trim();
      const nameTokens = cleanName.split(' ').filter(Boolean);
      const aliases = (opt.aliases || []).map((a) => a.toLowerCase().replace(/[-_]/g, ' '));
      const subtitle = (opt.subtitle || '').toLowerCase();
      const badge = (opt.badge || '').toLowerCase();

      // 1. Absolute exact match against full name, name without manufacturer, or exact alias
      if (
        name === q ||
        cleanName === cleanQ ||
        nameWithoutMfr === cleanQ ||
        aliases.includes(cleanQ) ||
        aliases.includes(q)
      ) {
        scored.push({ option: opt, score: 2000 });
        continue;
      }

      // 2. Exact token comparison with strict numeric boundary separation
      let exactTokenMatches = 0;
      let prefixTokenMatches = 0;
      let numericMismatch = false;

      for (const qt of qTokens) {
        const isNum = /^\d+$/.test(qt);
        const exactInName = nameTokens.some((nt) => nt === qt);
        const exactInAlias = aliases.some((a) => a.split(' ').includes(qt));

        if (exactInName || exactInAlias) {
          exactTokenMatches++;
        } else {
          // Check prefix matches with strict rejection of conflicting numeric models (e.g. 170 vs 1700)
          const prefixInName = nameTokens.some((nt) => {
            if (isNum && /^\d+/.test(nt) && nt !== qt) {
              numericMismatch = true;
              return false;
            }
            return nt.startsWith(qt);
          });

          if (prefixInName) {
            prefixTokenMatches++;
          }
        }
      }

      // Reject numeric model contradictions (e.g. searching 170 should never return 1700 as a candidate)
      if (numericMismatch && exactTokenMatches < qTokens.length) {
        continue;
      }

      // All query tokens matched exactly or as valid non-numeric prefix
      if (exactTokenMatches === qTokens.length) {
        const extraTokens = Math.max(0, nameTokens.length - qTokens.length);
        let s = 1500 - extraTokens * 15;
        // Boost if query explicitly matches laptop/desktop nature
        if (cleanQ.includes('laptop') && opt.isLaptop) s += 100;
        if (cleanQ.includes('desktop') && !opt.isLaptop) s += 100;
        scored.push({ option: opt, score: s });
      } else if (exactTokenMatches + prefixTokenMatches === qTokens.length) {
        let s = 1000 + exactTokenMatches * 50 - nameTokens.length * 10;
        if (cleanQ.includes('laptop') && opt.isLaptop) s += 50;
        scored.push({ option: opt, score: s });
      } else {
        // Fallback multi-token corpus search
        const corpus = `${cleanName} ${subtitle} ${badge} ${aliases.join(' ')}`;
        const matchedAllTokens = qTokens.every((qt) => corpus.includes(qt));
        if (matchedAllTokens && !numericMismatch) {
          scored.push({ option: opt, score: 500 + exactTokenMatches * 50 });
        }
      }
    }

    // Sort descending by score
    return scored.sort((a, b) => b.score - a.score).map((r) => r.option);
  }, [options, query]);

  const exactMatch = options.some(
    (opt) =>
      opt.name.toLowerCase().trim() === query.toLowerCase().trim() ||
      (opt.aliases && opt.aliases.some((a) => a.toLowerCase().trim() === query.toLowerCase().trim()))
  );

  const hasSearchText = query.trim().length > 0;
  const showCustomNotice = hasSearchText && !exactMatch && filteredAndRanked.length === 0;

  return (
    <div className="relative w-full" ref={dropdownRef} id={`container-${id}`}>
      <label htmlFor={id} className="block text-sm font-medium text-zinc-300 mb-1.5 flex items-center justify-between">
        <span>{label}</span>
        {selectedOption?.isLaptop && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800/60">
            <Laptop className="w-3 h-3" /> Laptop {type}
          </span>
        )}
      </label>

      {/* Main trigger button / input container */}
      <div
        id={id}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full min-h-[46px] px-3.5 py-2.5 rounded-xl border bg-zinc-900/90 text-left cursor-pointer transition-all flex items-center justify-between gap-2 shadow-sm ${
          isOpen
            ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-zinc-900'
            : 'border-zinc-800 hover:border-zinc-700'
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
        <div className="flex-1 truncate">
          {customName ? (
            <div className="flex items-center gap-2">
              <span className="text-zinc-100 font-medium truncate">{customName}</span>
              <span className="text-xs bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded border border-indigo-800/60">
                General Estimate
              </span>
            </div>
          ) : selectedOption ? (
            <div className="flex items-center gap-2 truncate">
              <span className="text-zinc-100 font-medium truncate">{selectedOption.name}</span>
              {selectedOption.isLaptop && (
                <span className="text-xs text-amber-400 flex items-center gap-1 bg-amber-950/50 px-1.5 py-0.5 rounded border border-amber-900/40">
                  <Laptop className="w-3 h-3" /> Laptop
                </span>
              )}
              {selectedOption.vram && (
                <span className="text-xs text-zinc-400 bg-zinc-800/80 px-1.5 py-0.5 rounded">
                  {selectedOption.vram} GB VRAM
                </span>
              )}
            </div>
          ) : (
            <span className="text-zinc-400 text-sm">{placeholder}</span>
          )}
        </div>

        <ChevronDown
          className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-zinc-200' : ''
          }`}
        />
      </div>

      {/* Floating Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-1.5 w-full bg-zinc-900 border border-zinc-700/80 rounded-xl shadow-2xl overflow-hidden backdrop-blur-lg">
          {/* Search box header */}
          <div className="p-2.5 border-b border-zinc-800 bg-zinc-950/80">
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id={`input-search-${id}`}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Search or choose your ${type}...`}
                className="w-full bg-zinc-900 text-sm text-zinc-100 pl-9 pr-3 py-2 rounded-lg border border-zinc-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          {/* List items */}
          <div className="max-h-64 overflow-y-auto p-1.5 divide-y divide-zinc-800/50">
            {filteredAndRanked.length > 0 ? (
              filteredAndRanked.map((opt) => {
                const isSelected = opt.id === selectedId && !customName;
                return (
                  <button
                    key={opt.id}
                    id={`option-${id}-${opt.id}`}
                    type="button"
                    onClick={() => {
                      onSelect(opt);
                      setIsOpen(false);
                      setQuery('');
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600/20 text-indigo-300 font-medium'
                        : 'text-zinc-200 hover:bg-zinc-800/80'
                    }`}
                  >
                    <div className="flex flex-col gap-0.5 truncate">
                      <div className="flex items-center gap-2">
                        <span className="truncate">{opt.name}</span>
                        {opt.isLaptop && (
                          <span className="text-[11px] font-medium bg-amber-950/80 text-amber-300 border border-amber-800/60 px-1.5 py-0.5 rounded flex items-center gap-1">
                            <Laptop className="w-2.5 h-2.5" /> Laptop
                          </span>
                        )}
                        {opt.generation && (
                          <span className="text-[10px] text-zinc-400 bg-zinc-800/70 border border-zinc-700/60 px-1.5 py-0.5 rounded">
                            {opt.generation}
                          </span>
                        )}
                      </div>
                      {opt.subtitle && (
                        <span className="text-xs text-zinc-400 truncate">{opt.subtitle}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {opt.vram && (
                        <span className="text-xs text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded">
                          {opt.vram} GB
                        </span>
                      )}
                      {isSelected && <Check className="w-4 h-4 text-indigo-400" />}
                    </div>
                  </button>
                );
              })
            ) : null}

            {/* Graceful Fallback if Hardware not found or user entered uncommon chip */}
            {showCustomNotice && (
              <div className="p-3 bg-zinc-950/90 rounded-lg m-1 border border-zinc-800 text-sm">
                <div className="flex items-start gap-2.5 text-amber-400 mb-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <div className="text-xs leading-relaxed text-zinc-300">
                    <strong className="text-amber-300 font-medium block mb-0.5">
                      We don't have this exact {type} in our database yet.
                    </strong>
                    You can still continue with a general estimate. Choose approximate tier:
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-1.5 mb-2.5">
                  {(['entry', 'mid', 'high'] as const).map((tier) => (
                    <button
                      key={tier}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCustomTier(tier);
                      }}
                      className={`text-xs py-1.5 px-2 rounded font-medium border text-center transition-colors capitalize cursor-pointer ${
                        customTier === tier
                          ? 'bg-indigo-600 text-white border-indigo-500'
                          : 'bg-zinc-800 text-zinc-300 border-zinc-700 hover:bg-zinc-700'
                      }`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  id={`btn-custom-${id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onCustomEntry) {
                      onCustomEntry(query.trim(), customTier);
                    }
                    setIsOpen(false);
                    setQuery('');
                  }}
                  className="w-full text-xs font-semibold py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors text-center cursor-pointer"
                >
                  Use "{query.trim()}" ({customTier} estimate)
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
