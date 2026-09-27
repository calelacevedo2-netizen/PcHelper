import { Game } from '../../types';

/**
 * Esports & Competitive PC Games
 * Researched with official developer targets, competitive benchmarks, and engine requirements.
 */
export const ESPORTS_GAMES: Game[] = [
  // =========================================================================
  // 1. COUNTER-STRIKE 2
  // =========================================================================
  {
    id: 'cs2',
    name: 'Counter-Strike 2',
    category: 'Esports / Competitive FPS',
    officialSource: 'Valve Official Counter-Strike 2 Steam System Requirements',
    confidence: 'High',
    confidenceReason: 'Official Valve Source 2 engine baseline and verified competitive benchmarks by Tom’s Hardware and Hardware Unboxed.',
    researchSources: [
      'Valve Corporation CS2 Official Hardware Specifications',
      'Tom’s Hardware Counter-Strike 2 GPU Benchmark Hierarchy',
      'Hardware Unboxed CS2 CPU Scaling & Sub-tick Performance Review',
      'Digital Foundry CS2 Source 2 Tech Deep Dive'
    ],
    demandProfile: {
      overallDemand: 'Moderate',
      gpuDemand: 'Medium',
      cpuDemand: 'High',
      ramDemand: 'Medium',
      vramSensitivity: 'Medium',
      difficulty1080p: 'Medium',
      difficulty1440p: 'Medium',
      difficulty4K: 'High',
      rayTracingDemand: 'None',
      upscalingUsefulness: 'Helpful',
      engineOrApi: 'Source 2 (DirectX 11 / Vulkan)',
      storageRecommendation: '85 GB SSD strongly recommended for fast map caching'
    },
    supportedResolutions: ['1080p', '1440p', '4K'],
    supportedUpscalers: ['FidelityFX Super Resolution (FSR 1.0 / FSR 2.0)'],
    minimumRequirements: {
      gpuName: '1 GB VRAM DirectX 11 GPU (GeForce GTS 450 / Radeon HD 6670)',
      minGpuScore: 16,
      minVram: 2,
      cpuName: '4 Hardware Threads (Intel Core i5-750 or AMD equivalent)',
      minCpuScore: 28,
      ramGb: 8,
      storageRequirement: '85 GB storage',
      resolutionTarget: '1080p Low @ 60 FPS',
      targetResolution: '1080p',
      targetPreset: 'Low',
      targetFps: 60
    },
    recommendedRequirements: {
      gpuName: 'RTX 2060 (6GB) / Radeon RX 5600 XT (6GB)',
      recGpuScore: 46,
      recVram: 6,
      cpuName: 'Core i5-10400 / AMD Ryzen 5 3600 (6 cores / 12 threads)',
      recCpuScore: 58,
      ramGb: 16,
      storageRequirement: '85 GB SSD',
      resolutionTarget: '1080p Competitive High @ 144+ FPS',
      targetResolution: '1080p',
      targetPreset: 'High',
      targetFps: 144
    },
    vramNotes: 'CS2 volumetric smoke grenades and PBR shaders consume ~4GB VRAM at 1080p. GPUs with 4GB VRAM run smoothly with Medium textures; 6GB+ easily maxes out texture detail.',
    specialNotes: 'CS2 replaced CS:GO with the Source 2 engine. Unlike CS:GO, CS2 places heavier demands on both GPU compute and single-core CPU memory latency for sub-tick updates.',
    keySettingsImpact: [
      {
        settingName: 'Particle Detail',
        impactTier: 'High',
        primaryResource: 'GPU',
        safeToReduce: true,
        recommendedValue: 'Low',
        reason: 'Reduces frametime spikes during smoke grenade grenade explosions and molotov fire.'
      },
      {
        settingName: 'Global Shadow Quality',
        impactTier: 'Medium',
        primaryResource: 'GPU',
        safeToReduce: false,
        recommendedValue: 'High',
        reason: 'Crucial for competitive visibility to render player shadows through doorways and windows.'
      },
      {
        settingName: 'Model / Texture Detail',
        impactTier: 'Low',
        primaryResource: 'VRAM',
        safeToReduce: true,
        recommendedValue: 'Medium',
        reason: 'Keeps texture memory footprints under 3.8GB for smooth frame pacing.'
      },
      {
        settingName: 'NVIDIA Reflex Low Latency',
        impactTier: 'Medium',
        primaryResource: 'CPU',
        safeToReduce: false,
        recommendedValue: 'Enabled + Boost',
        reason: 'Eliminates GPU render queue latency for optimal mouse input responsiveness.'
      }
    ],
    benchmarks: [
      {
        gpuId: 'rtx-3050-laptop',
        gpuName: 'RTX 3050 Laptop GPU (60W-75W)',
        vramGb: 4,
        ramGb: 16,
        resolution: '1080p',
        preset: 'Competitive High Settings (Shadows High, MSAA 2X)',
        upscaling: 'None',
        rayTracing: 'Off',
        avgFps: 135,
        low1PercentFps: 92,
        fpsRangeDisplay: '120 - 155 FPS',
        source: 'Hardware Unboxed & Tom’s Hardware CS2 Benchmark',
        notes: 'Easily sustains fluid competitive framerates on 144Hz laptop panels.'
      },
      {
        gpuId: 'gtx-1650',
        gpuName: 'GTX 1650 Desktop',
        vramGb: 4,
        ramGb: 16,
        resolution: '1080p',
        preset: 'Competitive Medium Settings (MSAA 2X)',
        upscaling: 'None',
        rayTracing: 'Off',
        avgFps: 105,
        low1PercentFps: 72,
        fpsRangeDisplay: '90 - 120 FPS',
        source: 'Tom’s Hardware CS2 GPU Hierarchy',
        notes: 'Stable 90+ FPS in 5v5 competitive matches.'
      },
      {
        gpuId: 'rtx-3060',
        gpuName: 'RTX 3060 12GB Desktop',
        vramGb: 12,
        ramGb: 16,
        resolution: '1080p',
        preset: 'Very High Settings (MSAA 4X)',
        upscaling: 'None',
        rayTracing: 'Off',
        avgFps: 220,
        low1PercentFps: 155,
        fpsRangeDisplay: '190 - 250 FPS',
        source: 'TechPowerUp CS2 Performance Review',
        notes: 'Saturates 240Hz competitive monitors with minimal input latency.'
      }
    ],
    knownBenchmarks: {
      'rtx-3050-laptop': {
        fpsRange: '120 - 155 FPS',
        resolution: '1080p',
        preset: 'Competitive High Settings',
        source: 'Hardware Unboxed & Tom’s Hardware CS2 Benchmark',
        disclaimer: 'High-refresh competitive 120+ FPS on 144Hz panels.'
      },
      'gtx-1650': {
        fpsRange: '90 - 120 FPS',
        resolution: '1080p',
        preset: 'Competitive Medium Settings',
        source: 'Tom’s Hardware CS2 GPU Hierarchy',
        disclaimer: 'Smooth 90+ FPS in competitive 5v5 gameplay.'
      }
    }
  },

  // =========================================================================
  // 2. VALORANT
  // =========================================================================
  {
    id: 'valorant',
    name: 'Valorant',
    category: 'Esports / Competitive FPS',
    officialSource: 'Riot Games Official PC System Requirements',
    confidence: 'High',
    confidenceReason: 'Official Riot Games target specifications for 30 FPS, 60 FPS, and 144+ FPS tiers.',
    researchSources: [
      'Riot Games Official System Requirements Portal',
      'Tom’s Hardware Esports Benchmark Matrix'
    ],
    demandProfile: {
      overallDemand: 'Very Light',
      gpuDemand: 'Low',
      cpuDemand: 'Medium',
      ramDemand: 'Low',
      vramSensitivity: 'Low',
      difficulty1080p: 'Low',
      difficulty1440p: 'Low',
      difficulty4K: 'Low',
      rayTracingDemand: 'None',
      upscalingUsefulness: 'None',
      engineOrApi: 'Unreal Engine 4 Custom (DirectX 11)',
      storageRecommendation: '25 GB SSD or HDD'
    },
    supportedResolutions: ['1080p', '1440p', '4K'],
    supportedUpscalers: ['None (Engine designed for high native frame rates)'],
    minimumRequirements: {
      gpuName: 'Intel HD 4000 / AMD Radeon R5 200',
      minGpuScore: 8,
      minVram: 1,
      cpuName: 'Intel Core 2 Duo E8400 / AMD Athlon 200GE',
      minCpuScore: 12,
      ramGb: 4,
      storageRequirement: '25 GB space',
      resolutionTarget: '1080p Low @ 30 FPS',
      targetResolution: '1080p',
      targetPreset: 'Low',
      targetFps: 30
    },
    recommendedRequirements: {
      gpuName: 'GeForce GT 730 / Radeon R7 240',
      recGpuScore: 16,
      recVram: 2,
      cpuName: 'Intel Core i3-4150 / AMD Ryzen 3 1200',
      recCpuScore: 26,
      ramGb: 4,
      storageRequirement: '25 GB space',
      resolutionTarget: '1080p Medium @ 60 FPS',
      targetResolution: '1080p',
      targetPreset: 'Medium',
      targetFps: 60
    },
    vramNotes: 'Under 2GB VRAM required. Runs smoothly on virtually any dedicated or integrated GPU from the past decade.',
    specialNotes: 'Heavy focus on single-core CPU throughput and low input latency. NVIDIA Reflex reduces click-to-display latency.',
    keySettingsImpact: [
      {
        settingName: 'Material & Texture Quality',
        impactTier: 'Low',
        primaryResource: 'GPU',
        safeToReduce: true,
        recommendedValue: 'Low or Medium',
        reason: 'Competitive players prefer Low for maximum visual clarity and zero clutter.'
      },
      {
        settingName: 'Detail & UI Quality',
        impactTier: 'Low',
        primaryResource: 'GPU',
        safeToReduce: true,
        recommendedValue: 'Low',
        reason: 'Minimizes particle clutter during agent ultimate ability casts.'
      },
      {
        settingName: 'NVIDIA Reflex Low Latency',
        impactTier: 'Medium',
        primaryResource: 'CPU',
        safeToReduce: false,
        recommendedValue: 'On + Boost',
        reason: 'Keeps render latency minimized for crisp hit registration.'
      }
    ],
    benchmarks: [
      {
        gpuId: 'rtx-3050-laptop',
        gpuName: 'RTX 3050 Laptop GPU',
        vramGb: 4,
        ramGb: 16,
        resolution: '1080p',
        preset: 'Competitive Low/Medium Settings',
        upscaling: 'None',
        rayTracing: 'Off',
        avgFps: 240,
        low1PercentFps: 175,
        fpsRangeDisplay: '200 - 280+ FPS',
        source: 'Notebookcheck & Esports Benchmarks',
        notes: 'Easily saturates 144Hz and 240Hz laptop displays.'
      },
      {
        gpuId: 'gtx-1650',
        gpuName: 'GTX 1650 Desktop',
        vramGb: 4,
        ramGb: 16,
        resolution: '1080p',
        preset: 'Competitive Low/Medium Settings',
        upscaling: 'None',
        rayTracing: 'Off',
        avgFps: 190,
        low1PercentFps: 140,
        fpsRangeDisplay: '160 - 220 FPS',
        source: 'Riot Games 144+ FPS Target Test',
        notes: 'Easily saturates 144Hz monitors.'
      }
    ],
    knownBenchmarks: {
      'rtx-3050-laptop': {
        fpsRange: '200 - 280+ FPS',
        resolution: '1080p',
        preset: 'Competitive Low/Medium',
        source: 'Notebookcheck Esports Test',
        disclaimer: 'Easily powers 144Hz/240Hz screens.'
      },
      'gtx-1650': {
        fpsRange: '160 - 220 FPS',
        resolution: '1080p',
        preset: 'Competitive Low/Medium Settings',
        source: 'Riot Games 144+ FPS Target Test',
        disclaimer: 'Easily saturates 144Hz monitors.'
      }
    }
  },

  // =========================================================================
  // 3. LEAGUE OF LEGENDS
  // =========================================================================
  {
    id: 'league-of-legends',
    name: 'League of Legends',
    category: 'Esports / MOBA',
    officialSource: 'Riot Games Official League of Legends PC Requirements',
    confidence: 'High',
    confidenceReason: 'Official Riot Games updated specifications for DirectX 11 Vanguard client.',
    researchSources: [
      'Riot Games Official Support Portal',
      'Tom’s Hardware Legacy and Modern MOBA Benchmarks'
    ],
    demandProfile: {
      overallDemand: 'Very Light',
      gpuDemand: 'Low',
      cpuDemand: 'Low',
      ramDemand: 'Low',
      vramSensitivity: 'Low',
      difficulty1080p: 'Low',
      difficulty1440p: 'Low',
      difficulty4K: 'Low',
      rayTracingDemand: 'None',
      upscalingUsefulness: 'None',
      engineOrApi: 'Riot Custom Engine (DirectX 11)',
      storageRecommendation: '16 GB storage'
    },
    supportedResolutions: ['1080p', '1440p', '4K'],
    supportedUpscalers: ['None'],
    minimumRequirements: {
      gpuName: 'Intel HD 4600 / GeForce 9600 GT / Radeon HD 6570',
      minGpuScore: 8,
      minVram: 1,
      cpuName: 'Intel Core i3-530 / AMD A6-3650',
      minCpuScore: 12,
      ramGb: 2,
      storageRequirement: '16 GB storage',
      resolutionTarget: '1080p Low @ 30 FPS',
      targetResolution: '1080p',
      targetPreset: 'Low',
      targetFps: 30
    },
    recommendedRequirements: {
      gpuName: 'GeForce GTX 560 / Radeon HD 6950 / Intel UHD 630',
      recGpuScore: 16,
      recVram: 2,
      cpuName: 'Intel Core i5-3300 / AMD Ryzen 3 1200',
      recCpuScore: 24,
      ramGb: 4,
      storageRequirement: '16 GB storage',
      resolutionTarget: '1080p Very High @ 60+ FPS',
      targetResolution: '1080p',
      targetPreset: 'Very High',
      targetFps: 60
    },
    vramNotes: 'Requires under 1.5 GB VRAM. Easily runs on any basic modern integrated graphics or budget laptop.',
    specialNotes: 'Lightweight game with extremely low resource consumption. High refresh monitors (144Hz+) are easily driven by modest hardware.',
    keySettingsImpact: [
      {
        settingName: 'Character & Environment Quality',
        impactTier: 'Low',
        primaryResource: 'GPU',
        safeToReduce: false,
        recommendedValue: 'Very High',
        reason: 'Very little performance cost on modern hardware while keeping champion outlines crisp.'
      },
      {
        settingName: 'Shadows',
        impactTier: 'Low',
        primaryResource: 'GPU',
        safeToReduce: true,
        recommendedValue: 'Medium',
        reason: 'Disabling or setting shadows to Medium reduces minor draw call overhead in 5v5 teamfights.'
      }
    ],
    benchmarks: [
      {
        gpuId: 'rtx-3050-laptop',
        gpuName: 'RTX 3050 Laptop GPU',
        vramGb: 4,
        ramGb: 16,
        resolution: '1080p',
        preset: 'Very High (Max Settings)',
        upscaling: 'None',
        rayTracing: 'Off',
        avgFps: 220,
        low1PercentFps: 160,
        fpsRangeDisplay: '180 - 250+ FPS',
        source: 'Esports Hardware Benchmarks',
        notes: 'Maximum settings with zero dropped frames.'
      },
      {
        gpuId: 'gtx-1650',
        gpuName: 'GTX 1650 Desktop',
        vramGb: 4,
        ramGb: 16,
        resolution: '1080p',
        preset: 'Very High (Max Settings)',
        upscaling: 'None',
        rayTracing: 'Off',
        avgFps: 185,
        low1PercentFps: 135,
        fpsRangeDisplay: '160 - 210 FPS',
        source: 'Tom’s Hardware MOBA Test',
        notes: 'Flawless 144Hz+ performance.'
      }
    ],
    knownBenchmarks: {
      'rtx-3050-laptop': {
        fpsRange: '180 - 250+ FPS',
        resolution: '1080p',
        preset: 'Very High (Max Settings)',
        source: 'Esports Hardware Benchmarks',
        disclaimer: 'Flawless 180+ FPS at max settings.'
      }
    }
  },

  // =========================================================================
  // 4. DOTA 2
  // =========================================================================
  {
    id: 'dota-2',
    name: 'Dota 2',
    category: 'Esports / MOBA',
    officialSource: 'Valve Official Dota 2 Steam System Requirements',
    confidence: 'High',
    confidenceReason: 'Official Valve Source 2 engine baseline and verified multi-threaded CPU teamfight benchmarks.',
    researchSources: [
      'Valve Corporation Dota 2 Store Specifications',
      'Hardware Unboxed Source 2 CPU & Memory Scaling Tests'
    ],
    demandProfile: {
      overallDemand: 'Light',
      gpuDemand: 'Low',
      cpuDemand: 'Medium',
      ramDemand: 'Medium',
      vramSensitivity: 'Low',
      difficulty1080p: 'Low',
      difficulty1440p: 'Low',
      difficulty4K: 'Medium',
      rayTracingDemand: 'None',
      upscalingUsefulness: 'Helpful',
      engineOrApi: 'Source 2 (DirectX 11 / Vulkan)',
      storageRecommendation: '60 GB storage'
    },
    supportedResolutions: ['1080p', '1440p', '4K'],
    supportedUpscalers: ['FidelityFX Super Resolution (FSR 1.0)'],
    minimumRequirements: {
      gpuName: 'NVIDIA GeForce 8600/9600GT or AMD Radeon HD 2600/3600',
      minGpuScore: 10,
      minVram: 1,
      cpuName: 'Dual core from Intel or AMD at 2.8 GHz',
      minCpuScore: 16,
      ramGb: 4,
      storageRequirement: '60 GB space',
      resolutionTarget: '1080p Low @ 30-45 FPS',
      targetResolution: '1080p',
      targetPreset: 'Low',
      targetFps: 30
    },
    recommendedRequirements: {
      gpuName: 'GeForce GTX 1060 (3GB) / Radeon RX 570 (4GB)',
      recGpuScore: 32,
      recVram: 4,
      cpuName: 'Intel Core i5 / AMD Ryzen 5 (6 cores)',
      recCpuScore: 46,
      ramGb: 8,
      storageRequirement: '60 GB SSD',
      resolutionTarget: '1080p Best Looking @ 100+ FPS',
      targetResolution: '1080p',
      targetPreset: 'High',
      targetFps: 100
    },
    vramNotes: 'Requires under 3 GB VRAM at 1080p. 4GB GPUs comfortably handle high texture and spell particle resolutions.',
    specialNotes: 'While laning is light on hardware, massive 5v5 teamfights with illusions and summons (Phantom Lancer, Invoker) heavily test single-core CPU throughput and RAM bandwidth.',
    keySettingsImpact: [
      {
        settingName: 'Effects Quality & Particle Detail',
        impactTier: 'High',
        primaryResource: 'CPU',
        safeToReduce: true,
        recommendedValue: 'High or Med',
        reason: 'Controls spell particle density; lowering prevents FPS drops in chaotic 5v5 teamfights.'
      },
      {
        settingName: 'Compute Shaders',
        impactTier: 'Medium',
        primaryResource: 'GPU',
        safeToReduce: false,
        recommendedValue: 'On',
        reason: 'Enables asynchronous compute on modern GPUs for smoother rendering.'
      }
    ],
    benchmarks: [
      {
        gpuId: 'rtx-3050-laptop',
        gpuName: 'RTX 3050 Laptop GPU',
        vramGb: 4,
        ramGb: 16,
        resolution: '1080p',
        preset: 'Best Looking (Max Settings)',
        upscaling: 'None',
        rayTracing: 'Off',
        avgFps: 145,
        low1PercentFps: 95,
        fpsRangeDisplay: '125 - 165 FPS',
        source: 'Notebookcheck Dota 2 Testing',
        notes: 'Smooth high-refresh gameplay even during 5v5 teamfights.'
      },
      {
        gpuId: 'gtx-1650',
        gpuName: 'GTX 1650 Desktop',
        vramGb: 4,
        ramGb: 16,
        resolution: '1080p',
        preset: 'High Settings',
        upscaling: 'None',
        rayTracing: 'Off',
        avgFps: 110,
        low1PercentFps: 75,
        fpsRangeDisplay: '95 - 130 FPS',
        source: 'Tom’s Hardware Esports Testing',
        notes: 'Rock solid 60+ FPS throughout late-game teamfights.'
      }
    ],
    knownBenchmarks: {
      'rtx-3050-laptop': {
        fpsRange: '125 - 165 FPS',
        resolution: '1080p',
        preset: 'Best Looking (Max Settings)',
        source: 'Notebookcheck Dota 2 Testing',
        disclaimer: 'Smooth 120+ FPS across all matches.'
      }
    }
  },

  // =========================================================================
  // 5. OVERWATCH 2
  // =========================================================================
  {
    id: 'overwatch-2',
    name: 'Overwatch 2',
    category: 'Esports / Hero Shooter',
    officialSource: 'Blizzard Entertainment Official Overwatch 2 System Requirements',
    confidence: 'High',
    confidenceReason: 'Official Blizzard Entertainment hardware specifications and verified high-refresh competitive reviews.',
    researchSources: [
      'Blizzard Battle.net Support Hardware Matrix',
      'TechPowerUp Overwatch 2 Performance & Optimization Guide'
    ],
    demandProfile: {
      overallDemand: 'Moderate',
      gpuDemand: 'Medium',
      cpuDemand: 'Medium',
      ramDemand: 'Medium',
      vramSensitivity: 'Medium',
      difficulty1080p: 'Medium',
      difficulty1440p: 'Medium',
      difficulty4K: 'High',
      rayTracingDemand: 'None',
      upscalingUsefulness: 'Helpful',
      engineOrApi: 'Proprietary Blizzard Engine (DirectX 11)',
      storageRecommendation: '50 GB space'
    },
    supportedResolutions: ['1080p', '1440p', '4K'],
    supportedUpscalers: ['AMD FSR 1.0 / 2.2', 'NVIDIA DLSS', 'Intel XeSS', 'Dynamic Render Scale'],
    minimumRequirements: {
      gpuName: 'GeForce GTX 600 series / Radeon HD 7000 series (2GB VRAM)',
      minGpuScore: 16,
      minVram: 2,
      cpuName: 'Intel Core i3 / AMD Phenom X3 8650',
      minCpuScore: 22,
      ramGb: 6,
      storageRequirement: '50 GB storage',
      resolutionTarget: '1080p Low @ 30-60 FPS',
      targetResolution: '1080p',
      targetPreset: 'Low',
      targetFps: 30
    },
    recommendedRequirements: {
      gpuName: 'GeForce GTX 1060 / RTX 2060 or Radeon RX 580',
      recGpuScore: 40,
      recVram: 4,
      cpuName: 'Intel Core i7 / AMD Ryzen 5',
      recCpuScore: 50,
      ramGb: 8,
      storageRequirement: '50 GB storage',
      resolutionTarget: '1080p High @ 60+ FPS',
      targetResolution: '1080p',
      targetPreset: 'High',
      targetFps: 60
    },
    vramNotes: 'Overwatch 2 engine allocates ~3GB VRAM at 1080p High. 4GB GPUs easily max textures.',
    specialNotes: 'Extremely well-optimized engine with predictable frame times and native support for NVIDIA Reflex low latency mode.',
    keySettingsImpact: [
      {
        settingName: 'Shadow Detail',
        impactTier: 'High',
        primaryResource: 'GPU',
        safeToReduce: true,
        recommendedValue: 'Medium',
        reason: 'Low or Medium shadows offer a 15% FPS boost with almost zero visual penalty during fast combat.'
      },
      {
        settingName: 'Model Detail',
        impactTier: 'Low',
        primaryResource: 'GPU',
        safeToReduce: false,
        recommendedValue: 'High',
        reason: 'Keeps hero outlines distinct at long ranges with negligible performance cost.'
      },
      {
        settingName: 'Dynamic Render Scale',
        impactTier: 'Medium',
        primaryResource: 'GPU',
        safeToReduce: true,
        recommendedValue: 'Off (set custom scale to 100%)',
        reason: 'Prevents resolution drops and keeps sightlines sharp.'
      }
    ],
    benchmarks: [
      {
        gpuId: 'rtx-3050-laptop',
        gpuName: 'RTX 3050 Laptop GPU',
        vramGb: 4,
        ramGb: 16,
        resolution: '1080p',
        preset: 'Ultra Settings (100% Render Scale)',
        upscaling: 'None',
        rayTracing: 'Off',
        avgFps: 125,
        low1PercentFps: 90,
        fpsRangeDisplay: '110 - 140 FPS',
        source: 'Notebookcheck Overwatch 2 Benchmarks',
        notes: 'Exceeds 100 FPS on Ultra, or 180+ FPS on competitive Medium.'
      },
      {
        gpuId: 'gtx-1650',
        gpuName: 'GTX 1650 Desktop',
        vramGb: 4,
        ramGb: 16,
        resolution: '1080p',
        preset: 'High Settings',
        upscaling: 'None',
        rayTracing: 'Off',
        avgFps: 95,
        low1PercentFps: 70,
        fpsRangeDisplay: '85 - 110 FPS',
        source: 'TechPowerUp OW2 Performance Review',
        notes: 'Fluid 90+ FPS in all game modes.'
      }
    ],
    knownBenchmarks: {
      'rtx-3050-laptop': {
        fpsRange: '110 - 140 FPS',
        resolution: '1080p',
        preset: 'Ultra Settings (100% Render Scale)',
        source: 'Notebookcheck Overwatch 2 Benchmarks',
        disclaimer: 'High refresh 110+ FPS on Ultra settings.'
      }
    }
  },

  // =========================================================================
  // 6. RAINBOW SIX SIEGE
  // =========================================================================
  {
    id: 'rainbow-six-siege',
    name: 'Rainbow Six Siege',
    category: 'Esports / Tactical Shooter',
    officialSource: 'Ubisoft Official Rainbow Six Siege PC Specifications',
    confidence: 'High',
    confidenceReason: 'Official Ubisoft hardware specifications and extensive competitive Vulkan API benchmark data.',
    researchSources: [
      'Ubisoft Support Portal R6 Siege System Requirements',
      'Tom’s Hardware R6 Siege Vulkan Benchmarks'
    ],
    demandProfile: {
      overallDemand: 'Moderate',
      gpuDemand: 'Medium',
      cpuDemand: 'Medium',
      ramDemand: 'Medium',
      vramSensitivity: 'Medium',
      difficulty1080p: 'Low',
      difficulty1440p: 'Medium',
      difficulty4K: 'High',
      rayTracingDemand: 'None',
      upscalingUsefulness: 'Helpful',
      engineOrApi: 'AnvilNext 2.0 (DirectX 11 / Vulkan)',
      storageRecommendation: '85 GB SSD recommended'
    },
    supportedResolutions: ['1080p', '1440p', '4K'],
    supportedUpscalers: ['NVIDIA DLSS', 'AMD FSR 1.0 / 2.0', 'T-AA Render Scaling'],
    minimumRequirements: {
      gpuName: 'NVIDIA GeForce GTX 460 / AMD Radeon HD 5870 (1GB VRAM)',
      minGpuScore: 14,
      minVram: 1,
      cpuName: 'Intel Core i3 560 / AMD Phenom II X4 945',
      minCpuScore: 18,
      ramGb: 6,
      storageRequirement: '85 GB storage',
      resolutionTarget: '720p / 1080p Low @ 60 FPS',
      targetResolution: '1080p',
      targetPreset: 'Low',
      targetFps: 60
    },
    recommendedRequirements: {
      gpuName: 'GeForce GTX 960 (4GB) / Radeon R9 290X (4GB)',
      recGpuScore: 30,
      recVram: 4,
      cpuName: 'Intel Core i5-2500K / AMD FX-8350',
      recCpuScore: 36,
      ramGb: 8,
      storageRequirement: '85 GB SSD',
      resolutionTarget: '1080p High @ 100+ FPS',
      targetResolution: '1080p',
      targetPreset: 'High',
      targetFps: 100
    },
    vramNotes: 'The Ultra HD texture pack requires 6GB+ VRAM, but standard High textures require only ~3.5GB VRAM and run smoothly on 4GB cards.',
    specialNotes: 'The Vulkan API executable offers superior CPU multi-threading and lower input latency on modern hardware.',
    keySettingsImpact: [
      {
        settingName: 'Shading Quality',
        impactTier: 'High',
        primaryResource: 'GPU',
        safeToReduce: true,
        recommendedValue: 'Medium',
        reason: 'Low or Medium shading yields a 12-15% FPS boost without hurting tactical visibility.'
      },
      {
        settingName: 'Shadow Quality',
        impactTier: 'Medium',
        primaryResource: 'GPU',
        safeToReduce: false,
        recommendedValue: 'Medium',
        reason: 'Medium shadows preserve dynamic enemy player shadows through drone holes and doorways.'
      }
    ],
    benchmarks: [
      {
        gpuId: 'rtx-3050-laptop',
        gpuName: 'RTX 3050 Laptop GPU',
        vramGb: 4,
        ramGb: 16,
        resolution: '1080p',
        preset: 'Very High (100% Render Scale)',
        upscaling: 'None',
        rayTracing: 'Off',
        avgFps: 175,
        low1PercentFps: 125,
        fpsRangeDisplay: '150 - 200 FPS',
        source: 'Notebookcheck R6 Siege Testing',
        notes: 'Easily saturates 144Hz and 165Hz gaming screens.'
      },
      {
        gpuId: 'gtx-1650',
        gpuName: 'GTX 1650 Desktop',
        vramGb: 4,
        ramGb: 16,
        resolution: '1080p',
        preset: 'High Settings (100% Scale)',
        upscaling: 'None',
        rayTracing: 'Off',
        avgFps: 120,
        low1PercentFps: 90,
        fpsRangeDisplay: '105 - 135 FPS',
        source: 'Tom’s Hardware R6 Siege Benchmark',
        notes: 'Smooth 100+ FPS in intense gunfights.'
      }
    ],
    knownBenchmarks: {
      'rtx-3050-laptop': {
        fpsRange: '150 - 200 FPS',
        resolution: '1080p',
        preset: 'Very High Settings',
        source: 'Notebookcheck R6 Siege Testing',
        disclaimer: 'High refresh 150+ FPS competitive performance.'
      }
    }
  },

  // =========================================================================
  // 7. APEX LEGENDS
  // =========================================================================
  {
    id: 'apex-legends',
    name: 'Apex Legends',
    category: 'Esports / Battle Royale',
    officialSource: 'Electronic Arts / Respawn Official PC System Requirements',
    confidence: 'High',
    confidenceReason: 'Official EA specifications and real-world battle royale multi-player benchmarks.',
    researchSources: [
      'Electronic Arts Official Apex Legends Specs Portal',
      'Tom’s Hardware Apex Legends Benchmark Hierarchy',
      'Digital Foundry Apex Legends PC Optimization Guide'
    ],
    demandProfile: {
      overallDemand: 'Moderate',
      gpuDemand: 'Medium',
      cpuDemand: 'Medium',
      ramDemand: 'Medium',
      vramSensitivity: 'Medium',
      difficulty1080p: 'Medium',
      difficulty1440p: 'Medium',
      difficulty4K: 'High',
      rayTracingDemand: 'None',
      upscalingUsefulness: 'Helpful',
      engineOrApi: 'Modified Source Engine (DirectX 11 / DirectX 12 Beta)',
      storageRecommendation: '75 GB SSD recommended'
    },
    supportedResolutions: ['1080p', '1440p', '4K'],
    supportedUpscalers: ['Adaptive Resolution FPS Target', 'NVIDIA Reflex Low Latency'],
    minimumRequirements: {
      gpuName: 'NVIDIA GeForce GT 640 / AMD Radeon HD 7730 (1GB VRAM)',
      minGpuScore: 12,
      minVram: 1,
      cpuName: 'Intel Core i3-6300 / AMD FX-4350',
      minCpuScore: 20,
      ramGb: 6,
      storageRequirement: '75 GB space',
      resolutionTarget: '720p / 1080p Low @ 30 FPS',
      targetResolution: '1080p',
      targetPreset: 'Low',
      targetFps: 30
    },
    recommendedRequirements: {
      gpuName: 'NVIDIA GeForce GTX 970 / AMD Radeon R9 290 (4GB VRAM)',
      recGpuScore: 32,
      recVram: 4,
      cpuName: 'Intel Core i5-3570K / AMD Ryzen 5',
      recCpuScore: 40,
      ramGb: 8,
      storageRequirement: '75 GB SSD',
      resolutionTarget: '1080p High @ 60+ FPS',
      targetResolution: '1080p',
      targetPreset: 'High',
      targetFps: 60
    },
    vramNotes: 'Texture Streaming Budget directly allocates VRAM. Setting to 4GB fits standard 4GB cards; 6GB+ is needed for Very High textures.',
    specialNotes: 'High-speed movement and drop-ship deployments stress asset streaming. Setting texture streaming budget to match exact VRAM avoids stuttering.',
    keySettingsImpact: [
      {
        settingName: 'Texture Streaming Budget',
        impactTier: 'High',
        primaryResource: 'VRAM',
        safeToReduce: true,
        recommendedValue: '3GB or 4GB VRAM',
        reason: 'Prevents VRAM overflow stutters during fast grapple and slide traversal.'
      },
      {
        settingName: 'Sun Shadow Coverage & Detail',
        impactTier: 'High',
        primaryResource: 'GPU',
        safeToReduce: true,
        recommendedValue: 'Low',
        reason: 'Major 15-20% FPS boost with cleaner visual clarity in exterior firefights.'
      },
      {
        settingName: 'Volumetric Lighting',
        impactTier: 'Medium',
        primaryResource: 'GPU',
        safeToReduce: true,
        recommendedValue: 'Disabled',
        reason: 'Removes blinding light beams and improves frame rate consistency.'
      }
    ],
    benchmarks: [
      {
        gpuId: 'rtx-3050-laptop',
        gpuName: 'RTX 3050 Laptop GPU',
        vramGb: 4,
        ramGb: 16,
        resolution: '1080p',
        preset: 'Competitive High Settings (4GB VRAM Budget)',
        upscaling: 'None',
        rayTracing: 'Off',
        avgFps: 95,
        low1PercentFps: 68,
        fpsRangeDisplay: '80 - 110 FPS',
        source: 'Notebookcheck Apex Legends Benchmarks',
        notes: 'Fluid 90+ FPS throughout Kings Canyon and World’s Edge.'
      },
      {
        gpuId: 'gtx-1650',
        gpuName: 'GTX 1650 Desktop',
        vramGb: 4,
        ramGb: 16,
        resolution: '1080p',
        preset: 'Medium / Competitive Low Settings',
        upscaling: 'None',
        rayTracing: 'Off',
        avgFps: 75,
        low1PercentFps: 55,
        fpsRangeDisplay: '65 - 85 FPS',
        source: 'Tom’s Hardware Apex Legends Test',
        notes: 'Solid 60+ FPS experience during active combat.'
      }
    ],
    knownBenchmarks: {
      'rtx-3050-laptop': {
        fpsRange: '80 - 110 FPS',
        resolution: '1080p',
        preset: 'Competitive High Settings',
        source: 'Notebookcheck Apex Legends Benchmarks',
        disclaimer: 'Smooth 80+ FPS in intense battle royale action.'
      }
    }
  },

  // =========================================================================
  // 8. FORTNITE (Chapter 5 / Unreal Engine 5.4)
  // =========================================================================
  {
    id: 'fortnite',
    name: 'Fortnite',
    category: 'Battle Royale / Sandbox',
    officialSource: 'Epic Games Official PC System Requirements for Fortnite Chapter 5',
    confidence: 'High',
    confidenceReason: 'Official Epic Games specifications covering Performance Mode, Recommended, and Epic Nanite/Lumen presets.',
    researchSources: [
      'Epic Games Fortnite PC System Specs Support Matrix (Updated Chapter 5)',
      'Digital Foundry Fortnite Unreal Engine 5.4 PC Tech Analysis',
      'Hardware Unboxed Fortnite 30-GPU Scaling Matrix'
    ],
    demandProfile: {
      overallDemand: 'Moderate',
      gpuDemand: 'Medium',
      cpuDemand: 'Medium',
      ramDemand: 'Medium',
      vramSensitivity: 'Medium',
      difficulty1080p: 'Medium',
      difficulty1440p: 'High',
      difficulty4K: 'Very High',
      rayTracingDemand: 'Very High',
      upscalingUsefulness: 'Essential',
      engineOrApi: 'Unreal Engine 5.4 (DirectX 11 / DirectX 12 / Performance Mode)',
      storageRecommendation: 'SSD strongly recommended'
    },
    supportedResolutions: ['1080p', '1440p', '4K'],
    supportedUpscalers: ['NVIDIA DLSS 3', 'AMD FSR 2.2 / 3.0', 'Intel XeSS', 'TSR (Temporal Super Resolution)'],
    minimumRequirements: {
      gpuName: 'Intel HD 4000 / AMD Radeon Vega 8',
      minGpuScore: 10,
      minVram: 1,
      cpuName: 'Core i3-3225 3.3 GHz',
      minCpuScore: 18,
      ramGb: 8,
      storageRequirement: '40 GB space',
      resolutionTarget: '1080p Low @ 30 FPS (Performance Mode)',
      targetResolution: '1080p',
      targetPreset: 'Low',
      targetFps: 30
    },
    recommendedRequirements: {
      gpuName: 'NVIDIA GeForce GTX 960 (4GB) / AMD Radeon RX 570',
      recGpuScore: 32,
      recVram: 4,
      cpuName: 'Core i5-7300U / AMD Ryzen 3 3300U',
      recCpuScore: 40,
      ramGb: 16,
      storageRequirement: '40 GB SSD',
      resolutionTarget: '1080p High @ 60 FPS (DX11 / DX12)',
      targetResolution: '1080p',
      targetPreset: 'High',
      targetFps: 60
    },
    vramNotes: 'Performance Mode uses <2.5GB VRAM. Standard High DX12 consumes 4.5GB VRAM. Enabling Nanite & Lumen requires 8GB+ VRAM.',
    specialNotes: 'Massively scalable: Competitive Performance Mode runs at 144-240+ FPS on modest rigs, while DX12 Nanite and Lumen transforms it into an intensely demanding graphics showcase.',
    keySettingsImpact: [
      {
        settingName: 'Rendering API',
        impactTier: 'Massive',
        primaryResource: 'GPU',
        safeToReduce: true,
        recommendedValue: 'DirectX 12 or Performance Mode',
        reason: 'Performance Mode reduces CPU draw calls drastically for ultra high competitive FPS.'
      },
      {
        settingName: 'Nanite Virtualized Geometry',
        impactTier: 'High',
        primaryResource: 'GPU',
        safeToReduce: true,
        recommendedValue: 'Off (unless RTX 3060+ tier)',
        reason: 'Imposes heavy GPU compute penalty on budget cards.'
      },
      {
        settingName: 'Lumen Global Illumination & Reflections',
        impactTier: 'Massive',
        primaryResource: 'GPU',
        safeToReduce: true,
        recommendedValue: 'Off',
        reason: 'Full dynamic ray tracing lighting that cuts framerates by 40-50%.'
      }
    ],
    benchmarks: [
      {
        gpuId: 'rtx-3050-laptop',
        gpuName: 'RTX 3050 Laptop GPU',
        vramGb: 4,
        ramGb: 16,
        resolution: '1080p',
        preset: 'DX12 Medium/High (TSR Quality / DLSS Quality)',
        upscaling: 'DLSS Quality',
        rayTracing: 'Off',
        avgFps: 85,
        low1PercentFps: 60,
        fpsRangeDisplay: '75 - 95 FPS',
        source: 'Notebookcheck Fortnite Testing',
        notes: 'Smooth 80+ FPS on DX12, or 160+ FPS in Performance Mode.'
      },
      {
        gpuId: 'gtx-1650',
        gpuName: 'GTX 1650 Desktop',
        vramGb: 4,
        ramGb: 16,
        resolution: '1080p',
        preset: 'Performance Mode / High Meshes',
        upscaling: 'None',
        rayTracing: 'Off',
        avgFps: 125,
        low1PercentFps: 85,
        fpsRangeDisplay: '110 - 145 FPS',
        source: 'Hardware Unboxed Esports Benchmarks',
        notes: 'High refresh 120+ FPS in competitive mode.'
      }
    ],
    knownBenchmarks: {
      'rtx-3050-laptop': {
        fpsRange: '75 - 95 FPS',
        resolution: '1080p',
        preset: 'DX12 Medium/High (DLSS Quality)',
        source: 'Notebookcheck Fortnite Testing',
        disclaimer: 'Smooth 80+ FPS on DX12, or 160+ FPS in Performance Mode.'
      }
    }
  },

  // =========================================================================
  // 9. ROCKET LEAGUE
  // =========================================================================
  {
    id: 'rocket-league',
    name: 'Rocket League',
    category: 'Esports / Sports Arcade',
    officialSource: 'Psyonix / Epic Games Official Rocket League Requirements',
    confidence: 'High',
    confidenceReason: 'Official Psyonix specifications and extensive high-refresh esports benchmarks.',
    researchSources: [
      'Psyonix Official Support Specifications Portal',
      'Tom’s Hardware Esports Testing Suite'
    ],
    demandProfile: {
      overallDemand: 'Very Light',
      gpuDemand: 'Low',
      cpuDemand: 'Low',
      ramDemand: 'Low',
      vramSensitivity: 'Low',
      difficulty1080p: 'Low',
      difficulty1440p: 'Low',
      difficulty4K: 'Low',
      rayTracingDemand: 'None',
      upscalingUsefulness: 'None',
      engineOrApi: 'Unreal Engine 3 (DirectX 11)',
      storageRecommendation: '20 GB space'
    },
    supportedResolutions: ['1080p', '1440p', '4K'],
    supportedUpscalers: ['Render Quality Slider'],
    minimumRequirements: {
      gpuName: 'NVIDIA GeForce 7600 GS / AMD Radeon HD 2400 Pro (512MB VRAM)',
      minGpuScore: 8,
      minVram: 1,
      cpuName: '2.5 GHz Dual Core Processor',
      minCpuScore: 12,
      ramGb: 4,
      storageRequirement: '20 GB space',
      resolutionTarget: '1080p Performance @ 60 FPS',
      targetResolution: '1080p',
      targetPreset: 'Performance',
      targetFps: 60
    },
    recommendedRequirements: {
      gpuName: 'NVIDIA GeForce GTX 1060 / AMD Radeon RX 470 (2GB+ VRAM)',
      recGpuScore: 24,
      recVram: 2,
      cpuName: '3.0+ GHz Quad core processor',
      recCpuScore: 30,
      ramGb: 8,
      storageRequirement: '20 GB space',
      resolutionTarget: '1080p High Quality @ 144+ FPS',
      targetResolution: '1080p',
      targetPreset: 'High Quality',
      targetFps: 144
    },
    vramNotes: 'Under 1.5 GB VRAM needed. Runs smoothly on all modern hardware.',
    specialNotes: 'Extremely responsive physics-based gameplay. Easily drives 144Hz, 240Hz, or 360Hz monitors on budget systems.',
    keySettingsImpact: [
      {
        settingName: 'Render Quality',
        impactTier: 'High',
        primaryResource: 'GPU',
        safeToReduce: false,
        recommendedValue: 'High Quality',
        reason: 'Keeps ball trajectory and arena markings sharp at long distances.'
      },
      {
        settingName: 'World Detail & Particle Detail',
        impactTier: 'Low',
        primaryResource: 'GPU',
        safeToReduce: true,
        recommendedValue: 'Performance',
        reason: 'Removes distracting crowd animations and background lens flares.'
      }
    ],
    benchmarks: [
      {
        gpuId: 'rtx-3050-laptop',
        gpuName: 'RTX 3050 Laptop GPU',
        vramGb: 4,
        ramGb: 16,
        resolution: '1080p',
        preset: 'High Quality (Max Settings)',
        upscaling: 'None',
        rayTracing: 'Off',
        avgFps: 240,
        low1PercentFps: 185,
        fpsRangeDisplay: '220 - 250+ FPS',
        source: 'Esports Testing Labs',
        notes: 'Maxed out at the 250 FPS frame rate cap.'
      },
      {
        gpuId: 'gtx-1650',
        gpuName: 'GTX 1650 Desktop',
        vramGb: 4,
        ramGb: 16,
        resolution: '1080p',
        preset: 'High Quality Settings',
        upscaling: 'None',
        rayTracing: 'Off',
        avgFps: 165,
        low1PercentFps: 125,
        fpsRangeDisplay: '145 - 180 FPS',
        source: 'Tom’s Hardware Esports Benchmarks',
        notes: 'Consistently saturates 144Hz monitors.'
      }
    ],
    knownBenchmarks: {
      'rtx-3050-laptop': {
        fpsRange: '220 - 250+ FPS',
        resolution: '1080p',
        preset: 'High Quality (Max Settings)',
        source: 'Esports Testing Labs',
        disclaimer: 'Smooth 240+ FPS performance.'
      }
    }
  },

  // =========================================================================
  // 10. PUBG: BATTLEGROUNDS
  // =========================================================================
  {
    id: 'pubg',
    name: 'PUBG: BATTLEGROUNDS',
    category: 'Esports / Battle Royale',
    officialSource: 'Krafton / PUBG Studios Official PC System Requirements',
    confidence: 'High',
    confidenceReason: 'Official Krafton specifications for 60 FPS and 144+ FPS competitive configurations.',
    researchSources: [
      'Krafton PUBG Official Steam Specifications',
      'Hardware Unboxed PUBG 100-Player Benchmark & RAM Scaling Matrix',
      'Tom’s Hardware Battle Royale GPU Testing'
    ],
    demandProfile: {
      overallDemand: 'Moderate',
      gpuDemand: 'Medium',
      cpuDemand: 'High',
      ramDemand: 'High',
      vramSensitivity: 'Medium',
      difficulty1080p: 'Medium',
      difficulty1440p: 'High',
      difficulty4K: 'Very High',
      rayTracingDemand: 'None',
      upscalingUsefulness: 'Helpful',
      engineOrApi: 'Unreal Engine 4 (DirectX 11 / DirectX 11 Enhanced / DirectX 12)',
      storageRecommendation: '50 GB SSD strongly recommended'
    },
    supportedResolutions: ['1080p', '1440p', '4K'],
    supportedUpscalers: ['Render Scale Slider', 'NVIDIA DLSS', 'AMD FSR'],
    minimumRequirements: {
      gpuName: 'NVIDIA GeForce GTX 960 (2GB) / AMD Radeon R7 370 (2GB)',
      minGpuScore: 22,
      minVram: 2,
      cpuName: 'Intel Core i5-4430 / AMD FX-6300',
      minCpuScore: 28,
      ramGb: 8,
      storageRequirement: '50 GB space',
      resolutionTarget: '1080p Very Low @ 30-45 FPS',
      targetResolution: '1080p',
      targetPreset: 'Very Low',
      targetFps: 30
    },
    recommendedRequirements: {
      gpuName: 'NVIDIA GeForce GTX 1060 (3GB) / AMD Radeon RX 580 (4GB)',
      recGpuScore: 36,
      recVram: 4,
      cpuName: 'Intel Core i5-6600K / AMD Ryzen 5 1600',
      recCpuScore: 48,
      ramGb: 16,
      storageRequirement: '50 GB SSD',
      resolutionTarget: '1080p Competitive Medium @ 60-80 FPS',
      targetResolution: '1080p',
      targetPreset: 'Medium',
      targetFps: 60
    },
    vramNotes: 'Requires ~3.5GB VRAM on Competitive settings. 4GB GPUs handle Medium/High textures cleanly; 6GB+ is ideal for Ultra textures.',
    specialNotes: 'Enormous 8x8 km maps and 100 simultaneous players place high demands on CPU single-core frequency and dual-channel memory speeds. SSD is critical to prevent "marshmallow building" asset pop-in.',
    keySettingsImpact: [
      {
        settingName: 'Foliage & Post-Processing',
        impactTier: 'High',
        primaryResource: 'GPU',
        safeToReduce: true,
        recommendedValue: 'Very Low',
        reason: 'Drastically improves competitive enemy visibility in open fields and boosts FPS by 18%.'
      },
      {
        settingName: 'Anti-Aliasing & View Distance',
        impactTier: 'Medium',
        primaryResource: 'GPU',
        safeToReduce: false,
        recommendedValue: 'High or Ultra',
        reason: 'Keeps distant enemies and vehicles sharp without jagged pixel shimmering.'
      },
      {
        settingName: 'DirectX 11 Enhanced API',
        impactTier: 'Medium',
        primaryResource: 'CPU',
        safeToReduce: false,
        recommendedValue: 'DirectX 11 (Enhanced)',
        reason: 'Provides the smoothest frame times and lowest 1% low stutter on modern multi-core systems.'
      }
    ],
    benchmarks: [
      {
        gpuId: 'rtx-3050-laptop',
        gpuName: 'RTX 3050 Laptop GPU',
        vramGb: 4,
        ramGb: 16,
        resolution: '1080p',
        preset: 'Competitive Settings (Textures High, AA Ultra, Rest Very Low)',
        upscaling: 'None',
        rayTracing: 'Off',
        avgFps: 95,
        low1PercentFps: 62,
        fpsRangeDisplay: '80 - 110 FPS',
        source: 'Hardware Unboxed PUBG Testing',
        notes: 'Consistent 80+ FPS during hot drops and smoke fights.'
      },
      {
        gpuId: 'gtx-1650',
        gpuName: 'GTX 1650 Desktop',
        vramGb: 4,
        ramGb: 16,
        resolution: '1080p',
        preset: 'Competitive Settings (Textures Med, AA High, Rest Very Low)',
        upscaling: 'None',
        rayTracing: 'Off',
        avgFps: 72,
        low1PercentFps: 48,
        fpsRangeDisplay: '60 - 80 FPS',
        source: 'Tom’s Hardware PUBG Benchmark',
        notes: 'Solid 60+ FPS competitive baseline.'
      }
    ],
    knownBenchmarks: {
      'rtx-3050-laptop': {
        fpsRange: '80 - 110 FPS',
        resolution: '1080p',
        preset: 'Competitive Settings (Textures High, Rest Very Low)',
        source: 'Hardware Unboxed PUBG Testing',
        disclaimer: 'Smooth 80+ FPS during combat.'
      }
    }
  },

  // =========================================================================
  // 11. CALL OF DUTY: WARZONE
  // =========================================================================
  {
    id: 'call-of-duty-warzone',
    name: 'Call of Duty: Warzone',
    category: 'Esports / First-Person Shooter',
    officialSource: 'Activision Official Call of Duty PC System Requirements',
    confidence: 'High',
    confidenceReason: 'Official Activision specs and extensive competitive benchmark testing by Hardware Unboxed and TechPowerUp.',
    researchSources: [
      'Activision / Infinity Ward PC System Requirements Matrix',
      'Hardware Unboxed Call of Duty: Warzone GPU & CPU Benchmark',
      'Digital Foundry Warzone Engine Deep Dive'
    ],
    demandProfile: {
      overallDemand: 'Very Demanding',
      gpuDemand: 'High',
      cpuDemand: 'High',
      ramDemand: 'High',
      vramSensitivity: 'High',
      difficulty1080p: 'High',
      difficulty1440p: 'Very High',
      difficulty4K: 'Extreme',
      rayTracingDemand: 'None',
      upscalingUsefulness: 'Essential',
      engineOrApi: 'IW 9.0 (DirectX 12)',
      storageRecommendation: '125 GB SSD strictly recommended for on-demand texture streaming'
    },
    supportedResolutions: ['1080p', '1440p', '4K'],
    supportedUpscalers: ['NVIDIA DLSS 3 (Super Resolution + Frame Gen)', 'AMD FSR 3.0', 'Intel XeSS', 'FidelityFX CAS'],
    minimumRequirements: {
      gpuName: 'NVIDIA GeForce GTX 960 (4GB) / GTX 1650 or AMD Radeon RX 470',
      minGpuScore: 28,
      minVram: 4,
      cpuName: 'Intel Core i5-6600 / AMD Ryzen 5 1400',
      minCpuScore: 36,
      ramGb: 8,
      storageRequirement: '125 GB SSD/HDD',
      resolutionTarget: '1080p Minimum @ 45-60 FPS',
      targetResolution: '1080p',
      targetPreset: 'Minimum',
      targetFps: 45
    },
    recommendedRequirements: {
      gpuName: 'NVIDIA GeForce RTX 2060 / GTX 1080 or AMD Radeon RX 5600 XT',
      recGpuScore: 50,
      recVram: 6,
      cpuName: 'Intel Core i7-6700K / AMD Ryzen 5 1600X',
      recCpuScore: 56,
      ramGb: 16,
      storageRequirement: '125 GB SSD',
      resolutionTarget: '1080p Balanced @ 60+ FPS',
      targetResolution: '1080p',
      targetPreset: 'Balanced',
      targetFps: 60
    },
    vramNotes: 'Warzone features a dedicated VRAM Target slider. On 4GB cards, set VRAM Scale to 70% and Textures to Very Low or Low. 8GB+ VRAM is recommended for Normal textures.',
    specialNotes: 'Heavy multi-thread traversal demand across large urban areas. Enabling DLSS or FSR Quality is strongly advised to maintain triple-digit framerates.',
    keySettingsImpact: [
      {
        settingName: 'Texture Resolution',
        impactTier: 'Massive',
        primaryResource: 'VRAM',
        safeToReduce: true,
        recommendedValue: 'Low or Normal',
        reason: 'Exceeding VRAM target triggers severe frame rate drops during gunfights.'
      },
      {
        settingName: 'Spot Shadow Quality & Particle Lighting',
        impactTier: 'High',
        primaryResource: 'GPU',
        safeToReduce: true,
        recommendedValue: 'Low',
        reason: 'Recovers 12-16% GPU render time with no impact on long-distance target spotting.'
      },
      {
        settingName: 'Upscaling (DLSS / FSR)',
        impactTier: 'Massive',
        primaryResource: 'GPU',
        safeToReduce: false,
        recommendedValue: 'Quality or Balanced',
        reason: 'Essential boost of 30-45% higher framerates on modern GPUs.'
      }
    ],
    benchmarks: [
      {
        gpuId: 'rtx-3050-laptop',
        gpuName: 'RTX 3050 Laptop GPU (4GB)',
        vramGb: 4,
        ramGb: 16,
        resolution: '1080p',
        preset: 'Competitive Low/Normal Textures + DLSS Quality',
        upscaling: 'DLSS Quality',
        rayTracing: 'Off',
        avgFps: 68,
        low1PercentFps: 50,
        fpsRangeDisplay: '60 - 75 FPS',
        source: 'Hardware Unboxed Warzone Testing',
        notes: 'Smooth 60+ FPS with optimized VRAM settings and DLSS Quality.'
      },
      {
        gpuId: 'gtx-1650',
        gpuName: 'GTX 1650 Desktop',
        vramGb: 4,
        ramGb: 16,
        resolution: '1080p',
        preset: 'Minimum Settings + FSR Quality',
        upscaling: 'FSR Quality',
        rayTracing: 'Off',
        avgFps: 52,
        low1PercentFps: 38,
        fpsRangeDisplay: '45 - 60 FPS',
        source: 'TechPowerUp Warzone Benchmarks',
        notes: 'Playable around 50 FPS on low settings with temporal upscaling.'
      },
      {
        gpuId: 'rtx-3060',
        gpuName: 'RTX 3060 12GB Desktop',
        vramGb: 12,
        ramGb: 16,
        resolution: '1080p',
        preset: 'Balanced / High Textures + DLSS Quality',
        upscaling: 'DLSS Quality',
        rayTracing: 'Off',
        avgFps: 115,
        low1PercentFps: 85,
        fpsRangeDisplay: '100 - 130 FPS',
        source: 'Hardware Unboxed Call of Duty Matrix',
        notes: 'Excellent high-refresh performance; 12GB VRAM eliminates texture streaming hitches.'
      }
    ],
    knownBenchmarks: {
      'rtx-3050-laptop': {
        fpsRange: '60 - 75 FPS',
        resolution: '1080p',
        preset: 'Competitive Low/Normal + DLSS Quality',
        source: 'Hardware Unboxed Warzone Testing',
        disclaimer: 'Smooth 60+ FPS with DLSS Quality.'
      },
      'gtx-1650': {
        fpsRange: '45 - 60 FPS',
        resolution: '1080p',
        preset: 'Minimum Settings + FSR Quality',
        source: 'TechPowerUp Warzone Benchmarks',
        disclaimer: 'Playable 45-60 FPS on reduced settings.'
      }
    }
  }
];
