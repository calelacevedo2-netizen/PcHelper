import React, { useState } from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  X,
  Sliders,
  Info,
  RotateCcw,
  Sparkles,
  Gauge,
  Laptop,
  Monitor,
  Wrench,
  BookOpen,
  ArrowDownCircle,
  ShieldCheck,
  Zap,
  Cpu,
  HardDrive,
  Layers,
  ChevronDown,
  ChevronUp,
  Check,
  FileText,
  Activity,
  Tv
} from 'lucide-react';
import {
  RecommendationResult,
  GPU,
  CPU as CPUType,
  Game,
  Resolution,
  RamOption,
  DeviceType,
  OptimizationGoal,
  TargetFpsOption
} from '../types';
import { SettingsExplainer } from './SettingsExplainer';
import { OptimizationGuide } from './OptimizationGuide';

interface ResultSectionProps {
  result: RecommendationResult;
  gpu: GPU;
  cpu: CPUType;
  ram: RamOption;
  game: Game;
  resolution: Resolution;
  deviceType?: DeviceType | null;
  onResetOrChange: () => void;
  onClose?: () => void;
  currentGoal?: OptimizationGoal;
  currentTargetFps?: TargetFpsOption;
  customTargetFps?: number;
  onGoalChange?: (goal: OptimizationGoal, targetFps: TargetFpsOption, customFps?: number) => void;
}

export const ResultSection: React.FC<ResultSectionProps> = ({
  result,
  gpu,
  cpu,
  ram,
  game,
  resolution,
  deviceType = 'desktop',
  onResetOrChange,
  onClose,
  currentGoal = 'balanced',
  currentTargetFps = 'any',
  customTargetFps,
  onGoalChange
}) => {
  const [showSources, setShowSources] = useState(false);
  const [isGameNotesOpen, setIsGameNotesOpen] = useState(false);
  const [isEvidenceOpen, setIsEvidenceOpen] = useState(true);

  // Status Color Palettes
  const statusConfig = {
    green: {
      bgCard: 'bg-emerald-950/20 border-emerald-500/40',
      badgeBg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      icon: CheckCircle2,
      iconColor: 'text-emerald-400',
      glow: 'shadow-emerald-950/40'
    },
    yellow: {
      bgCard: 'bg-amber-950/20 border-amber-500/40',
      badgeBg: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      icon: AlertTriangle,
      iconColor: 'text-amber-400',
      glow: 'shadow-amber-950/40'
    },
    red: {
      bgCard: 'bg-rose-950/20 border-rose-500/40',
      badgeBg: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
      icon: XCircle,
      iconColor: 'text-rose-400',
      glow: 'shadow-rose-950/40'
    }
  }[result.overallStatus];

  const StatusIcon = statusConfig.icon;

  const effectiveDeviceType: DeviceType =
    deviceType ||
    result.deviceType ||
    (gpu.type === 'laptop' || cpu.type === 'laptop' ? 'laptop' : 'desktop');

  const isLaptop = effectiveDeviceType === 'laptop';
  const targetRamGb = Math.max(16, game.recommendedRequirements.ramGb);

  let headlineText = result.recommendationHeadline;
  if (!headlineText) {
    if (isLaptop) {
      switch (result.limitation) {
        case 'RAM':
          headlineText = `Recommendation: Upgrade to ${targetRamGb}GB RAM`;
          break;
        case 'GPU':
          headlineText = 'Limitation: GPU Bottleneck (Lower settings or resolution)';
          break;
        case 'VRAM':
          headlineText = 'Recommendation: Lower VRAM-heavy settings first';
          break;
        case 'CPU':
          headlineText = 'Recommendation: Adjust Graphics Settings';
          break;
        case 'Balanced':
        default:
          headlineText = 'Recommendation: Hardware is Balanced';
          break;
      }
    } else {
      switch (result.limitation) {
        case 'RAM':
          headlineText = `Recommendation: Upgrade to ${targetRamGb}GB RAM`;
          break;
        case 'GPU':
          headlineText = 'Recommendation: Upgrade Graphics Card';
          break;
        case 'VRAM':
          headlineText = 'Recommendation: Lower VRAM-heavy settings first';
          break;
        case 'CPU':
          headlineText = 'Recommendation: Upgrade Processor';
          break;
        case 'Balanced':
        default:
          headlineText = 'Recommendation: Hardware is Balanced';
          break;
      }
    }
  }

  return (
    <div className="w-full space-y-6 pt-2" id="results-display">
      {/* 1. Expected Performance Card */}
      <div
        id="overall-result-card"
        className={`rounded-2xl p-6 md:p-8 border backdrop-blur-md shadow-xl transition-all ${statusConfig.bgCard} ${statusConfig.glow}`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-zinc-800/80">
          <div className="flex items-start gap-3.5">
            <div className={`p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 ${statusConfig.iconColor} flex-shrink-0 mt-0.5`}>
              <StatusIcon className="w-7 h-7" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className={`inline-flex items-center text-xs md:text-sm font-semibold px-3 py-1 rounded-full border ${statusConfig.badgeBg}`}>
                  {result.statusBadgeText}
                </span>

                {/* Workload Limitation Category Badge */}
                {result.workloadLimitationType && (
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                    result.workloadLimitationType === 'Mixed / Balanced'
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/60'
                      : result.workloadLimitationType === 'GPU-bound'
                      ? 'bg-purple-950/80 text-purple-300 border-purple-800/60'
                      : result.workloadLimitationType === 'CPU-bound'
                      ? 'bg-amber-950/80 text-amber-300 border-amber-800/60'
                      : 'bg-rose-950/80 text-rose-300 border-rose-800/60'
                  }`}>
                    Workload: {result.workloadLimitationType}
                  </span>
                )}

                {/* Confidence Level Badge */}
                {result.confidence && (
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${
                    result.confidence === 'High'
                      ? 'bg-emerald-950/70 text-emerald-300 border-emerald-800/50'
                      : result.confidence === 'Medium'
                      ? 'bg-sky-950/70 text-sky-300 border-sky-800/50'
                      : 'bg-amber-950/70 text-amber-300 border-amber-800/50'
                  }`}>
                    <ShieldCheck className="w-3 h-3" />
                    Confidence: {result.confidence}
                  </span>
                )}

                {(gpu.type === 'laptop' || cpu.type === 'laptop') && (
                  <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-sky-950/80 text-sky-300 border border-sky-800/60 flex items-center gap-1">
                    <Laptop className="w-3 h-3" />
                    Mobile Hardware Evaluated
                  </span>
                )}
              </div>

              <h2 className="text-xl md:text-2xl font-bold text-zinc-100 tracking-tight">
                {result.statusTitle}
              </h2>

              {/* Hardware specifications snapshot */}
              <div className="mt-2 text-xs md:text-sm text-zinc-300 flex flex-wrap items-center gap-x-2.5 gap-y-1">
                <span className="inline-flex items-center gap-1 font-semibold text-zinc-100 bg-zinc-900/90 px-2 py-0.5 rounded border border-zinc-800">
                  {gpu.name} ({gpu.vram} GB VRAM)
                </span>
                <span className="text-zinc-500">•</span>
                <span className="inline-flex items-center gap-1 font-semibold text-zinc-100 bg-zinc-900/90 px-2 py-0.5 rounded border border-zinc-800">
                  {cpu.name}
                </span>
                <span className="text-zinc-500">•</span>
                <span className="text-zinc-300">
                  {ram} GB RAM ({result.memoryChannel || 'Dual-Channel'}{result.ramModuleSetup ? ` • ${result.ramModuleSetup}` : ''})
                </span>
                <span className="text-zinc-500">•</span>
                <span className="text-indigo-300 font-medium">{game.name} ({resolution})</span>

                {result.selectedDevice && !result.isHardwareMismatch && (
                  <>
                    <span className="text-zinc-500">•</span>
                    <span className="inline-flex items-center gap-1 font-medium text-sky-300 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/60">
                      <Laptop className="w-3 h-3 text-sky-400" />
                      {result.selectedDevice.name}
                      {result.selectedDevice.gpuTgpWatts ? ` (${result.selectedDevice.gpuTgpWatts})` : ''}
                    </span>
                  </>
                )}
              </div>

              {/* Memory Channel Limitation Notice */}
              {result.memoryChannelLimitation && (
                <div className="mt-2.5 px-3 py-1.5 rounded-lg bg-sky-950/40 border border-sky-600/40 text-xs text-sky-200 flex items-center gap-2">
                  <Info className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>{result.memoryChannelLimitation}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-center flex-shrink-0">
            <button
              type="button"
              id="btn-adjust-specs"
              onClick={onResetOrChange}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs md:text-sm font-medium rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors border border-zinc-700 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Adjust</span>
            </button>

            {onClose && (
              <button
                type="button"
                id="btn-close-results"
                onClick={onClose}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs md:text-sm font-bold rounded-xl bg-zinc-800/90 hover:bg-zinc-700 text-zinc-100 hover:text-white transition-all border border-zinc-600 hover:border-zinc-400 shadow-md cursor-pointer active:scale-95"
                aria-label="Close Results"
              >
                <X className="w-4 h-4 text-rose-400" />
                <span>✕ Close Results</span>
              </button>
            )}
          </div>
        </div>

        {/* Real-World Benchmark Performance Meter (Rendered FPS vs Frame Gen Displayed) */}
        {result.hasSufficientFpsEvidence && result.renderedFpsRange ? (
          <div className="mt-4 p-4 rounded-xl bg-zinc-900/95 border border-indigo-900/70 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-300">
                    Expected Real-World Performance
                  </span>
                  {result.benchmarkInfo?.matchingTier && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/50">
                      {result.benchmarkInfo.matchingTier}
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-400">
                  Calculated from verified benchmark data, adjusted for your exact CPU, RAM channel, and power envelope.
                </p>
              </div>

              {/* Hardware match quality tag */}
              <div className="text-left sm:text-right shrink-0">
                <span className="text-[11px] text-zinc-400 block font-medium">Confidence Basis</span>
                <span className="text-xs font-semibold text-emerald-400">
                  {result.confidenceReason || 'Verified Benchmark Matrix'}
                </span>
              </div>
            </div>

            {/* Framerate Numbers Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
              {/* Box 1: Rendered Average FPS Range */}
              <div className="p-3 rounded-lg bg-[#0a0d18] border border-[#1b233a] space-y-1">
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                  Estimated Rendered Average
                </span>
                <div className="text-xl sm:text-2xl font-black text-indigo-300 font-mono">
                  {result.renderedFpsRange}
                </div>
                <p className="text-[10px] text-zinc-400">
                  True internal game engine draw calls and input response.
                </p>
              </div>

              {/* Box 2: Expected 1% Low Framerate */}
              {result.expectedLow1Percent && (
                <div className="p-3 rounded-lg bg-[#0a0d18] border border-[#1b233a] space-y-1">
                  <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                    Expected 1% Low Stability
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
                    {result.expectedLow1Percent}
                  </div>
                  <p className="text-[10px] text-zinc-400">
                    Reflects frame pacing and traversal smoothness during intense moments.
                  </p>
                </div>
              )}

              {/* Box 3: Displayed FPS with Frame Generation (if supported) */}
              {result.displayedFpsWithFrameGen ? (
                <div className="p-3 rounded-lg bg-purple-950/30 border border-purple-800/50 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-purple-300 uppercase tracking-wider">
                      Displayed with Frame Gen
                    </span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-900/60 text-purple-200 border border-purple-700/50">
                      Optical Flow
                    </span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-purple-300 font-mono">
                    {result.displayedFpsWithFrameGen}
                  </div>
                  <p className="text-[10px] text-zinc-400">
                    Interpolated display frames for visual smoothness on high-refresh (120Hz+) screens.
                  </p>
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-[#0a0d18] border border-[#1b233a] space-y-1">
                  <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider block">
                    Recommended Settings Target
                  </span>
                  <div className="text-base font-bold text-zinc-200">
                    {result.recommendedSettings.preset} Preset
                  </div>
                  <p className="text-[10px] text-zinc-400 truncate">
                    {result.recommendedSettings.upscaling.split('(')[0].trim()}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Transparent Qualitative Assessment when exact numerical data is omitted to avoid fabrication */
          <div className="mt-4 p-4 rounded-xl bg-zinc-900/90 border border-amber-900/40 space-y-2">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <Info className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Qualitative Performance Assessment (No Fixed FPS Guessing)</span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              {result.qualitativeAssessment || 'Reliable real-world benchmark data is not available for this exact configuration, so a precise numerical FPS estimate is omitted to avoid misleading speculation.'}
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-zinc-400">
              <span>Expected Behavior:</span>
              <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-200 font-semibold border border-zinc-700">
                {result.performanceCategory}
              </span>
              <span>at {resolution} on {result.recommendedSettings.preset} settings</span>
            </div>
          </div>
        )}

        {/* Game Demand Profile Snapshot */}
        {game.demandProfile && (
          <div className="mt-3.5 pt-3 border-t border-zinc-800/80 flex flex-wrap items-center gap-2 text-[11px]">
            <span className="text-zinc-400 font-medium flex items-center gap-1">
              <Layers className="w-3 h-3 text-indigo-400" />
              Game Demand Profile:
            </span>
            <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
              GPU Demand: <strong className="text-zinc-100">{game.demandProfile.gpuDemand}</strong>
            </span>
            <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
              CPU Demand: <strong className="text-zinc-100">{game.demandProfile.cpuDemand}</strong>
            </span>
            <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
              VRAM Sensitivity: <strong className="text-zinc-100">{game.demandProfile.vramSensitivity}</strong>
            </span>
            <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300">
              Upscaling: <strong className="text-zinc-100">{game.demandProfile.upscalingUsefulness}</strong>
            </span>
            {game.demandProfile.engineOrApi && (
              <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hidden lg:inline">
                Engine: {game.demandProfile.engineOrApi}
              </span>
            )}
          </div>
        )}
      </div>

      {/* 2. Hardware Limitation & Why Section (Side-by-Side on desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Hardware Limitation & Upgrade Recommendation */}
        <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5 md:p-6 flex flex-col justify-between" id="limitation-card">
          <div>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <span>YOUR LIKELY LIMITATION</span>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-zinc-800/80 text-zinc-400 border border-zinc-700/50 flex items-center gap-1">
                {effectiveDeviceType === 'laptop' ? (
                  <>
                    <Laptop className="w-3 h-3 text-sky-400" />
                    <span>Laptop Profile</span>
                  </>
                ) : (
                  <>
                    <Monitor className="w-3 h-3 text-indigo-400" />
                    <span>Desktop PC</span>
                  </>
                )}
              </span>
            </div>

            {/* Dynamic Recommendation Headline */}
            <div className="mb-3">
              <div className={`text-base sm:text-lg md:text-xl font-bold flex items-start gap-2 ${
                result.limitation === 'Balanced'
                  ? 'text-emerald-300'
                  : 'text-amber-300'
              }`}>
                {result.limitation === 'Balanced' ? (
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{headlineText}</span>
                  </span>
                ) : (
                  <span className="flex items-start gap-2">
                    {result.isUpgradeable ? (
                      <Wrench className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    ) : (
                      <Sliders className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    )}
                    <span>{headlineText}</span>
                  </span>
                )}
              </div>
            </div>

            <p className="text-sm text-zinc-300 leading-relaxed">
              {result.limitationExplanation}
            </p>
          </div>

          {/* Quick Component Health Checklist */}
          <div className="mt-5 pt-4 border-t border-zinc-800/80 grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
            <div className="p-2 rounded-lg bg-zinc-950/60 border border-zinc-800">
              <div className="text-zinc-400 mb-0.5">GPU Compute</div>
              <div className={`font-semibold ${result.ratings.gpu.status === 'Strong' ? 'text-emerald-400' : result.ratings.gpu.status === 'Adequate' ? 'text-amber-400' : 'text-rose-400'}`}>
                {result.ratings.gpu.status}
              </div>
            </div>
            <div className="p-2 rounded-lg bg-zinc-950/60 border border-zinc-800">
              <div className="text-zinc-400 mb-0.5">CPU Processor</div>
              <div className={`font-semibold ${result.ratings.cpu.status === 'Strong' ? 'text-emerald-400' : result.ratings.cpu.status === 'Adequate' ? 'text-amber-400' : 'text-rose-400'}`}>
                {result.ratings.cpu.status}
              </div>
            </div>
            <div className="p-2 rounded-lg bg-zinc-950/60 border border-zinc-800">
              <div className="text-zinc-400 mb-0.5">RAM</div>
              <div className={`font-semibold ${result.ratings.ram.status === 'Ample' ? 'text-emerald-400' : result.ratings.ram.status === 'Adequate' ? 'text-amber-400' : 'text-rose-400'}`}>
                {ram} GB ({result.ratings.ram.status})
              </div>
            </div>
            <div className="p-2 rounded-lg bg-zinc-950/60 border border-zinc-800">
              <div className="text-zinc-400 mb-0.5">VRAM Buffer</div>
              <div className={`font-semibold ${result.ratings.vram.status === 'Ample' ? 'text-emerald-400' : result.ratings.vram.status === 'Adequate' ? 'text-amber-400' : 'text-rose-400'}`}>
                {gpu.vram} GB ({result.ratings.vram.status})
              </div>
            </div>
          </div>
        </div>

        {/* Why this recommendation */}
        <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-5 md:p-6 flex flex-col justify-between" id="why-recommendation-card">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5 flex items-center gap-1.5">
              <span>Plain English Breakdown</span>
            </div>
            <h3 className="text-lg md:text-xl font-bold text-zinc-100 mb-3">
              Why this recommendation?
            </h3>
            <p className="text-sm text-zinc-300 leading-relaxed">
              {result.whyExplanation}
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-zinc-800/80 text-xs text-zinc-400 flex items-center justify-between">
            <span>Target Resolution: <strong className="text-zinc-200">{resolution}</strong></span>
            <span>Game: <strong className="text-zinc-200">{game.name}</strong></span>
          </div>
        </div>
      </div>

      {/* 3. Deep Evidence & Benchmark References Section (Collapsible Accordion) */}
      {result.evidenceDetails && (
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 md:p-6 shadow-sm" id="evidence-accordion">
          <div
            onClick={() => setIsEvidenceOpen(prev => !prev)}
            className="flex items-center justify-between gap-2 pb-2 border-b border-zinc-800 cursor-pointer select-none group"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setIsEvidenceOpen(prev => !prev);
              }
            }}
          >
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-sky-400" />
              <h4 className="text-sm md:text-base font-bold text-zinc-100 group-hover:text-sky-300 transition-colors uppercase tracking-wider">
                Benchmark Evidence & Methodology Details
              </h4>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-zinc-400 group-hover:text-zinc-200">
              <span className="text-[11px] font-medium hidden sm:inline">
                {isEvidenceOpen ? 'Hide Evidence' : 'View Evidence'}
              </span>
              {isEvidenceOpen ? (
                <ChevronUp className="w-4 h-4 text-sky-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-zinc-400" />
              )}
            </div>
          </div>

          {isEvidenceOpen && (
            <div className="pt-4 space-y-4 animate-in fade-in duration-150 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Hardware Comparison Target */}
                <div className="p-3.5 rounded-xl bg-[#090c17] border border-[#1f2842] space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-zinc-200 text-xs">
                    <Laptop className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Hardware Comparison Target</span>
                  </div>
                  <p className="text-zinc-300 font-mono text-[11px]">
                    {result.evidenceDetails.hardwareComparisonTarget}
                  </p>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Matching tier: <strong className="text-zinc-300 uppercase">{result.evidenceDetails.hardwareMatchingTier.replace(/_/g, ' ')}</strong>
                  </p>
                </div>

                {/* Benchmark References & Outlets */}
                <div className="p-3.5 rounded-xl bg-[#090c17] border border-[#1f2842] space-y-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-zinc-200 text-xs">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Benchmark References & Data Sources</span>
                  </div>
                  <ul className="space-y-1 text-zinc-300 text-[11px]">
                    {result.evidenceDetails.benchmarkReferences.map((ref, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-400">•</span>
                        <span>{ref}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Configuration Differences & Applied Adjustments */}
              {result.evidenceDetails.configurationDifferences.length > 0 && (
                <div className="p-3.5 rounded-xl bg-[#090c17] border border-[#1f2842] space-y-1.5">
                  <span className="font-bold text-zinc-200 text-xs block">
                    System Configuration Differences & Applied Scaling:
                  </span>
                  <ul className="space-y-1 text-zinc-300 text-[11px]">
                    {result.evidenceDetails.configurationDifferences.map((diff, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-sky-400">•</span>
                        <span>{diff}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Assumptions & Environmental Caveats */}
              <div className="p-3.5 rounded-xl bg-[#090c17] border border-[#1f2842] space-y-1.5">
                <span className="font-bold text-zinc-200 text-xs block">
                  Testing Assumptions & Real-World Caveats:
                </span>
                <ul className="space-y-1 text-zinc-400 text-[11px]">
                  {result.evidenceDetails.relevantAssumptions.map((assump, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-zinc-400">•</span>
                      <span>{assump}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. In-Game Optimization Guide & Settings */}
      <OptimizationGuide
        result={result}
        game={game}
        gpu={gpu}
        cpu={cpu}
        ram={ram}
        currentGoal={currentGoal}
        currentTargetFps={currentTargetFps}
        customTargetFps={customTargetFps}
        onGoalChange={onGoalChange || (() => {})}
      />

      {/* 5. Researched Game-Specific Quirks & Architecture Advice (Collapsible Accordion) */}
      {result.gameSpecificGuide && (
        <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 md:p-6 shadow-sm" id="game-specific-advice-card">
          <div
            onClick={() => setIsGameNotesOpen(prev => !prev)}
            className="flex items-center justify-between gap-2 pb-2 border-b border-zinc-800 cursor-pointer select-none group"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setIsGameNotesOpen(prev => !prev);
              }
            }}
          >
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <h4 className="text-sm md:text-base font-bold text-zinc-100 group-hover:text-amber-300 transition-colors uppercase tracking-wider">
                Researched Engine & Architectural Notes for {game.name}
              </h4>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-zinc-400 group-hover:text-zinc-200">
              <span className="text-[11px] font-medium hidden sm:inline">
                {isGameNotesOpen ? 'Hide Notes' : 'View Notes'}
              </span>
              {isGameNotesOpen ? (
                <ChevronUp className="w-4 h-4 text-amber-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-zinc-400" />
              )}
            </div>
          </div>

          {isGameNotesOpen && (
            <div className="pt-4 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Settings that can be safely lowered */}
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/40">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 mb-2.5">
                    <ArrowDownCircle className="w-3.5 h-3.5" />
                    <span>Quick-Win Reductions (Minimal Visual Loss)</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-zinc-300">
                    {result.gameSpecificGuide.safeToLowerWithoutVisualLoss.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Heaviest settings in this game */}
                <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-900/40">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-400 mb-2.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Heaviest Performance Bottlenecks in Engine</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-zinc-300">
                    {result.gameSpecificGuide.biggestKillers.slice(0, 3).map((killer, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-rose-400 font-bold">•</span>
                        <span>{killer}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* VRAM or special note */}
              {game.vramNotes && (
                <div className="mt-4 p-3 rounded-lg bg-zinc-950/80 border border-zinc-800 text-xs text-zinc-300 flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span><strong className="text-zinc-100">VRAM & Memory Note:</strong> {game.vramNotes}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 6. Educational Settings Explainer Accordion */}
      <SettingsExplainer />

      {/* Bottom Close Results action */}
      {onClose && (
        <div className="pt-2 pb-4 flex justify-center">
          <button
            type="button"
            id="btn-close-results-bottom"
            onClick={onClose}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 hover:text-white transition-all border border-zinc-600 hover:border-zinc-400 shadow-lg cursor-pointer"
            aria-label="Close Results and select another game"
          >
            <X className="w-4 h-4 text-rose-400" />
            <span>✕ Close Results & Select Another Game</span>
          </button>
        </div>
      )}
    </div>
  );
};
