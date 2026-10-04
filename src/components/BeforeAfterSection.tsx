import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Layers,
  ArrowRight,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  HardDrive,
  Sliders,
  Tv,
  Zap,
  Activity,
  Info
} from 'lucide-react';

interface ComparisonRun {
  label: string;
  avgFps: string;
  low1PercentFps: string;
  notes: string;
}

const COMPARISON_TEMPLATES = [
  {
    id: 'ram-channel',
    title: 'RAM Upgrade (Single to Dual-Channel)',
    category: 'Hardware Upgrade',
    runA: {
      label: 'Before: 8 GB Single-Channel (1×8GB DDR4-3200)',
      avgFps: '55.2',
      low1PercentFps: '31.0',
      notes: 'Single stick memory bus bottleneck. Frequent micro-stutters during camera pans.'
    },
    runB: {
      label: 'After: 16 GB Dual-Channel (2×8GB DDR4-3200)',
      avgFps: '62.4',
      low1PercentFps: '42.5',
      notes: 'Added matched 8GB module to enable 128-bit dual-channel bandwidth.'
    }
  },
  {
    id: 'upscaling',
    title: 'Native Rendering vs. DLSS Quality',
    category: 'Graphics Technology',
    runA: {
      label: 'Native 1440p (No Upscaling)',
      avgFps: '48.0',
      low1PercentFps: '36.5',
      notes: 'Full 2560×1440 internal shader rasterization.'
    },
    runB: {
      label: '1440p + DLSS Quality (Rendered at 960p)',
      avgFps: '71.5',
      low1PercentFps: '54.0',
      notes: 'AI Tensor super-resolution with reconstructed sub-pixel detail.'
    }
  },
  {
    id: 'graphics-preset',
    title: 'Ultra Preset vs. Optimized High Preset',
    category: 'Settings Tuning',
    runA: {
      label: 'Max Ultra Settings (Full Volumetrics & Reflections)',
      avgFps: '43.2',
      low1PercentFps: '29.8',
      notes: 'Heavy ray marching compute and full volumetric fog rendering.'
    },
    runB: {
      label: 'Optimized High (Medium Fog & Screen-Space Reflections)',
      avgFps: '64.0',
      low1PercentFps: '48.2',
      notes: 'Selectively reduced non-essential heavy settings while retaining High textures.'
    }
  },
  {
    id: 'ray-tracing',
    title: 'Ray Tracing On vs. Ray Tracing Off',
    category: 'Feature Impact',
    runA: {
      label: 'Ray Tracing Ultra (Full Reflections & Shadows)',
      avgFps: '34.5',
      low1PercentFps: '22.0',
      notes: 'Heavy BVH traversal load on BVH intersection units.'
    },
    runB: {
      label: 'Ray Tracing Off (Standard Rasterized Lighting)',
      avgFps: '76.0',
      low1PercentFps: '58.5',
      notes: 'Standard raster lighting pipeline with baked global illumination.'
    }
  }
];

export const BeforeAfterSection: React.FC = () => {
  const [runA, setRunA] = useState<ComparisonRun>(COMPARISON_TEMPLATES[0].runA);
  const [runB, setRunB] = useState<ComparisonRun>(COMPARISON_TEMPLATES[0].runB);
  const [activeTemplateId, setActiveTemplateId] = useState<string>('ram-channel');

  const parsedAvgA = parseFloat(runA.avgFps);
  const parsedAvgB = parseFloat(runB.avgFps);
  const parsedLowA = runA.low1PercentFps ? parseFloat(runA.low1PercentFps) : undefined;
  const parsedLowB = runB.low1PercentFps ? parseFloat(runB.low1PercentFps) : undefined;

  const isValidAvg = !isNaN(parsedAvgA) && parsedAvgA > 0 && !isNaN(parsedAvgB) && parsedAvgB > 0;

  // Calculate percentage delta
  const avgDeltaPercent = isValidAvg ? Math.round(((parsedAvgB - parsedAvgA) / parsedAvgA) * 1000) / 10 : 0;
  const hasLow1Percent = parsedLowA !== undefined && !isNaN(parsedLowA) && parsedLowA > 0 &&
                        parsedLowB !== undefined && !isNaN(parsedLowB) && parsedLowB > 0;
  const lowDeltaPercent = hasLow1Percent ? Math.round(((parsedLowB! - parsedLowA!) / parsedLowA!) * 1000) / 10 : undefined;

  const applyTemplate = (tpl: typeof COMPARISON_TEMPLATES[0]) => {
    setActiveTemplateId(tpl.id);
    setRunA(tpl.runA);
    setRunB(tpl.runB);
  };

  const handleClear = () => {
    setActiveTemplateId('');
    setRunA({ label: 'Before Configuration', avgFps: '', low1PercentFps: '', notes: '' });
    setRunB({ label: 'After Configuration', avgFps: '', low1PercentFps: '', notes: '' });
  };

  return (
    <div className="w-full space-y-6" id="before-after-section">
      {/* Header Banner */}
      <div className="p-5 md:p-6 rounded-2xl bg-[#090c17]/90 border border-[#1f2842] shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-sky-950/80 text-sky-300 border border-sky-800/60">
                <Sliders className="w-5 h-5 text-sky-400" />
              </span>
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                Before vs. After Performance Comparison
              </h2>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-sky-950/80 text-sky-300 border border-sky-800/60 uppercase">
                A/B Testing
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400">
              Measure real-world performance differences before and after hardware upgrades, driver updates, or settings tweaks.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClear}
            className="self-start sm:self-center px-3 py-1.5 rounded-xl text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Custom Test</span>
          </button>
        </div>

        {/* Quick Comparison Templates */}
        <div className="mt-4 pt-3 border-t border-[#1f2842] flex flex-wrap items-center gap-2">
          <span className="text-xs text-zinc-400 font-semibold flex items-center gap-1 mr-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Example Comparisons:
          </span>
          {COMPARISON_TEMPLATES.map((tpl) => (
            <button
              key={tpl.id}
              type="button"
              onClick={() => applyTemplate(tpl)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                activeTemplateId === tpl.id
                  ? 'bg-sky-600 text-white border-sky-500 shadow-sm'
                  : 'bg-zinc-900 text-zinc-300 border-zinc-700 hover:bg-zinc-800 hover:text-white'
              }`}
            >
              {tpl.title}
            </button>
          ))}
        </div>
      </div>

      {/* Side-by-Side Comparison Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Run A (Before) */}
        <div className="p-5 rounded-2xl bg-[#0c0f1d]/90 border border-[#1b233a] shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2.5 border-b border-[#1f2842]">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-zinc-800 text-zinc-300 text-xs font-bold flex items-center justify-center border border-zinc-700">
                A
              </span>
              <h3 className="text-sm font-bold text-white">Before / Baseline Configuration</h3>
            </div>
            <span className="text-[10px] text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
              Reference Run
            </span>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1">
              Configuration / Settings Label
            </label>
            <input
              type="text"
              value={runA.label}
              onChange={(e) => setRunA({ ...runA, label: e.target.value })}
              placeholder="e.g. 8GB Single-Channel / Low Settings"
              className="w-full bg-zinc-900 border border-zinc-700 text-zinc-100 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-zinc-300 block mb-1">
                Average FPS <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                value={runA.avgFps}
                onChange={(e) => setRunA({ ...runA, avgFps: e.target.value })}
                placeholder="e.g. 55.0"
                className="w-full bg-[#080b15] border border-zinc-700 text-zinc-100 font-mono text-lg font-bold rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">
                1% Low FPS <span className="text-[10px] font-normal">(Optional)</span>
              </label>
              <input
                type="number"
                step="0.1"
                value={runA.low1PercentFps}
                onChange={(e) => setRunA({ ...runA, low1PercentFps: e.target.value })}
                placeholder="e.g. 31.0"
                className="w-full bg-[#080b15] border border-zinc-700 text-zinc-300 font-mono text-lg font-bold rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-zinc-400 block mb-1">Observation Notes</label>
            <textarea
              rows={2}
              value={runA.notes}
              onChange={(e) => setRunA({ ...runA, notes: e.target.value })}
              placeholder="Notes on frame pacing, thermal state, or scene tested..."
              className="w-full bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs rounded-lg p-2.5 focus:outline-none"
            />
          </div>
        </div>

        {/* Run B (After) */}
        <div className="p-5 rounded-2xl bg-[#0c0f1d]/90 border border-indigo-900/60 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-2.5 border-b border-[#1f2842]">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center border border-indigo-400">
                B
              </span>
              <h3 className="text-sm font-bold text-white">After / Upgraded Configuration</h3>
            </div>
            <span className="text-[10px] text-indigo-300 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-800/60">
              Target Test Run
            </span>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-300 block mb-1">
              Configuration / Settings Label
            </label>
            <input
              type="text"
              value={runB.label}
              onChange={(e) => setRunB({ ...runB, label: e.target.value })}
              placeholder="e.g. 16GB Dual-Channel / High Settings"
              className="w-full bg-zinc-900 border border-zinc-700 text-zinc-100 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-indigo-300 block mb-1">
                Average FPS <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                step="0.1"
                value={runB.avgFps}
                onChange={(e) => setRunB({ ...runB, avgFps: e.target.value })}
                placeholder="e.g. 62.4"
                className="w-full bg-[#080b15] border border-indigo-500/70 text-indigo-200 font-mono text-lg font-bold rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-400"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-zinc-400 block mb-1">
                1% Low FPS <span className="text-[10px] font-normal">(Optional)</span>
              </label>
              <input
                type="number"
                step="0.1"
                value={runB.low1PercentFps}
                onChange={(e) => setRunB({ ...runB, low1PercentFps: e.target.value })}
                placeholder="e.g. 42.5"
                className="w-full bg-[#080b15] border border-zinc-700 text-zinc-300 font-mono text-lg font-bold rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-zinc-400 block mb-1">Observation Notes</label>
            <textarea
              rows={2}
              value={runB.notes}
              onChange={(e) => setRunB({ ...runB, notes: e.target.value })}
              placeholder="Notes on frame pacing, thermal state, or scene tested..."
              className="w-full bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs rounded-lg p-2.5 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Comparison Analysis Results Card */}
      {isValidAvg && (
        <div className="p-5 md:p-7 rounded-2xl bg-zinc-900/90 border border-zinc-700/80 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                A/B Measured Comparison Result
              </span>
              <h3 className="text-lg md:text-xl font-bold text-white mt-0.5">
                {runA.label || 'Configuration A'} vs. {runB.label || 'Configuration B'}
              </h3>
            </div>

            <div className="flex items-center gap-3">
              <div className={`px-3.5 py-1.5 rounded-xl border flex items-center gap-1.5 font-mono font-bold text-sm ${
                avgDeltaPercent > 0
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50'
                  : avgDeltaPercent < 0
                  ? 'bg-rose-950/80 text-rose-300 border-rose-500/50'
                  : 'bg-zinc-800 text-zinc-300 border-zinc-700'
              }`}>
                {avgDeltaPercent > 0 ? (
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                ) : avgDeltaPercent < 0 ? (
                  <TrendingDown className="w-4 h-4 text-rose-400" />
                ) : null}
                <span>{avgDeltaPercent > 0 ? `+${avgDeltaPercent}%` : `${avgDeltaPercent}%`} Average FPS</span>
              </div>
            </div>
          </div>

          {/* Metric Comparison Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Metric 1: Average FPS Delta */}
            <div className="p-4 rounded-xl bg-[#0a0d18] border border-[#1b233a] space-y-1.5">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
                Average FPS Transition
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold text-zinc-400 font-mono">{parsedAvgA}</span>
                <ArrowRight className="w-4 h-4 text-zinc-500" />
                <span className={`text-2xl font-black font-mono ${avgDeltaPercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {parsedAvgB} FPS
                </span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Absolute difference:{' '}
                <strong className={avgDeltaPercent >= 0 ? 'text-emerald-300' : 'text-rose-300'}>
                  {avgDeltaPercent >= 0 ? `+${(parsedAvgB - parsedAvgA).toFixed(1)}` : (parsedAvgB - parsedAvgA).toFixed(1)} FPS
                </strong>{' '}
                ({avgDeltaPercent >= 0 ? `+${avgDeltaPercent}%` : `${avgDeltaPercent}%`})
              </p>
            </div>

            {/* Metric 2: 1% Low Stability Delta */}
            {hasLow1Percent ? (
              <div className="p-4 rounded-xl bg-[#0a0d18] border border-[#1b233a] space-y-1.5">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
                  1% Low Stability Transition
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold text-zinc-400 font-mono">{parsedLowA}</span>
                  <ArrowRight className="w-4 h-4 text-zinc-500" />
                  <span className={`text-2xl font-black font-mono ${lowDeltaPercent! >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {parsedLowB} FPS
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400">
                  Pacing improvement:{' '}
                  <strong className={lowDeltaPercent! >= 0 ? 'text-emerald-300' : 'text-rose-300'}>
                    {lowDeltaPercent! >= 0 ? `+${(parsedLowB! - parsedLowA!).toFixed(1)}` : (parsedLowB! - parsedLowA!).toFixed(1)} FPS
                  </strong>{' '}
                  ({lowDeltaPercent! >= 0 ? `+${lowDeltaPercent}%` : `${lowDeltaPercent}%`})
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-[#0a0d18] border border-[#1b233a] space-y-1.5">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
                  1% Low Tracking
                </span>
                <div className="text-sm font-semibold text-zinc-400 pt-1">
                  1% Low Not Provided
                </div>
                <p className="text-[11px] text-zinc-500">
                  Enter 1% low framerate in both runs to analyze micro-stutter reduction.
                </p>
              </div>
            )}

            {/* Metric 3: Consistency & Frame Pacing Verdict */}
            <div className="p-4 rounded-xl bg-[#0a0d18] border border-[#1b233a] space-y-1.5">
              <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
                Consistency Verdict
              </span>
              <div className="text-sm font-bold text-indigo-300 pt-0.5">
                {avgDeltaPercent >= 15
                  ? 'Major Performance Leap'
                  : avgDeltaPercent >= 7
                  ? 'Noticeable Improvement'
                  : avgDeltaPercent >= -3 && avgDeltaPercent <= 3
                  ? 'Within Margin of Error'
                  : avgDeltaPercent < -10
                  ? 'Significant Regression'
                  : 'Slight Performance Change'}
              </div>
              <p className="text-[11px] text-zinc-400">
                {hasLow1Percent && lowDeltaPercent! > avgDeltaPercent
                  ? '1% lows gained more than averages, proving superior frame delivery stability.'
                  : 'Measured change from user-entered benchmark numbers.'}
              </p>
            </div>
          </div>

          {/* Section: "What Changed?" */}
          <div className="p-4 rounded-xl bg-[#080b15] border border-zinc-800 space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-sky-400" />
              <span>What Changed?</span>
            </h4>
            <p className="text-xs leading-relaxed text-zinc-300">
              Your average framerate shifted from <strong>{parsedAvgA} FPS</strong> to{' '}
              <strong>{parsedAvgB} FPS</strong> ({avgDeltaPercent >= 0 ? `+${avgDeltaPercent}%` : `${avgDeltaPercent}%`}).
              {hasLow1Percent ? (
                <>
                  {' '}Your 1% low also changed from <strong>{parsedLowA} FPS</strong> to{' '}
                  <strong>{parsedLowB} FPS</strong> ({lowDeltaPercent! >= 0 ? `+${lowDeltaPercent}%` : `${lowDeltaPercent}%`}).
                  {lowDeltaPercent! >= 10
                    ? ' This indicates that the second configuration significantly reduced traversal micro-stutters and smoothed frame pacing.'
                    : ' The frame pacing remained consistent between both configurations.'}
                </>
              ) : (
                ' This confirms a measurable difference in raw render throughput between the two tested configurations.'
              )}
            </p>
            <p className="text-[11px] text-zinc-400">
              <strong>Evidence Note:</strong> This analysis strictly reflects the numerical deltas calculated between your two entered test runs.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
