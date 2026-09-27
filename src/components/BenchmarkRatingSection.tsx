import React, { useState, useId, useMemo, useRef, useEffect } from 'react';
import {
  Gauge,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Sliders,
  Tv,
  Cpu,
  Monitor,
  Laptop,
  Layers,
  Thermometer,
  Zap,
  Info,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Activity,
  Award,
  Search,
  X,
  Check,
  AlertTriangle,
  ShieldCheck
} from 'lucide-react';
import { GPUS_DATABASE } from '../data/gpus';
import { CPUS_DATABASE } from '../data/cpus';
import { GAMES_DATABASE } from '../data/games';
import { DEVICES_DATABASE } from '../data/devices';
import {
  BenchmarkRatingInput,
  BenchmarkRatingResult,
  DeviceType,
  DeviceModel,
  MemoryChannel,
  Resolution,
  RamOption,
  Game,
  GPU,
  CPU as CpuType
} from '../types';
import { evaluateBenchmarkRating } from '../logic/benchmarkRatingEvaluator';

interface BenchmarkRatingSectionProps {
  initialDeviceType?: DeviceType | null;
  initialDevice?: DeviceModel | null;
  initialGpuId?: string | null;
  initialCpuId?: string | null;
  initialRam?: RamOption | null;
  initialVram?: number | null;
  initialMemoryChannel?: MemoryChannel;
  initialGame?: Game | null;
  initialResolution?: Resolution;
}

export const BenchmarkRatingSection: React.FC<BenchmarkRatingSectionProps> = ({
  initialGame
}) => {
  // Input IDs for accessibility
  const avgFpsInputId = useId();
  const low1PctInputId = useId();
  const gpuUsageInputId = useId();
  const cpuUsageInputId = useId();
  const ramUsageInputId = useId();
  const vramUsageInputId = useId();
  const tempInputId = useId();
  const targetFpsInputId = useId();
  const stutteringInputId = useId();

  // --------------------------------------------------------------------------
  // 1. HARDWARE STATE - Starts completely blank per requirement
  // --------------------------------------------------------------------------
  const [deviceType, setDeviceType] = useState<DeviceType | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<DeviceModel | null>(null);
  const [selectedGpuId, setSelectedGpuId] = useState<string>('');
  const [selectedCpuId, setSelectedCpuId] = useState<string>('');
  const [selectedVram, setSelectedVram] = useState<number | null>(null);
  const [selectedRam, setSelectedRam] = useState<RamOption | null>(null);
  const [memoryChannel, setMemoryChannel] = useState<MemoryChannel | null>(null);

  // Searchable laptop dropdown state
  const [laptopSearchQuery, setLaptopSearchQuery] = useState('');
  const [isLaptopDropdownOpen, setIsLaptopDropdownOpen] = useState(false);
  const laptopComboboxRef = useRef<HTMLDivElement>(null);

  // Search filter states for GPU & CPU dropdowns
  const [gpuSearchQuery, setGpuSearchQuery] = useState('');
  const [isGpuDropdownOpen, setIsGpuDropdownOpen] = useState(false);
  const gpuComboboxRef = useRef<HTMLDivElement>(null);

  const [cpuSearchQuery, setCpuSearchQuery] = useState('');
  const [isCpuDropdownOpen, setIsCpuDropdownOpen] = useState(false);
  const cpuComboboxRef = useRef<HTMLDivElement>(null);

  // --------------------------------------------------------------------------
  // 2. GAME & SETTINGS STATE - Game is the only field with a default
  // --------------------------------------------------------------------------
  const [selectedGameId, setSelectedGameId] = useState<string>(initialGame?.id || 'cyberpunk-2077');
  const [gameSearchQuery, setGameSearchQuery] = useState<string>(initialGame?.name || 'Cyberpunk 2077');
  const [isGameDropdownOpen, setIsGameDropdownOpen] = useState(false);
  const gameComboboxRef = useRef<HTMLDivElement>(null);

  const [resolution, setResolution] = useState<Resolution | null>(null);
  const [preset, setPreset] = useState<'Low' | 'Medium' | 'High' | 'Ultra' | null>(null);
  const [upscaling, setUpscaling] = useState<string>('');
  const [rayTracing, setRayTracing] = useState<boolean>(false);

  // --------------------------------------------------------------------------
  // 3. BENCHMARK RESULTS STATE - Required fields start completely blank
  // --------------------------------------------------------------------------
  const [avgFps, setAvgFps] = useState<string>('');
  const [low1PercentFps, setLow1PercentFps] = useState<string>('');

  // --------------------------------------------------------------------------
  // 4. ADVANCED INFORMATION (OPTIONAL) - Starts collapsed & completely blank
  // --------------------------------------------------------------------------
  const [isAdvancedOpen, setIsAdvancedOpen] = useState<boolean>(false);
  const [gpuUsage, setGpuUsage] = useState<string>('');
  const [cpuUsage, setCpuUsage] = useState<string>('');
  const [ramUsage, setRamUsage] = useState<string>('');
  const [vramUsage, setVramUsage] = useState<string>('');
  const [temperature, setTemperature] = useState<string>('');
  const [targetFps, setTargetFps] = useState<string>('');
  const [stutteringSeverity, setStutteringSeverity] = useState<'none' | 'minor' | 'frequent' | ''>('');

  // Evaluation Result State (starts null - no auto-evaluation on mount)
  const [ratingResult, setRatingResult] = useState<BenchmarkRatingResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const resultContainerRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (laptopComboboxRef.current && !laptopComboboxRef.current.contains(event.target as Node)) {
        setIsLaptopDropdownOpen(false);
      }
      if (gpuComboboxRef.current && !gpuComboboxRef.current.contains(event.target as Node)) {
        setIsGpuDropdownOpen(false);
      }
      if (cpuComboboxRef.current && !cpuComboboxRef.current.contains(event.target as Node)) {
        setIsCpuDropdownOpen(false);
      }
      if (gameComboboxRef.current && !gameComboboxRef.current.contains(event.target as Node)) {
        setIsGameDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // --------------------------------------------------------------------------
  // Searchable Laptop Models Query
  // --------------------------------------------------------------------------
  const filteredLaptops = useMemo(() => {
    const q = laptopSearchQuery.trim();
    if (!q) return [];

    const qTokens = q.toLowerCase().split(/\s+/).filter(Boolean);
    const laptops = DEVICES_DATABASE.filter((d) => d.type === 'laptop');

    const matches = laptops.filter((d) => {
      const searchCorpus = [
        d.name,
        d.brand,
        d.productFamily,
        d.series || '',
        d.modelNumber || '',
        d.exactModel || '',
        d.exactSku || '',
        d.id.replace(/-/g, ' '),
        ...(d.skus || []),
        ...(d.keywords || [])
      ].join(' ').toLowerCase();

      return qTokens.every((token) => searchCorpus.includes(token));
    });

    return matches.slice(0, 12);
  }, [laptopSearchQuery]);

  // Filtered GPUs
  const filteredGpus = useMemo(() => {
    let list = GPUS_DATABASE;
    if (deviceType) {
      list = list.filter((g) => g.type === deviceType);
    }
    if (gpuSearchQuery.trim()) {
      const q = gpuSearchQuery.toLowerCase();
      list = list.filter((g) => g.name.toLowerCase().includes(q) || g.manufacturer.toLowerCase().includes(q));
    }
    return list.slice(0, 30);
  }, [deviceType, gpuSearchQuery]);

  // Filtered CPUs
  const filteredCpus = useMemo(() => {
    let list = CPUS_DATABASE;
    if (deviceType) {
      list = list.filter((c) => c.type === deviceType);
    }
    if (cpuSearchQuery.trim()) {
      const q = cpuSearchQuery.toLowerCase();
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.manufacturer.toLowerCase().includes(q) ||
          (c.generation && c.generation.toLowerCase().includes(q))
      );
    }
    return list.slice(0, 30);
  }, [deviceType, cpuSearchQuery]);

  // Filtered Games
  const filteredGames = useMemo(() => {
    if (!gameSearchQuery.trim()) return GAMES_DATABASE;
    const q = gameSearchQuery.toLowerCase();
    return GAMES_DATABASE.filter(
      (g) => g.name.toLowerCase().includes(q) || (g.category && g.category.toLowerCase().includes(q))
    );
  }, [gameSearchQuery]);

  // Active GPU & CPU entities
  const activeGpu = useMemo(() => {
    return GPUS_DATABASE.find((g) => g.id === selectedGpuId) || null;
  }, [selectedGpuId]);

  const activeCpu = useMemo(() => {
    return CPUS_DATABASE.find((c) => c.id === selectedCpuId) || null;
  }, [selectedCpuId]);

  const activeGame = useMemo(() => {
    return GAMES_DATABASE.find((g) => g.id === selectedGameId) || GAMES_DATABASE[0];
  }, [selectedGameId]);

  // Handle selecting a laptop model from search
  const handleSelectDeviceModel = (device: DeviceModel | null) => {
    setSelectedDevice(device);
    if (device) {
      setDeviceType('laptop');
      setSelectedGpuId(device.defaultGpuId);
      setSelectedCpuId(device.defaultCpuId);
      setSelectedVram(device.defaultVram);
      setSelectedRam(device.defaultRam as RamOption);
      setMemoryChannel(device.defaultChannel || 'Dual-Channel');
    }
    setIsLaptopDropdownOpen(false);
    setLaptopSearchQuery('');
  };

  // Handle selecting GPU
  const handleSelectGpu = (gpu: GPU) => {
    setSelectedGpuId(gpu.id);
    setSelectedVram(gpu.vram);
    if (!deviceType) {
      setDeviceType(gpu.type);
    }
    setIsGpuDropdownOpen(false);
    setGpuSearchQuery('');
  };

  // Handle selecting CPU
  const handleSelectCpu = (cpu: CpuType) => {
    setSelectedCpuId(cpu.id);
    if (!deviceType) {
      setDeviceType(cpu.type);
    }
    setIsCpuDropdownOpen(false);
    setCpuSearchQuery('');
  };

  // --------------------------------------------------------------------------
  // Reset Form Behavior: completely blank, ready for fresh entry
  // --------------------------------------------------------------------------
  const handleReset = () => {
    setDeviceType(null);
    setSelectedDevice(null);
    setLaptopSearchQuery('');
    setIsLaptopDropdownOpen(false);
    setSelectedGpuId('');
    setGpuSearchQuery('');
    setIsGpuDropdownOpen(false);
    setSelectedCpuId('');
    setCpuSearchQuery('');
    setIsCpuDropdownOpen(false);
    setSelectedVram(null);
    setSelectedRam(null);
    setMemoryChannel(null);
    setResolution(null);
    setPreset(null);
    setUpscaling('');
    setRayTracing(false);
    setAvgFps('');
    setLow1PercentFps('');
    setGpuUsage('');
    setCpuUsage('');
    setRamUsage('');
    setVramUsage('');
    setTemperature('');
    setTargetFps('');
    setStutteringSeverity('');
    setRatingResult(null);
    setErrorMessage(null);
    setIsAdvancedOpen(false);
  };

  // --------------------------------------------------------------------------
  // Evaluate Benchmark Rating on form submission
  // --------------------------------------------------------------------------
  const handleEvaluate = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    // Hardware Validation
    if (!selectedDevice && !selectedGpuId) {
      setErrorMessage('Please select your Graphics Card (GPU) or search for your exact laptop model.');
      return;
    }

    if (!selectedDevice && !selectedCpuId) {
      setErrorMessage('Please select your Processor (CPU) or search for your exact laptop model.');
      return;
    }

    // Game Settings Validation
    if (!resolution) {
      setErrorMessage('Please select your benchmark Resolution (1080p, 1440p, or 4K).');
      return;
    }

    if (!preset) {
      setErrorMessage('Please select your in-game Graphics Preset (Low, Medium, High, or Ultra).');
      return;
    }

    // Benchmark Results Validation
    const parsedAvg = parseFloat(avgFps);
    const parsedLow = low1PercentFps.trim() ? parseFloat(low1PercentFps) : undefined;

    if (isNaN(parsedAvg) || parsedAvg <= 0) {
      setErrorMessage('Please enter your measured Average FPS from your benchmark.');
      return;
    }

    if (parsedLow !== undefined) {
      if (isNaN(parsedLow) || parsedLow <= 0) {
        setErrorMessage('1% Low FPS must be a positive number if provided.');
        return;
      }
      if (parsedLow > parsedAvg) {
        setErrorMessage('1% Low FPS cannot exceed the Average FPS.');
        return;
      }
    }

    setIsEvaluating(true);

    const resolvedGpuObj = activeGpu || (selectedDevice ? GPUS_DATABASE.find(g => g.id === selectedDevice.defaultGpuId) : null) || GPUS_DATABASE[0];
    const resolvedCpuObj = activeCpu || (selectedDevice ? CPUS_DATABASE.find(c => c.id === selectedDevice.defaultCpuId) : null) || CPUS_DATABASE[0];

    const input: BenchmarkRatingInput = {
      deviceType: deviceType || selectedDevice?.type || resolvedGpuObj.type || 'desktop',
      selectedDevice,
      gpuId: resolvedGpuObj.id,
      gpuName: resolvedGpuObj.name,
      vramGb: selectedVram || resolvedGpuObj.vram || 8,
      cpuId: resolvedCpuObj.id,
      cpuName: resolvedCpuObj.name,
      ramGb: selectedRam || 16,
      memoryChannel: memoryChannel || undefined,
      gameId: selectedGameId,
      gameName: activeGame.name,
      resolution,
      graphicsPreset: preset,
      upscaling: upscaling || 'Native / Off',
      rayTracing,
      avgFps: parsedAvg,
      low1PercentFps: parsedLow,
      gpuUsagePercent: gpuUsage.trim() ? parseFloat(gpuUsage) : undefined,
      cpuUsagePercent: cpuUsage.trim() ? parseFloat(cpuUsage) : undefined,
      ramUsageGb: ramUsage.trim() ? parseFloat(ramUsage) : undefined,
      vramUsageGb: vramUsage.trim() ? parseFloat(vramUsage) : undefined,
      temperatureCelsius: temperature.trim() ? parseFloat(temperature) : undefined,
      targetFps: targetFps.trim() ? parseFloat(targetFps) : undefined,
      stutteringSeverity: stutteringSeverity || undefined
    };

    const res = evaluateBenchmarkRating(input);
    setRatingResult(res);

    setTimeout(() => {
      setIsEvaluating(false);
      resultContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 150);
  };

  return (
    <div className="space-y-6">
      {/* Feature Header */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#0c0f1d]/90 border border-[#1b233a] shadow-lg relative overflow-hidden backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30">
                <Gauge className="w-4 h-4" />
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Benchmark Rating
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-950 text-purple-300 border border-purple-800/60">
                Peer Comparison
              </span>
            </div>
            <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
              Compare your real in-game benchmark results against verified real-world hardware data to answer:
              <span className="text-zinc-200 font-semibold ml-1">
                “Is my PC performing normally compared with other systems using the same or similar hardware?”
              </span>
            </p>
          </div>

          {/* Header Action & Four Rating Legend Pill */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-[#090c17] border border-[#1f2842] text-[11px] shrink-0">
              <span className="px-2 py-0.5 rounded-md bg-rose-950/80 text-rose-300 font-semibold border border-rose-800/50">
                🔴 Below Typical
              </span>
              <span className="px-2 py-0.5 rounded-md bg-amber-950/80 text-amber-300 font-semibold border border-amber-800/50">
                🟡 Typical
              </span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-950/80 text-emerald-300 font-semibold border border-emerald-800/50">
                🟢 Above Typical
              </span>
              <span className="px-2 py-0.5 rounded-md bg-purple-950/80 text-purple-300 font-semibold border border-purple-800/50">
                ⭐ Exceptional
              </span>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0e1326] border border-[#1f2842] text-zinc-300 hover:text-white hover:border-zinc-500 text-xs font-medium transition-colors cursor-pointer"
              title="Clear all fields"
            >
              <RotateCcw className="w-3.5 h-3.5 text-zinc-400" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form (5 Cols on LG) */}
        <form
          onSubmit={handleEvaluate}
          className="lg:col-span-5 p-4 sm:p-5 rounded-2xl bg-[#0c0f1d]/90 border border-[#1b233a] shadow-lg space-y-4 backdrop-blur-md"
        >
          <div className="flex items-center justify-between border-b border-[#1f2842] pb-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-200 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-purple-400" />
              Enter Benchmark Data
            </span>
            <button
              type="button"
              onClick={handleReset}
              className="text-[11px] text-zinc-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Clear form
            </button>
          </div>

          {/* Section A: Hardware Configuration */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <Laptop className="w-3.5 h-3.5 text-indigo-400" />
                1. System Hardware
              </label>
              {/* Desktop vs Laptop switch */}
              <div className="inline-flex p-0.5 rounded-lg bg-[#090c17] border border-[#1f2842]">
                <button
                  type="button"
                  onClick={() => {
                    setDeviceType('desktop');
                    setSelectedDevice(null);
                  }}
                  className={`px-3 py-1 text-[11px] font-semibold rounded-md transition-colors cursor-pointer ${
                    deviceType === 'desktop'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Desktop
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDeviceType('laptop');
                  }}
                  className={`px-3 py-1 text-[11px] font-semibold rounded-md transition-colors cursor-pointer ${
                    deviceType === 'laptop'
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Laptop
                </button>
              </div>
            </div>

            {/* Searchable Laptop Model Picker (shown when Laptop is selected) */}
            {deviceType === 'laptop' && (
              <div className="space-y-1.5" ref={laptopComboboxRef}>
                <div className="flex items-center justify-between">
                  <label className="text-[11px] text-zinc-400 flex items-center gap-1">
                    <span>Laptop Model</span>
                    <span className="text-[10px] text-zinc-400">(Optional - auto-fills specs)</span>
                  </label>
                  {selectedDevice && (
                    <button
                      type="button"
                      onClick={() => handleSelectDeviceModel(null)}
                      className="text-[10px] text-purple-400 hover:text-purple-300 flex items-center gap-0.5 cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                      Clear Model
                    </button>
                  )}
                </div>

                {/* If selected: show compact card */}
                {selectedDevice ? (
                  <div className="p-2.5 rounded-xl bg-[#090c17] border border-purple-500/50 flex items-center justify-between gap-2 shadow-sm">
                    <div className="space-y-0.5 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white truncate">
                          {selectedDevice.name}
                        </span>
                        {selectedDevice.gpuTgpWatts && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-purple-950 text-purple-300 border border-purple-800/60 shrink-0">
                            {selectedDevice.gpuTgpWatts}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-zinc-400 truncate">
                        Default: {activeGpu?.name || selectedDevice.defaultGpuId} • {activeCpu?.name || selectedDevice.defaultCpuId}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSelectDeviceModel(null)}
                      className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors shrink-0 cursor-pointer"
                      title="Deselect laptop model"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  /* If not selected: searchable dropdown */
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsLaptopDropdownOpen(!isLaptopDropdownOpen)}
                      className="w-full px-3 py-2 rounded-xl bg-[#090c17] border border-[#1f2842] text-left text-xs text-zinc-400 flex items-center justify-between cursor-pointer hover:border-zinc-700 transition-colors"
                    >
                      <span className="flex items-center gap-1.5 truncate">
                        <Search className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                        <span>Search laptop model (e.g. Scar 18, Nitro 5, Legion, FA506)...</span>
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0 ml-1" />
                    </button>

                    {isLaptopDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-64 overflow-y-auto rounded-xl bg-[#090c17] border border-[#273254] shadow-2xl p-2 space-y-1.5">
                        <div className="sticky top-0 bg-[#090c17] z-10 pb-1">
                          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#0e1326] border border-[#1f2842] focus-within:border-purple-500">
                            <Search className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                            <input
                              type="text"
                              value={laptopSearchQuery}
                              onChange={(e) => setLaptopSearchQuery(e.target.value)}
                              placeholder="Type laptop family or SKU (e.g. ROG Strix, FA506, Legion)..."
                              className="w-full bg-transparent text-xs text-zinc-200 placeholder-zinc-400 focus:outline-none"
                              autoFocus
                            />
                            {laptopSearchQuery && (
                              <button
                                type="button"
                                onClick={() => setLaptopSearchQuery('')}
                                className="text-zinc-400 hover:text-white"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Search Results */}
                        {laptopSearchQuery.trim() === '' ? (
                          <div className="p-3 text-center space-y-1.5">
                            <p className="text-[11px] text-zinc-400">
                              Type to search by laptop name, family, or model number.
                            </p>
                            <div className="flex flex-wrap justify-center gap-1 text-[10px] text-zinc-400">
                              <span className="text-zinc-400">Quick searches:</span>
                              {['Scar 18', 'FA506', 'Legion Pro', 'Nitro 5', 'LOQ 15'].map((example) => (
                                <button
                                  key={example}
                                  type="button"
                                  onClick={() => setLaptopSearchQuery(example)}
                                  className="px-1.5 py-0.5 rounded bg-[#12162a] text-purple-300 hover:bg-purple-950/60 cursor-pointer"
                                >
                                  {example}
                                </button>
                              ))}
                            </div>
                          </div>
                        ) : filteredLaptops.length > 0 ? (
                          filteredLaptops.map((laptop) => (
                            <button
                              key={laptop.id}
                              type="button"
                              onClick={() => handleSelectDeviceModel(laptop)}
                              className="w-full text-left px-2.5 py-2 rounded-lg text-xs hover:bg-[#12162a] transition-colors cursor-pointer space-y-0.5 border border-transparent hover:border-[#1f2842]"
                            >
                              <div className="flex items-center justify-between gap-1">
                                <span className="font-semibold text-zinc-200 truncate">{laptop.name}</span>
                                {laptop.gpuTgpWatts && (
                                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 border border-purple-800/40 shrink-0">
                                    {laptop.gpuTgpWatts}
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-zinc-400 truncate">
                                {GPUS_DATABASE.find(g => g.id === laptop.defaultGpuId)?.name || laptop.defaultGpuId} • {CPUS_DATABASE.find(c => c.id === laptop.defaultCpuId)?.name || laptop.defaultCpuId}
                              </div>
                            </button>
                          ))
                        ) : (
                          <div className="p-3 text-center text-xs text-zinc-400">
                            No matching laptop models found.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* GPU Selector */}
            <div className="space-y-1" ref={gpuComboboxRef}>
              <label className="text-[11px] text-zinc-400 flex items-center justify-between">
                <span>Graphics Card (GPU)</span>
                <span className="text-[10px] text-purple-400 font-semibold">REQUIRED</span>
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsGpuDropdownOpen(!isGpuDropdownOpen)}
                  className={`w-full px-3 py-2 rounded-xl bg-[#090c17] border text-left text-xs flex items-center justify-between cursor-pointer transition-colors ${
                    activeGpu
                      ? 'border-[#1f2842] text-zinc-200 hover:border-zinc-600'
                      : 'border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <span className="truncate font-medium">
                    {activeGpu ? activeGpu.name : 'Select Graphics Card (GPU)...'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0 ml-1" />
                </button>

                {isGpuDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-56 overflow-y-auto rounded-xl bg-[#090c17] border border-[#273254] shadow-2xl p-1.5 space-y-1">
                    <div className="p-1 sticky top-0 bg-[#090c17] z-10 border-b border-[#1f2842]">
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#0e1326] border border-[#1f2842]">
                        <Search className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                        <input
                          type="text"
                          value={gpuSearchQuery}
                          onChange={(e) => setGpuSearchQuery(e.target.value)}
                          placeholder="Search GPU..."
                          className="w-full bg-transparent text-xs text-zinc-200 placeholder-zinc-400 focus:outline-none"
                          autoFocus
                        />
                      </div>
                    </div>
                    {filteredGpus.map((gpu) => (
                      <button
                        key={gpu.id}
                        type="button"
                        onClick={() => handleSelectGpu(gpu)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                          gpu.id === selectedGpuId
                            ? 'bg-purple-950/80 text-purple-200 font-semibold'
                            : 'text-zinc-300 hover:bg-[#12162a]'
                        }`}
                      >
                        <span className="truncate">{gpu.name}</span>
                        <span className="text-[10px] text-zinc-400 ml-2 shrink-0">{gpu.vram}GB VRAM</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* CPU Selector */}
            <div className="space-y-1" ref={cpuComboboxRef}>
              <label className="text-[11px] text-zinc-400 flex items-center justify-between">
                <span>Processor (CPU)</span>
                <span className="text-[10px] text-purple-400 font-semibold">REQUIRED</span>
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsCpuDropdownOpen(!isCpuDropdownOpen)}
                  className={`w-full px-3 py-2 rounded-xl bg-[#090c17] border text-left text-xs flex items-center justify-between cursor-pointer transition-colors ${
                    activeCpu
                      ? 'border-[#1f2842] text-zinc-200 hover:border-zinc-600'
                      : 'border-zinc-800 text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <span className="truncate font-medium">
                    {activeCpu ? activeCpu.name : 'Select Processor (CPU)...'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0 ml-1" />
                </button>

                {isCpuDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-56 overflow-y-auto rounded-xl bg-[#090c17] border border-[#273254] shadow-2xl p-1.5 space-y-1">
                    <div className="p-1 sticky top-0 bg-[#090c17] z-10 border-b border-[#1f2842]">
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#0e1326] border border-[#1f2842]">
                        <Search className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                        <input
                          type="text"
                          value={cpuSearchQuery}
                          onChange={(e) => setCpuSearchQuery(e.target.value)}
                          placeholder="Search CPU..."
                          className="w-full bg-transparent text-xs text-zinc-200 placeholder-zinc-400 focus:outline-none"
                          autoFocus
                        />
                      </div>
                    </div>
                    {filteredCpus.map((cpu) => (
                      <button
                        key={cpu.id}
                        type="button"
                        onClick={() => handleSelectCpu(cpu)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                          cpu.id === selectedCpuId
                            ? 'bg-purple-950/80 text-purple-200 font-semibold'
                            : 'text-zinc-300 hover:bg-[#12162a]'
                        }`}
                      >
                        <span className="truncate">{cpu.name}</span>
                        <span className="text-[10px] text-zinc-400 ml-2 shrink-0">{cpu.generation || ''}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* RAM Capacity & Memory Channel (Starts blank/unselected) */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[11px] text-zinc-400">RAM Capacity</label>
                <select
                  value={selectedRam ?? ''}
                  onChange={(e) => setSelectedRam(e.target.value ? (Number(e.target.value) as RamOption) : null)}
                  className="w-full px-3 py-2 rounded-xl bg-[#090c17] border border-[#1f2842] text-xs text-zinc-200 focus:outline-none focus:border-purple-500 cursor-pointer"
                >
                  <option value="">Select RAM Capacity</option>
                  {[8, 12, 16, 24, 32, 48, 64].map((r) => (
                    <option key={r} value={r}>
                      {r} GB RAM
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-zinc-400">Memory Channel</label>
                <select
                  value={memoryChannel ?? ''}
                  onChange={(e) => setMemoryChannel(e.target.value ? (e.target.value as MemoryChannel) : null)}
                  className="w-full px-3 py-2 rounded-xl bg-[#090c17] border border-[#1f2842] text-xs text-zinc-200 focus:outline-none focus:border-purple-500 cursor-pointer"
                >
                  <option value="">Select Memory Channel</option>
                  <option value="Dual-Channel">Dual-Channel (2x Stick)</option>
                  <option value="Single-Channel">Single-Channel (1x Stick)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section B: Target Game & Settings */}
          <div className="space-y-3 pt-3 border-t border-[#1f2842]">
            <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
              <Tv className="w-3.5 h-3.5 text-sky-400" />
              2. Game & In-Game Settings
            </label>

            {/* Game Selector (The only field that may have a remembered default) */}
            <div className="space-y-1" ref={gameComboboxRef}>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsGameDropdownOpen(!isGameDropdownOpen)}
                  className="w-full px-3 py-2 rounded-xl bg-[#090c17] border border-[#1f2842] text-left text-xs text-zinc-200 flex items-center justify-between cursor-pointer hover:border-zinc-700 transition-colors"
                >
                  <span className="truncate font-semibold text-sky-300">{activeGame.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0 ml-1" />
                </button>

                {isGameDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 z-50 mt-1 max-h-56 overflow-y-auto rounded-xl bg-[#090c17] border border-[#273254] shadow-2xl p-1.5 space-y-1">
                    <div className="p-1 sticky top-0 bg-[#090c17] z-10 border-b border-[#1f2842]">
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#0e1326] border border-[#1f2842]">
                        <Search className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                        <input
                          type="text"
                          value={gameSearchQuery}
                          onChange={(e) => setGameSearchQuery(e.target.value)}
                          placeholder="Search game..."
                          className="w-full bg-transparent text-xs text-zinc-200 placeholder-zinc-400 focus:outline-none"
                          autoFocus
                        />
                      </div>
                    </div>
                    {filteredGames.map((game) => (
                      <button
                        key={game.id}
                        type="button"
                        onClick={() => {
                          setSelectedGameId(game.id);
                          setGameSearchQuery(game.name);
                          setIsGameDropdownOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors cursor-pointer ${
                          game.id === selectedGameId
                            ? 'bg-sky-950/80 text-sky-200 font-semibold'
                            : 'text-zinc-300 hover:bg-[#12162a]'
                        }`}
                      >
                        <span className="truncate">{game.name}</span>
                        <span className="text-[10px] text-zinc-400 ml-2 shrink-0">{game.category || ''}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Resolution Buttons (Starts blank/unselected) */}
            <div className="space-y-1">
              <label className="text-[11px] text-zinc-400 flex items-center justify-between">
                <span>Resolution</span>
                <span className="text-[10px] text-purple-400 font-semibold">REQUIRED</span>
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['1080p', '1440p', '4K'] as Resolution[]).map((res) => (
                  <button
                    key={res}
                    type="button"
                    onClick={() => setResolution(res)}
                    className={`py-1.5 px-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer text-center ${
                      resolution === res
                        ? 'bg-sky-600 text-white border-sky-400 shadow-sm shadow-sky-600/30'
                        : 'bg-[#090c17] text-zinc-400 border-[#1f2842] hover:text-zinc-200'
                    }`}
                  >
                    {res}
                  </button>
                ))}
              </div>
            </div>

            {/* Graphics Preset (Starts blank/unselected) */}
            <div className="space-y-1">
              <label className="text-[11px] text-zinc-400 flex items-center justify-between">
                <span>Graphics Preset</span>
                <span className="text-[10px] text-purple-400 font-semibold">REQUIRED</span>
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['Low', 'Medium', 'High', 'Ultra'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPreset(p)}
                    className={`py-1.5 px-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer text-center ${
                      preset === p
                        ? 'bg-purple-600 text-white border-purple-400 shadow-sm shadow-purple-600/30'
                        : 'bg-[#090c17] text-zinc-400 border-[#1f2842] hover:text-zinc-200'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Upscaling & Ray Tracing (Optional) */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[11px] text-zinc-400">Upscaling (Optional)</label>
                <select
                  value={upscaling}
                  onChange={(e) => setUpscaling(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-xl bg-[#090c17] border border-[#1f2842] text-xs text-zinc-200 focus:outline-none focus:border-purple-500 cursor-pointer"
                >
                  <option value="">Native / Off (Default)</option>
                  <option value="DLSS Quality">DLSS Quality</option>
                  <option value="DLSS Balanced">DLSS Balanced</option>
                  <option value="DLSS Performance">DLSS Performance</option>
                  <option value="DLSS 3 Frame Gen">DLSS 3 Frame Gen</option>
                  <option value="FSR Quality">FSR Quality</option>
                  <option value="FSR Balanced">FSR Balanced</option>
                  <option value="XeSS Quality">XeSS Quality</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-zinc-400">Ray Tracing</label>
                <button
                  type="button"
                  onClick={() => setRayTracing(!rayTracing)}
                  className={`w-full py-1.5 px-3 rounded-xl text-xs font-semibold border transition-colors cursor-pointer text-center ${
                    rayTracing
                      ? 'bg-rose-950/80 text-rose-200 border-rose-600'
                      : 'bg-[#090c17] text-zinc-400 border-[#1f2842] hover:text-zinc-200'
                  }`}
                >
                  {rayTracing ? 'Ray Tracing: ON' : 'Ray Tracing: OFF'}
                </button>
              </div>
            </div>
          </div>

          {/* Section C: Measured Benchmark Results */}
          <div className="space-y-3 pt-3 border-t border-[#1f2842]">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                3. Your In-Game Benchmark Results
              </label>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/60 uppercase">
                Required
              </span>
            </div>

            {/* Average FPS and 1% Low FPS (Starts completely blank) */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-[#090c17] border border-emerald-500/40 space-y-1 shadow-sm">
                <div className="flex items-center justify-between">
                  <label htmlFor={avgFpsInputId} className="text-xs font-bold text-zinc-200">
                    Average FPS
                  </label>
                  <span className="text-[10px] text-emerald-400 font-semibold">REQUIRED</span>
                </div>
                <div className="relative">
                  <input
                    id={avgFpsInputId}
                    type="number"
                    min="1"
                    max="999"
                    value={avgFps}
                    onChange={(e) => setAvgFps(e.target.value)}
                    placeholder="e.g. 68"
                    className="w-full px-3 py-2 rounded-lg bg-[#0e1326] border border-[#273254] text-lg font-extrabold text-white placeholder:text-zinc-400 focus:outline-none focus:border-emerald-500"
                    required
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-zinc-400 font-medium">FPS</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#090c17] border border-[#1f2842] space-y-1 shadow-sm">
                <div className="flex items-center justify-between">
                  <label htmlFor={low1PctInputId} className="text-xs font-bold text-zinc-200">
                    1% Low FPS
                  </label>
                  <span className="text-[10px] text-zinc-400 font-medium">OPTIONAL</span>
                </div>
                <div className="relative">
                  <input
                    id={low1PctInputId}
                    type="number"
                    min="1"
                    max="999"
                    value={low1PercentFps}
                    onChange={(e) => setLow1PercentFps(e.target.value)}
                    placeholder="e.g. 52 (optional)"
                    className="w-full px-3 py-2 rounded-lg bg-[#0e1326] border border-[#273254] text-lg font-extrabold text-white placeholder:text-zinc-400 focus:outline-none focus:border-purple-500"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-zinc-400 font-medium">FPS</span>
                </div>
              </div>
            </div>

            {/* Expandable Optional Advanced Info - Starts completely blank */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#090c17] border border-[#1f2842] text-xs font-semibold text-zinc-300 hover:text-white transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <Thermometer className="w-3.5 h-3.5 text-indigo-400" />
                  Advanced Information (Optional)
                </span>
                {isAdvancedOpen ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
              </button>

              {isAdvancedOpen && (
                <div className="mt-2 p-3 rounded-xl bg-[#090c17] border border-[#1f2842] space-y-2.5 animate-in fade-in duration-150">
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    All metrics below are <strong>strictly optional</strong>. Only enter values you monitored during your benchmark run. If left blank, your system will be rated normally based on verified peer benchmarks without guessing.
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <label htmlFor={gpuUsageInputId} className="text-[11px] text-zinc-400 block mb-0.5">
                        GPU Usage (%)
                      </label>
                      <input
                        id={gpuUsageInputId}
                        type="number"
                        min="0"
                        max="100"
                        value={gpuUsage}
                        onChange={(e) => setGpuUsage(e.target.value)}
                        placeholder="e.g. 98"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#0e1326] border border-[#232d4b] text-zinc-200 placeholder:text-zinc-400 text-xs focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label htmlFor={cpuUsageInputId} className="text-[11px] text-zinc-400 block mb-0.5">
                        CPU Usage (%)
                      </label>
                      <input
                        id={cpuUsageInputId}
                        type="number"
                        min="0"
                        max="100"
                        value={cpuUsage}
                        onChange={(e) => setCpuUsage(e.target.value)}
                        placeholder="e.g. 50"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#0e1326] border border-[#232d4b] text-zinc-200 placeholder:text-zinc-400 text-xs focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label htmlFor={tempInputId} className="text-[11px] text-zinc-400 block mb-0.5">
                        GPU/CPU Temp (°C)
                      </label>
                      <input
                        id={tempInputId}
                        type="number"
                        min="20"
                        max="115"
                        value={temperature}
                        onChange={(e) => setTemperature(e.target.value)}
                        placeholder="e.g. 76"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#0e1326] border border-[#232d4b] text-zinc-200 placeholder:text-zinc-400 text-xs focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label htmlFor={vramUsageInputId} className="text-[11px] text-zinc-400 block mb-0.5">
                        VRAM Usage (GB)
                      </label>
                      <input
                        id={vramUsageInputId}
                        type="number"
                        step="0.1"
                        value={vramUsage}
                        onChange={(e) => setVramUsage(e.target.value)}
                        placeholder="e.g. 6.5"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#0e1326] border border-[#232d4b] text-zinc-200 placeholder:text-zinc-400 text-xs focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label htmlFor={ramUsageInputId} className="text-[11px] text-zinc-400 block mb-0.5">
                        RAM Usage (GB)
                      </label>
                      <input
                        id={ramUsageInputId}
                        type="number"
                        step="0.1"
                        value={ramUsage}
                        onChange={(e) => setRamUsage(e.target.value)}
                        placeholder="e.g. 11.2"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#0e1326] border border-[#232d4b] text-zinc-200 placeholder:text-zinc-400 text-xs focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div>
                      <label htmlFor={targetFpsInputId} className="text-[11px] text-zinc-400 block mb-0.5">
                        Target FPS
                      </label>
                      <input
                        id={targetFpsInputId}
                        type="number"
                        value={targetFps}
                        onChange={(e) => setTargetFps(e.target.value)}
                        placeholder="e.g. 60"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#0e1326] border border-[#232d4b] text-zinc-200 placeholder:text-zinc-400 text-xs focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>

                  {/* Stuttering / Frame Drop Observation */}
                  <div className="pt-1">
                    <label htmlFor={stutteringInputId} className="text-[11px] text-zinc-400 block mb-0.5">
                      Stuttering / Freezing Observed
                    </label>
                    <select
                      id={stutteringInputId}
                      value={stutteringSeverity}
                      onChange={(e) => setStutteringSeverity(e.target.value as any)}
                      className="w-full px-2.5 py-1.5 rounded-lg bg-[#0e1326] border border-[#232d4b] text-zinc-200 text-xs focus:outline-none focus:border-purple-500 cursor-pointer"
                    >
                      <option value="">None / Not Observed</option>
                      <option value="minor">Minor occasional frame hitching</option>
                      <option value="frequent">Frequent stuttering / micro-freezes</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Validation Error Message */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-600/60 text-rose-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isEvaluating}
              className="flex-1 py-3.5 px-4 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-500 hover:from-violet-500 hover:via-indigo-500 hover:to-sky-400 text-white font-extrabold text-sm uppercase tracking-wider shadow-lg shadow-purple-900/30 border border-purple-400/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              <span>COMPARE & RATE BENCHMARK</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-3.5 py-3.5 rounded-xl bg-[#090c17] border border-[#1f2842] text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors cursor-pointer"
              title="Reset all fields"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Right Column: Rating Results (7 Cols on LG) */}
        <div ref={resultContainerRef} className="lg:col-span-7 space-y-4">
          {ratingResult ? (
            <div className="space-y-4 animate-in fade-in duration-200">
              {/* Main Rating Banner */}
              <div
                className={`p-5 rounded-2xl border shadow-xl relative overflow-hidden backdrop-blur-md ${
                  ratingResult.rating === 'Below Typical'
                    ? 'bg-gradient-to-br from-rose-950/60 via-[#100d1c] to-[#0c0f1d] border-rose-600/70'
                    : ratingResult.rating === 'Typical'
                    ? 'bg-gradient-to-br from-amber-950/50 via-[#14121d] to-[#0c0f1d] border-amber-500/70'
                    : ratingResult.rating === 'Above Typical'
                    ? 'bg-gradient-to-br from-emerald-950/50 via-[#0d161d] to-[#0c0f1d] border-emerald-500/70'
                    : ratingResult.rating === 'Exceptional'
                    ? 'bg-gradient-to-br from-purple-950/60 via-[#160d26] to-[#0c0f1d] border-purple-500/70'
                    : 'bg-gradient-to-br from-zinc-900/60 via-[#131520] to-[#0c0f1d] border-zinc-700/70'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-300">
                      Benchmark Verdict
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5">
                      <span>{ratingResult.ratingBadgeText}</span>
                    </h3>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-zinc-400 block uppercase tracking-wider font-semibold">
                      Performance Delta
                    </span>
                    <span
                      className={`text-xl sm:text-2xl font-black ${
                        ratingResult.avgFpsDeltaPercent >= 0
                          ? 'text-emerald-400'
                          : ratingResult.avgFpsDeltaPercent >= -10
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {ratingResult.avgFpsDeltaPercent >= 0
                        ? `+${ratingResult.avgFpsDeltaPercent}%`
                        : `${ratingResult.avgFpsDeltaPercent}%`}
                    </span>
                    <span className="text-[11px] text-zinc-400 ml-1">vs typical baseline</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-zinc-200 mt-3 leading-relaxed">
                  {ratingResult.verdictSummary}
                </p>
              </div>

              {/* Unusual Measurement Advisory Note (if present) */}
              {ratingResult.unusualWarning && (
                <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-600/50 flex items-start gap-3 text-xs text-amber-200 shadow-md">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-bold text-amber-300 block uppercase tracking-wider text-[11px]">
                      Unusually High Measurement Notice
                    </span>
                    <p className="text-[11px] text-amber-200/90 leading-relaxed">
                      {ratingResult.unusualWarning}
                    </p>
                  </div>
                </div>
              )}

              {/* Numerical Comparison Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#0c0f1d]/90 border border-[#1b233a] shadow-lg space-y-4 backdrop-blur-md">
                <div className="flex items-center justify-between border-b border-[#1f2842] pb-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-200 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-sky-400" />
                    Comparison Against Verified Baseline
                  </span>
                  <span className="text-[11px] text-sky-400 font-medium">
                    {ratingResult.baseline.sampleCountOrConfidence}
                  </span>
                </div>

                {/* 4 Core Summary Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-[#090c17] border border-[#1f2842] space-y-0.5">
                    <span className="text-[10px] uppercase font-bold text-zinc-400 block tracking-wider">Rating</span>
                    <span className="font-bold text-white text-xs block truncate">
                      {ratingResult.ratingBadgeText}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#090c17] border border-[#1f2842] space-y-0.5">
                    <span className="text-[10px] uppercase font-bold text-zinc-400 block tracking-wider">Your Result</span>
                    <span className="font-black text-sky-400 text-sm block font-mono">
                      {ratingResult.userAvgFps} FPS
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#090c17] border border-[#1f2842] space-y-0.5">
                    <span className="text-[10px] uppercase font-bold text-zinc-400 block tracking-wider">Typical Range</span>
                    <span className="font-bold text-zinc-200 text-xs block font-mono">
                      {ratingResult.baseline.expectedFpsMin}–{ratingResult.baseline.expectedFpsMax} FPS
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#090c17] border border-[#1f2842] space-y-0.5">
                    <span className="text-[10px] uppercase font-bold text-zinc-400 block tracking-wider">Difference</span>
                    <span className={`font-bold text-xs block truncate ${
                      ratingResult.differenceFromNormalRange.direction === 'above'
                        ? 'text-emerald-400'
                        : ratingResult.differenceFromNormalRange.direction === 'below'
                        ? 'text-rose-400'
                        : 'text-amber-400'
                    }`} title={ratingResult.differenceFromNormalRange.label}>
                      {ratingResult.differenceFromNormalRange.label}
                    </span>
                  </div>
                </div>

                {/* 2 Benchmark Metric Rows */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Average FPS Meter */}
                  <div className="p-3.5 rounded-xl bg-[#090c17] border border-[#1f2842] space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-zinc-300">Average FPS</span>
                      <span className="text-xs font-bold text-white">
                        Your Result: <span className="text-sky-400">{ratingResult.userAvgFps} FPS</span>
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1 border-t border-[#1f2842]">
                      <span>Typical Expected Range:</span>
                      <span className="font-semibold text-zinc-200">
                        {ratingResult.baseline.expectedFpsMin} – {ratingResult.baseline.expectedFpsMax} FPS (Avg {ratingResult.baseline.baselineAvgFps})
                      </span>
                    </div>

                    {/* Visual Placement Indicator */}
                    <div className="space-y-1 pt-1">
                      <div className="h-2 w-full bg-[#12162a] rounded-full overflow-hidden flex">
                        <div
                          className={`h-full transition-all rounded-full ${
                            ratingResult.userAvgFps >= ratingResult.baseline.expectedFpsMin
                              ? ratingResult.userAvgFps > ratingResult.baseline.expectedFpsMax
                                ? 'bg-gradient-to-r from-emerald-500 to-purple-500'
                                : 'bg-emerald-500'
                              : 'bg-rose-500'
                          }`}
                          style={{
                            width: `${Math.min(100, Math.max(10, Math.round((ratingResult.userAvgFps / (ratingResult.baseline.expectedFpsMax * 1.3)) * 100)))}%`
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-zinc-400">
                        <span>0 FPS</span>
                        <span>Typical Min: {ratingResult.baseline.expectedFpsMin}</span>
                        <span>Typical Max: {ratingResult.baseline.expectedFpsMax}</span>
                      </div>
                    </div>
                  </div>

                  {/* 1% Low FPS Meter */}
                  {ratingResult.isLow1PercentProvided && ratingResult.userLow1PercentFps !== undefined ? (
                    <div className="p-3.5 rounded-xl bg-[#090c17] border border-[#1f2842] space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-zinc-300">1% Low FPS</span>
                        <span className="text-xs font-bold text-white">
                          Your Result: <span className="text-emerald-400">{ratingResult.userLow1PercentFps} FPS</span>
                        </span>
                      </div>

                      {ratingResult.baseline.expectedLow1PercentMin !== undefined && (
                        <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1 border-t border-[#1f2842]">
                          <span>Typical 1% Low Range:</span>
                          <span className="font-semibold text-zinc-200">
                            {ratingResult.baseline.expectedLow1PercentMin} – {ratingResult.baseline.expectedLow1PercentMax} FPS
                          </span>
                        </div>
                      )}

                      {/* Visual Placement Indicator */}
                      <div className="space-y-1 pt-1">
                        <div className="h-2 w-full bg-[#12162a] rounded-full overflow-hidden flex">
                          <div
                            className={`h-full transition-all rounded-full ${
                              ratingResult.baseline.expectedLow1PercentMin !== undefined && ratingResult.userLow1PercentFps >= ratingResult.baseline.expectedLow1PercentMin
                                ? 'bg-emerald-500'
                                : 'bg-rose-500'
                            }`}
                            style={{
                              width: `${Math.min(100, Math.max(10, Math.round((ratingResult.userLow1PercentFps / ((ratingResult.baseline.expectedLow1PercentMax || ratingResult.baseline.expectedFpsMax * 0.75) * 1.3)) * 100)))}%`
                            }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-zinc-400">
                          <span>Frame Pacing: {ratingResult.framePacingStatus}</span>
                          {ratingResult.framePacingRatio !== undefined && (
                            <span>Ratio: {Math.round(ratingResult.framePacingRatio * 100)}%</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-xl bg-[#090c17] border border-[#1f2842] space-y-2 flex flex-col justify-between">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-zinc-300">1% Low Stability</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                          Not Entered
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-relaxed">
                        1% Low FPS was not provided. The rating is based on your Average FPS relative to peer systems. To evaluate frame time stuttering or pacing consistency, you can optionally enter your 1% low framerate.
                      </p>
                      {ratingResult.baseline.expectedLow1PercentMin !== undefined && (
                        <div className="text-[10px] text-zinc-400 pt-1 border-t border-[#1f2842]">
                          Typical peer 1% low: <strong className="text-zinc-200">{ratingResult.baseline.expectedLow1PercentMin}–{ratingResult.baseline.expectedLow1PercentMax} FPS</strong>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Benchmark Source & Comparable Hardware Match Citation */}
                <div className="p-3.5 rounded-xl bg-[#090c17] border border-[#1f2842] text-xs space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <span className="text-zinc-200 font-bold block">
                          Comparison Target: {ratingResult.baseline.matchDescription}
                        </span>
                        <p className="text-[11px] text-zinc-400 leading-relaxed">
                          Data Source: <span className="text-zinc-300 font-medium">{ratingResult.baseline.sourceCitation}</span>
                        </p>
                        {ratingResult.baseline.notes && (
                          <p className="text-[11px] text-zinc-400 italic">
                            Note: {ratingResult.baseline.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider bg-purple-950 text-purple-300 border border-purple-800/60 shrink-0">
                      Tier: {ratingResult.baseline.matchPriority.replace(/_/g, ' ')}
                    </span>
                  </div>

                  {/* Benchmark References & Outlets */}
                  {ratingResult.evidenceDetails && ratingResult.evidenceDetails.benchmarkReferences.length > 0 && (
                    <div className="pt-2 border-t border-[#1f2842] flex flex-wrap items-center gap-1.5 text-[10px]">
                      <span className="text-zinc-400 font-semibold">Evidence Sources:</span>
                      {ratingResult.evidenceDetails.benchmarkReferences.map((ref, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800">
                          {ref}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* "Why?" Explanation Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#0c0f1d]/90 border border-[#1b233a] shadow-lg space-y-3 backdrop-blur-md">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-200 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  Why Did My PC Get This Rating?
                </span>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  {ratingResult.whyExplanation}
                </p>

                {/* Key Contributing Factors List */}
                {ratingResult.keyContributingFactors.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-[#1f2842]">
                    <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                      Contributing Factors Detected:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {ratingResult.keyContributingFactors.map((factor, idx) => (
                        <div
                          key={idx}
                          className={`p-2.5 rounded-xl border text-xs space-y-1 ${
                            factor.impact === 'Positive'
                              ? 'bg-emerald-950/40 border-emerald-800/50 text-emerald-200'
                              : factor.impact === 'Negative'
                              ? 'bg-rose-950/40 border-rose-800/50 text-rose-200'
                              : 'bg-[#090c17] border-[#1f2842] text-zinc-300'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 font-bold">
                            {factor.impact === 'Positive' ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            ) : factor.impact === 'Negative' ? (
                              <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                            ) : (
                              <Info className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                            )}
                            <span className="truncate">{factor.title}</span>
                          </div>
                          <p className="text-[11px] opacity-90 leading-relaxed">
                            {factor.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Actionable Recommendations: What Should I Check? */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#0c0f1d]/90 border border-[#1b233a] shadow-lg space-y-3 backdrop-blur-md">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  What Should I Check / Next Steps
                </span>
                <div className="space-y-2">
                  {ratingResult.actionableRecommendations.map((rec) => (
                    <div
                      key={rec.priority}
                      className="p-3 rounded-xl bg-[#090c17] border border-[#1f2842] flex items-start gap-3 text-xs"
                    >
                      <span className="w-6 h-6 rounded-lg bg-[#141b30] border border-[#27355f] text-sky-400 font-extrabold flex items-center justify-center shrink-0 text-xs">
                        {rec.priority}
                      </span>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-zinc-100">{rec.title}</span>
                          <span className="px-1.5 py-0.2 rounded text-[10px] uppercase font-bold bg-[#12162a] text-zinc-400 border border-[#232d4b]">
                            {rec.type}
                          </span>
                        </div>
                        <p className="text-zinc-400 text-[11px] leading-relaxed">
                          {rec.detail}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 sm:p-12 rounded-2xl bg-[#0c0f1d]/80 border border-[#1b233a] text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-950/40 border border-purple-500/30 flex items-center justify-center text-purple-400 mx-auto shadow-inner">
                <Gauge className="w-6 h-6" />
              </div>
              <div className="space-y-1 max-w-md mx-auto">
                <h4 className="text-base font-bold text-white">Ready to Rate Benchmark</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Enter your hardware specifications, game settings, and measured Average &amp; 1% Low FPS, then click <strong className="text-zinc-200">“COMPARE &amp; RATE BENCHMARK”</strong> to see how your PC performs relative to verified peer systems.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 max-w-lg mx-auto text-left text-xs">
                <div className="p-2 rounded-xl bg-[#090c17] border border-[#1f2842] space-y-0.5">
                  <span className="text-[10px] text-zinc-400 block font-semibold">STEP 1</span>
                  <span className="font-bold text-zinc-200 block text-[11px]">Pick Hardware</span>
                  <span className="text-[10px] text-zinc-400">Desktop or Laptop</span>
                </div>
                <div className="p-2 rounded-xl bg-[#090c17] border border-[#1f2842] space-y-0.5">
                  <span className="text-[10px] text-zinc-400 block font-semibold">STEP 2</span>
                  <span className="font-bold text-zinc-200 block text-[11px]">Select Game</span>
                  <span className="text-[10px] text-zinc-400">Resolution &amp; Preset</span>
                </div>
                <div className="p-2 rounded-xl bg-[#090c17] border border-[#1f2842] space-y-0.5">
                  <span className="text-[10px] text-zinc-400 block font-semibold">STEP 3</span>
                  <span className="font-bold text-zinc-200 block text-[11px]">Enter FPS</span>
                  <span className="text-[10px] text-zinc-400">Avg &amp; 1% Low FPS</span>
                </div>
                <div className="p-2 rounded-xl bg-[#090c17] border border-[#1f2842] space-y-0.5">
                  <span className="text-[10px] text-zinc-400 block font-semibold">STEP 4</span>
                  <span className="font-bold text-zinc-200 block text-[11px]">Get Rating</span>
                  <span className="text-[10px] text-zinc-400">Peer Comparison</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
