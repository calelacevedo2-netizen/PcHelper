import React, { useState } from 'react';
import {
  Laptop,
  Monitor,
  Cpu,
  Layers,
  HardDrive,
  AlertTriangle,
  CheckCircle2,
  X,
  Gauge,
  HelpCircle,
  ShieldCheck,
  RotateCcw,
  Zap,
  Fan,
  Tv,
  BarChart3,
  ExternalLink,
  Check,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { PcTierResult } from '../types';

interface PcTierSectionProps {
  result: PcTierResult;
  onClose: () => void;
  onAdjust: () => void;
}

export const PcTierSection: React.FC<PcTierSectionProps> = ({
  result,
  onClose,
  onAdjust
}) => {
  // Color configuration by main tier
  const tierThemes = {
    'Potato': {
      border: 'border-stone-600/50',
      bgCard: 'bg-stone-950/60',
      badge: 'bg-stone-800/80 text-amber-300 border-amber-700/50',
      glow: 'shadow-stone-950/40',
      accentText: 'text-amber-400',
      dotBg: 'bg-amber-400'
    },
    'Entry-Level': {
      border: 'border-amber-500/40',
      bgCard: 'bg-amber-950/20',
      badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      glow: 'shadow-amber-950/30',
      accentText: 'text-amber-400',
      dotBg: 'bg-amber-400'
    },
    'Mid-Range': {
      border: 'border-sky-500/40',
      bgCard: 'bg-sky-950/20',
      badge: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
      glow: 'shadow-sky-950/30',
      accentText: 'text-sky-400',
      dotBg: 'bg-sky-400'
    },
    'High-End': {
      border: 'border-indigo-500/40',
      bgCard: 'bg-indigo-950/20',
      badge: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
      glow: 'shadow-indigo-950/30',
      accentText: 'text-indigo-400',
      dotBg: 'bg-indigo-400'
    },
    'Top-Tier': {
      border: 'border-emerald-500/40',
      bgCard: 'bg-emerald-950/20',
      badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      glow: 'shadow-emerald-950/30',
      accentText: 'text-emerald-400',
      dotBg: 'bg-emerald-400'
    }
  }[result.mainTier];

  const isLaptop = result.deviceType === 'laptop';
  const isPotato = result.mainTier === 'Potato';
  const [isDeviceSpecsOpen, setIsDeviceSpecsOpen] = useState(false);

  // Calculate position on the category scale (Low: ~18%, Average: ~50%, Good: ~82%)
  const getScalePosition = () => {
    if (result.subTier.includes('Low')) return 18;
    if (result.subTier.includes('Good')) return 82;
    return 50; // Average or default center
  };

  return (
    <div id="pc-tier-results-display" className="w-full space-y-6 pt-4 animate-in fade-in duration-300">
      {/* 1. Main Hardware Summary & Overall Tier Card */}
      <div
        id="pc-tier-main-card"
        className={`rounded-2xl p-6 md:p-8 border backdrop-blur-md shadow-xl transition-all ${tierThemes.bgCard} ${tierThemes.border} ${tierThemes.glow}`}
      >
        {/* Card Header with Close Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-zinc-800/80">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className={`inline-flex items-center text-xs md:text-sm font-semibold px-3 py-1 rounded-full border ${tierThemes.badge}`}>
                {isPotato ? '🥔 POTATO' : result.mainTier.toUpperCase()}
              </span>
              <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-zinc-800/90 text-zinc-300 border border-zinc-700/60 flex items-center gap-1">
                {isLaptop ? (
                  <>
                    <Laptop className="w-3.5 h-3.5 text-sky-400" />
                    <span>Laptop Hardware</span>
                  </>
                ) : (
                  <>
                    <Monitor className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Desktop Hardware</span>
                  </>
                )}
              </span>
              {result.confidence && (
                <span
                  id="pc-tier-confidence-badge"
                  className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${
                    result.confidence === 'High'
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60'
                      : result.confidence === 'Medium'
                      ? 'bg-sky-950/80 text-sky-300 border-sky-700/60'
                      : 'bg-amber-950/80 text-amber-300 border-amber-700/60'
                  }`}
                  title={result.confidenceReason}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Confidence: {result.confidence}</span>
                </span>
              )}
            </div>
            <h2 className="text-xs uppercase tracking-wider text-zinc-400 font-semibold">
              Your PC Tier
            </h2>
            <div className={`text-3xl md:text-4xl font-extrabold tracking-tight mt-1 ${tierThemes.accentText}`}>
              {isPotato ? `🥔 ${result.subTier}` : result.subTier}
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center flex-shrink-0">
            <button
              type="button"
              id="btn-adjust-pc-tier-specs"
              onClick={onAdjust}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs md:text-sm font-medium rounded-xl bg-zinc-800/90 hover:bg-zinc-700 text-zinc-200 transition-colors border border-zinc-700 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Adjust Specs</span>
            </button>

            {/* Prominent Close Results Button */}
            <button
              type="button"
              id="btn-close-pc-tier-results"
              onClick={onClose}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs md:text-sm font-bold rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-100 hover:text-white transition-all border border-zinc-600 hover:border-zinc-400 shadow-md cursor-pointer"
              aria-label="Close Tier Results"
            >
              <X className="w-4 h-4 text-rose-400" />
              <span>✕ Close Results</span>
            </button>
          </div>
        </div>

        {/* Primary Classification Sentence */}
        <div className="pt-4 pb-2">
          <p className="text-base md:text-lg font-medium text-zinc-200 leading-relaxed">
            {result.overallExplanation}
          </p>
          <p className="text-xs md:text-sm text-zinc-400 mt-1">
            {result.mainTierDescription}
          </p>
          {result.confidenceReason && (
            <p id="pc-tier-confidence-reason" className="text-[11px] text-zinc-500 mt-2 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
              <span><strong className="text-zinc-400">Evaluation Evidence ({result.confidence} Confidence):</strong> {result.confidenceReason}</span>
            </p>
          )}
        </div>

        {/* Performance Scale (Rule 15: Visual Indicator within Category) */}
        <div
          id="pc-tier-performance-scale"
          className="my-5 p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80"
        >
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-2 font-medium">
            <span>Category Performance Scale: <strong className="text-zinc-200">{result.mainTier}</strong></span>
            <span className={`font-semibold ${tierThemes.accentText}`}>{result.subTier}</span>
          </div>

          {isPotato ? (
            <div className="space-y-2">
              <div className="relative h-2 rounded-full bg-zinc-800 overflow-hidden">
                <div className="absolute inset-y-0 left-0 bg-stone-600 rounded-full" style={{ width: '15%' }} />
              </div>
              <div className="flex justify-between text-[11px] text-zinc-500">
                <span className="text-amber-400 font-semibold">● Outdated Hardware</span>
                <span>Unsuitable for Modern Gaming</span>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {/* Scale bar with active marker */}
              <div className="relative h-2.5 rounded-full bg-zinc-800/90 border border-zinc-700/50">
                <div
                  className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-zinc-900 shadow-lg transition-all ${tierThemes.dotBg}`}
                  style={{ left: `${getScalePosition()}%` }}
                />
              </div>
              {/* Subtier Labels with active highlight */}
              <div className="flex justify-between text-xs pt-1">
                <span className={`transition-colors ${result.subTier.includes('Low') ? `${tierThemes.accentText} font-bold` : 'text-zinc-400'}`}>
                  Low
                </span>
                <span className={`transition-colors ${result.subTier.includes('Average') ? `${tierThemes.accentText} font-bold` : 'text-zinc-400'}`}>
                  Average
                </span>
                <span className={`transition-colors ${result.subTier.includes('Good') ? `${tierThemes.accentText} font-bold` : 'text-zinc-400'}`}>
                  Good
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Custom Hardware Mismatch Notice */}
        {result.mismatchNotice && (
          <div
            id="hardware-mismatch-notice"
            className="mt-3 p-3.5 rounded-xl bg-amber-950/40 border border-amber-600/60 text-amber-200 text-xs flex items-start gap-2.5"
          >
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-bold block text-amber-300">
                Custom Hardware Notice
              </span>
              <span>{result.mismatchNotice}</span>
            </div>
          </div>
        )}

        {/* Selected Device Model Specifications Block (Collapsible) */}
        {result.selectedDevice && (
          <div
            id="pc-tier-device-specs-card"
            className="mt-4 rounded-xl bg-zinc-900/90 border border-indigo-500/40 overflow-hidden"
          >
            <div
              onClick={() => setIsDeviceSpecsOpen(prev => !prev)}
              className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 cursor-pointer select-none group hover:bg-zinc-850/60 transition-colors"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setIsDeviceSpecsOpen(prev => !prev);
                }
              }}
            >
              <div className="flex items-center gap-2.5">
                <span className="p-1.5 rounded-lg bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 shrink-0">
                  {isLaptop ? <Laptop className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
                </span>
                <div>
                  <span className="text-[11px] text-zinc-400 block uppercase font-semibold">
                    Verified Device Model
                  </span>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-zinc-100 group-hover:text-indigo-300 transition-colors">
                      {result.selectedDevice.name}
                    </span>
                    {result.selectedDevice.modelNumber && (
                      <span className="text-[11px] text-zinc-400 font-mono">
                        ({result.selectedDevice.modelNumber})
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="text-[11px] text-zinc-300 bg-zinc-800 border border-zinc-700 px-2.5 py-0.5 rounded-full">
                  {result.selectedDevice.brand} • {result.selectedDevice.productFamily}
                </span>
                <div className="flex items-center gap-1 text-xs text-zinc-400 group-hover:text-zinc-200 ml-1">
                  <span className="text-[11px] hidden sm:inline font-medium">
                    {isDeviceSpecsOpen ? 'Hide Details' : 'View Specs & Benchmarks'}
                  </span>
                  {isDeviceSpecsOpen ? (
                    <ChevronUp className="w-4 h-4 text-indigo-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-zinc-400" />
                  )}
                </div>
              </div>
            </div>

            {isDeviceSpecsOpen && (
              <div className="p-4 pt-1 border-t border-zinc-800/80 space-y-3 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-xs pt-2">
                  {result.selectedDevice.gpuTgpWatts && (
                    <div className="p-2.5 rounded-lg bg-zinc-950/70 border border-zinc-800">
                      <span className="text-zinc-400 text-[11px] uppercase font-semibold flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 text-amber-400" /> GPU Power Limit (TGP)
                      </span>
                      <span className="font-bold text-amber-300 block mt-1">
                        {result.selectedDevice.gpuTgpWatts}
                      </span>
                    </div>
                  )}

                  {result.selectedDevice.coolingNotes && (
                    <div className="p-2.5 rounded-lg bg-zinc-950/70 border border-zinc-800">
                      <span className="text-zinc-400 text-[11px] uppercase font-semibold flex items-center gap-1">
                        <Fan className="w-3.5 h-3.5 text-sky-400" /> Thermal Solution
                      </span>
                      <span className="text-zinc-200 block mt-1 text-[11px] leading-snug">
                        {result.selectedDevice.coolingNotes}
                      </span>
                    </div>
                  )}

                  {result.selectedDevice.display && (
                    <div className="p-2.5 rounded-lg bg-zinc-950/70 border border-zinc-800">
                      <span className="text-zinc-400 text-[11px] uppercase font-semibold flex items-center gap-1">
                        <Tv className="w-3.5 h-3.5 text-indigo-400" /> Display Configuration
                      </span>
                      <span className="text-zinc-200 block mt-1 text-[11px]">
                        {result.selectedDevice.display}
                      </span>
                    </div>
                  )}
                </div>

                {/* Verified Chassis Benchmarks */}
                {result.selectedDevice.benchmarks && result.selectedDevice.benchmarks.length > 0 && (
                  <div className="pt-2 border-t border-zinc-800/80">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-300 mb-2">
                      <BarChart3 className="w-4 h-4 text-emerald-400" />
                      <span>Real-World Tested Performance (Direct Device Benchmarks):</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {result.selectedDevice.benchmarks.map((bm, idx) => (
                        <div
                          key={idx}
                          className="p-2 rounded-lg bg-zinc-950/80 border border-zinc-800/80 text-[11px] flex flex-col justify-between"
                        >
                          <div>
                            <span className="font-bold text-zinc-100 block">{bm.game}</span>
                            <span className="text-zinc-400 text-[10px]">
                              {bm.resolution} • {bm.preset}
                            </span>
                          </div>
                          <div className="mt-1 flex items-baseline justify-between">
                            <span className="text-emerald-400 font-extrabold text-xs">
                              {bm.avgFps} FPS avg
                            </span>
                            {bm.low1PercentFps && (
                              <span className="text-zinc-400 text-[10px]">
                                (1% low: {bm.low1PercentFps})
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    {result.selectedDevice.source && (
                      <p className="text-[10px] text-zinc-400 mt-2 flex items-center justify-between">
                        <span>Source: {result.selectedDevice.source}</span>
                        {result.selectedDevice.sourceUrl && (
                          <a
                            href={result.selectedDevice.sourceUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-indigo-400 hover:underline inline-flex items-center gap-0.5"
                          >
                            Official Specs <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Hardware Analyzed Summary Block */}
        <div className="mt-5 p-4 rounded-xl bg-zinc-900/80 border border-zinc-800/90">
          <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>Hardware Analyzed</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs md:text-sm">
            <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/60">
              <span className="text-zinc-500 block text-[11px] uppercase font-semibold">Form Factor</span>
              <span className="text-zinc-200 font-bold flex items-center gap-1.5 mt-0.5">
                {isLaptop ? <Laptop className="w-3.5 h-3.5 text-sky-400" /> : <Monitor className="w-3.5 h-3.5 text-indigo-400" />}
                {isLaptop ? 'Laptop' : 'Desktop PC'}
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/60">
              <span className="text-zinc-500 block text-[11px] uppercase font-semibold">Processor (CPU)</span>
              <span className="text-zinc-100 font-bold block truncate mt-0.5" title={result.cpu.name}>
                {result.cpu.name}
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/60">
              <span className="text-zinc-500 block text-[11px] uppercase font-semibold">Graphics (GPU)</span>
              <span className="text-zinc-100 font-bold block truncate mt-0.5" title={`${result.gpu.name} — ${result.gpu.vram} GB VRAM`}>
                {result.gpu.name} ({result.gpu.vram} GB)
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/60">
              <span className="text-zinc-500 block text-[11px] uppercase font-semibold">Memory (RAM)</span>
              <span className="text-zinc-100 font-bold block mt-0.5">
                {result.ram.capacityGb} GB RAM
              </span>
              <div className="flex flex-wrap items-center gap-1 mt-1 text-[10px]">
                <span className="text-zinc-300 font-medium">
                  {result.memoryChannel || result.ram.channel || 'Dual-Channel'}
                </span>
                {result.ramModuleSetup && (
                  <span className="text-zinc-400">({result.ramModuleSetup})</span>
                )}
              </div>
              {result.ramUpgradeStatus === 'supported_upgrade' && (
                <span className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-300 bg-emerald-950/70 px-1.5 py-0.5 rounded border border-emerald-800/60">
                  <Check className="w-2.5 h-2.5" /> Supported Upgrade
                </span>
              )}
              {result.ramUpgradeStatus === 'factory' && (
                <span className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-medium text-zinc-400 bg-zinc-900/90 px-1.5 py-0.5 rounded border border-zinc-800">
                  Factory Configuration
                </span>
              )}
              {result.ramUpgradeStatus === 'unsupported' && (
                <span className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-semibold text-amber-300 bg-amber-950/70 px-1.5 py-0.5 rounded border border-amber-800/60">
                  <AlertTriangle className="w-2.5 h-2.5" /> Unverified Configuration
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Biggest Limitation Section (Rule 13) */}
      <div
        id="pc-tier-limitation-card"
        className="rounded-2xl p-6 border border-zinc-800 bg-zinc-900/60 backdrop-blur-sm"
      >
        <div className="flex items-start gap-3.5">
          <div className={`p-2.5 rounded-xl flex-shrink-0 ${
            result.biggestLimitation === 'None / Balanced'
              ? 'bg-emerald-950/50 border border-emerald-800 text-emerald-400'
              : 'bg-amber-950/50 border border-amber-800 text-amber-400'
          }`}>
            {result.biggestLimitation === 'None / Balanced' ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <AlertTriangle className="w-5 h-5" />
            )}
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-wider text-zinc-400 font-bold">
              Biggest Limitation
            </h3>
            <div className="text-lg md:text-xl font-bold text-zinc-100 mt-0.5">
              {result.biggestLimitation === 'None / Balanced' ? (
                <span className="text-emerald-300">None / Balanced System</span>
              ) : (
                <span>Limitation: <strong className="text-amber-300">{result.biggestLimitation}</strong></span>
              )}
            </div>
            <p className="text-xs md:text-sm text-zinc-300 mt-1 leading-relaxed">
              {result.limitationExplanation}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Component Breakdown (Rule 13: CPU, GPU, VRAM, RAM) */}
      <div
        id="pc-tier-why-card"
        className="rounded-2xl p-6 md:p-8 border border-zinc-800 bg-zinc-900/70 backdrop-blur-sm space-y-6"
      >
        <div className="border-b border-zinc-800 pb-4">
          <h2 className="text-lg md:text-xl font-bold text-zinc-100 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-indigo-400" />
            <span>Hardware Component Breakdown</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Evaluated against real-world benchmark data, memory sensitivity, and hardware architecture.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* GPU Breakdown */}
          <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <Gauge className="w-4 h-4 text-indigo-400" />
                <span>GPU</span>
              </span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-950/80 text-indigo-300 border border-indigo-800/70">
                {result.gpu.tier}
              </span>
            </div>
            <div className="text-sm font-semibold text-zinc-200">
              {result.gpu.name}
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              {result.gpu.explanation}
            </p>
            {result.gpu.limitationWarning && (
              <p className="text-xs text-amber-300 font-medium">
                {result.gpu.limitationWarning}
              </p>
            )}
          </div>

          {/* CPU Breakdown */}
          <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-sky-400" />
                <span>CPU</span>
              </span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-sky-950/80 text-sky-300 border border-sky-800/70">
                {result.cpu.tier}
              </span>
            </div>
            <div className="text-sm font-semibold text-zinc-200">
              {result.cpu.name}
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              {result.cpu.explanation}
            </p>
            {result.cpu.limitationWarning && (
              <p className="text-xs text-amber-300 font-medium">
                {result.cpu.limitationWarning}
              </p>
            )}
          </div>

          {/* VRAM Breakdown */}
          <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-amber-400" />
                <span>VRAM</span>
              </span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-950/80 text-amber-300 border border-amber-800/70">
                {result.vram.tier}
              </span>
            </div>
            <div className="text-sm font-semibold text-zinc-200">
              {result.vram.capacityGb} GB Video Memory
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              {result.vram.explanation}
            </p>
            {result.vram.limitationWarning && (
              <p className="text-xs text-amber-300 font-medium">
                {result.vram.limitationWarning}
              </p>
            )}
          </div>

          {/* RAM Breakdown */}
          <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <HardDrive className="w-4 h-4 text-emerald-400" />
                <span>RAM</span>
              </span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/70">
                {result.ram.tier}
              </span>
            </div>
            <div className="text-sm font-semibold text-zinc-200">
              {result.ram.capacityGb} GB System Memory ({result.memoryChannel || 'Dual-Channel'})
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              {result.ram.explanation}
            </p>
            {result.ramModuleSetup && (
              <p className="text-[11px] text-zinc-400">
                Module configuration: <span className="text-zinc-200 font-medium">{result.ramModuleSetup}</span>
              </p>
            )}
            {result.ram.details && (
              <p className="text-[11px] text-indigo-300 bg-indigo-950/40 p-2 rounded-lg border border-indigo-900/40">
                {result.ram.details}
              </p>
            )}
            {result.memoryChannelLimitation && (
              <p className="text-xs text-sky-300 font-medium bg-sky-950/40 p-2 rounded-lg border border-sky-900/40 flex items-start gap-1.5">
                <Info className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                <span>{result.memoryChannelLimitation}</span>
              </p>
            )}
            {result.ram.limitationWarning && (
              <p className="text-xs text-amber-300 font-medium">
                {result.ram.limitationWarning}
              </p>
            )}
            {result.ramStatusNote && result.ramUpgradeStatus === 'unsupported' && (
              <p className="text-xs text-amber-300 font-medium bg-amber-950/40 p-2 rounded-lg border border-amber-900/40 flex items-start gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>{result.ramStatusNote}</span>
              </p>
            )}
          </div>
        </div>

        {/* Overall Synthesis */}
        <div className="pt-4 border-t border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-950/40 p-4 rounded-xl">
          <div>
            <span className="text-xs uppercase font-bold text-zinc-400">Overall PC Tier</span>
            <div className={`text-xl font-extrabold ${tierThemes.accentText}`}>
              {isPotato ? `🥔 ${result.subTier}` : result.subTier}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="self-start sm:self-center px-4 py-2 text-xs md:text-sm font-semibold rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 cursor-pointer flex items-center gap-1.5"
          >
            <X className="w-4 h-4 text-rose-400" />
            <span>✕ Close Results</span>
          </button>
        </div>
      </div>
    </div>
  );
};
