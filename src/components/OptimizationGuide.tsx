import React, { useState } from 'react';
import {
  RecommendationResult,
  OptimizationGoal,
  TargetFpsOption,
  Game,
  GPU,
  CPU,
  RamOption
} from '../types';
import {
  Sliders,
  Zap,
  Sparkles,
  Gauge,
  Info,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Cpu,
  Layers,
  HardDrive,
  MonitorCheck
} from 'lucide-react';

interface OptimizationGuideProps {
  result: RecommendationResult;
  game: Game;
  gpu: GPU;
  cpu: CPU;
  ram: RamOption;
  currentGoal: OptimizationGoal;
  currentTargetFps: TargetFpsOption;
  customTargetFps?: number;
  onGoalChange: (goal: OptimizationGoal, targetFps: TargetFpsOption, customFps?: number) => void;
}

export const OptimizationGuide: React.FC<OptimizationGuideProps> = ({
  result,
  game,
  gpu,
  cpu,
  ram,
  currentGoal,
  currentTargetFps,
  customTargetFps,
  onGoalChange
}) => {
  const [expandedExplanation, setExpandedExplanation] = useState<string | null>(null);
  const [isFpsStepsOpen, setIsFpsStepsOpen] = useState(false);
  const [isGraphicsStepsOpen, setIsGraphicsStepsOpen] = useState(false);
  const [customFpsInput, setCustomFpsInput] = useState<string>(
    customTargetFps ? String(customTargetFps) : '75'
  );
  const [showCustomInput, setShowCustomInput] = useState<boolean>(currentTargetFps === 'custom');

  const { recommendedSettings, fpsSteps, graphicsSteps } = result;
  const explanations = recommendedSettings.explanations || {};

  const toggleExplanation = (key: string) => {
    setExpandedExplanation(prev => (prev === key ? null : key));
  };

  const handleGoalSelect = (goal: OptimizationGoal) => {
    onGoalChange(goal, currentTargetFps, customTargetFps);
  };

  const handleFpsSelect = (fps: TargetFpsOption) => {
    if (fps === 'custom') {
      setShowCustomInput(true);
      const parsed = parseInt(customFpsInput, 10) || 75;
      onGoalChange(currentGoal, 'custom', parsed);
    } else {
      setShowCustomInput(false);
      onGoalChange(currentGoal, fps, undefined);
    }
  };

  const handleCustomFpsChange = (val: string) => {
    setCustomFpsInput(val);
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed) && parsed >= 20 && parsed <= 360) {
      onGoalChange(currentGoal, 'custom', parsed);
    }
  };

  // Structured list of settings to display in the main optimization grid
  const primarySettingsList = [
    {
      key: 'resolution',
      label: 'Target Resolution',
      value: recommendedSettings.resolutionLabel,
      resource: 'GPU',
      explanation: explanations.resolution
    },
    {
      key: 'preset',
      label: 'Overall Preset',
      value: recommendedSettings.preset,
      resource: 'Balanced',
      explanation: explanations.preset
    },
    {
      key: 'textures',
      label: 'Texture Quality',
      value: recommendedSettings.textures,
      resource: 'VRAM',
      explanation: explanations.textures
    },
    {
      key: 'shadows',
      label: 'Shadow Quality',
      value: recommendedSettings.shadows,
      resource: 'GPU',
      explanation: explanations.shadows
    },
    {
      key: 'reflections',
      label: 'Reflections',
      value: recommendedSettings.reflections || 'Medium',
      resource: 'GPU',
      explanation: explanations.reflections
    },
    {
      key: 'effects',
      label: 'Effects Quality',
      value: recommendedSettings.effects,
      resource: 'GPU',
      explanation: explanations.effects
    },
    {
      key: 'viewDistance',
      label: 'View Distance / LOD',
      value: recommendedSettings.viewDistance || 'Medium',
      resource: 'CPU',
      explanation: explanations.viewDistance
    },
    {
      key: 'volumetrics',
      label: 'Volumetrics & Fog',
      value: recommendedSettings.volumetrics || 'Medium',
      resource: 'GPU',
      explanation: explanations.volumetrics
    },
    {
      key: 'rayTracing',
      label: 'Ray Tracing',
      value: recommendedSettings.rayTracing,
      resource: 'GPU',
      explanation: explanations.rayTracing
    },
    {
      key: 'upscaling',
      label: 'Upscaling (DLSS / FSR / XeSS)',
      value: recommendedSettings.upscaling,
      resource: 'GPU',
      explanation: explanations.upscaling
    }
  ];

  if (recommendedSettings.frameGeneration) {
    primarySettingsList.push({
      key: 'frameGeneration',
      label: 'Frame Generation',
      value: recommendedSettings.frameGeneration,
      resource: 'GPU',
      explanation: explanations.frameGeneration
    });
  }

  const getResourceBadge = (res?: string) => {
    switch (res) {
      case 'VRAM':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded bg-purple-950/70 text-purple-300 border border-purple-800/40">
            <HardDrive className="w-3 h-3" />
            VRAM Bound
          </span>
        );
      case 'CPU':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded bg-sky-950/70 text-sky-300 border border-sky-800/40">
            <Cpu className="w-3 h-3" />
            CPU Bound
          </span>
        );
      case 'GPU':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded bg-indigo-950/70 text-indigo-300 border border-indigo-800/40">
            <Layers className="w-3 h-3" />
            GPU Shader
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700/50">
            <MonitorCheck className="w-3 h-3" />
            Balanced
          </span>
        );
    }
  };

  return (
    <div id="optimize-my-game-section" className="space-y-6">
      {/* Header & Goal Selector Bar */}
      <div className="bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-5 md:p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-zinc-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-950/80 text-indigo-300 border border-indigo-800/50">
                <Sliders className="w-3.5 h-3.5" />
                Optimize My Game Engine
              </span>
              <span className="text-xs text-zinc-400">
                Calibrated for {game.name}
              </span>
            </div>
            <h3 className="text-xl font-bold text-zinc-100 tracking-tight">
              In-Game Optimization Guide
            </h3>
            <p className="text-xs md:text-sm text-zinc-400 mt-1 max-w-2xl">
              Select your performance priority below. The engine dynamically calculates settings by analyzing GPU compute, VRAM capacity ({gpu.vram} GB), CPU draw-call limits, and verified engine characteristics.
            </p>
          </div>

          {/* Goal Selector Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="inline-flex p-1 rounded-xl bg-zinc-950 border border-zinc-800" role="group" aria-label="Optimization Goal">
              <button
                type="button"
                id="goal-balanced-btn"
                onClick={() => handleGoalSelect('balanced')}
                className={`flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  currentGoal === 'balanced'
                    ? 'bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Gauge className="w-3.5 h-3.5 text-indigo-400" />
                <span>Balanced</span>
              </button>

              <button
                type="button"
                id="goal-graphics-btn"
                onClick={() => handleGoalSelect('graphics')}
                className={`flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  currentGoal === 'graphics'
                    ? 'bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Best Graphics</span>
              </button>

              <button
                type="button"
                id="goal-fps-btn"
                onClick={() => handleGoalSelect('fps')}
                className={`flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  currentGoal === 'fps'
                    ? 'bg-zinc-800 text-zinc-100 shadow-sm border border-zinc-700'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                <span>More FPS</span>
              </button>
            </div>
          </div>
        </div>

        {/* Target Framerate Selector */}
        <div className="mt-4 pt-4 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-zinc-400 font-medium flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-indigo-400" />
              Target Framerate Baseline:
            </span>
            <div className="inline-flex items-center gap-1 p-0.5 rounded-lg bg-zinc-950 border border-zinc-800">
              {(['any', 30, 60, 120, 'custom'] as TargetFpsOption[]).map((fps) => {
                const label = fps === 'any' ? 'Uncapped' : fps === 'custom' ? 'Custom' : `${fps} FPS`;
                const isSelected = currentTargetFps === fps;
                return (
                  <button
                    key={String(fps)}
                    type="button"
                    onClick={() => handleFpsSelect(fps)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600 text-white font-semibold'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
            {showCustomInput && (
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  min={24}
                  max={360}
                  value={customFpsInput}
                  onChange={(e) => handleCustomFpsChange(e.target.value)}
                  className="w-16 px-2 py-1 text-xs font-mono bg-zinc-950 border border-zinc-700 rounded text-zinc-100 focus:outline-none focus:border-indigo-500"
                  placeholder="FPS"
                />
                <span className="text-zinc-400 text-xs">FPS</span>
              </div>
            )}
          </div>

          <div className="text-xs text-zinc-400 flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-zinc-300">
              Active Strategy: <strong className="text-indigo-300 capitalize">{currentGoal}</strong>
              {result.targetFps ? ` • Target ${result.targetFps}` : ''}
            </span>
          </div>
        </div>
      </div>

      {/* Main Settings Table / Cards */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 md:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 pb-3 border-b border-zinc-800">
          <div>
            <h4 className="text-base font-bold text-zinc-100 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-400" />
              Recommended In-Game Settings
            </h4>
            <p className="text-xs text-zinc-400 mt-0.5">
              Apply these values in {game.name}'s Video & Graphics options. Click any row for the engineering reason.
            </p>
          </div>
          <div className="text-xs font-semibold px-3 py-1 rounded-full bg-zinc-800 text-zinc-200 border border-zinc-700 self-start sm:self-center">
            Suggested Baseline: {recommendedSettings.preset}
          </div>
        </div>

        {/* Dense, Clean Table / Card Layout */}
        <div className="space-y-2">
          {primarySettingsList.map((item) => {
            const isExpanded = expandedExplanation === item.key;
            return (
              <div
                key={item.key}
                className={`rounded-xl border transition-all ${
                  isExpanded
                    ? 'bg-zinc-950/80 border-indigo-900/60'
                    : 'bg-zinc-950/50 border-zinc-800/80 hover:border-zinc-700'
                }`}
              >
                <div
                  onClick={() => toggleExplanation(item.key)}
                  className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleExplanation(item.key);
                    }
                  }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-zinc-200">
                      {item.label}
                    </span>
                    {getResourceBadge(item.resource)}
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <span className="text-sm font-bold text-indigo-300 font-mono">
                      {item.value}
                    </span>
                    <button
                      type="button"
                      className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1 cursor-pointer"
                      aria-label="Toggle explanation"
                    >
                      <span className="text-[11px] underline hidden sm:inline">Why?</span>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5 text-zinc-400" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Inline "Why this setting?" Explainer Drawer */}
                {isExpanded && item.explanation && (
                  <div className="px-4 pb-3.5 pt-1 border-t border-zinc-800/80 text-xs text-zinc-300">
                    <div className="p-3 rounded-lg bg-zinc-900/90 border border-zinc-800 flex items-start gap-2.5">
                      <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <div className="font-semibold text-zinc-200">
                          Why {item.value} for {item.label}?
                        </div>
                        <p className="text-zinc-300 leading-relaxed text-xs">
                          {item.explanation.explanation}
                        </p>
                        {item.explanation.safeToReduce && (
                          <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1">
                            <TrendingDown className="w-3 h-3" />
                            <span>Safe to lower further if you need an additional FPS buffer.</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Other Important Settings Row */}
        {recommendedSettings.otherImportantSettings && recommendedSettings.otherImportantSettings.length > 0 && (
          <div className="mt-4 pt-4 border-t border-zinc-800">
            <div className="text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-wider">
              Secondary & Quality-of-Life Settings:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-300">
              {recommendedSettings.otherImportantSettings.map((setting, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/80 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
                  <span>{setting}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Two-Column Decision Grid: "⚡ Need more FPS?" vs "🎨 Want better graphics?" */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* 1. Need More FPS? */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col justify-between" id="need-more-fps-card">
          <div>
            <div
              onClick={() => setIsFpsStepsOpen(prev => !prev)}
              className="flex items-center justify-between gap-2 pb-3 border-b border-zinc-800 cursor-pointer select-none group"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setIsFpsStepsOpen(prev => !prev);
                }
              }}
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800/60 shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm md:text-base font-bold text-zinc-100 group-hover:text-emerald-300 transition-colors">
                      Need More FPS?
                    </h4>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                      {fpsSteps?.length || 0} Steps
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Prioritized in order of maximum gain with minimal visual loss.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-zinc-400 group-hover:text-zinc-200 shrink-0">
                <span className="text-[11px] font-medium hidden sm:inline">
                  {isFpsStepsOpen ? 'Hide' : 'View Steps'}
                </span>
                {isFpsStepsOpen ? (
                  <ChevronUp className="w-4 h-4 text-emerald-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-zinc-400" />
                )}
              </div>
            </div>

            {isFpsStepsOpen && (
              <div className="pt-3 animate-in fade-in duration-200">
                {fpsSteps && fpsSteps.length > 0 ? (
                  <div className="space-y-3">
                    {fpsSteps.map((step) => (
                      <div
                        key={step.stepNumber}
                        className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80 hover:border-zinc-700 transition-all"
                      >
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[11px] font-bold flex items-center justify-center shrink-0">
                              {step.stepNumber}
                            </span>
                            <span className="text-xs font-bold text-zinc-200">
                              {step.settingName}
                            </span>
                          </div>
                          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                            step.potentialEffect === 'Large'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                              : step.potentialEffect === 'Moderate'
                              ? 'bg-sky-950 text-sky-300 border border-sky-800/60'
                              : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                          }`}>
                            +{step.potentialEffect} FPS Impact
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs font-mono mb-2">
                          <span className="text-zinc-400">{step.fromValue}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-zinc-500" />
                          <span className="text-emerald-400 font-bold">{step.toValue}</span>
                        </div>

                        <p className="text-[11px] text-zinc-400 leading-relaxed">
                          <strong className="text-zinc-300">Visual Tradeoff:</strong> {step.visualTradeoff}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-400 italic">
                    Hardware is already at the lowest viable settings baseline for this configuration.
                  </p>
                )}
                <div className="mt-4 pt-3 border-t border-zinc-800/80 text-[11px] text-zinc-400 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Lowering shadows or adjusting upscaler saves the most frametime across modern game engines.</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 2. Want Better Graphics? */}
        <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 md:p-6 shadow-sm flex flex-col justify-between" id="want-better-graphics-card">
          <div>
            <div
              onClick={() => setIsGraphicsStepsOpen(prev => !prev)}
              className="flex items-center justify-between gap-2 pb-3 border-b border-zinc-800 cursor-pointer select-none group"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setIsGraphicsStepsOpen(prev => !prev);
                }
              }}
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-amber-950 text-amber-400 border border-amber-800/60 shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm md:text-base font-bold text-zinc-100 group-hover:text-amber-300 transition-colors">
                      Want Better Graphics?
                    </h4>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800/60">
                      {graphicsSteps?.length || 0} Upgrades
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Safe visual settings with little-to-no performance penalty.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-zinc-400 group-hover:text-zinc-200 shrink-0">
                <span className="text-[11px] font-medium hidden sm:inline">
                  {isGraphicsStepsOpen ? 'Hide' : 'View Upgrades'}
                </span>
                {isGraphicsStepsOpen ? (
                  <ChevronUp className="w-4 h-4 text-amber-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-zinc-400" />
                )}
              </div>
            </div>

            {isGraphicsStepsOpen && (
              <div className="pt-3 animate-in fade-in duration-200">
                {graphicsSteps && graphicsSteps.length > 0 ? (
                  <div className="space-y-3">
                    {graphicsSteps.map((step) => (
                      <div
                        key={step.stepNumber}
                        className="p-3.5 rounded-xl bg-zinc-950/60 border border-zinc-800/80 hover:border-zinc-700 transition-all"
                      >
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-amber-950 text-amber-300 border border-amber-800 text-[11px] font-bold flex items-center justify-center shrink-0">
                              {step.stepNumber}
                            </span>
                            <span className="text-xs font-bold text-zinc-200">
                              {step.settingName}
                            </span>
                          </div>
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-950/70 text-amber-300 border border-amber-800/60 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" />
                            Safe Upgrade
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs font-mono mb-2">
                          <span className="text-zinc-400">{step.fromValue}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-zinc-500" />
                          <span className="text-amber-300 font-bold">{step.toValue}</span>
                        </div>

                        <p className="text-[11px] text-zinc-300 leading-relaxed mb-1">
                          <strong className="text-amber-200">Visual Gain:</strong> {step.visualImprovement}
                        </p>
                        <p className="text-[11px] text-zinc-400">
                          <strong className="text-zinc-400">Condition:</strong> {step.hardwareCondition}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-400 italic">
                    Your hardware is fully utilized at current targets. Quality increases may cause frame drops.
                  </p>
                )}
                <div className="mt-4 pt-3 border-t border-zinc-800/80 text-[11px] text-zinc-400 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Textures and Anisotropic Filtering have zero shader cost when memory capacity is sufficient.</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
