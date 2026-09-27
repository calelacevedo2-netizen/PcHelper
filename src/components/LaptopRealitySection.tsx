import React, { useState, useMemo } from 'react';
import {
  Laptop,
  Zap,
  Flame,
  Tv,
  HardDrive,
  Cpu,
  Monitor,
  Layers,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Search,
  ArrowRight,
  TrendingUp,
  Sliders,
  Scale,
  Sparkles,
  Info
} from 'lucide-react';
import { DEVICES_DATABASE, getAvailableBrands, getProductFamilies } from '../data/devices';
import { DeviceModel, DeviceBenchmark } from '../types';
import { evaluateLaptopReality } from '../logic/laptopRealityEvaluator';
import { LaptopSelectCombobox } from './LaptopSelectCombobox';

interface LaptopRealitySectionProps {
  currentDevice?: DeviceModel | null;
  onSelectDevice?: (device: DeviceModel) => void;
}

export const LaptopRealitySection: React.FC<LaptopRealitySectionProps> = ({
  currentDevice,
  onSelectDevice
}) => {
  // Filter for laptops only
  const allLaptops = useMemo(() => {
    return DEVICES_DATABASE.filter((d) => d.type === 'laptop');
  }, []);

  // Selected primary laptop
  const [selectedLaptopId, setSelectedLaptopId] = useState<string>(() => {
    if (currentDevice && currentDevice.type === 'laptop') {
      return currentDevice.id;
    }
    // Default to a rich featured laptop model with benchmarks
    return 'lenovo-legion-pro-5-16irx9-rtx-4060';
  });

  // Comparison laptop state
  const [comparisonMode, setComparisonMode] = useState<boolean>(false);
  const [comparisonLaptopId, setComparisonLaptopId] = useState<string>(
    'msi-thin-15-b13uc-rtx-3050' // classic 45W low-TGP contrast
  );

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [brandFilter, setBrandFilter] = useState<string>('all');
  const [gpuFamilyFilter, setGpuFamilyFilter] = useState<string>('all');

  // Collapsible sections
  const [showVarianceFactors, setShowVarianceFactors] = useState<boolean>(false);
  const [showBenchmarkLimitations, setShowBenchmarkLimitations] = useState<boolean>(false);

  // Get active primary laptop
  const activeLaptop = useMemo(() => {
    return allLaptops.find((l) => l.id === selectedLaptopId) || allLaptops[0];
  }, [allLaptops, selectedLaptopId]);

  // Evaluate primary profile
  const primaryProfile = useMemo(() => {
    return evaluateLaptopReality(activeLaptop);
  }, [activeLaptop]);

  // Comparison laptop
  const comparisonLaptop = useMemo(() => {
    if (!comparisonMode) return null;
    return allLaptops.find((l) => l.id === comparisonLaptopId) || allLaptops[1];
  }, [allLaptops, comparisonLaptopId, comparisonMode]);

  const comparisonProfile = useMemo(() => {
    if (!comparisonLaptop) return null;
    return evaluateLaptopReality(comparisonLaptop);
  }, [comparisonLaptop]);

  // Filtered laptops for selector
  const filteredLaptops = useMemo(() => {
    return allLaptops.filter((lap) => {
      if (brandFilter !== 'all' && lap.brand.toLowerCase() !== brandFilter.toLowerCase()) {
        return false;
      }
      if (gpuFamilyFilter !== 'all') {
        const gpuName = lap.defaultGpuId.toLowerCase();
        if (!gpuName.includes(gpuFamilyFilter.toLowerCase())) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = lap.name.toLowerCase().includes(q);
        const matchSku = lap.exactSku?.toLowerCase().includes(q) || false;
        const matchFamily = lap.productFamily.toLowerCase().includes(q);
        const matchKeywords = lap.keywords?.some((k) => k.toLowerCase().includes(q)) || false;
        if (!matchName && !matchSku && !matchFamily && !matchKeywords) return false;
      }
      return true;
    });
  }, [allLaptops, brandFilter, gpuFamilyFilter, searchQuery]);

  const availableBrands = useMemo(() => {
    return getAvailableBrands('laptop');
  }, []);

  const handleSelectPrimary = (laptop: DeviceModel) => {
    setSelectedLaptopId(laptop.id);
    if (onSelectDevice) {
      onSelectDevice(laptop);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Introduction Banner */}
      <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <Laptop className="w-4 h-4" />
              </span>
              <h2 className="text-lg font-bold text-zinc-100 tracking-tight">
                Exact Laptop Reality
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-950 text-indigo-300 border border-indigo-800/60">
                Chassis & TGP Truth
              </span>
            </div>
            <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
              In laptops, graphics chips sharing the same name perform very differently. TGP power limits (45W vs 140W), cooling design, single vs dual-channel RAM, and display resolutions create up to a 35% difference in actual gaming framerates.
            </p>
          </div>

          <button
            type="button"
            id="btn-toggle-laptop-comparison"
            onClick={() => setComparisonMode(!comparisonMode)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer shadow-sm flex-shrink-0 ${
              comparisonMode
                ? 'bg-indigo-600 text-white border-indigo-500'
                : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-700'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>{comparisonMode ? 'Close Side-by-Side' : 'Compare Two Laptops'}</span>
          </button>
        </div>
      </div>

      {/* Laptop Picker Filter Bar */}
      <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search laptop (e.g. Legion Pro 5, TUF A15, Nitro V, Thin 15, Katana)..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Brand Filter */}
          <div className="flex items-center gap-2">
            <select
              value={brandFilter}
              onChange={(e) => setBrandFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="all">All Brands ({allLaptops.length})</option>
              {availableBrands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>

            {/* GPU Family Filter */}
            <select
              value={gpuFamilyFilter}
              onChange={(e) => setGpuFamilyFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="all">All Mobile GPUs</option>
              <option value="4090">RTX 4090 Mobile</option>
              <option value="4080">RTX 4080 Mobile</option>
              <option value="4070">RTX 4070 Mobile</option>
              <option value="4060">RTX 4060 Mobile</option>
              <option value="4050">RTX 4050 Mobile</option>
              <option value="3050">RTX 3050 Mobile</option>
              <option value="3060">RTX 3060 Mobile</option>
              <option value="3070">RTX 3070 / Ti Mobile</option>
            </select>
          </div>
        </div>

        {/* Searchable Combobox Laptop Selector */}
        <div className="pt-1">
          <LaptopSelectCombobox
            id="select-active-laptop-sku"
            laptops={filteredLaptops}
            selectedLaptop={activeLaptop}
            onSelectLaptop={handleSelectPrimary}
            label={`Choose Laptop Model (${filteredLaptops.length} available)`}
            placeholder="Type laptop model name, family, GPU or SKU..."
          />
        </div>
      </div>

      {/* Side-by-Side Comparison Selector when comparisonMode is active */}
      {comparisonMode && (
        <div className="p-4 rounded-2xl bg-zinc-900/90 border border-indigo-500/40 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-indigo-300 flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-indigo-400" />
              Compare Against Second Laptop Model:
            </span>
            <span className="text-[10px] text-zinc-400">Notice the difference in TGP and cooling!</span>
          </div>

          <LaptopSelectCombobox
            id="select-comparison-laptop-sku"
            laptops={allLaptops}
            selectedLaptop={allLaptops.find((l) => l.id === comparisonLaptopId) || null}
            onSelectLaptop={(lap) => setComparisonLaptopId(lap.id)}
            placeholder="Type comparison laptop name or SKU..."
          />
        </div>
      )}

      {/* Main Content: Single Profile or Side-by-Side Columns */}
      <div className={`grid gap-6 ${comparisonMode ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
        {/* Model Profile 1 */}
        <div className="space-y-4">
          <LaptopProfileCard
            profile={primaryProfile}
            badgeLabel={comparisonMode ? 'Model A (Primary)' : 'Verified Hardware Profile'}
            isPrimary
          />
        </div>

        {/* Model Profile 2 (if in comparison mode) */}
        {comparisonMode && comparisonProfile && (
          <div className="space-y-4">
            <LaptopProfileCard
              profile={comparisonProfile}
              badgeLabel="Model B (Comparison)"
              isPrimary={false}
            />
          </div>
        )}
      </div>

      {/* Real-World Variance Factors (Collapsible) */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/80 overflow-hidden shadow-sm">
        <button
          type="button"
          onClick={() => setShowVarianceFactors(!showVarianceFactors)}
          className="w-full p-4 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-zinc-300 hover:text-white cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-indigo-400" />
            Key Factors Causing Real-World Laptop Performance Variance
          </span>
          {showVarianceFactors ? (
            <ChevronUp className="w-4 h-4 text-zinc-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-zinc-400" />
          )}
        </button>

        {showVarianceFactors && (
          <div className="p-4 pt-1 space-y-2.5 border-t border-zinc-800/60 text-xs text-zinc-300">
            {primaryProfile.varianceFactors.map((factor, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-zinc-950/70 border border-zinc-800/80 leading-relaxed">
                {factor}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Benchmark Data Limitations & Realities (Collapsible) */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-hidden shadow-sm">
        <button
          type="button"
          onClick={() => setShowBenchmarkLimitations(!showBenchmarkLimitations)}
          className="w-full p-4 flex items-center justify-between text-xs font-semibold text-zinc-400 hover:text-zinc-200 cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-zinc-400" />
            Important Limitations of Laptop Benchmark Evidence
          </span>
          {showBenchmarkLimitations ? (
            <ChevronUp className="w-4 h-4 text-zinc-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-zinc-400" />
          )}
        </button>

        {showBenchmarkLimitations && (
          <div className="p-4 pt-1 space-y-2 border-t border-zinc-800/40 text-xs text-zinc-400 leading-relaxed">
            {primaryProfile.limitationsOfData.map((lim, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="text-zinc-400 mt-0.5">•</span>
                <span>{lim}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface LaptopProfileCardProps {
  profile: ReturnType<typeof evaluateLaptopReality>;
  badgeLabel: string;
  isPrimary: boolean;
}

const LaptopProfileCard: React.FC<LaptopProfileCardProps> = ({ profile, badgeLabel, isPrimary }) => {
  const { device, cpu, gpu, verifiedTgp, tgpTierClassification, tgpExplanation } = profile;

  return (
    <div className="p-5 rounded-2xl bg-zinc-900/90 border border-zinc-800 shadow-sm space-y-5">
      {/* Header Info */}
      <div className="space-y-1.5 border-b border-zinc-800/80 pb-4">
        <div className="flex items-center justify-between">
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-950 text-indigo-300 border border-indigo-800/50">
            {badgeLabel}
          </span>
          <span className="text-[11px] text-zinc-400 font-medium">
            SKU: {device.exactSku || device.modelNumber || 'Standard Config'}
          </span>
        </div>

        <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
          {device.name}
        </h3>
        <p className="text-xs text-zinc-400">
          {device.brand} • {device.productFamily} {device.generation ? `(${device.generation})` : ''}
        </p>
      </div>

      {/* Hardware Specifications Grid */}
      <div className="grid grid-cols-2 gap-2.5 text-xs">
        {/* GPU & TGP */}
        <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-zinc-400 flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-400" />
            GPU & Power Limit
          </span>
          <p className="font-semibold text-zinc-100 truncate">
            {gpu?.name || 'Discrete GPU'}
          </p>
          <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800/60">
              {verifiedTgp}
            </span>
            <span className="text-[10px] text-zinc-400">
              {device.defaultVram}GB GDDR6
            </span>
          </div>
        </div>

        {/* Processor (CPU) */}
        <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-zinc-400 flex items-center gap-1">
            <Cpu className="w-3 h-3 text-indigo-400" />
            Processor
          </span>
          <p className="font-semibold text-zinc-100 truncate">
            {cpu?.name || 'Processor'}
          </p>
          <p className="text-[10px] text-zinc-400">
            {cpu?.cores ? `${cpu.cores} Cores / ${cpu.threads} Threads` : 'High-Performance Mobile CPU'}
          </p>
        </div>

        {/* RAM & Memory Channels */}
        <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-zinc-400 flex items-center gap-1">
            <Layers className="w-3 h-3 text-emerald-400" />
            RAM Configuration
          </span>
          <p className="font-semibold text-zinc-100 truncate">
            {profile.ramAnalysis.factoryConfig}
          </p>
          <div className="pt-0.5">
            {profile.ramAnalysis.isSingleChannel ? (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800/60 inline-flex items-center gap-1">
                <AlertTriangle className="w-2.5 h-2.5" />
                Single-Channel (Bottleneck Risk)
              </span>
            ) : (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800/60">
                Dual-Channel Interleaved
              </span>
            )}
          </div>
        </div>

        {/* Display Panel */}
        <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 space-y-1">
          <span className="text-[10px] uppercase font-bold text-zinc-400 flex items-center gap-1">
            <Tv className="w-3 h-3 text-sky-400" />
            Display Specification
          </span>
          <p className="font-semibold text-zinc-100 truncate">
            {profile.displayAnalysis.resolutionLabel} @ {profile.displayAnalysis.refreshRateLabel}
          </p>
          <p className="text-[10px] text-zinc-400 truncate">
            {device.display || 'High Refresh Gaming Panel'}
          </p>
        </div>
      </div>

      {/* TGP & Thermal Power Envelope Reality */}
      <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/90 space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            TGP Power Classification: {tgpTierClassification}
          </span>
        </div>
        <p className="text-xs text-zinc-300 leading-relaxed">
          {tgpExplanation}
        </p>
      </div>

      {/* Cooling & Thermal Solution */}
      <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/90 space-y-1">
        <span className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
          <Flame className="w-3.5 h-3.5 text-rose-400" />
          Thermal & Cooling System Architecture
        </span>
        <p className="text-xs text-zinc-400 leading-relaxed">
          {profile.coolingAnalysis}
        </p>
      </div>

      {/* Single-Channel RAM Notice if applicable */}
      {profile.ramAnalysis.channelRiskNote && (
        <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-600/60 text-amber-200 text-xs flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold text-amber-300 block mb-0.5">
              Factory Single-Channel RAM Alert:
            </span>
            <span>{profile.ramAnalysis.channelRiskNote}</span>
            <span className="block mt-1 text-[11px] text-amber-400/90 font-medium">
              {profile.ramAnalysis.upgradePathNote}
            </span>
          </div>
        </div>
      )}

      {/* Display Native Load Notice */}
      <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800/90 space-y-1">
        <span className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
          <Tv className="w-3.5 h-3.5 text-sky-400" />
          Native Panel Shading Load: {profile.displayAnalysis.pixelLoadVersus1080p}
        </span>
        <p className="text-xs text-zinc-400 leading-relaxed">
          {profile.displayAnalysis.nativeGamingAdvice}
        </p>
      </div>

      {/* "How This Laptop Actually Performs" — Real Benchmark Evidence */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-200 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
            How This Laptop Actually Performs (Lab Evidence)
          </span>
          <span className="text-[10px] text-zinc-400">
            {profile.isEstimateOnly ? 'Architectural Model' : 'Lab Tested'}
          </span>
        </div>

        <p className="text-xs text-zinc-400 leading-relaxed">
          {profile.realWorldPerformanceSummary}
        </p>

        {/* Benchmarks Table */}
        {profile.benchmarkEvidence.length > 0 ? (
          <div className="rounded-xl border border-zinc-800 overflow-hidden bg-zinc-950">
            <div className="grid grid-cols-12 px-3 py-2 bg-zinc-900/90 text-[10px] font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-800">
              <span className="col-span-4">Game & Resolution</span>
              <span className="col-span-3">Preset</span>
              <span className="col-span-2 text-right">Avg FPS</span>
              <span className="col-span-3 text-right">Source</span>
            </div>

            <div className="divide-y divide-zinc-800/60">
              {profile.benchmarkEvidence.map((b, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-12 px-3 py-2.5 text-xs text-zinc-300 items-center hover:bg-zinc-900/40 transition-colors"
                >
                  <div className="col-span-4">
                    <span className="font-semibold text-white block truncate">
                      {b.game}
                    </span>
                    <span className="text-[10px] text-zinc-400">
                      {b.resolution}
                    </span>
                  </div>

                  <div className="col-span-3 truncate text-zinc-400 text-[11px]">
                    {b.preset}
                  </div>

                  <div className="col-span-2 text-right font-bold text-emerald-400">
                    {b.avgFps} FPS
                    {b.low1PercentFps && (
                      <span className="block text-[10px] font-normal text-zinc-400">
                        1%: {b.low1PercentFps}
                      </span>
                    )}
                  </div>

                  <div className="col-span-3 text-right text-[10px] text-zinc-400 truncate">
                    {b.source}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800/80 text-xs text-zinc-400 leading-relaxed">
            <span className="font-semibold text-zinc-300 block mb-0.5">
              Hardware Architecture Estimate:
            </span>
            Direct lab benchmark logs have not yet been archived for this exact SKU ({device.exactSku || device.name}). Performance is calculated from physical hardware parameters ({gpu?.name} running at {verifiedTgp}, {cpu?.name}, and {device.defaultRam}GB RAM) rather than synthetic guesswork.
          </div>
        )}
      </div>
    </div>
  );
};
