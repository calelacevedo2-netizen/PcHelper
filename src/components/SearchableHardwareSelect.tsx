import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, ChevronDown, Check, AlertCircle, Laptop, Filter, X } from 'lucide-react';

export type CompanyFilterOption = 'All' | 'NVIDIA' | 'AMD' | 'Intel';

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
  manufacturer?: string;
}

export function getOptionManufacturer(
  opt: SearchOption,
  type: 'GPU' | 'CPU'
): 'NVIDIA' | 'AMD' | 'Intel' | 'Other' {
  if (opt.manufacturer) {
    const m = opt.manufacturer.toUpperCase();
    if (m.includes('NVIDIA')) return 'NVIDIA';
    if (m.includes('AMD')) return 'AMD';
    if (m.includes('INTEL')) return 'Intel';
  }
  const combined = `${opt.name} ${opt.subtitle || ''}`.toLowerCase();

  if (type === 'GPU') {
    if (
      combined.includes('nvidia') ||
      combined.includes('geforce') ||
      combined.includes('rtx') ||
      combined.includes('gtx') ||
      combined.includes('gt 710') ||
      combined.includes('gt 1030') ||
      combined.includes('titan') ||
      combined.includes('quadro')
    ) {
      return 'NVIDIA';
    }
    if (
      combined.includes('amd') ||
      combined.includes('radeon') ||
      combined.includes('rx ') ||
      combined.includes('vega') ||
      combined.includes('rdna')
    ) {
      return 'AMD';
    }
    if (
      combined.includes('intel') ||
      combined.includes('arc') ||
      combined.includes('iris') ||
      combined.includes('hd graphics') ||
      combined.includes('uhd') ||
      combined.includes('battlemage') ||
      combined.includes('alchemist')
    ) {
      return 'Intel';
    }
  } else {
    // CPU
    if (
      combined.includes('amd') ||
      combined.includes('ryzen') ||
      combined.includes('threadripper') ||
      combined.includes('athlon') ||
      combined.includes('epyc')
    ) {
      return 'AMD';
    }
    if (
      combined.includes('intel') ||
      combined.includes('core') ||
      combined.includes('xeon') ||
      combined.includes('celeron') ||
      combined.includes('pentium')
    ) {
      return 'Intel';
    }
  }

  return 'Other';
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
  enableCompanyFilter?: boolean;
  companyFilter?: CompanyFilterOption;
  onCompanyFilterChange?: (filter: CompanyFilterOption) => void;
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
  type,
  enableCompanyFilter = false,
  companyFilter,
  onCompanyFilterChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [customTier, setCustomTier] = useState<'entry' | 'mid' | 'high'>('mid');
  const [internalCompanyFilter, setInternalCompanyFilter] = useState<CompanyFilterOption>('All');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const filterMenuRef = useRef<HTMLDivElement>(null);

  const activeCompanyFilter = companyFilter !== undefined ? companyFilter : internalCompanyFilter;

  const handleFilterSelect = (filter: CompanyFilterOption) => {
    if (onCompanyFilterChange) {
      onCompanyFilterChange(filter);
    } else {
      setInternalCompanyFilter(filter);
    }
  };

  const selectedOption = options.find((opt) => opt.id === selectedId);

  // Available company options for this hardware type
  const companyOptions: CompanyFilterOption[] = useMemo(() => {
    if (type === 'CPU') {
      return ['All', 'AMD', 'Intel'];
    }
    return ['All', 'NVIDIA', 'AMD', 'Intel'];
  }, [type]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setIsFilterMenuOpen(false);
      } else if (filterMenuRef.current && !filterMenuRef.current.contains(e.target as Node)) {
        setIsFilterMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter base options by company filter when active
  const baseFilteredOptions = useMemo(() => {
    if (!enableCompanyFilter || activeCompanyFilter === 'All') {
      return options;
    }
    return options.filter((opt) => getOptionManufacturer(opt, type) === activeCompanyFilter);
  }, [options, enableCompanyFilter, activeCompanyFilter, type]);

  // Intelligent multi-token & whole-word search with relevance ranking
  const filteredAndRanked = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return baseFilteredOptions;

    const cleanQ = q.replace(/[-_]/g, ' ').replace(/\s+/g, ' ');
    const qTokens = cleanQ.split(' ').filter(Boolean);

    const scored: Array<{ option: SearchOption; score: number }> = [];

    for (const opt of baseFilteredOptions) {
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
  }, [baseFilteredOptions, query]);

  const exactMatch = baseFilteredOptions.some(
    (opt) =>
      opt.name.toLowerCase().trim() === query.toLowerCase().trim() ||
      (opt.aliases && opt.aliases.some((a) => a.toLowerCase().trim() === query.toLowerCase().trim()))
  );

  const hasSearchText = query.trim().length > 0;
  const showCustomNotice = hasSearchText && !exactMatch && filteredAndRanked.length === 0;

  return (
    <div className="relative w-full" ref={dropdownRef} id={`container-${id}`}>
      <label htmlFor={id} className="block text-sm font-medium text-zinc-300 mb-1.5 flex items-center justify-between">
        <span className="flex items-center gap-2">
          <span>{label}</span>
          {enableCompanyFilter && activeCompanyFilter !== 'All' && (
            <span
              id={`badge-filter-${id}`}
              className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-indigo-950/90 text-indigo-300 border border-indigo-800/70"
            >
              Filter: {activeCompanyFilter}
              <button
                type="button"
                id={`btn-clear-badge-${id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleFilterSelect('All');
                }}
                className="hover:text-white ml-0.5 cursor-pointer"
                title="Clear company filter (show all)"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </span>
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

        <div className="flex items-center gap-1.5">
          {enableCompanyFilter && activeCompanyFilter !== 'All' && (
            <span className="text-[11px] font-semibold text-indigo-300 bg-indigo-950/70 border border-indigo-800/60 px-1.5 py-0.5 rounded">
              {activeCompanyFilter}
            </span>
          )}
          <ChevronDown
            className={`w-4 h-4 text-zinc-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-zinc-200' : ''
            }`}
          />
        </div>
      </div>

      {/* Floating Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-1.5 w-full bg-zinc-900 border border-zinc-700/80 rounded-xl shadow-2xl overflow-hidden backdrop-blur-lg">
          {/* Search box header with Company Filter */}
          <div className="p-2.5 border-b border-zinc-800 bg-zinc-950/80 space-y-2">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id={`input-search-${id}`}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={
                    activeCompanyFilter !== 'All'
                      ? `Search ${activeCompanyFilter} ${type}s...`
                      : `Search or choose your ${type}...`
                  }
                  className="w-full bg-zinc-900 text-sm text-zinc-100 pl-9 pr-3 py-2 rounded-lg border border-zinc-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              {/* Small Company Filter Button */}
              {enableCompanyFilter && (
                <div className="relative shrink-0" ref={filterMenuRef}>
                  <button
                    type="button"
                    id={`btn-filter-${id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsFilterMenuOpen((prev) => !prev);
                    }}
                    className={`px-2.5 py-2 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition-colors cursor-pointer ${
                      activeCompanyFilter !== 'All'
                        ? 'bg-indigo-600/25 text-indigo-300 border-indigo-500/70 hover:bg-indigo-600/35 shadow-sm'
                        : 'bg-zinc-900 text-zinc-300 border-zinc-700 hover:bg-zinc-800 hover:text-white'
                    }`}
                    title="Filter by manufacturer"
                  >
                    <Filter className="w-3.5 h-3.5" />
                    <span>{activeCompanyFilter === 'All' ? 'Filter' : activeCompanyFilter}</span>
                    <ChevronDown
                      className={`w-3 h-3 text-zinc-400 transition-transform duration-200 ${
                        isFilterMenuOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Filter Menu Dropdown */}
                  {isFilterMenuOpen && (
                    <div
                      id={`menu-filter-${id}`}
                      className="absolute right-0 top-full mt-1.5 z-60 w-36 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl p-1 backdrop-blur-md animate-in fade-in zoom-in-95 duration-150"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="px-2.5 py-1 text-[10px] font-bold text-zinc-400 uppercase tracking-wider border-b border-zinc-800 mb-1">
                        Company Filter
                      </div>
                      {companyOptions.map((comp) => {
                        const isSelected = activeCompanyFilter === comp;
                        return (
                          <button
                            key={comp}
                            type="button"
                            id={`filter-opt-${id}-${comp.toLowerCase()}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFilterSelect(comp);
                              setIsFilterMenuOpen(false);
                            }}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-indigo-600/30 text-indigo-300 font-semibold'
                                : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                            }`}
                          >
                            <span>{comp}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quick Filter Pill Buttons Row */}
            {enableCompanyFilter && (
              <div className="flex items-center justify-between text-xs pt-0.5">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] text-zinc-400 font-medium flex items-center gap-1 mr-0.5">
                    <Filter className="w-3 h-3 text-zinc-400" />
                    Company:
                  </span>
                  {companyOptions.map((comp) => {
                    const isSelected = activeCompanyFilter === comp;
                    return (
                      <button
                        key={comp}
                        type="button"
                        id={`pill-filter-${id}-${comp.toLowerCase()}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFilterSelect(comp);
                        }}
                        className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                            : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-700 hover:text-zinc-200'
                        }`}
                      >
                        {comp}
                      </button>
                    );
                  })}
                </div>

                {activeCompanyFilter !== 'All' && (
                  <button
                    type="button"
                    id={`btn-clear-filter-row-${id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFilterSelect('All');
                    }}
                    className="text-[11px] text-zinc-400 hover:text-white flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-zinc-800 transition-colors cursor-pointer shrink-0 ml-1"
                    title="Clear filter (show all)"
                  >
                    <X className="w-3 h-3" />
                    Clear
                  </button>
                )}
              </div>
            )}
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
            ) : (
              <div className="p-4 text-center text-xs text-zinc-400">
                {enableCompanyFilter && activeCompanyFilter !== 'All' ? (
                  <div className="space-y-1.5">
                    <p>
                      No {activeCompanyFilter} {type}s matched your search query "{query}".
                    </p>
                    <button
                      type="button"
                      onClick={() => handleFilterSelect('All')}
                      className="text-indigo-400 hover:text-indigo-300 underline font-medium cursor-pointer"
                    >
                      Clear company filter to search all {type}s
                    </button>
                  </div>
                ) : (
                  <span>No {type}s found matching "{query}".</span>
                )}
              </div>
            )}

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

