import React, { useState } from 'react';
import { ChevronDown, Image, Sun, Sparkles, Eye, Zap, HelpCircle } from 'lucide-react';

interface SettingGuide {
  id: string;
  name: string;
  shortDesc: string;
  fullDesc: string;
  impact: 'High' | 'Medium' | 'Low' | 'Performance Booster';
  impactColor: string;
  hardwareStressed: string;
  icon: React.ElementType;
}

const SETTINGS_GUIDE: SettingGuide[] = [
  {
    id: 'textures',
    name: 'Texture Quality',
    shortDesc: 'Controls how detailed surfaces, walls, and character clothing look.',
    fullDesc:
      'Texture quality changes the sharpness of surface artwork in the game. It mostly requires Video Memory (VRAM) on your graphics card rather than raw GPU power. As long as your card has enough VRAM, you can usually keep this high without losing frame rate.',
    impact: 'Low',
    impactColor: 'text-emerald-400 bg-emerald-950/60 border-emerald-800/60',
    hardwareStressed: 'VRAM (Video Memory)',
    icon: Image
  },
  {
    id: 'shadows',
    name: 'Shadow Quality',
    shortDesc: 'Controls the detail and smoothness of shadows cast by objects and characters.',
    fullDesc:
      'Shadow calculations are one of the heaviest tasks for a graphics card. Lowering shadows from Ultra to Medium or High usually gives an immediate 10% to 20% boost in frame rate with only a small difference in visual appearance.',
    impact: 'High',
    impactColor: 'text-rose-400 bg-rose-950/60 border-rose-800/60',
    hardwareStressed: 'GPU & CPU draw calls',
    icon: Sun
  },
  {
    id: 'effects',
    name: 'Effects Quality',
    shortDesc: 'Controls visual effects such as fire, explosions, smoke, dust, and magic spells.',
    fullDesc:
      'Whenever intense action happens (like grenade explosions or boss battles), particle effects flare up. If your frame rate drops specifically during combat, lowering Effects Quality will help keep performance stable.',
    impact: 'Medium',
    impactColor: 'text-amber-400 bg-amber-950/60 border-amber-800/60',
    hardwareStressed: 'GPU Compute & Fillrate',
    icon: Sparkles
  },
  {
    id: 'raytracing',
    name: 'Ray Tracing',
    shortDesc: 'Simulates realistic physical light bounces, realistic reflections, and accurate ambient shadows.',
    fullDesc:
      'Ray tracing calculates real-time light physics for gorgeous reflections and global lighting. However, it is extremely demanding on hardware and can easily cut your frame rate in half. For most PCs, keeping this OFF is the best choice for smooth gaming.',
    impact: 'High',
    impactColor: 'text-rose-400 bg-rose-950/60 border-rose-800/60',
    hardwareStressed: 'RT Cores & GPU Compute',
    icon: Eye
  },
  {
    id: 'upscaling',
    name: 'Upscaling (DLSS / FSR / XeSS)',
    shortDesc: 'Renders the game at a lower internal resolution and uses smart reconstruction to boost frame rates.',
    fullDesc:
      'Upscaling technologies (NVIDIA DLSS, AMD FSR, Intel XeSS) render the game at e.g. 720p or 1080p, then use smart algorithms to reconstruct a clean 1080p, 1440p, or 4K image. Setting this to "Quality" or "Balanced" provides free extra performance with nearly identical picture clarity.',
    impact: 'Performance Booster',
    impactColor: 'text-cyan-400 bg-cyan-950/60 border-cyan-800/60',
    hardwareStressed: 'Free Performance Boost',
    icon: Zap
  }
];

export const SettingsExplainer: React.FC = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 md:p-6" id="settings-explainer-section">
      <div className="flex items-center gap-2.5 mb-2">
        <HelpCircle className="w-5 h-5 text-indigo-400" />
        <h3 className="text-base md:text-lg font-semibold text-zinc-100">
          What do these settings do?
        </h3>
      </div>
      <p className="text-sm text-zinc-400 mb-4">
        Click any setting to see how it affects your graphics and frame rate in plain language.
      </p>

      <div className="space-y-2.5">
        {SETTINGS_GUIDE.map((setting) => {
          const isExpanded = expandedId === setting.id;
          const Icon = setting.icon;

          return (
            <div
              key={setting.id}
              id={`setting-item-${setting.id}`}
              className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                isExpanded
                  ? 'bg-zinc-850/90 border-zinc-700 shadow-md'
                  : 'bg-zinc-900/40 border-zinc-800/80 hover:border-zinc-700/80'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleExpand(setting.id)}
                className="w-full text-left px-4 py-3 flex items-center justify-between gap-3 cursor-pointer"
                aria-expanded={isExpanded}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center flex-shrink-0 text-zinc-300">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-zinc-100">{setting.name}</span>
                      <span
                        className={`text-[11px] font-medium px-2 py-0.5 rounded border ${setting.impactColor}`}
                      >
                        {setting.impact === 'Performance Booster' ? 'Boosts FPS' : `${setting.impact} Cost`}
                      </span>
                    </div>
                    <div className="text-xs text-zinc-400 truncate mt-0.5">{setting.shortDesc}</div>
                  </div>
                </div>

                <ChevronDown
                  className={`w-4 h-4 text-zinc-400 flex-shrink-0 transition-transform duration-200 ${
                    isExpanded ? 'rotate-180 text-zinc-200' : ''
                  }`}
                />
              </button>

              {isExpanded && (
                <div className="px-4 pb-3.5 pt-1 text-xs md:text-sm text-zinc-300 border-t border-zinc-800/60 mt-1 bg-zinc-950/30">
                  <p className="leading-relaxed mb-2.5 text-zinc-300">{setting.fullDesc}</p>
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <span className="text-zinc-500 font-medium">Hardware factor:</span>
                    <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono text-[11px]">
                      {setting.hardwareStressed}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
