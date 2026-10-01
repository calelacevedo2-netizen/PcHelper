import React, { useState, useRef } from 'react';
import {
  Monitor,
  Cpu,
  HardDrive,
  Gamepad2,
  Tv,
  ArrowRight,
  Sparkles,
  AlertCircle,
  HelpCircle,
  Laptop,
  Layers,
  CheckCircle2,
  Filter,
  Check,
  Info,
  AlertTriangle,
  Sliders,
  Gauge,
  Zap,
  Activity
} from 'lucide-react';
import { GPUS_DATABASE } from './data/gpus';
import { CPUS_DATABASE } from './data/cpus';
import { GAMES_DATABASE } from './data/games';
import { DEVICES_DATABASE } from './data/devices';
import { SearchableHardwareSelect, SearchOption } from './components/SearchableHardwareSelect';
import { HierarchicalDeviceSelector } from './components/HierarchicalDeviceSelector';
import { ProductFamilyItem, ExactModelItem } from './data/deviceHierarchy';
import { GameSelect } from './components/GameSelect';
import { ResultSection } from './components/ResultSection';
import { PcTierSection } from './components/PcTierSection';
import { FpsDiagnosticSection } from './components/FpsDiagnosticSection';
import { BenchmarkRatingSection } from './components/BenchmarkRatingSection';
import { LaptopRealitySection } from './components/LaptopRealitySection';
import { evaluateSystem } from './logic/evaluator';
import { evaluatePcTier } from './logic/pcTierEvaluator';
import { getDeviceRamSpecs, evaluateRamUpgrade } from './data/ramCompatibility';
import {
  GPU,
  CPU as CPUType,
  Game,
  Resolution,
  RamOption,
  RecommendationResult,
  DeviceType,
  PcTierResult,
  DeviceModel,
  MemoryChannel,
  RamUpgradeStatus,
  OptimizationGoal,
  TargetFpsOption
} from './types';

export default function App() {
  // Navigation Tabs: 'checker' = Game Checker, 'diagnostic' = FPS Diagnostic, 'rating' = Benchmark Rating, 'laptop' = Laptop Reality, 'tier' = PC Tier
  const [activeTab, setActiveTab] = useState<'checker' | 'diagnostic' | 'rating' | 'laptop' | 'tier'>('checker');

  // Step 1: Device Type selection ('desktop' | 'laptop' | null)
  const [deviceType, setDeviceType] = useState<DeviceType | null>(null);
  const [showAllHardware, setShowAllHardware] = useState<boolean>(false);

  // Hierarchical Device Selection State
  const [selectedFamily, setSelectedFamily] = useState<ProductFamilyItem | null>(null);
  const [selectedExactModel, setSelectedExactModel] = useState<ExactModelItem | null>(null);
  const [selectedSku, setSelectedSku] = useState<string | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<DeviceModel | null>(null);

  // State for hardware & game selection (start blank so user chooses manually)
  const [selectedGpuId, setSelectedGpuId] = useState<string | null>(null);
  const [selectedVram, setSelectedVram] = useState<number | null>(null);
  const [customGpu, setCustomGpu] = useState<{ name: string; tier: 'entry' | 'mid' | 'high' } | null>(null);

  const [selectedCpuId, setSelectedCpuId] = useState<string | null>(null);
  const [customCpu, setCustomCpu] = useState<{ name: string; tier: 'entry' | 'mid' | 'high' } | null>(null);

  const [selectedRam, setSelectedRam] = useState<RamOption | null>(null);
  const [selectedMemoryChannel, setSelectedMemoryChannel] = useState<MemoryChannel>('Single-Channel');
  const [selectedGame, setSelectedGame] = useState<Game | null>(
    GAMES_DATABASE.find((g) => g.id === 'cyberpunk-2077') || GAMES_DATABASE[0]
  );
  const [selectedResolution, setSelectedResolution] = useState<Resolution>('1080p');
  const [optimizationGoal, setOptimizationGoal] = useState<OptimizationGoal>('balanced');
  const [targetFps, setTargetFps] = useState<TargetFpsOption>('any');
  const [customTargetFps, setCustomTargetFps] = useState<number | undefined>(undefined);

  // Error validation state
  const [validationError, setValidationError] = useState<string | null>(null);

  // Result state for Game Checker
  const [result, setResult] = useState<RecommendationResult | null>(null);

  // Company filter state for Game Checker CPU and GPU selectors (persists while using Game Checker)
  const [checkerCpuCompanyFilter, setCheckerCpuCompanyFilter] = useState<'All' | 'AMD' | 'Intel'>('All');
  const [checkerGpuCompanyFilter, setCheckerGpuCompanyFilter] = useState<'All' | 'NVIDIA' | 'AMD' | 'Intel'>('All');

  // Result state for PC Tier
  const [tierResult, setTierResult] = useState<PcTierResult | null>(null);

  const resultsRef = useRef<HTMLDivElement>(null);
  const tierResultsRef = useRef<HTMLDivElement>(null);
  const checkerFormRef = useRef<HTMLDivElement>(null);

  // Detect whether manually chosen hardware deviates from the selected device model
  // Note: RAM upgrades are verified via evaluateRamUpgrade and do NOT trigger custom CPU/GPU hardware mismatch!
  const isHardwareMismatch = React.useMemo(() => {
    if (!selectedDevice || !selectedExactModel) return false;
    const cpuMismatch = customCpu !== null || selectedCpuId !== selectedDevice.defaultCpuId;
    const gpuMismatch = customGpu !== null || selectedGpuId !== selectedDevice.defaultGpuId;
    const vramMismatch = selectedVram !== null && selectedVram !== selectedDevice.defaultVram;
    return cpuMismatch || gpuMismatch || vramMismatch;
  }, [selectedDevice, selectedExactModel, selectedCpuId, selectedGpuId, selectedVram, customCpu, customGpu]);

  // Handle changing device type between Desktop and Laptop
  const handleSelectDeviceType = (type: DeviceType) => {
    setDeviceType(type);
    setValidationError(null);

    // Reset hierarchy
    setSelectedFamily(null);
    setSelectedExactModel(null);
    setSelectedSku(null);
    setSelectedDevice(null);

    // Explicitly reset CPU and GPU selections so they are blank (Requirement 5)
    setSelectedGpuId(null);
    setSelectedVram(null);
    setCustomGpu(null);
    setSelectedCpuId(null);
    setCustomCpu(null);
    setSelectedRam(null);
    setSelectedMemoryChannel('Single-Channel');
    setResult(null);
    setTierResult(null);
  };

  // Handle selecting or clearing a product family (Requirement 7)
  const handleSelectFamily = (family: ProductFamilyItem | null) => {
    setSelectedFamily(family);
    setSelectedExactModel(null);
    setSelectedSku(null);
    setSelectedDevice(null);
    setValidationError(null);
  };

  // Handle selecting an exact model (Requirement 4 & 8)
  const handleSelectExactModel = (model: ExactModelItem | null) => {
    setSelectedExactModel(model);
    setValidationError(null);

    if (model) {
      setSelectedDevice(model.primaryDevice);
      setSelectedSku(model.skus[0] || model.primaryDevice.exactSku || null);

      // Pre-fill verified factory configuration
      setSelectedCpuId(model.primaryDevice.defaultCpuId);
      setCustomCpu(null);
      setSelectedGpuId(model.primaryDevice.defaultGpuId);
      setCustomGpu(null);
      setSelectedVram(model.primaryDevice.defaultVram);
      setSelectedRam(model.primaryDevice.defaultRam as RamOption);
      const ramSpecs = getDeviceRamSpecs(model.primaryDevice, deviceType || 'laptop');
      setSelectedMemoryChannel(model.primaryDevice.defaultChannel || ramSpecs.factoryChannel || 'Dual-Channel');
    } else {
      setSelectedDevice(null);
      setSelectedSku(null);
    }
  };

  // Handle selecting an exact SKU/configuration
  const handleSelectSku = (sku: string | null, device: DeviceModel | null) => {
    setSelectedSku(sku);
    if (device) {
      setSelectedDevice(device);
      setSelectedCpuId(device.defaultCpuId);
      setCustomCpu(null);
      setSelectedGpuId(device.defaultGpuId);
      setCustomGpu(null);
      setSelectedVram(device.defaultVram);
      setSelectedRam(device.defaultRam as RamOption);
      const ramSpecs = getDeviceRamSpecs(device, deviceType || 'laptop');
      setSelectedMemoryChannel(device.defaultChannel || ramSpecs.factoryChannel || 'Dual-Channel');
    }
    setValidationError(null);
  };

  // Handle clearing device model completely
  const handleClearDevice = () => {
    setSelectedFamily(null);
    setSelectedExactModel(null);
    setSelectedSku(null);
    setSelectedDevice(null);
    setSelectedMemoryChannel('Single-Channel');
  };

  // Handle reverting back to factory specifications (Requirement 9)
  const handleRevertToFactory = () => {
    if (selectedExactModel && selectedDevice) {
      setSelectedCpuId(selectedDevice.defaultCpuId);
      setCustomCpu(null);
      setSelectedGpuId(selectedDevice.defaultGpuId);
      setCustomGpu(null);
      setSelectedVram(selectedDevice.defaultVram);
      setSelectedRam(selectedDevice.defaultRam as RamOption);
      const ramSpecs = getDeviceRamSpecs(selectedDevice, deviceType || 'laptop');
      setSelectedMemoryChannel(selectedDevice.defaultChannel || ramSpecs.factoryChannel || 'Dual-Channel');
      setValidationError(null);
    }
  };

  // Build filtered options list for GPU selector based on device type
  const availableGpus = React.useMemo(() => {
    if (showAllHardware || !deviceType) {
      return GPUS_DATABASE;
    }
    return GPUS_DATABASE.filter((gpu) => gpu.type === deviceType);
  }, [deviceType, showAllHardware]);

  const gpuOptions: SearchOption[] = React.useMemo(() => {
    const list = availableGpus.map((gpu) => {
      const isFactoryOption = selectedExactModel?.configurations.some((c) => c.defaultGpuId === gpu.id);
      return {
        id: gpu.id,
        name: gpu.name,
        manufacturer: gpu.manufacturer,
        subtitle: `${gpu.manufacturer} • ${gpu.type === 'laptop' ? 'Laptop GPU' : 'Desktop'} • ${gpu.vramVariants ? gpu.vramVariants.map((v) => `${v.vram}GB`).join('/') : `${gpu.vram} GB`} VRAM`,
        isLaptop: gpu.type === 'laptop',
        vram: gpu.vram,
        badge: isFactoryOption ? `Factory Spec • ${selectedExactModel?.displayName}` : undefined,
        aliases: [
          gpu.name,
          gpu.name.replace(/laptop gpu/i, 'laptop'),
          gpu.name.replace(/laptop gpu/i, 'mobile'),
          gpu.name.replace(/geforce /i, '')
        ]
      };
    });

    if (selectedExactModel) {
      return [...list].sort((a, b) => {
        if (a.badge && !b.badge) return -1;
        if (!a.badge && b.badge) return 1;
        return 0;
      });
    }

    return list;
  }, [availableGpus, selectedExactModel]);

  // Build filtered options list for CPU selector based on device type
  const availableCpus = React.useMemo(() => {
    if (showAllHardware || !deviceType) {
      return CPUS_DATABASE;
    }
    return CPUS_DATABASE.filter((cpu) => cpu.type === deviceType);
  }, [deviceType, showAllHardware]);

  const cpuOptions: SearchOption[] = React.useMemo(() => {
    const list = availableCpus.map((cpu) => {
      const isFactoryOption = selectedExactModel?.configurations.some((c) => c.defaultCpuId === cpu.id);
      return {
        id: cpu.id,
        name: cpu.name,
        manufacturer: cpu.manufacturer,
        subtitle: `${cpu.manufacturer} • ${cpu.type === 'laptop' ? 'Mobile CPU' : 'Desktop CPU'} • ${cpu.generation || cpu.family || ''}${cpu.cores ? ` • ${cpu.cores}C/${cpu.threads || cpu.cores}T` : ''}`,
        isLaptop: cpu.type === 'laptop',
        badge: isFactoryOption ? `Factory Spec • ${selectedExactModel?.displayName}` : undefined,
        generation: cpu.generation,
        family: cpu.family,
        aliases: cpu.aliases ? [cpu.name, ...cpu.aliases] : [cpu.name]
      };
    });

    if (selectedExactModel) {
      return [...list].sort((a, b) => {
        if (a.badge && !b.badge) return -1;
        if (!a.badge && b.badge) return 1;
        return 0;
      });
    }

    return list;
  }, [availableCpus, selectedExactModel]);

  const currentGpu = GPUS_DATABASE.find((g) => g.id === selectedGpuId);

  // Resolve current active GPU object (standard or estimated fallback)
  const resolveActiveGpu = (): GPU | null => {
    if (customGpu) {
      const scoreMap = { entry: 26, mid: 55, high: 85 };
      const vramMap = { entry: 4, mid: 8, high: 12 };
      const actualVram = selectedVram ?? vramMap[customGpu.tier];
      return {
        id: 'custom-gpu',
        name: `${customGpu.name} — ${actualVram} GB VRAM`,
        manufacturer: 'NVIDIA',
        type: customGpu.name.toLowerCase().includes('laptop') ? 'laptop' : 'desktop',
        vram: actualVram,
        performanceTier: customGpu.tier === 'entry' ? 3 : customGpu.tier === 'mid' ? 6 : 9,
        performanceScore: scoreMap[customGpu.tier]
      };
    }

    const baseGpu = GPUS_DATABASE.find((g) => g.id === selectedGpuId);
    if (!baseGpu) return null;

    const actualVram = selectedVram ?? baseGpu.vram;
    const matchedVariant = baseGpu.vramVariants?.find((v) => v.vram === actualVram);

    return {
      ...baseGpu,
      vram: actualVram,
      name: `${baseGpu.name} — ${actualVram} GB VRAM`,
      performanceScore: matchedVariant?.performanceScore ?? baseGpu.performanceScore,
      notes: matchedVariant?.notes ? `${baseGpu.notes} (${matchedVariant.notes})` : baseGpu.notes
    };
  };

  // Resolve current active CPU object (standard or estimated fallback)
  const resolveActiveCpu = (): CPUType | null => {
    if (customCpu) {
      const scoreMap = { entry: 32, mid: 60, high: 88 };
      return {
        id: 'custom-cpu',
        name: customCpu.name,
        manufacturer: 'Intel',
        type: customCpu.name.toLowerCase().includes('mobile') || customCpu.name.toLowerCase().includes('laptop') ? 'laptop' : 'desktop',
        performanceTier: customCpu.tier === 'entry' ? 3 : customCpu.tier === 'mid' ? 6 : 9,
        performanceScore: scoreMap[customCpu.tier]
      };
    }
    return CPUS_DATABASE.find((c) => c.id === selectedCpuId) || null;
  };

  const activeGpu = resolveActiveGpu();
  const activeCpu = resolveActiveCpu();

  const deviceRamSpecs = React.useMemo(() => {
    if (!selectedDevice) return null;
    return getDeviceRamSpecs(selectedDevice, deviceType || 'laptop');
  }, [selectedDevice, deviceType]);

  const currentRamUpgrade = React.useMemo(() => {
    if (!selectedRam) return null;
    const isDiscrete = activeGpu ? activeGpu.performanceTier > 2 : true;
    return evaluateRamUpgrade(selectedDevice, selectedRam, selectedMemoryChannel, isDiscrete);
  }, [selectedDevice, selectedRam, selectedMemoryChannel, activeGpu]);

  // Handle "CHECK MY PC" click
  const handleCheckMyPc = () => {
    if (!deviceType) {
      setValidationError('Please select whether you are using a Desktop PC or a Laptop.');
      return;
    }

    if (!activeCpu && !activeGpu) {
      setValidationError('Please select your CPU and GPU first.');
      return;
    }

    if (!activeCpu) {
      setValidationError('Please select your CPU first.');
      return;
    }

    if (!activeGpu) {
      setValidationError('Please select your GPU first.');
      return;
    }

    if (!selectedRam) {
      setValidationError('Please choose your RAM configuration.');
      return;
    }

    if (!selectedGame) {
      setValidationError('Please choose a game to evaluate.');
      return;
    }

    setValidationError(null);

    const evaluation = evaluateSystem(
      activeGpu,
      activeCpu,
      selectedRam,
      selectedGame,
      selectedResolution,
      !!customGpu,
      !!customCpu,
      deviceType,
      selectedDevice,
      isHardwareMismatch,
      selectedMemoryChannel,
      optimizationGoal,
      targetFps,
      customTargetFps
    );

    setResult(evaluation);

    // Smooth scroll down to results
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // Handle immediate dynamic re-evaluation when optimization goal or target FPS changes
  const handleGoalChange = (newGoal: OptimizationGoal, newTargetFps: TargetFpsOption, newCustomFps?: number) => {
    setOptimizationGoal(newGoal);
    setTargetFps(newTargetFps);
    if (newCustomFps !== undefined) {
      setCustomTargetFps(newCustomFps);
    }
    if (activeGpu && activeCpu && selectedRam && selectedGame) {
      const updated = evaluateSystem(
        activeGpu,
        activeCpu,
        selectedRam,
        selectedGame,
        selectedResolution,
        !!customGpu,
        !!customCpu,
        deviceType || 'desktop',
        selectedDevice,
        isHardwareMismatch,
        selectedMemoryChannel,
        newGoal,
        newTargetFps,
        newCustomFps ?? customTargetFps
      );
      setResult(updated);
    }
  };

  // Handle closing Game Results (collapses result without clearing hardware or game)
  const handleCloseGameResults = () => {
    setResult(null);
    checkerFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Handle closing PC Tier Results (collapses result without clearing hardware)
  const handleCloseTierResults = () => {
    setTierResult(null);
    checkerFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Handle Check My PC Tier
  const handleCheckPcTier = () => {
    if (!deviceType) {
      setValidationError('Please select whether you are using a Desktop PC or a Laptop.');
      return;
    }

    if (!activeCpu && !activeGpu) {
      setValidationError('Please select your CPU and GPU first.');
      return;
    }

    if (!activeCpu) {
      setValidationError('Please select your CPU first.');
      return;
    }

    if (!activeGpu) {
      setValidationError('Please select your GPU first.');
      return;
    }

    if (!selectedRam) {
      setValidationError('Please choose your RAM configuration.');
      return;
    }

    setValidationError(null);

    const evaluation = evaluatePcTier(
      activeGpu,
      activeCpu,
      selectedRam,
      selectedVram,
      deviceType,
      selectedDevice,
      isHardwareMismatch,
      selectedMemoryChannel
    );

    setTierResult(evaluation);

    // Smooth scroll down to tier results
    setTimeout(() => {
      tierResultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // Sync PC Tier result dynamically if user modifies specs while results are visible
  React.useEffect(() => {
    if (activeTab === 'tier' && tierResult && activeGpu && activeCpu && deviceType && selectedRam) {
      const updated = evaluatePcTier(
        activeGpu,
        activeCpu,
        selectedRam,
        selectedVram,
        deviceType,
        selectedDevice,
        isHardwareMismatch,
        selectedMemoryChannel
      );
      setTierResult(updated);
    }
  }, [selectedGpuId, selectedCpuId, selectedVram, selectedRam, selectedMemoryChannel, deviceType, selectedDevice, isHardwareMismatch]);

  // Handle Quick Presets (helpful for beginners)
  const applyPreset = (
    type: DeviceType,
    gpuId: string,
    vram: number,
    cpuId: string,
    ram: RamOption,
    gameId: string,
    res: Resolution
  ) => {
    setDeviceType(type);
    setSelectedDevice(null);
    setSelectedGpuId(gpuId);
    setSelectedVram(vram);
    setCustomGpu(null);
    setSelectedCpuId(cpuId);
    setCustomCpu(null);
    setSelectedRam(ram);
    const targetGame = GAMES_DATABASE.find((g) => g.id === gameId);
    if (targetGame) setSelectedGame(targetGame);
    setSelectedResolution(res);
    setResult(null);
    setTierResult(null);
    setValidationError(null);
  };

  return (
    <div className="min-h-screen bg-[#080a12] text-zinc-100 selection:bg-purple-600 selection:text-white pb-24 font-sans antialiased">
      {/* Subtle, clean technical grid backdrop */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.035] bg-[radial-gradient(#8b5cf6_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-[#1b2238] bg-[#080a12]/90 backdrop-blur-md">
        <div className="max-w-7xl 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0f1322] border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-[0_0_12px_-3px_rgba(168,85,247,0.3)]">
              <Monitor className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold tracking-tight text-white">
                  PC Gaming Helper
                </h1>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-purple-950/80 text-purple-300 border border-purple-800/60">
                  Data-Driven
                </span>
                <span className="hidden md:inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-sky-950/80 text-sky-300 border border-sky-800/60">
                  1080p Widescreen
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 font-normal">
                Hardware Benchmark Evaluator & In-Game Graphics Optimizer
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0f1322] border border-[#1f2842] text-zinc-300 text-xs font-medium shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse shadow-[0_0_8px_#34d399]" />
              Thermal & VRAM Aware
            </span>
          </div>
        </div>
      </header>

      {/* Main Content with 1920x1080 responsive canvas */}
      <main className="max-w-7xl 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-7 relative">
        {/* Main Navigation Tabs */}
        <div className="flex items-center justify-center">
          <nav
            aria-label="Application Navigation"
            className="inline-flex flex-wrap justify-center p-1.5 rounded-2xl bg-[#0c0f1c]/90 border border-[#1c243a] shadow-lg shadow-black/40 gap-1.5 max-w-full"
          >
            <button
              type="button"
              id="tab-game-checker"
              onClick={() => {
                setActiveTab('checker');
                setValidationError(null);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === 'checker'
                  ? 'bg-gradient-to-r from-violet-600 via-purple-600 to-sky-500 text-white font-bold shadow-[0_0_20px_-3px_rgba(168,85,247,0.4)] border border-purple-400/30'
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-800/60'
              }`}
            >
              <Gamepad2 className="w-4 h-4" />
              <span>Game Checker</span>
            </button>
            <button
              type="button"
              id="tab-fps-diagnostic"
              onClick={() => {
                setActiveTab('diagnostic');
                setValidationError(null);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === 'diagnostic'
                  ? 'bg-gradient-to-r from-violet-600 via-purple-600 to-sky-500 text-white font-bold shadow-[0_0_20px_-3px_rgba(168,85,247,0.4)] border border-purple-400/30'
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-800/60'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>FPS Diagnostic</span>
            </button>
            <button
              type="button"
              id="tab-benchmark-rating"
              onClick={() => {
                setActiveTab('rating');
                setValidationError(null);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === 'rating'
                  ? 'bg-gradient-to-r from-violet-600 via-purple-600 to-sky-500 text-white font-bold shadow-[0_0_20px_-3px_rgba(168,85,247,0.4)] border border-purple-400/30'
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-800/60'
              }`}
            >
              <Gauge className="w-4 h-4" />
              <span>Benchmark Rating</span>
            </button>
            <button
              type="button"
              id="tab-laptop-reality"
              onClick={() => {
                setActiveTab('laptop');
                setValidationError(null);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === 'laptop'
                  ? 'bg-gradient-to-r from-violet-600 via-purple-600 to-sky-500 text-white font-bold shadow-[0_0_20px_-3px_rgba(168,85,247,0.4)] border border-purple-400/30'
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-800/60'
              }`}
            >
              <Laptop className="w-4 h-4" />
              <span>Laptop Reality</span>
            </button>
            <button
              type="button"
              id="tab-pc-tier"
              onClick={() => {
                setActiveTab('tier');
                setValidationError(null);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm transition-all cursor-pointer ${
                activeTab === 'tier'
                  ? 'bg-gradient-to-r from-violet-600 via-purple-600 to-sky-500 text-white font-bold shadow-[0_0_20px_-3px_rgba(168,85,247,0.4)] border border-purple-400/30'
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-800/60'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>PC Tier</span>
            </button>
          </nav>
        </div>

        {/* Dynamic Intro Hero Box */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-100 tracking-tight">
            {activeTab === 'checker' && 'Will Your Hardware Run This Game?'}
            {activeTab === 'diagnostic' && 'Why Am I Getting This FPS?'}
            {activeTab === 'rating' && 'Is My PC Performing Normally?'}
            {activeTab === 'laptop' && 'Exact Laptop Hardware & Performance Reality'}
            {activeTab === 'tier' && 'What Tier Is Your Gaming PC?'}
          </h2>
          <p className="text-zinc-400 text-xs sm:text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            {activeTab === 'checker' &&
              'Select your components and a target game to receive evidence-based framerate estimates, bottleneck detection, and custom in-game graphics settings.'}
            {activeTab === 'diagnostic' &&
              'Diagnose why your actual in-game framerate is lower than expected, identify the limiting component, and see what to change first.'}
            {activeTab === 'rating' &&
              'Compare real in-game benchmark results against verified hardware data to check if your system is performing Below Typical, Typical, Above Typical, or Exceptional.'}
            {activeTab === 'laptop' &&
              'Explore real-world benchmarks, verified TGP power limits, cooling architectures, and RAM configurations across specific laptop models.'}
            {activeTab === 'tier' &&
              'Accurate, researched classification of your machine across 20 distinct hardware sub-tiers based on modern graphics APIs.'}
          </p>
        </div>

        {/* Quick Example Chips for quick testing */}
        {(activeTab === 'checker' || activeTab === 'tier') && (
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="text-zinc-400 font-medium flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Quick Presets:
          </span>
          {activeTab === 'checker' ? (
            <>
              <button
                type="button"
                id="preset-flagship-scar18"
                onClick={() => {
                  const scarDevice = DEVICES_DATABASE.find(d => d.id === 'asus-rog-strix-scar-18-g834jyr');
                  if (scarDevice) setSelectedDevice(scarDevice);
                  applyPreset(
                    'laptop',
                    'rtx-4090-laptop',
                    16,
                    'intel-i9-14900hx',
                    32,
                    'cyberpunk-2077',
                    '1440p'
                  );
                }}
                className="px-2.5 py-1 rounded-lg bg-[#0e1326] border border-purple-500/40 text-purple-200 hover:border-purple-400 hover:text-white transition-all shadow-[0_0_10px_-3px_rgba(168,85,247,0.3)] cursor-pointer font-medium"
              >
                Flagship (ASUS SCAR 18, RTX 4090 16GB, i9-14900HX)
              </button>
              <button
                type="button"
                id="preset-budget-laptop"
                onClick={() =>
                  applyPreset(
                    'laptop',
                    'rtx-3050-laptop',
                    4,
                    'amd-ryzen-7-5800h',
                    8,
                    'cyberpunk-2077',
                    '1080p'
                  )
                }
                className="px-2.5 py-1 rounded-lg bg-[#0d101e] border border-[#1d243b] text-zinc-300 hover:border-zinc-700 hover:text-white transition-colors cursor-pointer"
              >
                Budget Laptop (RTX 3050 4GB, Ryzen 7 5800H)
              </button>
              <button
                type="button"
                id="preset-ryzen-170-laptop"
                onClick={() =>
                  applyPreset(
                    'laptop',
                    'rtx-4060-laptop',
                    8,
                    'amd-ryzen-7-170',
                    16,
                    'black-myth-wukong',
                    '1080p'
                  )
                }
                className="px-2.5 py-1 rounded-lg bg-[#0d101e] border border-[#1d243b] text-zinc-300 hover:border-zinc-700 hover:text-white transition-colors cursor-pointer"
              >
                New Mobile (RTX 4060, Ryzen 7 170)
              </button>
              <button
                type="button"
                id="preset-midrange-desktop"
                onClick={() =>
                  applyPreset(
                    'desktop',
                    'rtx-3060',
                    12,
                    'amd-ryzen-7-5700x',
                    16,
                    'spiderman-remastered',
                    '1080p'
                  )
                }
                className="px-2.5 py-1 rounded-lg bg-[#0d101e] border border-[#1d243b] text-zinc-300 hover:border-zinc-700 hover:text-white transition-colors cursor-pointer"
              >
                Mid-Range Desktop (RTX 3060 12GB, Ryzen 7 5700X)
              </button>
              <button
                type="button"
                id="preset-classic-desktop"
                onClick={() =>
                  applyPreset(
                    'desktop',
                    'gtx-1060',
                    6,
                    'amd-ryzen-7-1700',
                    16,
                    'fortnite',
                    '1080p'
                  )
                }
                className="px-2.5 py-1 rounded-lg bg-[#0d101e] border border-[#1d243b] text-zinc-300 hover:border-zinc-700 hover:text-white transition-colors cursor-pointer"
              >
                Classic Desktop (GTX 1060 6GB, Ryzen 7 1700)
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                id="preset-tier-budget-laptop"
                onClick={() => {
                  applyPreset(
                    'laptop',
                    'rtx-3050-laptop',
                    4,
                    'amd-ryzen-7-5800h',
                    8,
                    selectedGame?.id || 'cyberpunk-2077',
                    selectedResolution
                  );
                }}
                className="px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:text-white transition-colors cursor-pointer"
              >
                Budget Laptop (RTX 3050 4GB, Ryzen 7 5800H, 8GB)
              </button>
              <button
                type="button"
                id="preset-tier-modern-mobile"
                onClick={() => {
                  applyPreset(
                    'laptop',
                    'rtx-4060-laptop',
                    8,
                    'amd-ryzen-7-170',
                    16,
                    selectedGame?.id || 'cyberpunk-2077',
                    selectedResolution
                  );
                }}
                className="px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:text-white transition-colors cursor-pointer"
              >
                Mobile Laptop (RTX 4060, Ryzen 7 170, 16GB)
              </button>
              <button
                type="button"
                id="preset-tier-midrange-desktop"
                onClick={() => {
                  applyPreset(
                    'desktop',
                    'rtx-3060',
                    12,
                    'amd-ryzen-7-5700x',
                    16,
                    selectedGame?.id || 'cyberpunk-2077',
                    selectedResolution
                  );
                }}
                className="px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:text-white transition-colors cursor-pointer"
              >
                Mid-Range Desktop (RTX 3060 12GB, Ryzen 7 5700X)
              </button>
              <button
                type="button"
                id="preset-tier-highend-desktop"
                onClick={() => {
                  applyPreset(
                    'desktop',
                    'rtx-4070-super',
                    12,
                    'intel-core-i7-14700k',
                    32,
                    selectedGame?.id || 'cyberpunk-2077',
                    selectedResolution
                  );
                }}
                className="px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:text-white transition-colors cursor-pointer"
              >
                High-End Desktop (RTX 4070 Super, i7-14700K, 32GB)
              </button>
            </>
          )}
          </div>
        )}

        {/* Primary Checker Form Card for Game Checker & PC Tier */}
        {(activeTab === 'checker' || activeTab === 'tier') && (
          <div
            ref={checkerFormRef}
            id="pc-checker-form"
            className="bg-[#0c0f1d]/90 border border-[#1b233a] rounded-2xl p-5 sm:p-7 md:p-8 shadow-2xl backdrop-blur-md space-y-6"
          >
          {activeTab === 'checker' ? (
            /* =========================================================================
               GAME CHECKER MODE: 2-COLUMN STRUCTURED LAYOUT ON DESKTOP
               ========================================================================= */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
              {/* SIDE A: Hardware Selection (Columns 1-6 on desktop) */}
              <div className="lg:col-span-6 xl:col-span-7 space-y-5" id="section-hardware-config">
                <div className="flex items-center justify-between pb-3 border-b border-[#1f2842]">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm md:text-base font-bold text-white flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-purple-400" />
                        <span>1. Hardware Configuration</span>
                      </h3>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-800/60 uppercase tracking-wider">
                        System Specs
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Configure your system or select a verified computer model:
                    </p>
                  </div>
                  {/* Hardware filter mode toggle */}
                  <button
                    type="button"
                    id="btn-toggle-all-hardware"
                    onClick={() => setShowAllHardware((prev) => !prev)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] transition-colors cursor-pointer shrink-0 ${
                      showAllHardware
                        ? 'bg-amber-950/60 text-amber-300 border-amber-800/80 hover:bg-amber-900/60'
                        : 'bg-zinc-950/60 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                    }`}
                    title="Toggle between filtered hardware and all hardware"
                  >
                    <Filter className="w-3 h-3" />
                    <span className="hidden sm:inline">
                      {showAllHardware ? 'Showing all components' : `Filtering by ${deviceType === 'laptop' ? 'Laptop' : 'Desktop'}`}
                    </span>
                    <span className="sm:hidden">
                      {showAllHardware ? 'All' : deviceType === 'laptop' ? 'Laptop' : 'Desktop'}
                    </span>
                  </button>
                </div>

                {/* Device Selector */}
                <div id="step-device-selection">
                  <HierarchicalDeviceSelector
                    deviceType={deviceType}
                    onSelectDeviceType={handleSelectDeviceType}
                    selectedFamily={selectedFamily}
                    onSelectFamily={handleSelectFamily}
                    selectedExactModel={selectedExactModel}
                    onSelectExactModel={handleSelectExactModel}
                    selectedSku={selectedSku}
                    onSelectSku={handleSelectSku}
                    selectedDevice={selectedDevice}
                    onClearDevice={handleClearDevice}
                    isHardwareMismatch={isHardwareMismatch}
                    onRevertToFactory={handleRevertToFactory}
                    activeCpuName={activeCpu?.name}
                    activeGpuName={activeGpu?.name}
                    selectedVram={selectedVram}
                    selectedRam={selectedRam}
                  />
                </div>

                {/* CPU & GPU Selectors in 2-Column Subgrid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  {/* CPU Selector */}
                  <div>
                    <SearchableHardwareSelect
                      id="select-cpu"
                      label={`2. Select CPU ${deviceType ? `• ${deviceType === 'laptop' ? 'Laptop' : 'Desktop'}` : ''}`}
                      placeholder="Select your CPU"
                      options={cpuOptions}
                      selectedId={selectedCpuId}
                      customName={customCpu?.name}
                      type="CPU"
                      enableCompanyFilter={true}
                      companyFilter={checkerCpuCompanyFilter}
                      onCompanyFilterChange={(filter) => setCheckerCpuCompanyFilter(filter as 'All' | 'AMD' | 'Intel')}
                      onSelect={(opt) => {
                        setSelectedCpuId(opt.id);
                        setCustomCpu(null);
                        setValidationError(null);
                      }}
                      onCustomEntry={(name, tier) => {
                        setSelectedCpuId(null);
                        setCustomCpu({ name, tier });
                        setValidationError(null);
                      }}
                    />
                    <p className="text-[11px] text-zinc-400 mt-1 flex items-center justify-between">
                      <span>
                        {checkerCpuCompanyFilter !== 'All'
                          ? `${cpuOptions.filter((c) => c.manufacturer === checkerCpuCompanyFilter).length} ${checkerCpuCompanyFilter} CPUs`
                          : `${cpuOptions.length} available`}
                      </span>
                      {selectedCpuId === 'amd-ryzen-7-170' && (
                        <span className="text-indigo-400 font-semibold truncate ml-1">
                          Zen 3+ Mobile
                        </span>
                      )}
                    </p>
                  </div>

                  {/* GPU Selector */}
                  <div>
                    <SearchableHardwareSelect
                      id="select-gpu"
                      label={`3. Select GPU ${deviceType ? `• ${deviceType === 'laptop' ? 'Laptop' : 'Desktop'}` : ''}`}
                      placeholder="Select your GPU"
                      options={gpuOptions}
                      selectedId={selectedGpuId}
                      customName={customGpu?.name}
                      type="GPU"
                      enableCompanyFilter={true}
                      companyFilter={checkerGpuCompanyFilter}
                      onCompanyFilterChange={(filter) => setCheckerGpuCompanyFilter(filter as 'All' | 'NVIDIA' | 'AMD' | 'Intel')}
                      onSelect={(opt) => {
                        setSelectedGpuId(opt.id);
                        setCustomGpu(null);
                        const found = GPUS_DATABASE.find((g) => g.id === opt.id);
                        if (found) {
                          if (found.vramVariants && found.vramVariants.length > 0) {
                            const validVrams = found.vramVariants.map((v) => v.vram);
                            if (!selectedVram || !validVrams.includes(selectedVram)) {
                              setSelectedVram(found.vramVariants[0].vram);
                            }
                          } else {
                            setSelectedVram(found.vram);
                          }
                        }
                        setValidationError(null);
                      }}
                      onCustomEntry={(name, tier) => {
                        setSelectedGpuId(null);
                        setCustomGpu({ name, tier });
                        setValidationError(null);
                      }}
                    />

                    {/* VRAM Variant Selector if GPU has multiple verified variants */}
                    {currentGpu?.vramVariants && currentGpu.vramVariants.length > 1 && (
                      <div id="container-vram-variants" className="mt-2.5 p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800 animate-in fade-in duration-200">
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5 text-indigo-400" />
                            VRAM Configuration:
                          </label>
                          <span className="text-[10px] text-zinc-400">
                            {currentGpu.vramVariants.length} variants
                          </span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                          {currentGpu.vramVariants.map((variant) => {
                            const isSelected = (selectedVram ?? currentGpu.vram) === variant.vram;
                            return (
                              <button
                                key={variant.vram}
                                id={`btn-vram-${variant.vram}gb`}
                                type="button"
                                onClick={() => {
                                  setSelectedVram(variant.vram);
                                  setValidationError(null);
                                }}
                                className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all flex flex-col items-center justify-center text-center cursor-pointer ${
                                  isSelected
                                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm shadow-indigo-600/30'
                                    : 'bg-zinc-900 text-zinc-300 border-zinc-700/80 hover:border-zinc-600 hover:bg-zinc-800'
                                }`}
                              >
                                <div className="flex items-center gap-1">
                                  <CheckCircle2 className={`w-3 h-3 ${isSelected ? 'text-white' : 'opacity-0'}`} />
                                  <span>{variant.vram} GB</span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Single verified VRAM badge indicator */}
                    {currentGpu && (!currentGpu.vramVariants || currentGpu.vramVariants.length <= 1) && (
                      <div className="mt-1.5 px-2.5 py-1 rounded-lg bg-zinc-950/40 border border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-400">
                        <span className="flex items-center gap-1">
                          <Layers className="w-3 h-3 text-zinc-500" />
                          VRAM:
                        </span>
                        <span className="font-semibold text-zinc-300">
                          {currentGpu.vram} GB {currentGpu.busWidthBits ? `(${currentGpu.busWidthBits}-bit)` : ''}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* System RAM and Memory Channel */}
                <div id="container-ram-select" className="pt-3 border-t border-zinc-800/70 space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                        <HardDrive className="w-4 h-4 text-indigo-400" />
                        4. System RAM
                      </label>
                      {deviceRamSpecs && (
                        <span className="text-[11px] text-zinc-400">
                          {deviceRamSpecs.memoryType} • {deviceRamSpecs.slotsCount} Slots (Max {deviceRamSpecs.maxSupportedRamGb}GB)
                        </span>
                      )}
                    </div>

                    {/* RAM Capacity Buttons */}
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                      {([4, 8, 16, 24, 32, 64] as RamOption[]).map((gb) => {
                        const isFactory = deviceRamSpecs && gb === deviceRamSpecs.factoryRamGb;
                        const isSupportedUpgrade = deviceRamSpecs && !isFactory && deviceRamSpecs.supportedCapacities.includes(gb);
                        const isUnverified = deviceRamSpecs && gb > deviceRamSpecs.maxSupportedRamGb;

                        return (
                          <button
                            key={gb}
                            id={`btn-ram-${gb}gb`}
                            type="button"
                            onClick={() => {
                              setSelectedRam(gb);
                              setValidationError(null);
                              if (deviceRamSpecs) {
                                if (deviceRamSpecs.slotsCount === 1) {
                                  setSelectedMemoryChannel('Single-Channel');
                                } else if (gb === deviceRamSpecs.factoryRamGb) {
                                  setSelectedMemoryChannel(deviceRamSpecs.factoryChannel);
                                }
                              }
                            }}
                            className={`py-2 px-1 rounded-xl border transition-all text-center cursor-pointer flex flex-col items-center justify-center min-h-[46px] ${
                              selectedRam === gb
                                ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                                : 'bg-zinc-900/90 text-zinc-300 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800'
                            }`}
                          >
                            <span className="text-xs sm:text-sm font-bold">{gb} GB</span>
                            {isFactory && (
                              <span className={`text-[9px] font-semibold mt-0.5 px-1 rounded ${
                                selectedRam === gb ? 'bg-indigo-700 text-indigo-100' : 'bg-zinc-800 text-zinc-300'
                              }`}>
                                Factory
                              </span>
                            )}
                            {isSupportedUpgrade && (
                              <span className={`text-[9px] font-semibold mt-0.5 px-1 rounded ${
                                selectedRam === gb ? 'bg-emerald-700 text-emerald-100' : 'bg-emerald-950/80 text-emerald-300'
                              }`}>
                                Upgrade
                              </span>
                            )}
                            {isUnverified && (
                              <span className={`text-[9px] font-semibold mt-0.5 px-1 rounded ${
                                selectedRam === gb ? 'bg-amber-700 text-amber-100' : 'bg-amber-950/80 text-amber-300'
                              }`}>
                                Unverified
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Memory Channel Selector */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium text-zinc-400 flex items-center gap-1">
                        <span>Memory Channel Configuration</span>
                      </span>
                      {currentRamUpgrade?.moduleConfig && (
                        <span className="text-[11px] text-zinc-400 font-mono">
                          {currentRamUpgrade.moduleConfig}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        id="btn-ram-channel-single"
                        onClick={() => setSelectedMemoryChannel('Single-Channel')}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer flex items-center justify-center gap-1.5 ${
                          selectedMemoryChannel === 'Single-Channel'
                            ? 'bg-zinc-800 text-white border-zinc-600 shadow-sm'
                            : 'bg-zinc-900/60 text-zinc-400 border-zinc-800/80 hover:bg-zinc-800/50 hover:text-zinc-200'
                        }`}
                      >
                        <span>Single-Channel</span>
                        <span className="text-[10px] text-zinc-400 font-normal">(1 Module)</span>
                      </button>

                      <button
                        type="button"
                        id="btn-ram-channel-dual"
                        disabled={deviceRamSpecs?.slotsCount === 1}
                        onClick={() => setSelectedMemoryChannel('Dual-Channel')}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center flex items-center justify-center gap-1.5 ${
                          deviceRamSpecs?.slotsCount === 1
                            ? 'opacity-40 cursor-not-allowed bg-zinc-950 border-zinc-900 text-zinc-600'
                            : selectedMemoryChannel === 'Dual-Channel'
                            ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30 cursor-pointer'
                            : 'bg-zinc-900/60 text-zinc-400 border-zinc-800/80 hover:bg-zinc-800/50 hover:text-zinc-200 cursor-pointer'
                        }`}
                      >
                        <span>Dual-Channel</span>
                        <span className="text-[10px] font-normal opacity-80">(2 Modules)</span>
                      </button>
                    </div>
                  </div>

                  {/* Real-Time RAM Verification Feedback */}
                  {deviceRamSpecs && selectedRam && (
                    <div className="space-y-1.5 pt-0.5">
                      {currentRamUpgrade?.status === 'factory' && (
                        <div className="p-2 rounded-lg bg-zinc-900/90 border border-zinc-800 text-xs text-zinc-300 flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                          <span>
                            <strong>Factory Configuration:</strong> {deviceRamSpecs.factoryRamGb} GB {deviceRamSpecs.memoryType} ({deviceRamSpecs.factoryModules}).
                          </span>
                        </div>
                      )}

                      {currentRamUpgrade?.status === 'supported_upgrade' && (
                        <div className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-800/50 text-xs text-emerald-200 flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>
                            <strong>Supported RAM Upgrade:</strong> {selectedRam} GB {selectedMemoryChannel} ({currentRamUpgrade.moduleConfig}). Verified compatible with {selectedDevice?.name}.
                          </span>
                        </div>
                      )}

                      {currentRamUpgrade?.status === 'unsupported' && (
                        <div className="p-2 rounded-lg bg-amber-950/40 border border-amber-800/50 text-xs text-amber-200 flex items-start gap-2">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                          <span>
                            <strong>Unverified Configuration:</strong> {currentRamUpgrade.warningMessage || `Exceeds verified ${deviceRamSpecs.maxSupportedRamGb} GB maximum memory limit for this model.`}
                          </span>
                        </div>
                      )}

                      {selectedMemoryChannel === 'Single-Channel' && selectedRam >= 16 && (
                        <div className="p-2 rounded-lg bg-sky-950/40 border border-sky-800/50 text-xs text-sky-200 flex items-start gap-2">
                          <Info className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                          <span>
                            <strong>Single-Channel Notice:</strong> Halves memory bus bandwidth. Dual-Channel (2 × 8 GB) is recommended for modern gaming.
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT SIDE: Distinct Section 2 (Game Selection) & Section 3 (Game Settings) */}
              <div className="lg:col-span-6 xl:col-span-5 space-y-5 lg:border-l lg:border-[#1f2842] lg:pl-8 flex flex-col justify-between">
                <div className="space-y-5">
                  {/* SECTION 2: Game Selection */}
                  <div id="section-game-selection" className="p-4 sm:p-5 rounded-2xl bg-[#090c17]/90 border border-[#1b233a] shadow-md space-y-3.5">
                    <div className="flex items-center justify-between pb-2.5 border-b border-[#1f2842]">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm md:text-base font-bold text-white flex items-center gap-2">
                          <Gamepad2 className="w-4 h-4 text-sky-400" />
                          <span>2. Game Selection</span>
                        </h3>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-sky-950/80 text-sky-300 border border-sky-800/60 uppercase tracking-wider">
                          Target Title
                        </span>
                      </div>
                      {selectedGame && (
                        <span className="text-[11px] font-medium text-sky-300 bg-sky-950/60 border border-sky-800/50 px-2 py-0.5 rounded">
                          {selectedGame.category || 'PC Game'}
                        </span>
                      )}
                    </div>

                    {/* Searchable Game Autocomplete Combobox */}
                    <GameSelect
                      id="select-game"
                      games={GAMES_DATABASE}
                      selectedGame={selectedGame}
                      onSelectGame={(g) => {
                        setSelectedGame(g);
                        setValidationError(null);
                      }}
                    />

                    {/* Selected Game Requirements & Demand Profile Banner */}
                    {selectedGame && (
                      <div className="p-2.5 rounded-xl bg-[#0e1324] border border-[#202b48] text-xs flex items-center justify-between gap-2">
                        <span className="text-zinc-300 font-medium truncate">
                          Min: {selectedGame.minimumRequirements.ramGb}GB RAM • Rec: {selectedGame.recommendedRequirements.ramGb}GB RAM
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-purple-950 text-purple-300 border border-purple-800/60 shrink-0">
                          {selectedGame.demandProfile.overallDemand} Demand
                        </span>
                      </div>
                    )}
                  </div>

                  {/* SECTION 3: Game Settings */}
                  <div id="section-game-settings" className="p-4 sm:p-5 rounded-2xl bg-[#090c17]/90 border border-[#1b233a] shadow-md space-y-4">
                    <div className="flex items-center justify-between pb-2.5 border-b border-[#1f2842]">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm md:text-base font-bold text-white flex items-center gap-2">
                          <Sliders className="w-4 h-4 text-purple-400" />
                          <span>3. Game Settings</span>
                        </h3>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-800/60 uppercase tracking-wider">
                          Resolution & Goals
                        </span>
                      </div>
                      <span className="text-[11px] text-zinc-400">Baseline & Target</span>
                    </div>

                    {/* Target Resolution */}
                    <div id="container-resolution-select">
                      <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Tv className="w-4 h-4 text-sky-400" />
                          Target Resolution
                        </span>
                        <span className="text-[11px] text-zinc-400">1080p is recommended baseline</span>
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['1080p', '1440p', '4K'] as Resolution[]).map((res) => (
                          <button
                            key={res}
                            id={`btn-resolution-${res.toLowerCase()}`}
                            type="button"
                            onClick={() => setSelectedResolution(res)}
                            className={`py-2 px-3 rounded-xl text-xs sm:text-sm font-semibold border transition-all text-center cursor-pointer ${
                              selectedResolution === res
                                ? 'bg-sky-600 text-white border-sky-500 shadow-md shadow-sky-600/30 font-bold'
                                : 'bg-[#0e1322] text-zinc-300 border-[#1f2842] hover:border-sky-500/50 hover:bg-[#13192f]'
                            }`}
                          >
                            {res}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Performance Goal Selector */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                        <Sliders className="w-3.5 h-3.5 text-purple-400" />
                        Performance Goal
                      </label>
                      <div className="grid grid-cols-3 gap-1.5">
                        {[
                          { id: 'balanced', label: 'Balanced', desc: 'Optimal Quality & FPS' },
                          { id: 'best-graphics', label: 'Best Graphics', desc: 'Visual Fidelity' },
                          { id: 'more-fps', label: 'More FPS', desc: 'High Refresh' }
                        ].map((g) => {
                          const isSelected = optimizationGoal === g.id;
                          return (
                            <button
                              key={g.id}
                              type="button"
                              id={`btn-form-goal-${g.id}`}
                              onClick={() => handleGoalChange(g.id as OptimizationGoal, targetFps, customTargetFps)}
                              className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-purple-950/80 text-white border-purple-500 shadow-sm shadow-purple-950/50'
                                  : 'bg-[#0e1322] text-zinc-400 border-[#1f2842] hover:bg-[#13192f] hover:text-zinc-200'
                              }`}
                            >
                              <span className={`block text-xs font-bold ${isSelected ? 'text-purple-300' : 'text-zinc-200'}`}>
                                {g.label}
                              </span>
                              <span className="block text-[10px] text-zinc-400 truncate mt-0.5">
                                {g.desc}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Target FPS Baseline */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                          <Gauge className="w-3.5 h-3.5 text-sky-400" />
                          Target Framerate Baseline
                        </label>
                        <span className="text-[11px] text-zinc-400">
                          {targetFps === 'any' ? 'Uncapped / Adaptive' : `${targetFps} FPS Target`}
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-1.5">
                        {(['any', 30, 60, 120] as TargetFpsOption[]).map((f) => {
                          const isSelected = targetFps === f;
                          return (
                            <button
                              key={String(f)}
                              type="button"
                              id={`btn-form-fps-${f}`}
                              onClick={() => handleGoalChange(optimizationGoal, f, customTargetFps)}
                              className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all text-center cursor-pointer whitespace-nowrap ${
                                isSelected
                                  ? 'bg-sky-600 text-white border-sky-500 shadow-sm shadow-sky-600/30'
                                  : 'bg-[#0e1322] text-zinc-400 border-[#1f2842] hover:bg-[#13192f] hover:text-zinc-200'
                              }`}
                            >
                              {f === 'any' ? 'Adaptive' : `${f} FPS`}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Real-time Configured System Snapshot */}
                    <div className="p-3 rounded-xl bg-[#090c17] border border-[#1f2842] text-xs text-zinc-400 space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-zinc-400 font-medium">Graphics:</span>
                        <span className="font-semibold text-zinc-200 truncate ml-2">
                          {activeGpu ? `${activeGpu.name} (${selectedVram || activeGpu.vram}GB)` : 'GPU not chosen'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-zinc-400 font-medium">Processor & RAM:</span>
                        <span className="font-semibold text-zinc-300 truncate ml-2">
                          {activeCpu ? activeCpu.name : 'CPU not chosen'} • {selectedRam}GB {selectedMemoryChannel || 'Dual-Channel'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#1f2842]">
                        <span className="text-zinc-400 font-medium">Selected Game:</span>
                        <span className="font-semibold text-sky-400 truncate ml-2">
                          {selectedGame ? `${selectedGame.name} @ ${selectedResolution}` : 'Game not chosen'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* =========================================================================
               PC TIER MODE: 2-COLUMN STRUCTURED LAYOUT ON DESKTOP
               ========================================================================= */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
              {/* Left Column: Device Type, Model, & Processor */}
              <div className="space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800/70">
                  <div>
                    <h3 className="text-sm md:text-base font-bold text-zinc-100 flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-indigo-400" />
                      <span>1. Device & Processor</span>
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Configure your system or select a verified computer model:
                    </p>
                  </div>
                  {/* Hardware filter mode toggle */}
                  <button
                    type="button"
                    id="btn-toggle-all-hardware-tier"
                    onClick={() => setShowAllHardware((prev) => !prev)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] transition-colors cursor-pointer shrink-0 ${
                      showAllHardware
                        ? 'bg-amber-950/60 text-amber-300 border-amber-800/80 hover:bg-amber-900/60'
                        : 'bg-zinc-950/60 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                    }`}
                    title="Toggle between filtered hardware and all hardware"
                  >
                    <Filter className="w-3 h-3" />
                    <span>{showAllHardware ? 'All' : deviceType === 'laptop' ? 'Laptop' : 'Desktop'}</span>
                  </button>
                </div>

                {/* Device Selector */}
                <div id="step-device-selection-tier">
                  <HierarchicalDeviceSelector
                    deviceType={deviceType}
                    onSelectDeviceType={handleSelectDeviceType}
                    selectedFamily={selectedFamily}
                    onSelectFamily={handleSelectFamily}
                    selectedExactModel={selectedExactModel}
                    onSelectExactModel={handleSelectExactModel}
                    selectedSku={selectedSku}
                    onSelectSku={handleSelectSku}
                    selectedDevice={selectedDevice}
                    onClearDevice={handleClearDevice}
                    isHardwareMismatch={isHardwareMismatch}
                    onRevertToFactory={handleRevertToFactory}
                    activeCpuName={activeCpu?.name}
                    activeGpuName={activeGpu?.name}
                    selectedVram={selectedVram}
                    selectedRam={selectedRam}
                  />
                </div>

                {/* CPU Selector */}
                <div>
                  <SearchableHardwareSelect
                    id="select-cpu-tier"
                    label={`2. Select CPU ${deviceType ? `• ${deviceType === 'laptop' ? 'Laptop' : 'Desktop'}` : ''}`}
                    placeholder="Select your CPU"
                    options={cpuOptions}
                    selectedId={selectedCpuId}
                    customName={customCpu?.name}
                    type="CPU"
                    onSelect={(opt) => {
                      setSelectedCpuId(opt.id);
                      setCustomCpu(null);
                      setValidationError(null);
                    }}
                    onCustomEntry={(name, tier) => {
                      setSelectedCpuId(null);
                      setCustomCpu({ name, tier });
                      setValidationError(null);
                    }}
                  />
                  <p className="text-[11px] text-zinc-400 mt-1 flex items-center justify-between">
                    <span>{cpuOptions.length} available CPUs</span>
                    {selectedCpuId === 'amd-ryzen-7-170' && (
                      <span className="text-indigo-400 font-semibold truncate ml-1">
                        Zen 3+ Mobile
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Right Column: GPU & System RAM */}
              <div className="space-y-5 lg:border-l lg:border-zinc-800/70 lg:pl-8">
                <div className="pb-3 border-b border-zinc-800/70">
                  <h3 className="text-sm md:text-base font-bold text-zinc-100 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-sky-400" />
                    <span>2. Graphics & System Memory</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Select your graphics card and memory capacity:
                  </p>
                </div>

                {/* GPU Selector */}
                <div>
                  <SearchableHardwareSelect
                    id="select-gpu-tier"
                    label={`3. Select GPU ${deviceType ? `• ${deviceType === 'laptop' ? 'Laptop' : 'Desktop'}` : ''}`}
                    placeholder="Select your GPU"
                    options={gpuOptions}
                    selectedId={selectedGpuId}
                    customName={customGpu?.name}
                    type="GPU"
                    onSelect={(opt) => {
                      setSelectedGpuId(opt.id);
                      setCustomGpu(null);
                      const found = GPUS_DATABASE.find((g) => g.id === opt.id);
                      if (found) {
                        if (found.vramVariants && found.vramVariants.length > 0) {
                          const validVrams = found.vramVariants.map((v) => v.vram);
                          if (!selectedVram || !validVrams.includes(selectedVram)) {
                            setSelectedVram(found.vramVariants[0].vram);
                          }
                        } else {
                          setSelectedVram(found.vram);
                        }
                      }
                      setValidationError(null);
                    }}
                    onCustomEntry={(name, tier) => {
                      setSelectedGpuId(null);
                      setCustomGpu({ name, tier });
                      setValidationError(null);
                    }}
                  />

                  {/* VRAM Variant Selector */}
                  {currentGpu?.vramVariants && currentGpu.vramVariants.length > 1 && (
                    <div id="container-vram-variants-tier" className="mt-2.5 p-2.5 rounded-xl bg-zinc-950/80 border border-zinc-800 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-indigo-400" />
                          VRAM Configuration:
                        </label>
                        <span className="text-[10px] text-zinc-400">
                          {currentGpu.vramVariants.length} verified configurations
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                        {currentGpu.vramVariants.map((variant) => {
                          const isSelected = (selectedVram ?? currentGpu.vram) === variant.vram;
                          return (
                            <button
                              key={variant.vram}
                              id={`btn-vram-${variant.vram}gb-tier`}
                              type="button"
                              onClick={() => {
                                setSelectedVram(variant.vram);
                                setValidationError(null);
                              }}
                              className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all flex flex-col items-center justify-center text-center cursor-pointer ${
                                isSelected
                                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm shadow-indigo-600/30'
                                  : 'bg-zinc-900 text-zinc-300 border-zinc-700/80 hover:border-zinc-600 hover:bg-zinc-800'
                              }`}
                            >
                              <div className="flex items-center gap-1">
                                <CheckCircle2 className={`w-3 h-3 ${isSelected ? 'text-white' : 'opacity-0'}`} />
                                <span>{variant.vram} GB</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Single verified VRAM badge */}
                  {currentGpu && (!currentGpu.vramVariants || currentGpu.vramVariants.length <= 1) && (
                    <div className="mt-1.5 px-2.5 py-1 rounded-lg bg-zinc-950/40 border border-zinc-800/60 flex items-center justify-between text-[11px] text-zinc-400">
                      <span className="flex items-center gap-1">
                        <Layers className="w-3 h-3 text-zinc-500" />
                        Verified VRAM:
                      </span>
                      <span className="font-semibold text-zinc-300">
                        {currentGpu.vram} GB {currentGpu.busWidthBits ? `(${currentGpu.busWidthBits}-bit)` : ''}
                      </span>
                    </div>
                  )}
                </div>

                {/* System RAM Field & Memory Channel Selector */}
                <div id="container-ram-select-tier" className="pt-2 border-t border-zinc-800/70 space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                        <HardDrive className="w-4 h-4 text-indigo-400" />
                        4. System RAM
                      </label>
                      {deviceRamSpecs && (
                        <span className="text-[11px] text-zinc-400">
                          {deviceRamSpecs.memoryType} • {deviceRamSpecs.slotsCount} Slots (Max {deviceRamSpecs.maxSupportedRamGb}GB)
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                      {([4, 8, 16, 24, 32, 64] as RamOption[]).map((gb) => {
                        const isFactory = deviceRamSpecs && gb === deviceRamSpecs.factoryRamGb;
                        const isSupportedUpgrade = deviceRamSpecs && !isFactory && deviceRamSpecs.supportedCapacities.includes(gb);
                        const isUnverified = deviceRamSpecs && gb > deviceRamSpecs.maxSupportedRamGb;

                        return (
                          <button
                            key={gb}
                            id={`btn-ram-${gb}gb-tier`}
                            type="button"
                            onClick={() => {
                              setSelectedRam(gb);
                              setValidationError(null);
                              if (deviceRamSpecs) {
                                if (deviceRamSpecs.slotsCount === 1) {
                                  setSelectedMemoryChannel('Single-Channel');
                                } else if (gb === deviceRamSpecs.factoryRamGb) {
                                  setSelectedMemoryChannel(deviceRamSpecs.factoryChannel);
                                }
                              }
                            }}
                            className={`py-2 px-1 rounded-xl border transition-all text-center cursor-pointer flex flex-col items-center justify-center min-h-[46px] ${
                              selectedRam === gb
                                ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30'
                                : 'bg-zinc-900/90 text-zinc-300 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800'
                            }`}
                          >
                            <span className="text-xs sm:text-sm font-bold">{gb} GB</span>
                            {isFactory && (
                              <span className={`text-[9px] font-semibold mt-0.5 px-1 rounded ${
                                selectedRam === gb ? 'bg-indigo-700 text-indigo-100' : 'bg-zinc-800 text-zinc-300'
                              }`}>
                                Factory
                              </span>
                            )}
                            {isSupportedUpgrade && (
                              <span className={`text-[9px] font-semibold mt-0.5 px-1 rounded ${
                                selectedRam === gb ? 'bg-emerald-700 text-emerald-100' : 'bg-emerald-950/80 text-emerald-300'
                              }`}>
                                Upgrade
                              </span>
                            )}
                            {isUnverified && (
                              <span className={`text-[9px] font-semibold mt-0.5 px-1 rounded ${
                                selectedRam === gb ? 'bg-amber-700 text-amber-100' : 'bg-amber-950/80 text-amber-300'
                              }`}>
                                Unverified
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Channel configuration buttons */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-medium text-zinc-400">Memory Channel Configuration</span>
                      {currentRamUpgrade?.moduleConfig && (
                        <span className="text-[11px] text-zinc-400 font-mono">{currentRamUpgrade.moduleConfig}</span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        id="btn-ram-channel-single-tier"
                        onClick={() => setSelectedMemoryChannel('Single-Channel')}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center cursor-pointer flex items-center justify-center gap-1.5 ${
                          selectedMemoryChannel === 'Single-Channel'
                            ? 'bg-zinc-800 text-white border-zinc-600 shadow-sm'
                            : 'bg-zinc-900/60 text-zinc-400 border-zinc-800/80 hover:bg-zinc-800/50 hover:text-zinc-200'
                        }`}
                      >
                        <span>Single-Channel</span>
                        <span className="text-[10px] text-zinc-400 font-normal">(1 Module)</span>
                      </button>

                      <button
                        type="button"
                        id="btn-ram-channel-dual-tier"
                        disabled={deviceRamSpecs?.slotsCount === 1}
                        onClick={() => setSelectedMemoryChannel('Dual-Channel')}
                        className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center flex items-center justify-center gap-1.5 ${
                          deviceRamSpecs?.slotsCount === 1
                            ? 'opacity-40 cursor-not-allowed bg-zinc-950 border-zinc-900 text-zinc-600'
                            : selectedMemoryChannel === 'Dual-Channel'
                            ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30 cursor-pointer'
                            : 'bg-zinc-900/60 text-zinc-400 border-zinc-800/80 hover:bg-zinc-800/50 hover:text-zinc-200 cursor-pointer'
                        }`}
                      >
                        <span>Dual-Channel</span>
                        <span className="text-[10px] font-normal opacity-80">(2 Modules)</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Validation Error Message */}
          {validationError && (
            <div
              id="validation-error-alert"
              className="p-3.5 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 text-sm flex items-center gap-2.5"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Mismatch Warning Alert if user customized hardware away from model default */}
          {activeTab === 'tier' && isHardwareMismatch && selectedDevice && (
            <div
              id="form-hardware-mismatch-warning"
              className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-600/60 text-amber-200 text-xs flex items-start gap-2.5 animate-in fade-in duration-200"
            >
              <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <span className="font-bold text-amber-300 block">
                  Custom Hardware Notice
                </span>
                <span>
                  Your custom hardware configuration differs from the selected device model ({selectedDevice.name}), so the result is based partly on your manually entered hardware.
                </span>
              </div>
            </div>
          )}

          {/* =========================================================================
              Primary Action Button: CHECK MY PC vs CHECK MY PC TIER
              ========================================================================= */}
          <div className="pt-2">
            {activeTab === 'checker' ? (
              <button
                id="btn-check-my-pc"
                type="button"
                onClick={handleCheckMyPc}
                className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-500 hover:from-violet-500 hover:via-indigo-500 hover:to-sky-400 text-white font-extrabold text-base md:text-lg tracking-wider uppercase shadow-[0_0_25px_-5px_rgba(168,85,247,0.4)] border border-purple-400/30 transition-all transform active:scale-[0.99] flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <span>CHECK MY PC</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                id="btn-check-my-pc-tier"
                type="button"
                onClick={handleCheckPcTier}
                className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-500 hover:from-violet-500 hover:via-indigo-500 hover:to-sky-400 text-white font-extrabold text-base md:text-lg tracking-wider uppercase shadow-[0_0_25px_-5px_rgba(168,85,247,0.4)] border border-purple-400/30 transition-all transform active:scale-[0.99] flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <span>CHECK MY PC TIER</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
        )}

        {/* SECTION 4: Performance / Results for Game Checker */}
        <div ref={resultsRef} id="section-performance-results">
          {activeTab === 'checker' && result && activeGpu && activeCpu && selectedGame ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <Gauge className="w-5 h-5 text-sky-400" />
                    <span>4. Performance / Results</span>
                  </h3>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-sky-950/80 text-sky-300 border border-sky-800/60 uppercase tracking-wider">
                    Evaluation Complete
                  </span>
                </div>
              </div>
              <ResultSection
                result={result}
                gpu={activeGpu}
                cpu={activeCpu}
                ram={selectedRam}
                game={selectedGame}
                resolution={selectedResolution}
                deviceType={deviceType}
                currentGoal={optimizationGoal}
                currentTargetFps={targetFps}
                customTargetFps={customTargetFps}
                onGoalChange={handleGoalChange}
                onResetOrChange={() => {
                  checkerFormRef.current?.scrollIntoView({ behavior: 'smooth' });
                }}
                onClose={handleCloseGameResults}
              />
            </div>
          ) : activeTab === 'checker' && !result ? (
            <div className="p-6 rounded-2xl bg-[#090c17]/80 border border-[#1b233a] shadow-xl backdrop-blur-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#1b233a]">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Gauge className="w-5 h-5 text-purple-400" />
                    <span>4. Performance / Results</span>
                  </h3>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-800/60 uppercase tracking-wider">
                    Ready to Evaluate
                  </span>
                </div>
                <span className="text-xs text-zinc-400">Click &quot;CHECK MY PC&quot; above to calculate</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#0d101e] border border-[#1d243b]">
                  <span className="text-[11px] text-zinc-400 block mb-1">Configured System</span>
                  <p className="font-semibold text-zinc-200 truncate">
                    {activeGpu ? activeGpu.name : 'Choose GPU'}
                  </p>
                  <p className="text-zinc-400 text-[11px] truncate">
                    {activeCpu ? activeCpu.name : 'Choose CPU'} • {selectedRam}GB {selectedMemoryChannel || 'Dual-Channel'}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-[#0d101e] border border-[#1d243b]">
                  <span className="text-[11px] text-zinc-400 block mb-1">Target Title</span>
                  <p className="font-semibold text-sky-400 truncate">
                    {selectedGame ? selectedGame.name : 'Choose Game'}
                  </p>
                  <p className="text-zinc-400 text-[11px]">
                    Display Resolution: <span className="text-zinc-200 font-medium">{selectedResolution}</span>
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-[#0d101e] border border-[#1d243b]">
                  <span className="text-[11px] text-zinc-400 block mb-1">Optimization Goal</span>
                  <p className="font-semibold text-purple-400 capitalize">
                    {optimizationGoal.replace('-', ' ')}
                  </p>
                  <p className="text-zinc-400 text-[11px]">
                    Framerate Target: <span className="text-zinc-200 font-medium">{targetFps === 'any' ? 'Adaptive' : `${targetFps} FPS`}</span>
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Results Area for PC Tier */}
        <div ref={tierResultsRef}>
          {activeTab === 'tier' && tierResult && (
            <PcTierSection
              result={tierResult}
              onClose={handleCloseTierResults}
              onAdjust={() => {
                checkerFormRef.current?.scrollIntoView({ behavior: 'smooth' });
              }}
            />
          )}
        </div>

        {/* Tab 3: FPS Diagnostic ("Why Am I Getting This FPS?") */}
        {activeTab === 'diagnostic' && (
          <FpsDiagnosticSection
            activeGpuName={activeGpu?.name}
            activeCpuName={activeCpu?.name}
            activeRamGb={selectedRam || undefined}
            activeVramGb={selectedVram || activeGpu?.vram || undefined}
            activeMemoryChannel={selectedMemoryChannel}
            activeGame={selectedGame}
            activeResolution={selectedResolution}
            isLaptop={deviceType === 'laptop'}
            laptopModelName={selectedDevice?.name}
            deviceTgpWatts={selectedDevice?.gpuTgpWatts}
          />
        )}

        {/* Tab: Benchmark Rating ("Is My PC Performing Normally?") */}
        {activeTab === 'rating' && (
          <BenchmarkRatingSection
            initialDeviceType={deviceType}
            initialDevice={selectedDevice}
            initialGpuId={selectedGpuId}
            initialCpuId={selectedCpuId}
            initialRam={selectedRam}
            initialVram={selectedVram}
            initialMemoryChannel={selectedMemoryChannel}
            initialGame={selectedGame}
            initialResolution={selectedResolution}
          />
        )}

        {/* Tab 4: Exact Laptop Reality */}
        {activeTab === 'laptop' && (
          <LaptopRealitySection
            currentDevice={selectedDevice}
            onSelectDevice={(device) => {
              setSelectedDevice(device);
              setDeviceType('laptop');
              setSelectedGpuId(device.defaultGpuId);
              setSelectedVram(device.defaultVram);
              setSelectedCpuId(device.defaultCpuId);
              setSelectedRam(device.defaultRam);
              setSelectedMemoryChannel(device.defaultChannel || 'Single-Channel');
              setCustomGpu(null);
              setCustomCpu(null);
            }}
          />
        )}
      </main>

      {/* Clean Footer with Widescreen Alignment */}
      <footer className="max-w-7xl 2xl:max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 pt-16 text-center text-xs text-zinc-400 border-t border-[#1b2238] mt-16 space-y-1">
        <p>
          <strong className="text-zinc-200">PC Gaming Helper</strong> • Simple, honest hardware guidance for PC gamers.
        </p>
        <p className="text-zinc-400">
          Estimates are rule-based recommendations. Real in-game frame rates depend on thermal conditions, background tasks, and game updates.
        </p>
      </footer>
    </div>
  );
}
