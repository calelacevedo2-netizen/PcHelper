import React, { useState, useId, useMemo } from 'react';
import {
  Upload,
  CheckCircle2,
  AlertTriangle,
  Info,
  Laptop,
  Monitor,
  Cpu,
  Layers,
  HardDrive,
  Gamepad2,
  Tv,
  Sliders,
  Sparkles,
  Search,
  Check,
  RotateCcw,
  Zap,
  Activity,
  ArrowRight
} from 'lucide-react';
import { GPUS_DATABASE } from '../data/gpus';
import { CPUS_DATABASE } from '../data/cpus';
import { GAMES_DATABASE } from '../data/games';
import { DEVICES_DATABASE } from '../data/devices';
import {
  DeviceType,
  DeviceModel,
  Resolution,
  MemoryChannel,
  Game,
  GPU,
  CPU as CPUType
} from '../types';
import { saveUserBenchmark, BenchmarkSample } from '../data/benchmarkStore';

interface SubmitBenchmarkSectionProps {
  initialDeviceType?: DeviceType | null;
  initialDevice?: DeviceModel | null;
  initialGpuId?: string | null;
  initialCpuId?: string | null;
  initialRam?: number | null;
  initialVram?: number | null;
  initialMemoryChannel?: MemoryChannel;
  initialGame?: Game | null;
  initialResolution?: Resolution;
  onBenchmarkSubmitted?: (sample: BenchmarkSample) => void;
  onNavigateToRating?: () => void;
}

export const SubmitBenchmarkSection: React.FC<SubmitBenchmarkSectionProps> = ({
  initialDeviceType,
  initialDevice,
  initialGpuId,
  initialCpuId,
  initialRam,
  initialVram,
  initialMemoryChannel,
  initialGame,
  initialResolution,
  onBenchmarkSubmitted,
  onNavigateToRating
}) => {
  const avgFpsInputId = useId();
  const low1PctInputId = useId();
  const notesInputId = useId();

  // 1. Hardware State
  const [deviceType, setDeviceType] = useState<DeviceType>(initialDeviceType || 'desktop');
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>(initialDevice?.id || '');
  const [gpuId, setGpuId] = useState<string>(initialGpuId || 'rtx-3060');
  const [cpuId, setCpuId] = useState<string>(initialCpuId || 'amd-ryzen-7-5700x');
  const [vramGb, setVramGb] = useState<number>(initialVram || 12);
  const [tgpWatts, setTgpWatts] = useState<string>(initialDevice?.gpuTgpWatts || '');
  const [ramGb, setRamGb] = useState<number>(initialRam || 16);
  const [ramSpeedMhz, setRamSpeedMhz] = useState<string>('3200');
  const [memoryChannel, setMemoryChannel] = useState<MemoryChannel>(initialMemoryChannel || 'Dual-Channel');

  // Search states for dropdowns
  const [gameSearch, setGameSearch] = useState('');
  const [isGameDropdownOpen, setIsGameDropdownOpen] = useState(false);
  const [selectedGameId, setSelectedGameId] = useState<string>(initialGame?.id || 'cyberpunk-2077');

  // 2. Settings State
  const [resolution, setResolution] = useState<Resolution>(initialResolution || '1080p');
  const [preset, setPreset] = useState<'Low' | 'Medium' | 'High' | 'Ultra'>('High');
  const [upscalingMethod, setUpscalingMethod] = useState<'None' | 'DLSS' | 'FSR' | 'XeSS'>('None');
  const [upscalingMode, setUpscalingMode] = useState<string>('Quality');
  const [rayTracing, setRayTracing] = useState<boolean>(false);
  const [frameGeneration, setFrameGeneration] = useState<boolean>(false);

  // 3. Measurements
  const [avgFps, setAvgFps] = useState<string>('');
  const [low1PercentFps, setLow1PercentFps] = useState<string>('');

  // 4. Optional Telemetry
  const [showTelemetry, setShowTelemetry] = useState(false);
  const [gpuUsage, setGpuUsage] = useState<string>('');
  const [cpuUsage, setCpuUsage] = useState<string>('');
  const [ramUsage, setRamUsage] = useState<string>('');
  const [vramUsage, setVramUsage] = useState<string>('');
  const [gpuTemp, setGpuTemp] = useState<string>('');
  const [cpuTemp, setCpuTemp] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // Feedback states
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedSample, setSubmittedSample] = useState<BenchmarkSample | null>(null);

  const selectedGame = useMemo(() => {
    return GAMES_DATABASE.find((g) => g.id === selectedGameId) || GAMES_DATABASE[0];
  }, [selectedGameId]);

  const selectedGpu = useMemo(() => {
    return GPUS_DATABASE.find((g) => g.id === gpuId);
  }, [gpuId]);

  const selectedCpu = useMemo(() => {
    return CPUS_DATABASE.find((c) => c.id === cpuId);
  }, [cpuId]);

  const selectedDevice = useMemo(() => {
    return DEVICES_DATABASE.find((d) => d.id === selectedDeviceId);
  }, [selectedDeviceId]);

  // When GPU changes, auto-set default VRAM
  const handleGpuChange = (newGpuId: string) => {
    setGpuId(newGpuId);
    const g = GPUS_DATABASE.find((item) => item.id === newGpuId);
    if (g) {
      setVramGb(g.vram);
    }
  };

  // High FPS advisory warning
  const parsedAvgFps = parseFloat(avgFps);
  const isUnusuallyHigh = !isNaN(parsedAvgFps) && parsedAvgFps >= 300;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanAvg = parseFloat(avgFps);
    if (isNaN(cleanAvg) || cleanAvg <= 0) {
      setErrorMessage('Please enter a valid Average FPS greater than 0.');
      return;
    }

    let cleanLow: number | undefined = undefined;
    if (low1PercentFps.trim()) {
      const parsedLow = parseFloat(low1PercentFps);
      if (isNaN(parsedLow) || parsedLow <= 0) {
        setErrorMessage('1% Low FPS must be a positive number if provided, or leave it blank.');
        return;
      }
      cleanLow = parsedLow;
    }

    const sample = saveUserBenchmark({
      deviceType,
      deviceModelId: selectedDeviceId || undefined,
      deviceModelName: selectedDevice ? selectedDevice.name : undefined,
      gpuId: gpuId,
      gpuName: selectedGpu ? selectedGpu.name : gpuId,
      vramGb,
      tgpWatts: tgpWatts.trim() ? tgpWatts : undefined,
      cpuId: cpuId,
      cpuName: selectedCpu ? selectedCpu.name : cpuId,
      ramGb,
      ramSpeedMhz: ramSpeedMhz ? parseInt(ramSpeedMhz, 10) : undefined,
      memoryChannel,
      gameId: selectedGame.id,
      gameName: selectedGame.name,
      resolution,
      preset,
      upscaling: upscalingMethod === 'None' ? 'Native / Off' : `${upscalingMethod} ${upscalingMode}`,
      rayTracing,
      frameGeneration,
      avgFps: cleanAvg,
      low1PercentFps: cleanLow,
      gpuUsagePercent: gpuUsage ? parseFloat(gpuUsage) : undefined,
      cpuUsagePercent: cpuUsage ? parseFloat(cpuUsage) : undefined,
      ramUsageGb: ramUsage ? parseFloat(ramUsage) : undefined,
      vramUsageGb: vramUsage ? parseFloat(vramUsage) : undefined,
      gpuTempC: gpuTemp ? parseFloat(gpuTemp) : undefined,
      cpuTempC: cpuTemp ? parseFloat(cpuTemp) : undefined,
      notes: notes.trim() ? notes : undefined
    });

    setSubmittedSample(sample);
    if (onBenchmarkSubmitted) {
      onBenchmarkSubmitted(sample);
    }
  };

  const handleReset = () => {
    setSubmittedSample(null);
    setAvgFps('');
    setLow1PercentFps('');
    setNotes('');
    setErrorMessage(null);
  };

  return (
    <div className="w-full space-y-6" id="submit-benchmark-section">
      {/* Header Banner */}
      <div className="p-5 md:p-6 rounded-2xl bg-[#090c17]/90 border border-[#1f2842] shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-purple-950/80 text-purple-300 border border-purple-800/60">
                <Upload className="w-5 h-5 text-purple-400" />
              </span>
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                Submit My Benchmark
              </h2>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 uppercase">
                Real-World Data
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400">
              Contribute your actual in-game performance measurements to PC Gaming Helper's crowd-sourced and verified database.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onNavigateToRating && (
              <button
                type="button"
                onClick={onNavigateToRating}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Activity className="w-3.5 h-3.5 text-indigo-400" />
                <span>Rate My Performance</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation State if just submitted */}
      {submittedSample ? (
        <div className="p-6 md:p-8 rounded-2xl bg-emerald-950/20 border border-emerald-500/40 text-center space-y-4 shadow-xl">
          <div className="w-14 h-14 rounded-full bg-emerald-950/80 border border-emerald-500/60 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <div className="space-y-1 max-w-lg mx-auto">
            <h3 className="text-xl font-bold text-white">
              Benchmark Successfully Contributed!
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300">
              Your measured result of <strong className="text-emerald-300 font-mono text-base">{submittedSample.avgFps} FPS</strong>
              {submittedSample.low1PercentFps ? <> (1% Low: <strong className="text-emerald-400 font-mono">{submittedSample.low1PercentFps} FPS</strong>)</> : ''} for{' '}
              <strong className="text-white">{submittedSample.gameName}</strong> has been structured and added to the community benchmark store.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-zinc-800 max-w-md mx-auto text-left text-xs space-y-1 text-zinc-300">
            <div className="flex justify-between">
              <span className="text-zinc-500">Hardware:</span>
              <span className="font-semibold text-zinc-200">{submittedSample.gpuName} • {submittedSample.cpuName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Settings:</span>
              <span>{submittedSample.resolution} • {submittedSample.preset} Preset</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Memory:</span>
              <span>{submittedSample.ramGb}GB {submittedSample.memoryChannel}</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-zinc-800 text-[11px]">
              <span className="text-zinc-500">Submission ID:</span>
              <span className="font-mono text-zinc-400">{submittedSample.id}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Submit Another Benchmark</span>
            </button>
            {onNavigateToRating && (
              <button
                type="button"
                onClick={onNavigateToRating}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors flex items-center gap-1.5 cursor-pointer shadow-lg shadow-indigo-600/30"
              >
                <span>Check If Result Is Typical</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Submission Form */
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: System Hardware */}
          <div className="p-5 md:p-6 rounded-2xl bg-[#0c0f1d]/90 border border-[#1b233a] shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1f2842]">
              <h3 className="text-sm md:text-base font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-purple-400" />
                <span>1. Test System Specifications</span>
              </h3>
              {/* Device Type Toggle */}
              <div className="flex items-center gap-1 p-1 bg-zinc-950 rounded-lg border border-zinc-800 text-xs">
                <button
                  type="button"
                  onClick={() => setDeviceType('desktop')}
                  className={`px-2.5 py-1 rounded font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                    deviceType === 'desktop'
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Monitor className="w-3.5 h-3.5" />
                  Desktop
                </button>
                <button
                  type="button"
                  onClick={() => setDeviceType('laptop')}
                  className={`px-2.5 py-1 rounded font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                    deviceType === 'laptop'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <Laptop className="w-3.5 h-3.5" />
                  Laptop
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* GPU Selector */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Graphics Card (GPU)
                </label>
                <select
                  value={gpuId}
                  onChange={(e) => handleGpuChange(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 text-zinc-100 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
                >
                  {GPUS_DATABASE.filter((g) => (deviceType === 'laptop' ? g.type === 'laptop' : g.type === 'desktop')).map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name} ({g.vram}GB)
                    </option>
                  ))}
                </select>
              </div>

              {/* CPU Selector */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Processor (CPU)
                </label>
                <select
                  value={cpuId}
                  onChange={(e) => setCpuId(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 text-zinc-100 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
                >
                  {CPUS_DATABASE.filter((c) => (deviceType === 'laptop' ? c.type === 'laptop' : c.type === 'desktop')).map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* RAM Capacity */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  RAM Capacity
                </label>
                <select
                  value={ramGb}
                  onChange={(e) => setRamGb(parseInt(e.target.value, 10))}
                  className="w-full bg-zinc-900 border border-zinc-700 text-zinc-100 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
                >
                  {[4, 8, 12, 16, 24, 32, 64].map((gb) => (
                    <option key={gb} value={gb}>
                      {gb} GB System RAM
                    </option>
                  ))}
                </select>
              </div>

              {/* Memory Channel */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Memory Channel
                </label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setMemoryChannel('Single-Channel')}
                    className={`py-2 px-2 rounded-lg text-xs font-semibold border transition-all text-center cursor-pointer ${
                      memoryChannel === 'Single-Channel'
                        ? 'bg-zinc-800 text-white border-zinc-600'
                        : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                    }`}
                  >
                    Single (1 Stick)
                  </button>
                  <button
                    type="button"
                    onClick={() => setMemoryChannel('Dual-Channel')}
                    className={`py-2 px-2 rounded-lg text-xs font-semibold border transition-all text-center cursor-pointer ${
                      memoryChannel === 'Dual-Channel'
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                        : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                    }`}
                  >
                    Dual (2 Sticks)
                  </button>
                </div>
              </div>
            </div>

            {/* Optional Mobile TGP & Exact Model */}
            {deviceType === 'laptop' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#1f2842]/60">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    Laptop Model (Optional)
                  </label>
                  <select
                    value={selectedDeviceId}
                    onChange={(e) => {
                      setSelectedDeviceId(e.target.value);
                      const dev = DEVICES_DATABASE.find((d) => d.id === e.target.value);
                      if (dev && dev.gpuTgpWatts) {
                        setTgpWatts(dev.gpuTgpWatts);
                      }
                    }}
                    className="w-full bg-zinc-900 border border-zinc-700 text-zinc-100 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
                  >
                    <option value="">Custom / Not Listed</option>
                    {DEVICES_DATABASE.filter((d) => d.type === 'laptop').map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.gpuTgpWatts || 'Standard TGP'})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">
                    GPU Power / TGP (Optional)
                  </label>
                  <input
                    type="text"
                    value={tgpWatts}
                    onChange={(e) => setTgpWatts(e.target.value)}
                    placeholder="e.g. 75W, 140W Max-P"
                    className="w-full bg-zinc-900 border border-zinc-700 text-zinc-100 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Game & Graphics Settings */}
          <div className="p-5 md:p-6 rounded-2xl bg-[#0c0f1d]/90 border border-[#1b233a] shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1f2842]">
              <h3 className="text-sm md:text-base font-bold text-white flex items-center gap-2">
                <Gamepad2 className="w-4 h-4 text-sky-400" />
                <span>2. Game & Test Conditions</span>
              </h3>
              <span className="text-xs text-zinc-400">Match your in-game settings</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Game Selector */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Tested Game
                </label>
                <select
                  value={selectedGameId}
                  onChange={(e) => setSelectedGameId(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-700 text-zinc-100 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
                >
                  {GAMES_DATABASE.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Resolution */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Render Resolution
                </label>
                <div className="grid grid-cols-3 gap-1">
                  {(['1080p', '1440p', '4K'] as Resolution[]).map((res) => (
                    <button
                      key={res}
                      type="button"
                      onClick={() => setResolution(res)}
                      className={`py-2 px-1 text-xs font-semibold rounded-lg border text-center transition-all cursor-pointer ${
                        resolution === res
                          ? 'bg-sky-600 text-white border-sky-500 shadow-sm'
                          : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                      }`}
                    >
                      {res}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preset */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Graphics Preset
                </label>
                <div className="grid grid-cols-4 gap-1">
                  {(['Low', 'Medium', 'High', 'Ultra'] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPreset(p)}
                      className={`py-2 px-1 text-xs font-semibold rounded-lg border text-center transition-all cursor-pointer ${
                        preset === p
                          ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                          : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Upscaling */}
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Upscaling
                </label>
                <select
                  value={upscalingMethod}
                  onChange={(e) => setUpscalingMethod(e.target.value as any)}
                  className="w-full bg-zinc-900 border border-zinc-700 text-zinc-100 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
                >
                  <option value="None">Native Rendering (Off)</option>
                  <option value="DLSS">NVIDIA DLSS</option>
                  <option value="FSR">AMD FSR</option>
                  <option value="XeSS">Intel XeSS</option>
                </select>
              </div>
            </div>

            {/* RT & Frame Gen Toggles */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <label className="flex items-center gap-2 text-xs font-medium text-zinc-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rayTracing}
                  onChange={(e) => setRayTracing(e.target.checked)}
                  className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-indigo-600 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <span>Ray Tracing Enabled</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-medium text-zinc-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={frameGeneration}
                  onChange={(e) => setFrameGeneration(e.target.checked)}
                  className="w-4 h-4 rounded border-zinc-700 bg-zinc-900 text-purple-600 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <span>Frame Generation Enabled</span>
              </label>
            </div>
          </div>

          {/* Section 3: Measured Performance */}
          <div className="p-5 md:p-6 rounded-2xl bg-[#0c0f1d]/90 border border-[#1b233a] shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1f2842]">
              <h3 className="text-sm md:text-base font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>3. Measured Framerate Results</span>
              </h3>
              <span className="text-xs text-zinc-400">Measured during gameplay</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Average FPS (Required) */}
              <div className="p-4 rounded-xl bg-zinc-900/90 border border-emerald-500/40 space-y-1.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <label htmlFor={avgFpsInputId} className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                    Average FPS <span className="text-rose-400">*</span>
                  </label>
                  <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800/50">
                    REQUIRED
                  </span>
                </div>
                <input
                  id={avgFpsInputId}
                  type="number"
                  step="0.1"
                  min="1"
                  max="2000"
                  value={avgFps}
                  onChange={(e) => setAvgFps(e.target.value)}
                  placeholder="e.g. 58.4"
                  className="w-full bg-[#080b15] border border-zinc-700 text-zinc-100 font-mono text-xl sm:text-2xl px-3 py-2 rounded-lg focus:outline-none focus:border-emerald-500"
                  required
                />
                <p className="text-[11px] text-zinc-400">
                  Overall average framerate recorded by MSI Afterburner, CapFrameX, Steam overlay, or in-game benchmark tool.
                </p>
              </div>

              {/* 1% Low FPS (Optional) */}
              <div className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-700/80 space-y-1.5 shadow-sm">
                <div className="flex items-center justify-between">
                  <label htmlFor={low1PctInputId} className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                    1% Low FPS
                  </label>
                  <span className="text-[10px] text-zinc-400 bg-zinc-800 px-1.5 py-0.5 rounded border border-zinc-700">
                    OPTIONAL — Leave blank if unknown
                  </span>
                </div>
                <input
                  id={low1PctInputId}
                  type="number"
                  step="0.1"
                  min="1"
                  max="2000"
                  value={low1PercentFps}
                  onChange={(e) => setLow1PercentFps(e.target.value)}
                  placeholder="e.g. 42.1 (Optional)"
                  className="w-full bg-[#080b15] border border-zinc-700 text-zinc-100 font-mono text-xl sm:text-2xl px-3 py-2 rounded-lg focus:outline-none focus:border-indigo-500"
                />
                <p className="text-[11px] text-zinc-400">
                  Never guess your 1% low. If your monitoring overlay didn't record it, leave this field completely empty.
                </p>
              </div>
            </div>

            {/* High FPS Non-blocking Advisory Warning */}
            {isUnusuallyHigh && (
              <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/50 text-xs text-amber-200 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-bold text-amber-300 block">
                    Unusually High Framerate Detected ({parsedAvgFps} FPS)
                  </span>
                  <span>
                    This result is unusually high for the selected configuration. Please verify that this was measured during active 3D gameplay rather than static loading screens, cutscenes, or main menu loops. If verified, you may proceed with submission.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Optional Detailed Telemetry & Notes */}
          <div className="p-4 rounded-xl bg-[#090c17]/70 border border-[#1f2842] space-y-3">
            <button
              type="button"
              onClick={() => setShowTelemetry(!showTelemetry)}
              className="w-full flex items-center justify-between text-xs font-semibold text-zinc-300 hover:text-white transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                <span>Additional Telemetry & Notes (Optional)</span>
              </span>
              <span className="text-[11px] text-indigo-400">
                {showTelemetry ? 'Hide Details' : 'Show Details'}
              </span>
            </button>

            {showTelemetry && (
              <div className="pt-2 border-t border-[#1f2842] space-y-3 animate-in fade-in duration-150">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label className="text-zinc-400 block mb-1">GPU Usage (%)</label>
                    <input
                      type="number"
                      placeholder="e.g. 98"
                      value={gpuUsage}
                      onChange={(e) => setGpuUsage(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 text-zinc-100 rounded px-2.5 py-1.5 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-400 block mb-1">CPU Usage (%)</label>
                    <input
                      type="number"
                      placeholder="e.g. 45"
                      value={cpuUsage}
                      onChange={(e) => setCpuUsage(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 text-zinc-100 rounded px-2.5 py-1.5 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-400 block mb-1">GPU Temp (°C)</label>
                    <input
                      type="number"
                      placeholder="e.g. 72"
                      value={gpuTemp}
                      onChange={(e) => setGpuTemp(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 text-zinc-100 rounded px-2.5 py-1.5 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-zinc-400 block mb-1">CPU Temp (°C)</label>
                    <input
                      type="number"
                      placeholder="e.g. 78"
                      value={cpuTemp}
                      onChange={(e) => setCpuTemp(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-700 text-zinc-100 rounded px-2.5 py-1.5 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor={notesInputId} className="text-xs text-zinc-400 block mb-1">
                    Benchmark Scene / Methodology Notes
                  </label>
                  <input
                    id={notesInputId}
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Built-in benchmark tool, City center driving route, DX12..."
                    className="w-full bg-zinc-900 border border-zinc-700 text-zinc-100 rounded-lg px-3 py-2 text-xs focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Validation Error Banner */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500 text-xs text-rose-200 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Submit Action */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              className="px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-600 hover:from-purple-500 hover:to-sky-500 text-white shadow-xl shadow-indigo-600/30 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Upload className="w-4 h-4" />
              <span>Submit Benchmark to Database</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
