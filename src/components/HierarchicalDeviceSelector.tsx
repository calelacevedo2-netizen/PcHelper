import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Search,
  ChevronDown,
  ChevronRight,
  Check,
  X,
  Laptop,
  Monitor,
  Cpu,
  Zap,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sliders,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import { DeviceModel, DeviceType, RamOption } from '../types';
import {
  ProductFamilyItem,
  ExactModelItem,
  getProductFamilies,
  searchProductFamilies,
  searchExactModels
} from '../data/deviceHierarchy';
import { CPUS_DATABASE } from '../data/cpus';
import { GPUS_DATABASE } from '../data/gpus';

interface HierarchicalDeviceSelectorProps {
  deviceType: DeviceType | null;
  onSelectDeviceType: (type: DeviceType) => void;
  selectedFamily: ProductFamilyItem | null;
  onSelectFamily: (family: ProductFamilyItem | null) => void;
  selectedExactModel: ExactModelItem | null;
  onSelectExactModel: (model: ExactModelItem | null) => void;
  selectedSku: string | null;
  onSelectSku: (sku: string | null, device: DeviceModel | null) => void;
  selectedDevice: DeviceModel | null;
  onClearDevice: () => void;
  isHardwareMismatch: boolean;
  onRevertToFactory: () => void;
  activeCpuName?: string;
  activeGpuName?: string;
  selectedVram?: number | null;
  selectedRam?: RamOption | null;
}

export const HierarchicalDeviceSelector: React.FC<HierarchicalDeviceSelectorProps> = ({
  deviceType,
  onSelectDeviceType,
  selectedFamily,
  onSelectFamily,
  selectedExactModel,
  onSelectExactModel,
  selectedSku,
  onSelectSku,
  selectedDevice,
  onClearDevice,
  isHardwareMismatch,
  onRevertToFactory,
  activeCpuName,
  activeGpuName,
  selectedVram,
  selectedRam
}) => {
  // Family search and dropdown state
  const [isFamilyDropdownOpen, setIsFamilyDropdownOpen] = useState(false);
  const [familySearchQuery, setFamilySearchQuery] = useState('');
  const [familyBrandFilter, setFamilyBrandFilter] = useState<string>('all');
  const familyDropdownRef = useRef<HTMLDivElement>(null);

  // Exact Model search state
  const [modelSearchQuery, setModelSearchQuery] = useState('');
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [isEditingModel, setIsEditingModel] = useState(false);
  const modelDropdownRef = useRef<HTMLDivElement>(null);

  // Close family dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (familyDropdownRef.current && !familyDropdownRef.current.contains(e.target as Node)) {
        setIsFamilyDropdownOpen(false);
      }
      if (modelDropdownRef.current && !modelDropdownRef.current.contains(e.target as Node)) {
        setIsModelDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered families for current device type
  const availableFamilies = useMemo(() => {
    if (!deviceType) return [];
    return getProductFamilies(deviceType);
  }, [deviceType]);

  // Extract brands for filter tabs
  const availableBrands = useMemo(() => {
    const set = new Set<string>();
    availableFamilies.forEach((f) => set.add(f.brand));
    return ['all', ...Array.from(set).sort()];
  }, [availableFamilies]);

  // Filtered family search results
  const filteredFamilies = useMemo(() => {
    if (!deviceType) return [];
    let list = searchProductFamilies(familySearchQuery, deviceType);
    if (familyBrandFilter !== 'all') {
      list = list.filter((f) => f.brand.toLowerCase() === familyBrandFilter.toLowerCase());
    }
    return list;
  }, [deviceType, familySearchQuery, familyBrandFilter]);

  // Filtered exact models for selected family
  const filteredExactModels = useMemo(() => {
    if (!selectedFamily) return [];
    return searchExactModels(modelSearchQuery, selectedFamily);
  }, [selectedFamily, modelSearchQuery]);

  // Handle selecting a family
  const handleSelectFamily = (family: ProductFamilyItem) => {
    onSelectFamily(family);
    setIsFamilyDropdownOpen(false);
    setFamilySearchQuery('');
    // Automatically open model dropdown or leave model blank as requested by requirement 7
  };

  // Handle selecting an exact model
  const handleSelectExactModel = (model: ExactModelItem) => {
    onSelectExactModel(model);
    setIsModelDropdownOpen(false);
    setModelSearchQuery('');
    setIsEditingModel(false);
  };

  return (
    <div className="space-y-5" id="hierarchical-device-selector">
      {/* =========================================================================
          LEVEL 1: What are you using? (Laptop vs Desktop PC)
          ========================================================================= */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <label className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
            <Laptop className="w-4 h-4 text-indigo-400" />
            1. What are you using?
          </label>
          <span className="text-xs text-zinc-400">Step 1 of 4</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {/* Laptop Option */}
          <button
            type="button"
            id="btn-select-laptop"
            onClick={() => onSelectDeviceType('laptop')}
            className={`p-3.5 sm:p-4 rounded-xl border text-left transition-all cursor-pointer relative flex flex-col justify-between gap-3 min-w-0 ${
              deviceType === 'laptop'
                ? 'bg-indigo-950/60 border-indigo-500 ring-2 ring-indigo-500/30 shadow-lg shadow-indigo-950/40 text-white'
                : 'bg-zinc-950/60 border-zinc-800/90 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900/60'
            }`}
          >
            <div className="flex items-start justify-between gap-2.5 min-w-0">
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Laptop className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-sm sm:text-base text-zinc-100 flex items-center gap-1.5 flex-wrap">
                    <span>Laptop</span>
                    {deviceType === 'laptop' && (
                      <span className="text-[10px] font-semibold text-indigo-300 bg-indigo-900/70 border border-indigo-700/60 px-1.5 py-0.5 rounded-full shrink-0">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    Gaming laptop or notebook with integrated screen
                  </p>
                </div>
              </div>

              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-all mt-0.5 ${
                  deviceType === 'laptop'
                    ? 'bg-indigo-600 border-indigo-400 text-white'
                    : 'border-zinc-700 bg-zinc-900'
                }`}
              >
                {deviceType === 'laptop' && <Check className="w-3.5 h-3.5" />}
              </div>
            </div>

            <div className="pt-2.5 border-t border-zinc-800/60 flex flex-col gap-1.5 text-[11px] min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-1.5 min-w-0">
                <span className="text-zinc-400 text-[11px] leading-tight min-w-0">Mobile CPUs & Laptop GPUs</span>
                <span className="font-medium text-amber-400/90 text-[10px] bg-amber-950/50 border border-amber-800/50 px-1.5 py-0.5 rounded shrink-0 whitespace-nowrap">
                  Power & thermal calibrated
                </span>
              </div>
            </div>
          </button>

          {/* Desktop PC Option */}
          <button
            type="button"
            id="btn-select-desktop"
            onClick={() => onSelectDeviceType('desktop')}
            className={`p-3.5 sm:p-4 rounded-xl border text-left transition-all cursor-pointer relative flex flex-col justify-between gap-3 min-w-0 ${
              deviceType === 'desktop'
                ? 'bg-indigo-950/60 border-indigo-500 ring-2 ring-indigo-500/30 shadow-lg shadow-indigo-950/40 text-white'
                : 'bg-zinc-950/60 border-zinc-800/90 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900/60'
            }`}
          >
            <div className="flex items-start justify-between gap-2.5 min-w-0">
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Monitor className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-sm sm:text-base text-zinc-100 flex items-center gap-1.5 flex-wrap">
                    <span>Desktop PC</span>
                    {deviceType === 'desktop' && (
                      <span className="text-[10px] font-semibold text-indigo-300 bg-indigo-900/70 border border-indigo-700/60 px-1.5 py-0.5 rounded-full shrink-0">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    Custom built or pre-built desktop gaming tower
                  </p>
                </div>
              </div>

              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-all mt-0.5 ${
                  deviceType === 'desktop'
                    ? 'bg-indigo-600 border-indigo-400 text-white'
                    : 'border-zinc-700 bg-zinc-900'
                }`}
              >
                {deviceType === 'desktop' && <Check className="w-3.5 h-3.5" />}
              </div>
            </div>

            <div className="pt-2.5 border-t border-zinc-800/60 flex flex-col gap-1.5 text-[11px] min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-1.5 min-w-0">
                <span className="text-zinc-400 text-[11px] leading-tight min-w-0">Desktop CPUs & Desktop GPUs</span>
                <span className="font-medium text-emerald-400/90 text-[10px] bg-emerald-950/50 border border-emerald-800/50 px-1.5 py-0.5 rounded shrink-0 whitespace-nowrap">
                  Standard full power
                </span>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* =========================================================================
          LEVEL 2: Product Family Selector (Searchable, optional)
          ========================================================================= */}
      {deviceType && (
        <div
          id="section-product-family"
          className="p-4 sm:p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800 animate-in fade-in duration-200"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div>
              <div className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                Select Product Family{' '}
                <span className="text-xs font-normal text-zinc-400">(Optional)</span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                {deviceType === 'laptop'
                  ? 'Select your laptop line (e.g. ASUS TUF Gaming A15, MSI Thin 15, Lenovo Legion 5) to reveal exact factory models.'
                  : 'Select your pre-built line (e.g. ASUS ROG Gaming, MSI MAG Codex, Lenovo Legion Tower), or skip to pick parts freely.'}
              </p>
            </div>

            {selectedFamily && (
              <button
                type="button"
                id="btn-clear-family"
                onClick={() => {
                  onSelectFamily(null);
                  onSelectExactModel(null);
                }}
                className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1 self-start sm:self-auto py-1 px-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Clear Family
              </button>
            )}
          </div>

          {/* If no family is selected: Show searchable picker */}
          {!selectedFamily ? (
            <div className="relative" ref={familyDropdownRef}>
              <div
                className="relative cursor-pointer"
                onClick={() => setIsFamilyDropdownOpen(true)}
              >
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                <input
                  type="text"
                  id="input-search-product-family"
                  value={familySearchQuery}
                  onChange={(e) => {
                    setFamilySearchQuery(e.target.value);
                    setIsFamilyDropdownOpen(true);
                  }}
                  onFocus={() => setIsFamilyDropdownOpen(true)}
                  placeholder={
                    deviceType === 'laptop'
                      ? 'Search laptop family (e.g. "TUF A15", "MSI Thin", "Legion", "Victus", or model "FA506")...'
                      : 'Search desktop family (e.g. "ASUS ROG", "MSI Codex", "Legion Tower", "Nitro Desktop")...'
                  }
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-zinc-950 border border-zinc-700 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
                <button
                  type="button"
                  aria-label="Toggle dropdown"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFamilyDropdownOpen(!isFamilyDropdownOpen);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 p-1"
                >
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isFamilyDropdownOpen ? 'rotate-180 text-indigo-400' : ''
                    }`}
                  />
                </button>
              </div>

              {/* Family Dropdown Panel */}
              {isFamilyDropdownOpen && (
                <div
                  id="dropdown-product-families"
                  className="absolute left-0 right-0 top-full mt-2 z-30 max-h-80 overflow-y-auto rounded-xl bg-zinc-900 border border-zinc-700 shadow-2xl p-2.5 space-y-2"
                >
                  {/* Brand Filter Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 border-b border-zinc-800 text-xs no-scrollbar">
                    {availableBrands.map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFamilyBrandFilter(b);
                        }}
                        className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                          familyBrandFilter === b
                            ? 'bg-indigo-600 text-white'
                            : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                        }`}
                      >
                        {b === 'all' ? 'All Brands' : b}
                      </button>
                    ))}
                  </div>

                  {/* Family Results */}
                  <div className="space-y-1 pt-1">
                    {filteredFamilies.length === 0 ? (
                      <div className="py-6 text-center text-xs text-zinc-400">
                        No product family found matching "{familySearchQuery}".
                        <br />
                        <span className="text-[11px] text-zinc-500 mt-1 inline-block">
                          You can still select your CPU, GPU, and RAM manually below!
                        </span>
                      </div>
                    ) : (
                      filteredFamilies.map((fam) => (
                        <button
                          key={fam.id}
                          type="button"
                          id={`btn-family-${fam.id}`}
                          onClick={() => handleSelectFamily(fam)}
                          className="w-full p-2.5 rounded-lg text-left hover:bg-zinc-800/80 transition-colors flex items-center justify-between group border border-transparent hover:border-zinc-700"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="p-1.5 rounded-md bg-zinc-800 text-zinc-300 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                              {deviceType === 'laptop' ? (
                                <Laptop className="w-4 h-4" />
                              ) : (
                                <Monitor className="w-4 h-4" />
                              )}
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-zinc-100 group-hover:text-indigo-300 transition-colors">
                                {fam.displayName}
                              </div>
                              <div className="text-[11px] text-zinc-400 flex items-center gap-1.5 mt-0.5">
                                <span className="font-medium text-zinc-300">{fam.brand}</span>
                                <span>•</span>
                                <span>{fam.modelCount} verified model{fam.modelCount > 1 ? 's' : ''}</span>
                                {fam.sampleModels.length > 0 && (
                                  <>
                                    <span>•</span>
                                    <span className="text-zinc-400">
                                      ({fam.sampleModels.join(', ')})
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-indigo-400 transition-colors" />
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Selected Family Pill */
            <div className="p-3.5 rounded-xl bg-zinc-950 border border-indigo-500/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                  {deviceType === 'laptop' ? <Laptop className="w-5 h-5" /> : <Monitor className="w-5 h-5" />}
                </div>
                <div>
                  <div className="text-xs text-zinc-400 font-medium">Selected Product Family:</div>
                  <div className="text-base font-bold text-white flex items-center gap-2">
                    {selectedFamily.displayName}
                    <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800">
                      {selectedFamily.modelCount} models
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                id="btn-change-family"
                onClick={() => {
                  onSelectFamily(null);
                  onSelectExactModel(null);
                  setIsFamilyDropdownOpen(true);
                }}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 px-3 py-1.5 rounded-lg border border-indigo-500/30 hover:bg-indigo-950/40 transition-colors"
              >
                Change Family
              </button>
            </div>
          )}

          {/* =========================================================================
              LEVEL 3: Exact Model Selector (shown after choosing family)
              ========================================================================= */}
          {selectedFamily && (
            <div
              id="section-exact-model"
              className="mt-4 pt-4 border-t border-zinc-800 animate-in fade-in duration-200"
            >
              <div className="flex items-center justify-between mb-2">
                <div>
                  <label className="text-xs font-semibold text-zinc-200 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-indigo-400" />
                    Exact Model for {selectedFamily.displayName}
                  </label>
                  <p className="text-[11px] text-zinc-400">
                    Select your exact model (e.g.{' '}
                    {selectedFamily.sampleModels.slice(0, 3).join(', ') || 'model'}) to load its verified
                    factory specs, or configure hardware manually below.
                  </p>
                </div>

                {selectedExactModel && (
                  <button
                    type="button"
                    id="btn-clear-exact-model"
                    onClick={() => onSelectExactModel(null)}
                    className="text-[11px] text-zinc-400 hover:text-zinc-200 flex items-center gap-1 px-2 py-1 rounded bg-zinc-800"
                  >
                    <X className="w-3 h-3" />
                    Deselect Model
                  </button>
                )}
              </div>

              {/* Exact Model Search & Grid OR Compact Summary when selected */}
              {selectedExactModel && !isEditingModel ? (
                <div className="p-3 rounded-xl bg-zinc-950 border border-indigo-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner">
                  <div>
                    <div className="font-bold text-xs sm:text-sm text-zinc-100 flex items-center gap-2">
                      <span>{selectedFamily.displayName} — {selectedExactModel.displayName}</span>
                      {selectedSku && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">
                          {selectedSku}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-zinc-400 mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                      <span className="text-zinc-300 font-medium">{selectedExactModel.cpuName}</span>
                      <span>•</span>
                      <span className="text-indigo-400 font-medium">{selectedExactModel.gpuName} ({selectedExactModel.vram} GB)</span>
                      <span>•</span>
                      <span>{selectedExactModel.ram} GB RAM</span>
                      {selectedExactModel.gpuTgpWatts && (
                        <>
                          <span>•</span>
                          <span className="text-amber-400 font-mono">{selectedExactModel.gpuTgpWatts.split(' ')[0]}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                    <button
                      type="button"
                      id="btn-change-exact-model"
                      onClick={() => setIsEditingModel(true)}
                      className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 px-2.5 py-1 rounded-lg border border-indigo-500/30 hover:bg-indigo-950/40 transition-colors"
                    >
                      Change Model
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onSelectExactModel(null);
                        setIsEditingModel(true);
                      }}
                      className="text-xs text-zinc-400 hover:text-zinc-200 p-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 transition-colors"
                      title="Clear Model"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
                    <input
                      type="text"
                      id="input-search-exact-model"
                      value={modelSearchQuery}
                      onChange={(e) => setModelSearchQuery(e.target.value)}
                      placeholder={`Filter exact model (e.g. "${selectedFamily.sampleModels[0] || 'FA506'}" or SKU)...`}
                      className="w-full pl-9 pr-8 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
                    />
                    {modelSearchQuery && (
                      <button
                        type="button"
                        onClick={() => setModelSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200 p-0.5"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Model Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto p-1 rounded-xl bg-zinc-950/40 border border-zinc-800/80">
                    {filteredExactModels.length === 0 ? (
                      <div className="col-span-2 py-4 text-center text-xs text-zinc-400">
                        No exact model found matching "{modelSearchQuery}".
                      </div>
                    ) : (
                      filteredExactModels.map((em) => {
                        const isSelected = selectedExactModel?.id === em.id;
                        return (
                          <button
                            key={em.id}
                            type="button"
                            id={`btn-model-${em.id}`}
                            onClick={() => handleSelectExactModel(em)}
                            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-indigo-950/70 border-indigo-500 ring-1 ring-indigo-500 text-white shadow-md'
                                : 'bg-zinc-900/80 border-zinc-800/80 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-850'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="font-bold text-xs text-zinc-100 flex items-center gap-1.5">
                                <span>{em.displayName}</span>
                                {isSelected && (
                                  <span className="p-0.5 rounded-full bg-indigo-500 text-white">
                                    <Check className="w-2.5 h-2.5" />
                                  </span>
                                )}
                              </div>
                              {em.year && (
                                <span className="text-[10px] text-zinc-400 bg-zinc-800 px-1.5 py-0.5 rounded">
                                  {em.year}
                                </span>
                              )}
                            </div>

                            <div className="mt-1.5 text-[11px] text-zinc-400 space-y-0.5">
                              <div className="text-zinc-300 font-medium truncate">
                                {em.cpuName}
                              </div>
                              <div className="text-indigo-400 truncate">
                                {em.gpuName} • {em.vram}GB VRAM
                              </div>
                              <div className="text-zinc-400 text-[10px] flex items-center justify-between pt-0.5">
                                <span>RAM: {em.ram}GB {em.ramType || ''}</span>
                                {em.gpuTgpWatts && (
                                  <span className="text-amber-400/90 font-mono">
                                    {em.gpuTgpWatts.split(' ')[0]}
                                  </span>
                                )}
                              </div>
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {/* =========================================================================
                  LEVEL 4: Exact Configuration / SKU Selector (when model has multiple SKUs)
                  ========================================================================= */}
              {selectedExactModel && selectedExactModel.skus.length > 1 && (
                <div
                  id="section-exact-skus"
                  className="mt-3 p-3 rounded-xl bg-zinc-950 border border-zinc-800"
                >
                  <div className="text-xs font-semibold text-zinc-300 flex items-center justify-between mb-2">
                    <span className="flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                      Specific Retail SKU / Configuration:
                    </span>
                    <span className="text-[11px] text-zinc-400 font-normal">
                      {selectedExactModel.skus.length} retail SKUs
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {selectedExactModel.skus.map((sku) => {
                      const isSelected = selectedSku === sku || (!selectedSku && sku === selectedExactModel.skus[0]);
                      return (
                        <button
                          key={sku}
                          type="button"
                          id={`btn-sku-${sku}`}
                          onClick={() => {
                            const matchingDev =
                              selectedExactModel.configurations.find((c) => c.exactSku === sku || (c.skus && c.skus.includes(sku))) ||
                              selectedExactModel.primaryDevice;
                            onSelectSku(sku, matchingDev);
                          }}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium border transition-colors ${
                            isSelected
                              ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                              : 'bg-zinc-900 text-zinc-300 border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800'
                          }`}
                        >
                          {sku}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Verified Factory Specs Overview Card */}
              {selectedExactModel && (
                <div
                  id="card-verified-factory-specs"
                  className="mt-3 p-3.5 rounded-xl bg-zinc-950/90 border border-emerald-500/30 text-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-semibold text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                      Verified Factory Configuration Applied
                    </div>
                    <span className="text-[11px] text-zinc-400 font-mono">
                      {selectedSku || selectedExactModel.skus[0] || selectedExactModel.displayName}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                    <div className="p-2 rounded bg-zinc-900 border border-zinc-800">
                      <div className="text-[10px] text-zinc-400">Processor (CPU)</div>
                      <div className="font-semibold text-zinc-200 truncate mt-0.5">
                        {selectedExactModel.cpuName}
                      </div>
                    </div>
                    <div className="p-2 rounded bg-zinc-900 border border-zinc-800">
                      <div className="text-[10px] text-zinc-400">Graphics (GPU)</div>
                      <div className="font-semibold text-zinc-200 truncate mt-0.5">
                        {selectedExactModel.gpuName}
                      </div>
                    </div>
                    <div className="p-2 rounded bg-zinc-900 border border-zinc-800">
                      <div className="text-[10px] text-zinc-400">VRAM & Memory</div>
                      <div className="font-semibold text-zinc-200 truncate mt-0.5">
                        {selectedExactModel.vram} GB VRAM • {selectedExactModel.ram} GB RAM
                      </div>
                    </div>
                    <div className="p-2 rounded bg-zinc-900 border border-zinc-800">
                      <div className="text-[10px] text-zinc-400">TGP / Thermal</div>
                      <div className="font-semibold text-amber-400 truncate mt-0.5">
                        {selectedExactModel.gpuTgpWatts || 'Factory Calibrated'}
                      </div>
                    </div>
                  </div>

                  {selectedExactModel.coolingNotes && (
                    <div className="text-[11px] text-zinc-400 pt-1 border-t border-zinc-800/80 flex items-start gap-1.5">
                      <Info className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0 mt-0.5" />
                      <span>{selectedExactModel.coolingNotes}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              CUSTOM HARDWARE OVERRIDE NOTICE (Requirement 9)
              ========================================================================= */}
          {selectedExactModel && isHardwareMismatch && (
            <div
              id="notice-custom-hardware-override"
              className="mt-3 p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/40 text-xs text-amber-200 animate-in fade-in duration-200"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-amber-300">Custom configuration</div>
                    <p className="text-[11px] text-amber-200/90 mt-0.5 leading-relaxed">
                      Your manually selected hardware differs from the known factory configuration, so the PC
                      Tier result will be based primarily on your custom hardware.
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2 text-[10px]">
                      <span className="px-2 py-0.5 rounded bg-amber-900/50 border border-amber-700/60 text-amber-200">
                        Current: {activeCpuName || 'Custom CPU'} • {activeGpuName || 'Custom GPU'} •{' '}
                        {selectedVram ? `${selectedVram}GB VRAM` : ''} •{' '}
                        {selectedRam ? `${selectedRam}GB RAM` : ''}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  id="btn-revert-factory-specs"
                  onClick={onRevertToFactory}
                  className="px-2.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition-colors flex-shrink-0 cursor-pointer shadow"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Revert to factory specs
                </button>
              </div>
            </div>
          )}

          {/* Free hardware entry reminder if no model selected */}
          {!selectedFamily && (
            <div className="mt-3 p-2.5 rounded-lg bg-zinc-950/40 border border-zinc-800/60 text-[11px] text-zinc-400 flex items-center gap-2">
              <Info className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
              <span>
                <strong>Manual Mode:</strong> You can skip device selection entirely and choose any CPU,
                GPU, VRAM, and RAM freely below.
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
