import { Game } from '../../types';

/**
 * Sony PlayStation PC Games Catalog
 * Sources: Nixxes Software Official Specs, Sony Interactive Entertainment PC Specifications,
 * Digital Foundry Technical Analysis, Hardware Unboxed, & TechPowerUp Benchmarks.
 */
export const PLAYSTATION_PC_GAMES: Game[] = [
  // =========================================================================
  // 1. GOD OF WAR (2018)
  // =========================================================================
  {
    id: 'god-of-war-2018',
    name: 'God of War (2018)',
    category: 'Action Adventure',
    officialSource: 'Sony Interactive Entertainment & Santa Monica Studio Official PC Requirements',
    confidence: 'High',
    confidenceReason: 'Official Sony 5-tier hardware specification matrix published for 720p/30, 1080p/30, 1080p/60, 1440p/60, and 4K/60, validated against Digital Foundry tech review.',
    researchSources: [
      'PlayStation Blog Official God of War PC System Requirements Announcement',
      'Digital Foundry God of War PC Tech Review & Optimization Guide',
      'Hardware Unboxed 30+ GPU Benchmark Analysis',
      'TechPowerUp God of War Performance Benchmark Suite'
    ],
    demandProfile: {
      overallDemand: 'High',
      gpuDemand: 'Medium',
      cpuDemand: 'Medium',
      ramDemand: 'Medium',
      vramSensitivity: 'Medium',
      difficulty1080p: 'Medium',
      difficulty1440p: 'High',
      difficulty4K: 'Very High',
      rayTracingDemand: 'None',
      upscalingUsefulness: 'High',
      engineOrApi: 'Santa Monica In-House Engine (DirectX 11)',
      storageRecommendation: '70 GB SSD Recommended'
    },
    supportedResolutions: ['1080p', '1440p', '4K'],
    supportedUpscalers: ['NVIDIA DLSS 2.3', 'AMD FSR 2.0'],
    minimumRequirements: {
      gpuName: 'GeForce GTX 960 (4GB) / Radeon R9 290X (4GB)',
      minGpuScore: 23,
      minVram: 4,
      cpuName: 'Intel Core i5-2500K / AMD Ryzen 3 1200',
      minCpuScore: 26,
      ramGb: 8,
      storageRequirement: '70 GB HDD (SSD Recommended)',
      resolutionTarget: '720p Low @ 30 FPS',
      targetResolution: '720p',
      targetPreset: 'Low',
      targetFps: 30
    },
    recommendedRequirements: {
      gpuName: 'GeForce GTX 1060 (6GB) / Radeon RX 570 (4GB)',
      recGpuScore: 32,
      recVram: 4,
      cpuName: 'Intel Core i5-6600K / AMD Ryzen 5 2400G',
      recCpuScore: 40,
      ramGb: 16,
      storageRequirement: '70 GB SSD Required',
      resolutionTarget: '1080p Original (PS4 Equivalent) @ 30 FPS (High @ 60 FPS requires RTX 2060 / RX 5700)',
      targetResolution: '1080p',
      targetPreset: 'Original / High',
      targetFps: 60
    },
    vramNotes: 'Original preset textures fit within 4GB VRAM. 6GB+ VRAM is recommended for High textures. 4GB GPUs maintain fluid 55-65 FPS on Original settings with DLSS or FSR Quality enabled.',
    specialNotes: 'God of War is built on DirectX 11; shader precompilation is handled during first boot and transitions to minimize in-game micro-stutters.',
    keySettingsImpact: [
      {
        settingName: 'Shadow Quality',
        impactTier: 'High',
        primaryResource: 'GPU',
        safeToReduce: true,
        recommendedValue: 'Original',
        reason: 'Settings above Original render higher resolution cascades and soft contact shadows that reduce framerates by 14-18% with negligible visual gain in motion.'
      },
      {
        settingName: 'Atmospherics (Volumetric Fog & Light Shafts)',
        impactTier: 'Medium',
        primaryResource: 'GPU',
        safeToReduce: true,
        recommendedValue: 'Original',
        reason: 'Original provides accurate god-rays and mountain mist; High and Ultra significantly increase volumetric sample steps across Alfheim and the Lake of Nine.'
      },
      {
        settingName: 'Reflections',
        impactTier: 'Medium',
        primaryResource: 'GPU',
        safeToReduce: true,
        recommendedValue: 'Original',
        reason: 'Controls screen-space water reflections on the Lake of Nine. Original matches the artist intent without performance spikes.'
      },
      {
        settingName: 'Texture Quality',
        impactTier: 'Medium',
        primaryResource: 'VRAM',
        safeToReduce: true,
        recommendedValue: 'Original on 4GB GPUs; High on 6GB+ GPUs',
        reason: 'Original fits cleanly inside a 4GB VRAM buffer with zero stuttering. High requires 6GB VRAM for high-resolution armor engravings and stone runes.'
      }
    ],
    benchmarks: [
      {
        gpuId: 'rtx-3050-laptop',
        gpuName: 'RTX 3050 Laptop GPU (4GB 75W)',
        vramGb: 4,
        ramGb: 16,
        resolution: '1080p',
        preset: 'Original (PS4 Quality)',
        upscaling: 'DLSS Quality',
        rayTracing: 'None',
        avgFps: 63,
        low1PercentFps: 51,
        fpsRangeDisplay: '58 - 68 FPS',
        source: 'Notebookcheck & Digital Foundry God of War PC Benchmark',
        notes: 'Consistent 60+ FPS across the Lake of Nine and Realm travel rooms with DLSS Quality on Original preset.'
      },
      {
        gpuId: 'gtx-1650-laptop',
        gpuName: 'GTX 1650 Laptop GPU (4GB 50W)',
        vramGb: 4,
        ramGb: 16,
        resolution: '1080p',
        preset: 'Original / Low Mix',
        upscaling: 'FSR 2.0 Quality',
        rayTracing: 'None',
        avgFps: 44,
        low1PercentFps: 34,
        fpsRangeDisplay: '40 - 48 FPS',
        source: 'TechPowerUp & Notebookcheck Community Testing',
        notes: 'Playable 40-48 FPS baseline with FSR Quality active.'
      },
      {
        gpuId: 'rtx-3060',
        gpuName: 'RTX 3060 (12GB Desktop)',
        vramGb: 12,
        ramGb: 16,
        resolution: '1080p',
        preset: 'Ultra',
        upscaling: 'DLSS Quality',
        rayTracing: 'None',
        avgFps: 78,
        low1PercentFps: 64,
        fpsRangeDisplay: '72 - 85 FPS',
        source: 'Hardware Unboxed 30-GPU God of War Benchmark Suite',
        notes: 'Rock-solid 75+ FPS at 1080p Ultra with DLSS Quality.'
      }
    ]
  },

  // =========================================================================
  // 2. GOD OF WAR RAGNARÖK (2024)
  // =========================================================================
  {
    id: 'god-of-war-ragnarok',
    name: 'God of War Ragnarök',
    category: 'Action Adventure',
    officialSource: 'Sony Interactive Entertainment & Jetpack Interactive Official PC Specifications (Sep 2024)',
    confidence: 'High',
    confidenceReason: 'Official multi-tier system specs released by PlayStation covering 1080p/30, 1080p/60, 1440p/60, and 4K/60, backed by Digital Foundry analysis and post-launch VRAM patch data.',
    researchSources: [
      'PlayStation Blog Official God of War Ragnarök PC Hardware Spec Sheet',
      'Digital Foundry God of War Ragnarök PC Port Tech Analysis',
      'TechPowerUp God of War Ragnarök Benchmark Suite',
      'Hardware Unboxed PC Port Performance Review'
    ],
    demandProfile: {
      overallDemand: 'Very Demanding',
      gpuDemand: 'High',
      cpuDemand: 'High',
      ramDemand: 'High',
      vramSensitivity: 'High',
      difficulty1080p: 'Moderate to High',
      difficulty1440p: 'High',
      difficulty4K: 'Very High',
      rayTracingDemand: 'None',
      upscalingUsefulness: 'Essential',
      engineOrApi: 'Santa Monica In-House Engine (DirectX 12)',
      storageRecommendation: '190 GB SSD Strictly Required'
    },
    supportedResolutions: ['1080p', '1440p', '4K'],
    supportedUpscalers: ['NVIDIA DLSS 3.7 (Frame Gen)', 'AMD FSR 3.1 (Frame Gen)', 'Intel XeSS 1.3'],
    minimumRequirements: {
      gpuName: 'GeForce GTX 1060 (6GB) / Radeon RX 5500 XT (8GB)',
      minGpuScore: 32,
      minVram: 6,
      cpuName: 'Intel Core i5-4670K / AMD Ryzen 3 1200',
      minCpuScore: 30,
      ramGb: 8,
      storageRequirement: '190 GB SSD strictly required (HDD not supported)',
      resolutionTarget: '1080p Low @ 30 FPS',
      targetResolution: '1080p',
      targetPreset: 'Low',
      targetFps: 30
    },
    recommendedRequirements: {
      gpuName: 'GeForce RTX 2060 Super (8GB) / Radeon RX 5700 (8GB)',
      recGpuScore: 52,
      recVram: 8,
      cpuName: 'Intel Core i5-8600 / AMD Ryzen 5 3600',
      recCpuScore: 54,
      ramGb: 16,
      storageRequirement: '190 GB SSD strictly required',
      resolutionTarget: '1080p Medium @ 60 FPS',
      targetResolution: '1080p',
      targetPreset: 'Medium',
      targetFps: 60
    },
    vramNotes: 'Sony originally instituted a 6GB VRAM check; patch 1.02 added official support for 4GB VRAM cards. On 4GB cards (such as RTX 3050 Laptop), Low/Medium textures with DLSS or FSR Quality fit inside the 4GB buffer without stuttering.',
    specialNotes: 'Demands an SSD for fast streaming of dense Nine Realms environments (Svartalfheim waterways, Vanaheim jungles).',
    keySettingsImpact: [
      {
        settingName: 'Shadow Quality',
        impactTier: 'High',
        primaryResource: 'GPU',
        safeToReduce: true,
        recommendedValue: 'Medium',
        reason: 'Ultra shadows create heavy raster load on dense jungle foliage in Vanaheim; Medium offers virtually identical visual quality with 15% better framerates.'
      },
      {
        settingName: 'Atmospherics & Volumetric Clouds',
        impactTier: 'High',
        primaryResource: 'GPU',
        safeToReduce: true,
        recommendedValue: 'Medium',
        reason: 'Reduces volumetric raymarching steps during snowstorms in Midgard and mist in Niflheim.'
      },
      {
        settingName: 'Texture Quality',
        impactTier: 'Massive',
        primaryResource: 'VRAM',
        safeToReduce: true,
        recommendedValue: 'Low/Medium on 4GB GPUs; High on 8GB+ GPUs',
        reason: 'Critical for avoiding VRAM spillover on 4GB and 6GB graphics cards.'
      },
      {
        settingName: 'Upscaling (DLSS / FSR 3.1 / XeSS)',
        impactTier: 'Massive',
        primaryResource: 'GPU',
        safeToReduce: false,
        recommendedValue: 'Quality Mode',
        reason: 'Reconstructing from an internal sub-native resolution grants a 30-40% framerate increase with clean anti-aliasing.'
      }
    ],
    benchmarks: [
      {
        gpuId: 'rtx-3050-laptop',
        gpuName: 'RTX 3050 Laptop GPU (4GB 75W)',
        vramGb: 4,
        ramGb: 16,
        resolution: '1080p',
        preset: 'Low / Medium Mix (Textures Low, Shadows Medium)',
        upscaling: 'DLSS Quality',
        rayTracing: 'None',
        avgFps: 54,
        low1PercentFps: 42,
        fpsRangeDisplay: '48 - 60 FPS',
        source: 'Digital Foundry God of War Ragnarök PC Port Analysis',
        notes: 'Following patch 1.02 (4GB VRAM support), runs smoothly at 50-60 FPS on Low/Medium settings with DLSS Quality.'
      },
      {
        gpuId: 'rtx-3060',
        gpuName: 'RTX 3060 (12GB Desktop)',
        vramGb: 12,
        ramGb: 16,
        resolution: '1080p',
        preset: 'High',
        upscaling: 'DLSS Quality',
        rayTracing: 'None',
        avgFps: 74,
        low1PercentFps: 61,
        fpsRangeDisplay: '68 - 82 FPS',
        source: 'TechPowerUp Ragnarök PC Benchmark Suite',
        notes: 'Solid 70+ FPS at 1080p High with DLSS Quality. 12GB VRAM handles all Nine Realms streaming easily.'
      }
    ]
  },

  // =========================================================================
  // 3. HORIZON FORBIDDEN WEST (2024)
  // =========================================================================
  {
    id: 'horizon-forbidden-west',
    name: 'Horizon Forbidden West',
    category: 'Open World RPG',
    officialSource: 'Nixxes Software & Guerrilla Games Official PC Specifications (March 2024)',
    confidence: 'High',
    confidenceReason: 'Official four-tier specifications published by Nixxes Software, comprehensive Digital Foundry technical review, and multi-GPU testing by TechPowerUp and Hardware Unboxed.',
    researchSources: [
      'PlayStation Blog Official Horizon Forbidden West Complete Edition PC Spec Announcement',
      'Digital Foundry Horizon Forbidden West PC Tech Review & Optimization Guide',
      'Hardware Unboxed 35-GPU Benchmark Suite',
      'TechPowerUp Horizon Forbidden West Performance Breakdown'
    ],
    demandProfile: {
      overallDemand: 'High',
      gpuDemand: 'Very High',
      cpuDemand: 'High',
      ramDemand: 'High',
      vramSensitivity: 'High',
      difficulty1080p: 'High',
      difficulty1440p: 'Very High',
      difficulty4K: 'Extreme',
      rayTracingDemand: 'None',
      upscalingUsefulness: 'Essential',
      engineOrApi: 'Decima Engine (DirectX 12)',
      storageRecommendation: '150 GB SSD Strictly Required'
    },
    supportedResolutions: ['1080p', '1440p', '4K'],
    supportedUpscalers: ['NVIDIA DLSS 3 (Frame Gen)', 'AMD FSR 3.1 (Frame Gen)', 'Intel XeSS', 'DLAA'],
    minimumRequirements: {
      gpuName: 'GeForce GTX 1650 (4GB) / Radeon RX 5500 XT (4GB)',
      minGpuScore: 26,
      minVram: 4,
      cpuName: 'Intel Core i3-8100 / AMD Ryzen 3 1300X',
      minCpuScore: 35,
      ramGb: 16,
      storageRequirement: '150 GB SSD strictly required',
      resolutionTarget: '720p Very Low @ 30 FPS',
      targetResolution: '720p',
      targetPreset: 'Very Low',
      targetFps: 30
    },
    recommendedRequirements: {
      gpuName: 'GeForce RTX 3060 (12GB) / Radeon RX 5700 (8GB)',
      recGpuScore: 50,
      recVram: 8,
      cpuName: 'Intel Core i5-8600 / AMD Ryzen 5 3600',
      recCpuScore: 54,
      ramGb: 16,
      storageRequirement: '150 GB SSD required',
      resolutionTarget: '1080p Medium @ 60 FPS',
      targetResolution: '1080p',
      targetPreset: 'Medium',
      targetFps: 60
    },
    vramNotes: 'Decima engine dynamically manages streaming pools, but High textures can demand 7GB+ VRAM. On 4GB cards, Medium textures with DLSS Quality keep allocations safe and stutter-free.',
    specialNotes: 'Features dense volumetric foliage and dynamic weather in the Daunt and Plainsong. An NVMe SSD prevents traversal hitches when riding machines.',
    keySettingsImpact: [
      {
        settingName: 'Shadows & Screen-Space Shadows',
        impactTier: 'High',
        primaryResource: 'GPU',
        safeToReduce: true,
        recommendedValue: 'Medium',
        reason: 'Reduces shadow map resolution and penumbra filtering cost across thousands of dynamic grass blades in Plainsong.'
      },
      {
        settingName: 'Volumetric Clouds',
        impactTier: 'High',
        primaryResource: 'GPU',
        safeToReduce: true,
        recommendedValue: 'Medium',
        reason: 'Guerrilla’s Nubis real-time volumetric cloud system is demanding; Medium saves ~12% GPU time with excellent atmospheric fidelity.'
      },
      {
        settingName: 'Crowd Quality & Hair Quality',
        impactTier: 'Medium',
        primaryResource: 'CPU',
        safeToReduce: true,
        recommendedValue: 'Medium',
        reason: 'Reduces vertex shader load in large Tenakth and Utaru settlements.'
      },
      {
        settingName: 'Texture Quality',
        impactTier: 'High',
        primaryResource: 'VRAM',
        safeToReduce: true,
        recommendedValue: 'Medium on 4GB-6GB GPUs; High on 8GB+ GPUs',
        reason: 'Medium textures maintain sharp detail up close while fitting securely into 4GB VRAM buffers.'
      }
    ],
    benchmarks: [
      {
        gpuId: 'rtx-3050-laptop',
        gpuName: 'RTX 3050 Laptop GPU (4GB 75W)',
        vramGb: 4,
        ramGb: 16,
        resolution: '1080p',
        preset: 'Medium (Volumetrics Medium, Textures Medium)',
        upscaling: 'DLSS Quality',
        rayTracing: 'None',
        avgFps: 48,
        low1PercentFps: 37,
        fpsRangeDisplay: '44 - 54 FPS',
        source: 'Digital Foundry & Hardware Unboxed Forbidden West PC Analysis',
        notes: 'Very playable 44-54 FPS at 1080p Medium with DLSS Quality. Textures on Medium prevent memory spilling.'
      },
      {
        gpuId: 'rtx-3060',
        gpuName: 'RTX 3060 (12GB Desktop)',
        vramGb: 12,
        ramGb: 16,
        resolution: '1080p',
        preset: 'High',
        upscaling: 'DLSS Quality',
        rayTracing: 'None',
        avgFps: 66,
        low1PercentFps: 53,
        fpsRangeDisplay: '60 - 74 FPS',
        source: 'TechPowerUp Horizon Forbidden West Review',
        notes: 'Comfortable 60+ FPS at 1080p High with DLSS Quality.'
      }
    ]
  },

  // =========================================================================
  // 4. GHOST OF TSUSHIMA DIRECTOR'S CUT (2024)
  // =========================================================================
  {
    id: 'ghost-of-tsushima',
    name: "Ghost of Tsushima DIRECTOR'S CUT",
    category: 'Open World Action',
    officialSource: 'Nixxes Software & Sucker Punch Official PC System Requirements (April 2024)',
    confidence: 'High',
    confidenceReason: 'Official four-tier hardware matrix released by Nixxes covering 720p/30 to 4K/60, praised by Digital Foundry as one of the best-optimized PC ports of recent years.',
    researchSources: [
      'PlayStation Blog Official Ghost of Tsushima PC Requirements Announcement',
      'Digital Foundry Ghost of Tsushima PC Tech Review & Port Analysis',
      'TechPowerUp Ghost of Tsushima Benchmark Suite',
      'Hardware Unboxed PC Port Performance Review'
    ],
    demandProfile: {
      overallDemand: 'High',
      gpuDemand: 'Medium',
      cpuDemand: 'Medium',
      ramDemand: 'Medium',
      vramSensitivity: 'Medium',
      difficulty1080p: 'Medium',
      difficulty1440p: 'High',
      difficulty4K: 'Very High',
      rayTracingDemand: 'None',
      upscalingUsefulness: 'High',
      engineOrApi: 'Sucker Punch In-House Engine (DirectX 12)',
      storageRecommendation: '75 GB SSD Strongly Recommended'
    },
    supportedResolutions: ['1080p', '1440p', '4K'],
    supportedUpscalers: ['NVIDIA DLSS 3 (Frame Gen)', 'AMD FSR 3.1 (Frame Gen)', 'Intel XeSS'],
    minimumRequirements: {
      gpuName: 'GeForce GTX 960 (4GB) / Radeon RX 5500 XT (4GB)',
      minGpuScore: 24,
      minVram: 4,
      cpuName: 'Intel Core i3-7100 / AMD Ryzen 3 1200',
      minCpuScore: 28,
      ramGb: 16,
      storageRequirement: '75 GB HDD (SSD Recommended)',
      resolutionTarget: '720p Very Low @ 30 FPS',
      targetResolution: '720p',
      targetPreset: 'Very Low',
      targetFps: 30
    },
    recommendedRequirements: {
      gpuName: 'GeForce RTX 2060 (6GB) / Radeon RX 5600 XT (6GB)',
      recGpuScore: 46,
      recVram: 6,
      cpuName: 'Intel Core i5-8600 / AMD Ryzen 5 3600',
      recCpuScore: 54,
      ramGb: 16,
      storageRequirement: '75 GB SSD Required',
      resolutionTarget: '1080p Medium @ 60 FPS',
      targetResolution: '1080p',
      targetPreset: 'Medium',
      targetFps: 60
    },
    vramNotes: 'Nixxes engineered an efficient texture streaming cache. High textures fit inside 4GB VRAM without micro-stutters when paired with DLSS Quality.',
    specialNotes: 'Outstanding optimization; particle physics (leaves, petals, embers) and wind simulation scale smoothly across multi-core CPUs.',
    keySettingsImpact: [
      {
        settingName: 'Shadow Quality',
        impactTier: 'High',
        primaryResource: 'GPU',
        safeToReduce: true,
        recommendedValue: 'High instead of Very High',
        reason: 'Very High adds soft contact penumbra on millions of windblown pampas grass blades, costing ~10% FPS.'
      },
      {
        settingName: 'Volumetric Fog',
        impactTier: 'Medium',
        primaryResource: 'GPU',
        safeToReduce: true,
        recommendedValue: 'High',
        reason: 'Controls morning mist in Izuhara and hot springs steam; High preserves cinematic atmosphere with light shader cost.'
      },
      {
        settingName: 'Texture Quality',
        impactTier: 'Medium',
        primaryResource: 'VRAM',
        safeToReduce: true,
        recommendedValue: 'High on 4GB+ GPUs',
        reason: 'High textures run comfortably on 4GB graphics cards without asset pop-in.'
      }
    ],
    benchmarks: [
      {
        gpuId: 'rtx-3050-laptop',
        gpuName: 'RTX 3050 Laptop GPU (4GB 75W)',
        vramGb: 4,
        ramGb: 16,
        resolution: '1080p',
        preset: 'High Preset',
        upscaling: 'DLSS Quality',
        rayTracing: 'None',
        avgFps: 62,
        low1PercentFps: 51,
        fpsRangeDisplay: '56 - 68 FPS',
        source: 'Digital Foundry & TechPowerUp Ghost of Tsushima PC Testing',
        notes: 'Locked 60+ FPS at 1080p High with DLSS Quality. Combat parries and katana duels feel exceptionally fluid.'
      },
      {
        gpuId: 'gtx-1650-laptop',
        gpuName: 'GTX 1650 Laptop GPU (4GB)',
        vramGb: 4,
        ramGb: 16,
        resolution: '1080p',
        preset: 'Medium Preset',
        upscaling: 'FSR 3.1 Quality',
        rayTracing: 'None',
        avgFps: 48,
        low1PercentFps: 38,
        fpsRangeDisplay: '44 - 54 FPS',
        source: 'Notebookcheck & Digital Foundry Testing',
        notes: 'Smooth 45-50 FPS at 1080p Medium with FSR 3.1 Quality.'
      },
      {
        gpuId: 'rtx-3060',
        gpuName: 'RTX 3060 (12GB Desktop)',
        vramGb: 12,
        ramGb: 16,
        resolution: '1440p',
        preset: 'Very High',
        upscaling: 'DLSS Quality',
        rayTracing: 'None',
        avgFps: 72,
        low1PercentFps: 58,
        fpsRangeDisplay: '66 - 78 FPS',
        source: 'Hardware Unboxed Ghost of Tsushima Multi-GPU Benchmark',
        notes: 'Flawless 70+ FPS at 1440p Very High with DLSS Quality.'
      }
    ]
  },

  // =========================================================================
  // 5. DAYS GONE (2021)
  // =========================================================================
  {
    id: 'days-gone',
    name: 'Days Gone',
    category: 'Open World Action',
    officialSource: 'Sony Interactive Entertainment & Bend Studio Official PC Specifications',
    confidence: 'High',
    confidenceReason: 'Official Sony specifications, Unreal Engine 4 optimization benchmarks from Digital Foundry and Hardware Unboxed.',
    researchSources: [
      'PlayStation Blog Official Days Gone PC Announcement & Requirements',
      'Digital Foundry Days Gone PC Tech Breakdown',
      'Hardware Unboxed Days Gone GPU Performance Suite',
      'TechPowerUp Days Gone Benchmark Hierarchy'
    ],
    demandProfile: {
      overallDemand: 'Moderate',
      gpuDemand: 'Medium',
      cpuDemand: 'Medium',
      ramDemand: 'Medium',
      vramSensitivity: 'Medium',
      difficulty1080p: 'Low to Medium',
      difficulty1440p: 'Medium',
      difficulty4K: 'High',
      rayTracingDemand: 'None',
      upscalingUsefulness: 'Helpful',
      engineOrApi: 'Unreal Engine 4 (DirectX 11)',
      storageRecommendation: '70 GB SSD Strongly Recommended'
    },
    supportedResolutions: ['1080p', '1440p', '4K'],
    supportedUpscalers: ['Resolution Scaling (In-Engine TSR/TAA)'],
    minimumRequirements: {
      gpuName: 'GeForce GTX 780 (3GB) / Radeon R9 290 (4GB)',
      minGpuScore: 22,
      minVram: 3,
      cpuName: 'Intel Core i5-2500K / AMD FX 6300',
      minCpuScore: 24,
      ramGb: 8,
      storageRequirement: '70 GB HDD (SSD Recommended)',
      resolutionTarget: '1080p Low @ 30 FPS',
      targetResolution: '1080p',
      targetPreset: 'Low',
      targetFps: 30
    },
    recommendedRequirements: {
      gpuName: 'GeForce GTX 1060 (6GB) / Radeon RX 580 (8GB)',
      recGpuScore: 32,
      recVram: 6,
      cpuName: 'Intel Core i7-4770K / AMD Ryzen 5 1500X',
      recCpuScore: 36,
      ramGb: 16,
      storageRequirement: '70 GB SSD',
      resolutionTarget: '1080p Very High @ 60 FPS',
      targetResolution: '1080p',
      targetPreset: 'Very High',
      targetFps: 60
    },
    vramNotes: 'Very modest VRAM requirement; 4GB GPUs easily handle High and Very High textures at 1080p with zero stuttering.',
    specialNotes: 'Hordes of 300+ Freakers demand stable CPU draw-call handling; modern multi-core processors maintain high 1% lows during horde encounters.',
    keySettingsImpact: [
      {
        settingName: 'Shadow Quality',
        impactTier: 'High',
        primaryResource: 'GPU',
        safeToReduce: true,
        recommendedValue: 'High instead of Very High',
        reason: 'Very High adds subtle contact shadowing under dense pine trees that costs ~8% FPS.'
      },
      {
        settingName: 'Foliage Draw Distance',
        impactTier: 'Medium',
        primaryResource: 'CPU',
        safeToReduce: true,
        recommendedValue: 'High',
        reason: 'Very High pushes grass rendering distance to the horizon, increasing draw-call counts on older processors.'
      },
      {
        settingName: 'Texture Quality',
        impactTier: 'Low',
        primaryResource: 'VRAM',
        safeToReduce: true,
        recommendedValue: 'Very High on 4GB+ GPUs',
        reason: 'Unreal Engine 4 texture streaming is exceptionally efficient in Days Gone.'
      }
    ],
    benchmarks: [
      {
        gpuId: 'rtx-3050-laptop',
        gpuName: 'RTX 3050 Laptop GPU (4GB 75W)',
        vramGb: 4,
        ramGb: 16,
        resolution: '1080p',
        preset: 'Very High Preset',
        upscaling: 'Native 100%',
        rayTracing: 'None',
        avgFps: 72,
        low1PercentFps: 58,
        fpsRangeDisplay: '66 - 78 FPS',
        source: 'Notebookcheck & Digital Foundry Days Gone PC Benchmarks',
        notes: 'Easily runs above 70 FPS at 1080p Very High natively. Motorcycle driving and Horde battles are rock-solid.'
      },
      {
        gpuId: 'gtx-1650-laptop',
        gpuName: 'GTX 1650 Laptop GPU (4GB)',
        vramGb: 4,
        ramGb: 16,
        resolution: '1080p',
        preset: 'High Preset',
        upscaling: 'Native 100%',
        rayTracing: 'None',
        avgFps: 52,
        low1PercentFps: 42,
        fpsRangeDisplay: '48 - 56 FPS',
        source: 'TechPowerUp Testing',
        notes: 'Solid 50+ FPS at 1080p High.'
      }
    ]
  },

  // =========================================================================
  // 6. DEATH STRANDING DIRECTOR'S CUT (2022)
  // =========================================================================
  {
    id: 'death-stranding-dc',
    name: "Death Stranding Director's Cut",
    category: 'Action Adventure',
    officialSource: '505 Games & Kojima Productions Official PC System Requirements',
    confidence: 'High',
    confidenceReason: 'Official publisher specifications, Decima engine PC benchmarks from Digital Foundry and TechPowerUp.',
    researchSources: [
      '505 Games Official PC System Requirements',
      'Digital Foundry Death Stranding PC Technical Breakdown',
      'TechPowerUp Death Stranding Director’s Cut GPU Hierarchy',
      'Hardware Unboxed Decima Engine Testing'
    ],
    demandProfile: {
      overallDemand: 'Moderate',
      gpuDemand: 'Medium',
      cpuDemand: 'Medium',
      ramDemand: 'Medium',
      vramSensitivity: 'Medium',
      difficulty1080p: 'Low to Medium',
      difficulty1440p: 'Medium',
      difficulty4K: 'High',
      rayTracingDemand: 'None',
      upscalingUsefulness: 'Helpful',
      engineOrApi: 'Decima Engine (DirectX 12)',
      storageRecommendation: '80 GB SSD Strongly Recommended'
    },
    supportedResolutions: ['1080p', '1440p', '4K'],
    supportedUpscalers: ['NVIDIA DLSS 2.3', 'AMD FSR 2.0', 'Intel XeSS'],
    minimumRequirements: {
      gpuName: 'GeForce GTX 1050 (3GB) / Radeon RX 560 (4GB)',
      minGpuScore: 20,
      minVram: 3,
      cpuName: 'Intel Core i5-2500 / AMD FX 8350',
      minCpuScore: 24,
      ramGb: 8,
      storageRequirement: '80 GB HDD (SSD Recommended)',
      resolutionTarget: '720p Low @ 30 FPS',
      targetResolution: '720p',
      targetPreset: 'Low',
      targetFps: 30
    },
    recommendedRequirements: {
      gpuName: 'GeForce GTX 1060 (6GB) / Radeon RX 590 (8GB)',
      recGpuScore: 32,
      recVram: 6,
      cpuName: 'Intel Core i7-3770 / AMD Ryzen 5 1600',
      recCpuScore: 34,
      ramGb: 8,
      storageRequirement: '80 GB SSD',
      resolutionTarget: '1080p Very High @ 60 FPS',
      targetResolution: '1080p',
      targetPreset: 'Very High',
      targetFps: 60
    },
    vramNotes: 'Decima handles memory with exceptional efficiency. High/Very High textures run without stutter on 4GB graphics cards.',
    specialNotes: 'One of the most scalable PC releases; delivers exceptional frame pacing and high refresh rates even on mid-range laptops.',
    keySettingsImpact: [
      {
        settingName: 'Shadow Resolution',
        impactTier: 'High',
        primaryResource: 'GPU',
        safeToReduce: true,
        recommendedValue: 'High',
        reason: 'Very High casts crisp soft shadows on rocks and volcanic terrain, costing ~8% FPS.'
      },
      {
        settingName: 'Ambient Occlusion',
        impactTier: 'Medium',
        primaryResource: 'GPU',
        safeToReduce: true,
        recommendedValue: 'Medium / High',
        reason: 'Provides depth under cargo packages and rocky outcrops with minimal shader overhead.'
      },
      {
        settingName: 'Texture Quality',
        impactTier: 'Low',
        primaryResource: 'VRAM',
        safeToReduce: true,
        recommendedValue: 'Very High on 4GB+ GPUs',
        reason: 'Very High textures fit comfortably inside 4GB VRAM at 1080p.'
      }
    ],
    benchmarks: [
      {
        gpuId: 'rtx-3050-laptop',
        gpuName: 'RTX 3050 Laptop GPU (4GB 75W)',
        vramGb: 4,
        ramGb: 16,
        resolution: '1080p',
        preset: 'Very High Preset',
        upscaling: 'DLSS Quality',
        rayTracing: 'None',
        avgFps: 84,
        low1PercentFps: 70,
        fpsRangeDisplay: '78 - 90 FPS',
        source: 'TechPowerUp & Notebookcheck Death Stranding DC Benchmarks',
        notes: 'Silky smooth 80+ FPS at 1080p Very High with DLSS Quality. Traversal across Icelandic landscapes is fluid.'
      },
      {
        gpuId: 'gtx-1650-laptop',
        gpuName: 'GTX 1650 Laptop GPU (4GB)',
        vramGb: 4,
        ramGb: 16,
        resolution: '1080p',
        preset: 'High Preset',
        upscaling: 'FSR 2.0 Quality',
        rayTracing: 'None',
        avgFps: 58,
        low1PercentFps: 48,
        fpsRangeDisplay: '54 - 64 FPS',
        source: 'Notebookcheck Testing',
        notes: 'Consistent 55-60 FPS at 1080p High with FSR Quality.'
      }
    ]
  },

  // =========================================================================
  // 7. RATCHET & CLANK: RIFT APART (2023)
  // =========================================================================
  {
    id: 'ratchet-clank-rift-apart',
    name: 'Ratchet & Clank: Rift Apart',
    category: 'Action Platformer',
    officialSource: 'PlayStation & Nixxes Software Official PC System Requirements (July 2023)',
    confidence: 'High',
    confidenceReason: 'Official Nixxes 5-tier specifications including DirectStorage 1.2 decompression, ray tracing profiles, and comprehensive Digital Foundry hardware reviews.',
    researchSources: [
      'PlayStation Blog Official Ratchet & Clank: Rift Apart PC Spec Announcement',
      'Digital Foundry Rift Apart PC Tech Review & DirectStorage Analysis',
      'Hardware Unboxed 30-GPU Benchmark Matrix',
      'TechPowerUp Rift Apart PC Performance Breakdown'
    ],
    demandProfile: {
      overallDemand: 'Very Demanding',
      gpuDemand: 'High',
      cpuDemand: 'High',
      ramDemand: 'High',
      vramSensitivity: 'High',
      difficulty1080p: 'Moderate to High',
      difficulty1440p: 'High',
      difficulty4K: 'Very High',
      rayTracingDemand: 'High',
      upscalingUsefulness: 'Essential',
      engineOrApi: 'Insomniac Engine with DirectStorage 1.2 (DirectX 12 Ultimate)',
      storageRecommendation: '75 GB SSD Strictly Required'
    },
    supportedResolutions: ['1080p', '1440p', '4K'],
    supportedUpscalers: ['NVIDIA DLSS 3 (Frame Gen)', 'AMD FSR 3.1 (Frame Gen)', 'Intel XeSS', 'IGTI'],
    minimumRequirements: {
      gpuName: 'GeForce GTX 960 (4GB) / Radeon RX 470 (4GB)',
      minGpuScore: 23,
      minVram: 4,
      cpuName: 'Intel Core i3-8100 / AMD Ryzen 3 3100',
      minCpuScore: 35,
      ramGb: 8,
      storageRequirement: '75 GB HDD (SSD Strongly Recommended for Rift transitions)',
      resolutionTarget: '720p Very Low @ 30 FPS',
      targetResolution: '720p',
      targetPreset: 'Very Low',
      targetFps: 30
    },
    recommendedRequirements: {
      gpuName: 'GeForce RTX 2060 (6GB) / Radeon RX 5700 (8GB)',
      recGpuScore: 48,
      recVram: 6,
      cpuName: 'Intel Core i5-8400 / AMD Ryzen 5 3600',
      recCpuScore: 50,
      ramGb: 16,
      storageRequirement: '75 GB SSD Strictly Required',
      resolutionTarget: '1080p Medium @ 60 FPS (RT Off)',
      targetResolution: '1080p',
      targetPreset: 'Medium',
      targetFps: 60
    },
    vramNotes: 'Ray Traced Reflections and Ambient Occlusion add ~1.8GB to VRAM usage; Ray Tracing MUST be disabled on 4GB and 6GB graphics cards. Medium textures with DLSS Quality fit cleanly within 4GB VRAM.',
    specialNotes: 'First PC game utilizing GPU DirectStorage decompression for instantaneous dimensional rift jumping; an NVMe or SATA SSD is essential.',
    keySettingsImpact: [
      {
        settingName: 'Ray Traced Reflections & Ambient Occlusion',
        impactTier: 'Massive',
        primaryResource: 'GPU',
        safeToReduce: true,
        recommendedValue: 'Off on sub-8GB GPUs',
        reason: 'Insomniac’s ray tracing is beautiful on high-end desktop GPUs, but cuts framerates by 40% and causes severe memory overflow on 4GB cards.'
      },
      {
        settingName: 'Shadow Quality',
        impactTier: 'High',
        primaryResource: 'GPU',
        safeToReduce: true,
        recommendedValue: 'Medium',
        reason: 'Calculates dynamic shadows for thousands of floating metallic particles in Nefarious City.'
      },
      {
        settingName: 'Texture Quality',
        impactTier: 'Massive',
        primaryResource: 'VRAM',
        safeToReduce: true,
        recommendedValue: 'Medium on 4GB GPUs; High on 8GB+ GPUs',
        reason: 'Setting textures to Medium prevents hitching during rapid pocket-dimension transitions on 4GB cards.'
      },
      {
        settingName: 'Upscaling (DLSS / FSR / XeSS)',
        impactTier: 'Massive',
        primaryResource: 'GPU',
        safeToReduce: false,
        recommendedValue: 'Quality Mode',
        reason: 'Increases performance by 35% and stabilizes frametimes in action-heavy dimensional firefights.'
      }
    ],
    benchmarks: [
      {
        gpuId: 'rtx-3050-laptop',
        gpuName: 'RTX 3050 Laptop GPU (4GB 75W)',
        vramGb: 4,
        ramGb: 16,
        resolution: '1080p',
        preset: 'Medium Preset (RT Off)',
        upscaling: 'DLSS Quality',
        rayTracing: 'Off',
        avgFps: 56,
        low1PercentFps: 44,
        fpsRangeDisplay: '50 - 62 FPS',
        source: 'Digital Foundry & Hardware Unboxed Rift Apart PC Analysis',
        notes: 'Smooth 50-60 FPS at 1080p Medium with DLSS Quality and RT Off. Dimension jumps on SSD are fluid.'
      },
      {
        gpuId: 'rtx-3060',
        gpuName: 'RTX 3060 (12GB Desktop)',
        vramGb: 12,
        ramGb: 16,
        resolution: '1080p',
        preset: 'High (RT Off)',
        upscaling: 'DLSS Quality',
        rayTracing: 'Off',
        avgFps: 76,
        low1PercentFps: 62,
        fpsRangeDisplay: '70 - 84 FPS',
        source: 'TechPowerUp Rift Apart Review',
        notes: 'Effortless 75+ FPS at 1080p High with DLSS Quality.'
      }
    ]
  }
];
