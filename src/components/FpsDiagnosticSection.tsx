import React, { useState, useId, useRef, useEffect, useMemo } from 'react';
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Gauge,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Zap,
  ArrowRight,
  Monitor,
  Flame,
  Check,
  Search,
  X,
  Cpu,
  Microchip,
  Layers,
  HardDrive,
  Sliders,
  Thermometer
} from 'lucide-react';
import { GAMES_DATABASE } from '../data/games';
import {
  FpsDiagnosticInput,
  FpsDiagnosticResult,
  StutteringLevel,
  MemoryChannel,
  Game,
  Resolution
} from '../types';
import { evaluateFpsDiagnostic } from '../logic/fpsDiagnosticEvaluator';

interface FpsDiagnosticSectionProps {
  // Pre-fill hardware context from active app configuration
  activeGpuName?: string;
  activeCpuName?: string;
  activeRamGb?: number;
  activeVramGb?: number;
  activeMemoryChannel?: MemoryChannel;
  activeGame?: Game | null;
  activeResolution?: Resolution;
  isLaptop?: boolean;
  laptopModelName?: string;
  deviceTgpWatts?: string;
}

export const FpsDiagnosticSection: React.FC<FpsDiagnosticSectionProps> = ({
  activeGpuName,
  activeCpuName,
  activeRamGb,
  activeVramGb,
  activeMemoryChannel,
  activeGame,
  activeResolution,
  isLaptop,
  laptopModelName,
  deviceTgpWatts
}) => {
  // Unique input IDs
  const customGameInputId = useId();
  const actualFpsInputId = useId();
  const targetFpsInputId = useId();
  const gpuUsageInputId = useId();
  const cpuUsageInputId = useId();
  const vramUsageInputId = useId();
  const ramUsageInputId = useId();
  const tempInputId = useId();
  const low1PctInputId = useId();

  // --------------------------------------------------------------------------
  // PRIMARY INPUTS (The 4 core inputs)
  // 1. Game
  // 2. Resolution
  // 3. Graphics Settings
  // 4. Actual FPS
  // --------------------------------------------------------------------------
  const [selectedGameId, setSelectedGameId] = useState<string>(activeGame?.id || 'cyberpunk-2077');
  const [gameSearchQuery, setGameSearchQuery] = useState<string>(() => {
    const initialGame = GAMES_DATABASE.find(g => g.id === (activeGame?.id || 'cyberpunk-2077'));
    return initialGame?.name || 'Cyberpunk 2077';
  });
  const [isGameDropdownOpen, setIsGameDropdownOpen] = useState<boolean>(false);
  const gameComboboxRef = useRef<HTMLDivElement>(null);
  const [customGameName, setCustomGameName] = useState<string>('');
  const [useCustomGame, setUseCustomGame] = useState<boolean>(false);

  const [resolution, setResolution] = useState<string>(activeResolution || '1080p');
  const [preset, setPreset] = useState<'Low' | 'Medium' | 'High' | 'Ultra' | 'Custom'>('High');
  const [actualFps, setActualFps] = useState<string>('42');

  // --------------------------------------------------------------------------
  // ADVANCED INFORMATION (Optional Expandable Section)
  // GPU Usage, CPU Usage, RAM Usage, VRAM Usage, 1% Low FPS, Temperatures,
  // Target FPS, Stuttering/Freezing
  // --------------------------------------------------------------------------
  const [isAdvancedOpen, setIsAdvancedOpen] = useState<boolean>(false);
  const [targetFps, setTargetFps] = useState<string>('60');
  const [gpuUsage, setGpuUsage] = useState<string>('99');
  const [cpuUsage, setCpuUsage] = useState<string>('45');
  const [ramUsage, setRamUsage] = useState<string>('');
  const [vramUsage, setVramUsage] = useState<string>('');
  const [temperature, setTemperature] = useState<string>('');
  const [low1Pct, setLow1Pct] = useState<string>('');
  const [stutteringLevel, setStutteringLevel] = useState<StutteringLevel>('minor');

  // UI state
  const [isDiagnosing, setIsDiagnosing] = useState<boolean>(false);
  const [showAdditionalNotes, setShowAdditionalNotes] = useState<boolean>(false);

  // Close game search dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (gameComboboxRef.current && !gameComboboxRef.current.contains(event.target as Node)) {
        setIsGameDropdownOpen(false);
        const currentSelected = GAMES_DATABASE.find(g => g.id === selectedGameId);
        if (currentSelected && !useCustomGame) {
          setGameSearchQuery(currentSelected.name);
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selectedGameId, useCustomGame]);

  // Filtered games for autocomplete
  const filteredDatabaseGames = useMemo(() => {
    const q = gameSearchQuery.trim().toLowerCase();
    if (!q) return GAMES_DATABASE;
    return GAMES_DATABASE.filter(g =>
      g.name.toLowerCase().includes(q) ||
      (g.category && g.category.toLowerCase().includes(q))
    );
  }, [gameSearchQuery]);

  // Count active advanced options to show a subtle badge on the expandable toggle
  const activeAdvancedCount = useMemo(() => {
    let count = 0;
    if (gpuUsage.trim()) count++;
    if (cpuUsage.trim()) count++;
    if (ramUsage.trim()) count++;
    if (vramUsage.trim()) count++;
    if (temperature.trim()) count++;
    if (targetFps.trim() && targetFps !== '60') count++;
    if (low1Pct.trim()) count++;
    if (stutteringLevel && stutteringLevel !== 'none') count++;
    return count;
  }, [gpuUsage, cpuUsage, ramUsage, vramUsage, temperature, targetFps, low1Pct, stutteringLevel]);

  // Initial Diagnostic Result
  const [diagnosticResult, setDiagnosticResult] = useState<FpsDiagnosticResult>(() => {
    return evaluateFpsDiagnostic({
      gameName: activeGame?.name || 'Cyberpunk 2077',
      gameId: activeGame?.id || 'cyberpunk-2077',
      resolution: activeResolution || '1080p',
      graphicsPreset: 'High',
      actualFps: 42,
      targetFps: 60,
      gpuUsagePercent: 99,
      cpuUsagePercent: 45,
      stutteringLevel: 'minor',
      gpuName: activeGpuName,
      cpuName: activeCpuName,
      totalRamGb: activeRamGb,
      totalVramGb: activeVramGb,
      memoryChannel: activeMemoryChannel,
      isLaptop,
      laptopModelName,
      deviceTgpWatts
    });
  });

  // Run diagnosis handler
  const handleRunDiagnosis = (e?: React.FormEvent) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    const fpsNum = parseFloat(actualFps);
    const validFps = !isNaN(fpsNum) && fpsNum > 0 ? fpsNum : 45;
    if (isNaN(fpsNum) || fpsNum <= 0) {
      setActualFps(String(validFps));
    }

    setIsDiagnosing(true);

    const gameName = useCustomGame && customGameName.trim()
      ? customGameName.trim()
      : GAMES_DATABASE.find(g => g.id === selectedGameId)?.name || 'Custom Game';

    const input: FpsDiagnosticInput = {
      gameName,
      gameId: useCustomGame ? undefined : selectedGameId,
      resolution,
      graphicsPreset: preset,
      actualFps: validFps,
      targetFps: targetFps.trim() ? parseFloat(targetFps) : undefined,
      gpuUsagePercent: gpuUsage.trim() ? parseFloat(gpuUsage) : undefined,
      cpuUsagePercent: cpuUsage.trim() ? parseFloat(cpuUsage) : undefined,
      ramUsageGb: ramUsage.trim() ? parseFloat(ramUsage) : undefined,
      totalRamGb: activeRamGb || 16,
      vramUsageGb: vramUsage.trim() ? parseFloat(vramUsage) : undefined,
      totalVramGb: activeVramGb || undefined,
      temperatureCelsius: temperature.trim() ? parseFloat(temperature) : undefined,
      stutteringLevel,
      low1PercentFps: low1Pct.trim() ? parseFloat(low1Pct) : undefined,
      gpuName: activeGpuName,
      cpuName: activeCpuName,
      memoryChannel: activeMemoryChannel,
      isLaptop,
      laptopModelName,
      deviceTgpWatts
    };

    const evaluated = evaluateFpsDiagnostic(input);
    setDiagnosticResult(evaluated);

    setTimeout(() => {
      setIsDiagnosing(false);
    }, 250);
  };

  const handlePreFillCurrentSystem = () => {
    if (activeGame) {
      setSelectedGameId(activeGame.id);
      setGameSearchQuery(activeGame.name);
      setUseCustomGame(false);
      setIsGameDropdownOpen(false);
    }
    if (activeResolution) {
      setResolution(activeResolution);
    }
    if (activeVramGb && !vramUsage) {
      setVramUsage(String(Math.min(activeVramGb, Math.round(activeVramGb * 0.9))));
    }
    if (activeRamGb && !ramUsage) {
      setRamUsage(String(Math.min(activeRamGb, Math.round(activeRamGb * 0.75))));
    }
  };

  const handleResetDefaults = () => {
    setSelectedGameId('cyberpunk-2077');
    const defaultGame = GAMES_DATABASE.find(g => g.id === 'cyberpunk-2077');
    setGameSearchQuery(defaultGame?.name || 'Cyberpunk 2077');
    setIsGameDropdownOpen(false);
    setUseCustomGame(false);
    setCustomGameName('');
    setResolution('1080p');
    setPreset('High');
    setActualFps('42');
    setTargetFps('60');
    setGpuUsage('99');
    setCpuUsage('45');
    setRamUsage('');
    setVramUsage('');
    setTemperature('');
    setLow1Pct('');
    setStutteringLevel('minor');
    setIsAdvancedOpen(false);
  };

  return (
    <div className="space-y-5">
      {/* Header Banner - Compact, Sleek & Focused */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#0c0f1d]/90 border border-[#1b233a] shadow-lg relative overflow-hidden backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30">
                <Activity className="w-4 h-4" />
              </span>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                FPS Diagnostic
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-950 text-purple-300 border border-purple-800/60">
                Troubleshooter
              </span>
            </div>
            <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
              Find out what is limiting your framerate and get a clear, step-by-step recommendation on what to change first.
            </p>
          </div>

          {(activeGpuName || activeCpuName) && (
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                id="btn-sync-diagnostic-hardware"
                onClick={handlePreFillCurrentSystem}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#12162a] hover:bg-[#181e3a] text-purple-200 border border-[#232d4b] transition-all cursor-pointer shadow-sm"
                title="Sync with current PC configuration"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>Use Configured Hardware</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Form with Primary Inputs + Expandable Advanced Info (5 cols on lg) */}
        <form
          onSubmit={handleRunDiagnosis}
          className="lg:col-span-5 p-4 sm:p-5 rounded-2xl bg-[#0c0f1d]/90 border border-[#1b233a] shadow-lg space-y-4 backdrop-blur-md"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#1f2842] pb-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-200 flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-purple-400" />
              Diagnostic Inputs
            </span>
            <button
              type="button"
              onClick={handleResetDefaults}
              className="text-[11px] text-zinc-400 hover:text-zinc-200 flex items-center gap-1 cursor-pointer transition-colors"
              title="Reset inputs to default"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* PRIMARY INPUT 1: Game */}
          <div className="space-y-1" ref={gameComboboxRef}>
            <div className="flex items-center justify-between">
              <label htmlFor="diagnostic-game-search-input" className="text-xs font-semibold text-zinc-200 flex items-center gap-1">
                <span>1. Game</span>
                <span className="text-[10px] text-rose-400 font-bold">*</span>
              </label>
              <button
                type="button"
                onClick={() => {
                  setUseCustomGame(!useCustomGame);
                  setIsGameDropdownOpen(false);
                }}
                className="text-[10px] text-indigo-400 hover:text-indigo-300 underline cursor-pointer"
              >
                {useCustomGame ? 'Pick from database' : '+ Custom unlisted game'}
              </button>
            </div>

            {useCustomGame ? (
              <input
                id={customGameInputId}
                type="text"
                value={customGameName}
                onChange={(e) => setCustomGameName(e.target.value)}
                placeholder="Type unlisted game name (e.g. Rust, PoE 2)..."
                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            ) : (
              <div className="relative">
                <div
                  className={`w-full min-h-[38px] px-3 py-1.5 rounded-xl bg-zinc-950 border text-xs text-zinc-100 flex items-center gap-2 transition-all cursor-text ${
                    isGameDropdownOpen
                      ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-zinc-950'
                      : 'border-zinc-800 hover:border-zinc-700'
                  }`}
                  onClick={() => setIsGameDropdownOpen(true)}
                >
                  <Search className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                  <input
                    id="diagnostic-game-search-input"
                    type="text"
                    role="combobox"
                    aria-expanded={isGameDropdownOpen}
                    aria-autocomplete="list"
                    aria-controls="diagnostic-game-listbox"
                    value={gameSearchQuery}
                    onFocus={() => setIsGameDropdownOpen(true)}
                    onChange={(e) => {
                      setGameSearchQuery(e.target.value);
                      if (!isGameDropdownOpen) setIsGameDropdownOpen(true);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') {
                        setIsGameDropdownOpen(false);
                      } else if (e.key === 'Enter') {
                        if (filteredDatabaseGames.length > 0) {
                          e.preventDefault();
                          const matched = filteredDatabaseGames[0];
                          setSelectedGameId(matched.id);
                          setGameSearchQuery(matched.name);
                          setIsGameDropdownOpen(false);
                        }
                      }
                    }}
                    placeholder="Search game..."
                    className="flex-1 bg-transparent text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none min-w-0"
                  />
                  {gameSearchQuery && (
                    <button
                      type="button"
                      aria-label="Clear search"
                      onClick={(e) => {
                        e.stopPropagation();
                        setGameSearchQuery('');
                        setIsGameDropdownOpen(true);
                      }}
                      className="p-1 rounded text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer shrink-0"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                  <button
                    type="button"
                    aria-label="Toggle game options"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsGameDropdownOpen(!isGameDropdownOpen);
                    }}
                    className="p-1 text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer shrink-0"
                  >
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        isGameDropdownOpen ? 'rotate-180 text-indigo-400' : ''
                      }`}
                    />
                  </button>
                </div>

                {isGameDropdownOpen && (
                  <div
                    id="diagnostic-game-listbox"
                    role="listbox"
                    className="absolute z-50 left-0 right-0 top-full mt-1.5 max-h-56 overflow-y-auto rounded-xl bg-zinc-900 border border-zinc-700/80 shadow-2xl backdrop-blur-xl p-1.5 space-y-0.5"
                  >
                    {filteredDatabaseGames.length > 0 ? (
                      filteredDatabaseGames.map((game) => {
                        const isSelected = selectedGameId === game.id;
                        return (
                          <div
                            key={game.id}
                            id={`diagnostic-game-opt-${game.id}`}
                            role="option"
                            aria-selected={isSelected}
                            onClick={() => {
                              setSelectedGameId(game.id);
                              setGameSearchQuery(game.name);
                              setIsGameDropdownOpen(false);
                            }}
                            className={`w-full px-2.5 py-1.5 rounded-lg text-left text-xs transition-colors flex items-center justify-between gap-2 cursor-pointer ${
                              isSelected
                                ? 'bg-indigo-600/30 text-indigo-200 border border-indigo-500/40 font-semibold'
                                : 'text-zinc-200 hover:bg-zinc-800/80 hover:text-white'
                            }`}
                          >
                            <span className="truncate">{game.name}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-2.5 text-center space-y-1.5">
                        <p className="text-xs text-zinc-400">No match found.</p>
                        <button
                          type="button"
                          onClick={() => {
                            setUseCustomGame(true);
                            setCustomGameName(gameSearchQuery);
                            setIsGameDropdownOpen(false);
                          }}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors cursor-pointer"
                        >
                          Use "{gameSearchQuery}" as custom game
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* PRIMARY INPUTS 2 & 3: Resolution & Graphics Settings */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label htmlFor="select-diagnostic-resolution" className="text-xs font-semibold text-zinc-200 flex items-center gap-1">
                <span>2. Resolution</span>
                <span className="text-[10px] text-rose-400 font-bold">*</span>
              </label>
              <select
                id="select-diagnostic-resolution"
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="1080p">1080p (FHD)</option>
                <option value="1440p">1440p (QHD)</option>
                <option value="4K">4K (UHD)</option>
                <option value="720p">720p (HD)</option>
                <option value="1200p">1200p (16:10)</option>
                <option value="1600p">1600p (16:10)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label htmlFor="select-diagnostic-preset" className="text-xs font-semibold text-zinc-200 flex items-center gap-1">
                <span>3. Settings</span>
                <span className="text-[10px] text-rose-400 font-bold">*</span>
              </label>
              <select
                id="select-diagnostic-preset"
                value={preset}
                onChange={(e) => setPreset(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="Low">Low Settings</option>
                <option value="Medium">Medium Settings</option>
                <option value="High">High Settings</option>
                <option value="Ultra">Ultra Settings</option>
                <option value="Custom">Custom Settings</option>
              </select>
            </div>
          </div>

          {/* PRIMARY INPUT 4: Actual FPS */}
          <div className="p-3 rounded-xl bg-zinc-950/70 border border-indigo-500/30">
            <div className="flex items-center justify-between mb-1">
              <label htmlFor={actualFpsInputId} className="text-xs font-bold text-indigo-300 flex items-center gap-1">
                <span>4. Actual In-Game FPS</span>
                <span className="text-[10px] text-rose-400 font-bold">*</span>
              </label>
              <span className="text-[10px] text-zinc-400">Average FPS you see</span>
            </div>
            <div className="relative">
              <input
                id={actualFpsInputId}
                type="number"
                min="1"
                max="999"
                value={actualFps}
                onChange={(e) => setActualFps(e.target.value)}
                placeholder="e.g. 42"
                required
                className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-indigo-500/40 text-sm font-bold text-white focus:outline-none focus:border-indigo-400 transition-colors"
              />
              <span className="absolute right-3 top-2 text-xs font-bold text-indigo-300 pointer-events-none">
                FPS
              </span>
            </div>
          </div>

          {/* EXPANDABLE SECTION: Advanced Information (Optional) */}
          <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/40 overflow-hidden transition-all">
            <button
              type="button"
              id="btn-toggle-advanced-info"
              onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
              className="w-full px-3.5 py-2.5 flex items-center justify-between text-xs font-semibold text-zinc-300 hover:text-white transition-colors cursor-pointer bg-zinc-900/50"
            >
              <div className="flex items-center gap-2">
                <Sliders className="w-3.5 h-3.5 text-purple-400" />
                <span>Advanced Information (Optional)</span>
                {activeAdvancedCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-purple-900/60 text-purple-300 border border-purple-700/50">
                    {activeAdvancedCount} active
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 text-[11px] text-zinc-400">
                <span>{isAdvancedOpen ? 'Hide' : 'Expand'}</span>
                {isAdvancedOpen ? (
                  <ChevronUp className="w-3.5 h-3.5 text-zinc-400" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                )}
              </div>
            </button>

            {isAdvancedOpen && (
              <div className="p-3.5 space-y-3 border-t border-zinc-800/60 bg-zinc-950/70 animate-in fade-in duration-200">
                <p className="text-[11px] text-zinc-400">
                  Providing these optional metrics improves diagnostic certainty, but is not required.
                </p>

                {/* GPU & CPU Usage */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label htmlFor={gpuUsageInputId} className="text-[11px] text-zinc-300">GPU Usage (%)</label>
                    <div className="relative">
                      <input
                        id={gpuUsageInputId}
                        type="number"
                        min="0"
                        max="100"
                        value={gpuUsage}
                        onChange={(e) => setGpuUsage(e.target.value)}
                        placeholder="e.g. 99"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-indigo-500"
                      />
                      <span className="absolute right-2.5 top-1.5 text-xs text-zinc-400 pointer-events-none">%</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor={cpuUsageInputId} className="text-[11px] text-zinc-300">CPU Usage (%)</label>
                    <div className="relative">
                      <input
                        id={cpuUsageInputId}
                        type="number"
                        min="0"
                        max="100"
                        value={cpuUsage}
                        onChange={(e) => setCpuUsage(e.target.value)}
                        placeholder="e.g. 45"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-indigo-500"
                      />
                      <span className="absolute right-2.5 top-1.5 text-xs text-zinc-400 pointer-events-none">%</span>
                    </div>
                  </div>
                </div>

                {/* RAM & VRAM Usage */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label htmlFor={ramUsageInputId} className="text-[11px] text-zinc-300">RAM Usage (GB)</label>
                    <div className="relative">
                      <input
                        id={ramUsageInputId}
                        type="number"
                        step="0.1"
                        min="0"
                        max="128"
                        value={ramUsage}
                        onChange={(e) => setRamUsage(e.target.value)}
                        placeholder="e.g. 12"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-indigo-500"
                      />
                      <span className="absolute right-2.5 top-1.5 text-xs text-zinc-400 pointer-events-none">GB</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor={vramUsageInputId} className="text-[11px] text-zinc-300">VRAM Usage (GB)</label>
                    <div className="relative">
                      <input
                        id={vramUsageInputId}
                        type="number"
                        step="0.1"
                        min="0"
                        max="48"
                        value={vramUsage}
                        onChange={(e) => setVramUsage(e.target.value)}
                        placeholder="e.g. 7"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-indigo-500"
                      />
                      <span className="absolute right-2.5 top-1.5 text-xs text-zinc-400 pointer-events-none">GB</span>
                    </div>
                  </div>
                </div>

                {/* 1% Low FPS & Temperatures */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label htmlFor={low1PctInputId} className="text-[11px] text-zinc-300">1% Low FPS</label>
                    <input
                      id={low1PctInputId}
                      type="number"
                      min="1"
                      max="999"
                      value={low1Pct}
                      onChange={(e) => setLow1Pct(e.target.value)}
                      placeholder="e.g. 28"
                      className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor={tempInputId} className="text-[11px] text-zinc-300 flex items-center gap-1">
                      <Thermometer className="w-3 h-3 text-rose-400" />
                      <span>Temperatures</span>
                    </label>
                    <div className="relative">
                      <input
                        id={tempInputId}
                        type="number"
                        min="30"
                        max="115"
                        value={temperature}
                        onChange={(e) => setTemperature(e.target.value)}
                        placeholder="e.g. 85"
                        className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-indigo-500"
                      />
                      <span className="absolute right-2.5 top-1.5 text-xs text-zinc-400 pointer-events-none">°C</span>
                    </div>
                  </div>
                </div>

                {/* Target FPS */}
                <div className="space-y-1">
                  <label htmlFor={targetFpsInputId} className="text-[11px] text-zinc-300">Target FPS</label>
                  <input
                    id={targetFpsInputId}
                    type="number"
                    min="1"
                    max="999"
                    value={targetFps}
                    onChange={(e) => setTargetFps(e.target.value)}
                    placeholder="e.g. 60"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Stuttering / Freezing */}
                <div className="space-y-1.5 pt-1">
                  <label className="text-[11px] text-zinc-300 block">
                    Stuttering / Freezing
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {(
                      [
                        { id: 'none', label: 'None' },
                        { id: 'minor', label: 'Minor' },
                        { id: 'frequent', label: 'Frequent' },
                        { id: 'severe', label: 'Severe' }
                      ] as const
                    ).map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        id={`btn-stutter-${s.id}`}
                        onClick={() => setStutteringLevel(s.id)}
                        className={`py-1 text-center text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                          stutteringLevel === s.id
                            ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                            : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Submit Action: Diagnose FPS */}
          <button
            type="submit"
            id="btn-run-fps-diagnosis"
            className={`w-full py-3 px-4 rounded-xl font-extrabold text-sm tracking-wide uppercase transition-all flex items-center justify-center gap-2 cursor-pointer border active:scale-[0.98] ${
              isDiagnosing
                ? 'bg-purple-700 text-white border-purple-400 ring-2 ring-purple-400/50 shadow-[0_0_20px_-3px_rgba(168,85,247,0.5)]'
                : 'bg-gradient-to-r from-violet-600 via-indigo-600 to-sky-500 hover:from-violet-500 hover:via-indigo-500 hover:to-sky-400 text-white border-purple-400/40 shadow-[0_0_20px_-5px_rgba(168,85,247,0.4)] hover:shadow-[0_0_25px_-3px_rgba(168,85,247,0.6)]'
            }`}
          >
            <Activity className={`w-4 h-4 ${isDiagnosing ? 'animate-spin' : ''}`} />
            <span>{isDiagnosing ? 'Diagnosing...' : 'Diagnose FPS'}</span>
          </button>
        </form>

        {/* Right Column: Diagnostic Results (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Card 1: Most Likely Cause & Why? (Compact, Prominent & Top-Aligned) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0c0f1d]/90 border border-purple-500/40 shadow-xl relative overflow-hidden backdrop-blur-md space-y-3.5">
            {/* Header: Most Likely Cause & Confidence */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" />
                  Most Likely Cause
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-white capitalize tracking-tight">
                  {diagnosticResult.mostLikelyCause}
                </h3>
              </div>

              {/* Confidence Pill */}
              <div className="shrink-0 flex items-center gap-2">
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
                    diagnosticResult.confidenceLevel === 'High'
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60'
                      : diagnosticResult.confidenceLevel === 'Medium'
                      ? 'bg-amber-950/80 text-amber-300 border-amber-700/60'
                      : 'bg-zinc-900 text-zinc-300 border-zinc-700'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      diagnosticResult.confidenceLevel === 'High'
                        ? 'bg-emerald-400'
                        : diagnosticResult.confidenceLevel === 'Medium'
                        ? 'bg-amber-400'
                        : 'bg-zinc-400'
                    }`}
                  />
                  <span>Confidence: {diagnosticResult.confidenceLevel}</span>
                </span>
              </div>
            </div>

            {/* "Why?" Section - Simple & Beginner-Friendly */}
            <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800/80 space-y-1">
              <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                Why?
              </div>
              <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed font-medium">
                {diagnosticResult.whyExplanation}
              </p>
              {diagnosticResult.confidenceReason && (
                <p className="text-[11px] text-zinc-400 pt-1 border-t border-zinc-800/50 mt-1.5">
                  <strong className="text-zinc-400 font-semibold">Confidence basis: </strong>
                  {diagnosticResult.confidenceReason}
                </p>
              )}
            </div>

            {/* Active Hardware Reference if known */}
            {activeGpuName && (
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-zinc-950/60 border border-zinc-800/70 text-[11px] text-zinc-400">
                <span className="text-zinc-400">Evaluated with:</span>
                <span className="text-zinc-200 font-medium">{activeGpuName}</span>
                {activeCpuName && <span>• {activeCpuName}</span>}
                {activeRamGb && <span>• {activeRamGb}GB RAM</span>}
              </div>
            )}
          </div>

          {/* Card 2: "What Should I Change First?" */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0c0f1d]/90 border border-[#1b233a] shadow-lg space-y-3.5 backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-[#1f2842] pb-2.5">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <Zap className="w-3.5 h-3.5" />
                </span>
                <h4 className="text-xs sm:text-sm font-bold text-zinc-100 uppercase tracking-wide">
                  What Should I Change First?
                </h4>
              </div>
              <span className="text-[10px] text-zinc-400">Prioritized checklist</span>
            </div>

            {/* Primary Action: Change this first */}
            {diagnosticResult.changeFirstAction && (
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-purple-950/40 to-indigo-950/30 border border-purple-500/30 space-y-1.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-purple-600 text-white tracking-wide shrink-0">
                      Change this first
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-white">
                      {diagnosticResult.changeFirstAction.action}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 shrink-0">
                    {diagnosticResult.changeFirstAction.impact}
                  </span>
                </div>
                {diagnosticResult.changeFirstAction.detail && (
                  <p className="text-[11px] text-zinc-300 leading-relaxed pl-1">
                    {diagnosticResult.changeFirstAction.detail}
                  </p>
                )}
              </div>
            )}

            {/* Secondary Actions: Then consider */}
            {diagnosticResult.thenConsiderActions && diagnosticResult.thenConsiderActions.length > 0 && (
              <div className="space-y-2 pt-1">
                <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                  Then consider:
                </div>
                <div className="space-y-1.5">
                  {diagnosticResult.thenConsiderActions.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-zinc-950/70 border border-zinc-800/80 hover:border-zinc-700/80 transition-all flex items-start justify-between gap-2 text-xs"
                    >
                      <div className="flex items-start gap-2 min-w-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                        <div className="space-y-0.5">
                          <span className="font-semibold text-zinc-200 block">
                            {item.action}
                          </span>
                          {item.detail && (
                            <span className="text-[11px] text-zinc-400 block leading-tight">
                              {item.detail}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-900 text-zinc-300 border border-zinc-800 shrink-0">
                        {item.impact}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Card 3: Hardware Component Bottleneck Breakdown (Compact 4-meter bar) */}
          {diagnosticResult.componentBreakdowns && diagnosticResult.componentBreakdowns.length > 0 && (
            <div className="p-4 rounded-xl bg-[#0c0f1d]/90 border border-[#1b233a] shadow-md space-y-2.5 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                  <Gauge className="w-3.5 h-3.5 text-purple-400" />
                  Component Saturation Breakdown
                </span>
                <span className="text-[10px] text-zinc-400">
                  Hardware load analysis
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {diagnosticResult.componentBreakdowns.map((comp) => {
                  const isCritical = comp.status === 'Critical Bottleneck';
                  const isModerate = comp.status === 'Moderate Limitation';

                  return (
                    <div
                      key={comp.component}
                      className={`p-2.5 rounded-xl border transition-all space-y-1.5 ${
                        comp.isPrimaryLimiter
                          ? 'bg-rose-950/20 border-rose-500/40 ring-1 ring-rose-500/20'
                          : isCritical
                          ? 'bg-amber-950/20 border-amber-500/30'
                          : isModerate
                          ? 'bg-yellow-950/15 border-yellow-600/20'
                          : 'bg-zinc-950/60 border-zinc-800/80'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          {comp.component === 'GPU' && <Microchip className="w-3 h-3 text-indigo-400" />}
                          {comp.component === 'CPU' && <Cpu className="w-3 h-3 text-blue-400" />}
                          {comp.component === 'RAM' && <Layers className="w-3 h-3 text-emerald-400" />}
                          {comp.component === 'VRAM' && <HardDrive className="w-3 h-3 text-purple-400" />}
                          <span className="text-xs font-bold text-zinc-200">{comp.component}</span>
                        </div>
                        <span className="font-mono text-[11px] font-bold text-zinc-300">
                          {comp.bottleneckScore}%
                        </span>
                      </div>

                      {/* Mini Bar */}
                      <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            comp.bottleneckScore >= 90
                              ? 'bg-rose-500'
                              : comp.bottleneckScore >= 75
                              ? 'bg-amber-500'
                              : comp.bottleneckScore >= 50
                              ? 'bg-indigo-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${comp.bottleneckScore}%` }}
                        />
                      </div>

                      <div className="text-[10px] text-zinc-400 truncate" title={comp.headroomDescription}>
                        {comp.headroomDescription}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Card 4: Additional Notes & Telemetry Tips (Collapsible, Minimal Scrolling) */}
          <div className="rounded-xl border border-zinc-800/70 bg-zinc-900/40 overflow-hidden">
            <button
              type="button"
              onClick={() => setShowAdditionalNotes(!showAdditionalNotes)}
              className="w-full p-3 flex items-center justify-between text-xs font-medium text-zinc-400 hover:text-zinc-200 cursor-pointer transition-colors"
            >
              <span className="flex items-center gap-2">
                <Monitor className="w-3.5 h-3.5 text-zinc-400" />
                <span>How to check your live GPU & CPU % while playing</span>
              </span>
              {showAdditionalNotes ? (
                <ChevronUp className="w-3.5 h-3.5 text-zinc-400" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
              )}
            </button>

            {showAdditionalNotes && (
              <div className="p-3.5 pt-1 space-y-2 border-t border-zinc-800/40 text-xs text-zinc-400">
                <div className="flex items-start gap-2">
                  <span className="text-indigo-400 font-bold">•</span>
                  <span><strong>Windows Xbox Game Bar:</strong> Press <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-200 text-[10px] border border-zinc-700">Win + G</kbd> anytime while in-game to toggle the built-in performance widget (FPS, GPU %, CPU %, and RAM).</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-indigo-400 font-bold">•</span>
                  <span><strong>Nvidia GeForce Experience:</strong> Press <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-200 text-[10px] border border-zinc-700">Alt + R</kbd> to open the GeForce overlay.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-indigo-400 font-bold">•</span>
                  <span><strong>AMD Radeon Adrenalin:</strong> Press <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-200 text-[10px] border border-zinc-700">Ctrl + Shift + O</kbd> for live GPU telemetry.</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
