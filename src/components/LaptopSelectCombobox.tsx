import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, ChevronDown, Check, Laptop, X, Sparkles, Scale } from 'lucide-react';
import { DeviceModel } from '../types';

interface LaptopSelectComboboxProps {
  id: string;
  laptops: DeviceModel[];
  selectedLaptop: DeviceModel | null;
  onSelectLaptop: (laptop: DeviceModel) => void;
  label?: string;
  placeholder?: string;
  showTgpBadge?: boolean;
}

export const LaptopSelectCombobox: React.FC<LaptopSelectComboboxProps> = ({
  id,
  laptops,
  selectedLaptop,
  onSelectLaptop,
  label,
  placeholder = 'Type to search laptop model, chassis, or GPU...',
  showTgpBadge = true
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredLaptops = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return laptops;
    return laptops.filter((lap) => {
      const matchName = lap.name.toLowerCase().includes(q);
      const matchSku = lap.exactSku?.toLowerCase().includes(q) || false;
      const matchBrand = lap.brand.toLowerCase().includes(q);
      const matchGpu = lap.defaultGpuId.toLowerCase().includes(q);
      const matchFamily = lap.productFamily.toLowerCase().includes(q);
      const matchKeywords = lap.keywords?.some((k) => k.toLowerCase().includes(q)) || false;
      return matchName || matchSku || matchBrand || matchGpu || matchFamily || matchKeywords;
    });
  }, [laptops, query]);

  return (
    <div className="relative w-full" ref={dropdownRef} id={`container-${id}`}>
      {label && (
        <div className="flex items-center justify-between mb-1.5">
          <label htmlFor={id} className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
            <Laptop className="w-3.5 h-3.5 text-indigo-400" />
            {label}
          </label>
          <span className="text-[10px] text-zinc-500 font-normal">
            ({filteredLaptops.length} available)
          </span>
        </div>
      )}

      {/* Trigger & Search Bar */}
      <div
        className={`w-full min-h-[42px] px-3 py-2 rounded-xl bg-zinc-950 border text-xs text-zinc-100 flex items-center gap-2 transition-all cursor-text shadow-sm ${
          isOpen
            ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-zinc-950'
            : 'border-zinc-800 hover:border-zinc-700'
        }`}
        onClick={() => {
          setIsOpen(true);
          inputRef.current?.focus();
        }}
      >
        <Search className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
        <input
          ref={inputRef}
          id={id}
          type="text"
          value={isOpen ? query : (selectedLaptop ? `${selectedLaptop.name} ${selectedLaptop.gpuTgpWatts ? `[${selectedLaptop.gpuTgpWatts}]` : ''}` : query)}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => {
            setIsOpen(true);
            setQuery('');
          }}
          placeholder={selectedLaptop ? `${selectedLaptop.name} — ${selectedLaptop.gpuTgpWatts || ''}` : placeholder}
          className="w-full bg-transparent text-xs text-zinc-100 placeholder-zinc-400 focus:outline-none truncate"
        />

        {query && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setQuery('');
              inputRef.current?.focus();
            }}
            className="text-zinc-500 hover:text-zinc-300 p-0.5"
          >
            <X className="w-3 h-3" />
          </button>
        )}

        <button
          type="button"
          tabIndex={-1}
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen((prev) => !prev);
          }}
          className="text-zinc-400 hover:text-zinc-200 shrink-0 p-0.5"
        >
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180 text-indigo-400' : ''}`} />
        </button>
      </div>

      {/* Floating Dropdown Results */}
      {isOpen && (
        <div
          id={`${id}-results-menu`}
          className="absolute left-0 right-0 top-full mt-2 z-50 max-h-72 overflow-y-auto rounded-xl bg-zinc-900 border border-zinc-700 shadow-2xl p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-150"
        >
          {filteredLaptops.length === 0 ? (
            <div className="py-6 text-center text-xs text-zinc-400">
              No laptop models match "{query}". Try searching by brand, GPU, or chassis name.
            </div>
          ) : (
            filteredLaptops.map((lap) => {
              const isSelected = selectedLaptop?.id === lap.id;
              return (
                <div
                  key={lap.id}
                  id={`item-${lap.id}`}
                  onClick={() => {
                    onSelectLaptop(lap);
                    setIsOpen(false);
                    setQuery('');
                  }}
                  className={`w-full p-2.5 rounded-lg text-left cursor-pointer transition-colors flex items-center justify-between gap-2.5 ${
                    isSelected
                      ? 'bg-indigo-950/80 text-white border border-indigo-500/40'
                      : 'hover:bg-zinc-800 text-zinc-200'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-zinc-100 truncate">
                        {lap.name}
                      </span>
                      {showTgpBadge && lap.gpuTgpWatts && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800/60 shrink-0 whitespace-nowrap">
                          {lap.gpuTgpWatts}
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-zinc-400 flex items-center gap-1.5 mt-0.5 truncate">
                      <span className="font-medium text-zinc-300">{lap.brand}</span>
                      <span>•</span>
                      <span>{lap.defaultGpuId}</span>
                      {lap.exactSku && (
                        <>
                          <span>•</span>
                          <span className="font-mono text-zinc-400">{lap.exactSku}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {isSelected && (
                    <div className="p-1 rounded-md bg-indigo-600 text-white shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
