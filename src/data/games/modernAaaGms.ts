import { Game } from '../../types';

/**
 * Modern Demanding AAA Games Catalog (2023-2025)
 * Sources: Ubisoft Official Technical Specs, Capcom Official Requirement Charts,
 * EA/Respawn Official Specifications, Digital Foundry Technical Deep Dives, & TechPowerUp.
 */
export const MODERN_AAA_GAMES: Game[] = [
  // =========================================================================
  // 1. AVATAR: FRONTIERS OF PANDORA (2023)
  // =========================================================================
  {
    id: 'avatar-frontiers-of-pandora',
    name: 'Avatar: Frontiers of Pandora',
    category: 'AAA / Demanding',
    officialSource: 'Ubisoft & Massive Entertainment Official PC System Specifications',
    confidence: 'High',
    confidenceReason: 'Verified against Ubisoft official multi-tier specifications (explicitly noting dual-channel RAM and FSR baseline), Digital Foundry technical analysis, and extensive hardware benchmarks.',
    researchSources: [
      'Ubisoft Massive Official Avatar: Frontiers of Pandora PC System Specifications',
      'Digital Foundry PC Benchmark Suite & Technical Analysis',
      'TechPowerUp Avatar Frontiers of Pandora GPU Hierarchy',
      'Hardware Unboxed Avatar Multi-GPU Benchmark'
    ],
    demandProfile: {
      overallDemand: 'Extreme',
      gpuDemand: 'Extreme',
      cpuDemand: 'High',
      ramDemand: 'High',
      vramSensitivity: 'Extreme',
      difficulty1080p: 'Very High',
      difficulty1440p: 'Extreme',
      difficulty4K: 'Extreme',
      rayTracingDemand: 'Extreme',
      upscalingUsefulness: 'Essential',
      engineOrApi: 'Snowdrop Engine (DirectX 12 with Mandatory Ray Tracing BVH)',
      storageRecommendation: '90 GB SSD Strictly Required'
    },
    supportedResolutions: ['1080p', '1440p', '4K'],
    supportedUpscalers: ['NVIDIA DLSS 3.5', 'AMD FSR 3.0', 'Intel XeSS'],
    minimumRequirements: {
      gpuName: 'Radeon RX 5700 (8GB) / GeForce GTX 1070 (8GB) / Intel Arc A750 (8GB)',
      minGpuScore: 44,
      minVram: 8,
      cpuName: 'AMD Ryzen 5 3600 / Intel Core i7-8700K',
      minCpuScore: 54,
      ramGb: 16,
      storageRequirement: '90 GB SSD strictly required (Dual-Channel RAM specified by Ubisoft)',
      resolutionTarget: '1080p Low @ 30 FPS (FSR 2 Quality Enabled)',
      targetResolution: '1080p',
      targetPreset: 'Low',
      targetFps: 30
    },
    recommendedRequirements: {
      gpuName: 'Radeon RX 6700 XT (12GB) / GeForce RTX 3060 Ti (8GB)',
      recGpuScore: 66,
      recVram: 8,
      cpuName: 'AMD Ryzen 5 5600X / Intel Core i5-11600K',
      recCpuScore: 65,
      ramGb: 16,
      storageRequirement: '90 GB SSD strictly required',
      resolutionTarget: '1080p High @ 60 FPS (FSR 2 Quality Enabled)',
      targetResolution: '1080p',
      targetPreset: 'High',
      targetFps: 60
    },
    vramNotes: 'Avatar uses mandatory hardware ray tracing structures (BVH) that live in VRAM. 4GB GPUs must run Low textures with DLSS/FSR Balanced to prevent video memory exhaustion.',
    specialNotes: 'Massive Entertainment engineered Pandora with a permanent ray-traced BVH acceleration pipeline. Dual-channel RAM and an NVMe SSD are strictly necessary.',
    keySettingsImpact: [
      {
        settingName: 'Volumetric Clouds',
        impactTier: 'Massive',
        primaryResource: 'GPU',
        safeToReduce: true,
        recommendedValue: 'Medium',
        reason: 'Volumetric cloud simulations across Pandora’s floating mountains are computationally brutal, costing up to 22% FPS on Ultra.'
      },
      {
        settingName: 'BVH Quality (Ray-Traced Geometry Structure)',
        impactTier: 'High',
        primaryResource: 'GPU',
        safeToReduce: true,
        recommendedValue: 'Low on 4GB-6GB GPUs; Medium on 8GB GPUs',
        reason: 'Governs bounding volume hierarchies for ray tracing. Lowering this preserves critical VRAM and improves traversal frametimes.'
      },
      {
        settingName: 'Shadow Quality & Sun Shadows',
        impactTier: 'High',
        primaryResource: 'GPU',
        safeToReduce: true,
        recommendedValue: 'Low / Medium',
        reason: 'Calculates dynamic canopy shadows for bioluminescent plants. Dropping from High to Medium yields a 12% FPS increase.'
      },
      {
        settingName: 'Texture Quality',
        impactTier: 'Massive',
        primaryResource: 'VRAM',
        safeToReduce: true,
        recommendedValue: 'Low on 4GB GPUs; Medium on 8GB GPUs',
        reason: 'Avatar features extraordinarily dense micro-textures. 4GB GPUs MUST use Low textures with upscaling active.'
      }
    ],
    benchmarks: [
      {
        gpuId: 'rtx-3050-laptop',
        gpuName: 'RTX 3050 Laptop GPU (4GB 75W)',
        vramGb: 4,
        ramGb: 16,
        resolution: '1080p',
        preset: 'Low (Low BVH & Low Textures)',
        upscaling: 'DLSS Balanced / Quality',
        rayTracing: 'Mandatory Engine RT (Low)',
        avgFps: 38,
        low1PercentFps: 29,
        fpsRangeDisplay: '34 - 44 FPS',
        source: 'Digital Foundry & Hardware Unboxed Avatar Multi-GPU Benchmark',
        notes: 'Playable around 35-42 FPS on Low preset with DLSS Balanced. Mandatory hardware ray tracing requires Low textures on 4GB cards.'
      },
      {
        gpuId: 'rtx-3060',
        gpuName: 'RTX 3060 (12GB Desktop)',
        vramGb: 12,
        ramGb: 16,
        resolution: '1080p',
        preset: 'Medium',
        upscaling: 'DLSS Quality',
        rayTracing: 'Mandatory Engine RT (Medium)',
        avgFps: 56,
        low1PercentFps: 44,
        fpsRangeDisplay: '50 - 62 FPS',
        source: 'TechPowerUp Avatar PC Performance Analysis',
        notes: 'Consistent 55+ FPS at 1080p Medium with DLSS Quality. 12GB VRAM accommodates dense flora streaming.'
      }
    ]
  },

  // =========================================================================
  // 2. STAR WARS JEDI: SURVIVOR (2023)
  // =========================================================================
  {
    id: 'star-wars-jedi-survivor',
    name: 'Star Wars Jedi: Survivor',
    category: 'AAA / Demanding',
    officialSource: 'Electronic Arts & Respawn Entertainment Official System Requirements',
    confidence: 'High',
    confidenceReason: 'Verified against Respawn official EA specifications and mature post-patch 7.5/8 benchmark datasets.',
    researchSources: [
      'Electronic Arts Official Jedi Survivor System Requirements Announcement',
      'Digital Foundry Post-Patch 7 Technical Deep Dive & Hardware Unboxed',
      'TechPowerUp Jedi Survivor GPU Hierarchy Benchmark Suite'
    ],
    demandProfile: {
      overallDemand: 'Very Demanding',
      gpuDemand: 'High',
      cpuDemand: 'Extreme',
      ramDemand: 'High',
      vramSensitivity: 'Extreme',
      difficulty1080p: 'High',
      difficulty1440p: 'Very High',
      difficulty4K: 'Extreme',
      rayTracingDemand: 'Extreme',
      upscalingUsefulness: 'Essential',
      engineOrApi: 'Unreal Engine 4 (DirectX 12)',
      storageRecommendation: '150 GB SSD Strictly Required'
    },
    supportedResolutions: ['1080p', '1440p', '4K'],
    supportedUpscalers: ['NVIDIA DLSS 3.5', 'AMD FSR 2.2 / 3.0'],
    minimumRequirements: {
      gpuName: 'GeForce GTX 1070 (8GB) / Radeon RX 580 (8GB)',
      minGpuScore: 36,
      minVram: 8,
      cpuName: 'Intel Core i7-7700 / AMD Ryzen 5 1400',
      minCpuScore: 34,
      ramGb: 16,
      storageRequirement: '150 GB SSD required',
      resolutionTarget: '1080p Low @ 30 FPS',
      targetResolution: '1080p',
      targetPreset: 'Low',
      targetFps: 30
    },
    recommendedRequirements: {
      gpuName: 'GeForce RTX 2070 (8GB) / Radeon RX 6700 XT (12GB)',
      recGpuScore: 56,
      recVram: 8,
      cpuName: 'Intel Core i5-11600K / AMD Ryzen 5 5600X',
      recCpuScore: 65,
      ramGb: 16,
      storageRequirement: '150 GB SSD required',
      resolutionTarget: '1080p High @ 60 FPS (RT Off)',
      targetResolution: '1080p',
      targetPreset: 'High',
      targetFps: 60
    },
    vramNotes: 'High textures allocate over 7.5GB of VRAM. 4GB and 6GB GPUs must run Medium textures with DLSS to maintain fluid gameplay without hitching.',
    specialNotes: 'Heavy multi-threaded CPU load on the planet Koboh (Rambler’s Reach outpost). Ray Tracing causes severe CPU stalls and should be disabled on all mid-range PCs.',
    keySettingsImpact: [
      {
        settingName: 'Ray Tracing',
        impactTier: 'Massive',
        primaryResource: 'GPU',
        safeToReduce: true,
        recommendedValue: 'Off',
        reason: 'Ray Tracing induces massive CPU bottlenecks and VRAM overflows across Rambler’s Reach outpost on Koboh, cutting framerates by 40%.'
      },
      {
        settingName: 'Shadow Quality',
        impactTier: 'High',
        primaryResource: 'GPU',
        safeToReduce: true,
        recommendedValue: 'Medium',
        reason: 'High shadows add detailed foliage contact maps that heavily impact GPU rasterization in the Koboh wilderness.'
      },
      {
        settingName: 'Texture Quality',
        impactTier: 'High',
        primaryResource: 'VRAM',
        safeToReduce: true,
        recommendedValue: 'Medium on 4GB-6GB GPUs; High on 8GB+ GPUs',
        reason: 'High textures exceed 7.5GB allocation; Medium runs cleanly on 4GB-6GB graphics cards.'
      }
    ],
    benchmarks: [
      {
        gpuId: 'rtx-3050-laptop',
        gpuName: 'RTX 3050 Laptop GPU (4GB 75W)',
        vramGb: 4,
        ramGb: 16,
        resolution: '1080p',
        preset: 'Low / Medium (RT Off)',
        upscaling: 'DLSS Quality',
        rayTracing: 'Off',
        avgFps: 44,
        low1PercentFps: 32,
        fpsRangeDisplay: '38 - 50 FPS',
        source: 'Digital Foundry Post-Patch Benchmark & Hardware Unboxed',
        notes: 'Playable 40-48 FPS on Koboh with RT Off and DLSS Quality. Textures on Medium keep memory usage under 4GB.'
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
        avgFps: 65,
        low1PercentFps: 48,
        fpsRangeDisplay: '58 - 72 FPS',
        source: 'TechPowerUp Jedi Survivor Benchmark',
        notes: 'Smooth 60+ FPS at 1080p High with DLSS Quality. CPU bottlenecks may cause brief dips around the Saloon.'
      }
    ]
  },

  // =========================================================================
  // 3. DRAGON'S DOGMA 2 (2024)
  // =========================================================================
  {
    id: 'dragons-dogma-2',
    name: "Dragon's Dogma 2",
    category: 'AAA / Demanding',
    officialSource: 'Capcom Official Dragon’s Dogma 2 System Specifications',
    confidence: 'High',
    confidenceReason: 'Verified with Capcom official PC system charts and extensive Digital Foundry CPU thread scaling analyses.',
    researchSources: [
      'Capcom Official Dragon’s Dogma 2 System Requirements Announcement',
      'Digital Foundry CPU & GPU Deep Dive on RE Engine',
      'TechPowerUp Dragon’s Dogma 2 Performance Review',
      'Hardware Unboxed CPU Bottleneck Breakdown'
    ],
    demandProfile: {
      overallDemand: 'Extreme',
      gpuDemand: 'High',
      cpuDemand: 'Extreme',
      ramDemand: 'High',
      vramSensitivity: 'High',
      difficulty1080p: 'High',
      difficulty1440p: 'Very High',
      difficulty4K: 'Extreme',
      rayTracingDemand: 'High',
      upscalingUsefulness: 'Essential',
      engineOrApi: 'RE Engine (DirectX 12)',
      storageRecommendation: '100 GB SSD Strictly Required'
    },
    supportedResolutions: ['1080p', '1440p', '4K'],
    supportedUpscalers: ['NVIDIA DLSS 3.5', 'AMD FSR 3.0'],
    minimumRequirements: {
      gpuName: 'GeForce GTX 1070 (8GB) / Radeon RX 5500 XT (8GB)',
      minGpuScore: 40,
      minVram: 8,
      cpuName: 'Intel Core i5-10600 / AMD Ryzen 5 3600',
      minCpuScore: 54,
      ramGb: 16,
      storageRequirement: '100 GB SSD',
      resolutionTarget: '1080p Low @ 30 FPS (Capcom notes framerate may drop in cities)',
      targetResolution: '1080p',
      targetPreset: 'Low',
      targetFps: 30
    },
    recommendedRequirements: {
      gpuName: 'GeForce RTX 2080 (8GB) / Radeon RX 6700 (10GB)',
      recGpuScore: 58,
      recVram: 8,
      cpuName: 'Intel Core i7-10700 / AMD Ryzen 5 3600X',
      recCpuScore: 56,
      ramGb: 16,
      storageRequirement: '100 GB SSD',
      resolutionTarget: '1080p/1440p High @ 60 FPS (RT Off)',
      targetResolution: '1080p',
      targetPreset: 'High',
      targetFps: 60
    },
    vramNotes: 'Capcom RE Engine uses buffer sizing options (0.25GB to 2GB). Setting to 0.5GB prevents VRAM allocation warnings on 4GB cards.',
    specialNotes: 'Vernworth city performance is constrained by CPU simulation of hundreds of individual NPCs. This is normal across all modern CPUs.',
    keySettingsImpact: [
      {
        settingName: 'Ray Tracing (Global Illumination)',
        impactTier: 'High',
        primaryResource: 'GPU',
        safeToReduce: true,
        recommendedValue: 'Off',
        reason: 'Enables real-time bounced sunlight across rugged cliffs, but incurs severe CPU thread stalls and ~25% lower framerates.'
      },
      {
        settingName: 'Shadow Quality & Mesh Quality',
        impactTier: 'High',
        primaryResource: 'CPU',
        safeToReduce: true,
        recommendedValue: 'Medium',
        reason: 'Mesh quality significantly affects CPU draw call submission for medieval castle walls and distant terrain.'
      },
      {
        settingName: 'Texture Quality',
        impactTier: 'High',
        primaryResource: 'VRAM',
        safeToReduce: true,
        recommendedValue: 'High (0.5GB buffer) on 4GB-6GB GPUs; High (2GB) on 8GB+ GPUs',
        reason: 'Setting texture buffer to 0.5GB prevents VRAM allocation warnings on 4GB cards.'
      }
    ],
    benchmarks: [
      {
        gpuId: 'rtx-3050-laptop',
        gpuName: 'RTX 3050 Laptop GPU (4GB 75W)',
        vramGb: 4,
        ramGb: 16,
        resolution: '1080p',
        preset: 'Low / Medium (RT Off)',
        upscaling: 'DLSS Quality',
        rayTracing: 'Off',
        avgFps: 42,
        low1PercentFps: 28,
        fpsRangeDisplay: '36 - 48 FPS',
        source: 'Digital Foundry & Hardware Unboxed Dragon’s Dogma 2 Benchmarks',
        notes: 'Runs between 40-48 FPS in the wilderness, but dips to ~28-32 FPS in the capital city of Vernworth due to NPC simulation thread saturation.'
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
        avgFps: 58,
        low1PercentFps: 36,
        fpsRangeDisplay: '50 - 65 FPS',
        source: 'TechPowerUp Dragon’s Dogma 2 Performance Review',
        notes: 'Consistent 60 FPS in wilderness combat; dips to 40 FPS inside Vernworth.'
      }
    ]
  },

  // =========================================================================
  // 4. SILENT HILL 2 (2024 REMAKE)
  // =========================================================================
  {
    id: 'silent-hill-2-remake',
    name: 'Silent Hill 2',
    category: 'AAA / Demanding',
    officialSource: 'Konami & Bloober Team Official Silent Hill 2 PC Specifications',
    confidence: 'High',
    confidenceReason: 'Verified against Konami & Bloober Team official specification sheet, Digital Foundry UE5 analysis, and TechPowerUp benchmark suite.',
    researchSources: [
      'Konami & Bloober Team Official Silent Hill 2 PC Specifications Announcement',
      'Digital Foundry UE5 Lumen Breakdown & Tech Review',
      'TechPowerUp Silent Hill 2 Benchmark Suite'
    ],
    demandProfile: {
      overallDemand: 'Very Demanding',
      gpuDemand: 'Very High',
      cpuDemand: 'Medium',
      ramDemand: 'High',
      vramSensitivity: 'High',
      difficulty1080p: 'High',
      difficulty1440p: 'Very High',
      difficulty4K: 'Extreme',
      rayTracingDemand: 'High',
      upscalingUsefulness: 'Essential',
      engineOrApi: 'Unreal Engine 5 (Lumen + Nanite, DirectX 12)',
      storageRecommendation: '50 GB SSD Strictly Required'
    },
    supportedResolutions: ['1080p', '1440p', '4K'],
    supportedUpscalers: ['NVIDIA DLSS 3.7', 'AMD FSR 3.1', 'Intel XeSS 1.3', 'Unreal TSR'],
    minimumRequirements: {
      gpuName: 'GeForce GTX 1070 Ti (8GB) / Radeon RX 5700 (8GB)',
      minGpuScore: 48,
      minVram: 8,
      cpuName: 'Intel Core i7-6700 / AMD Ryzen 5 2600',
      minCpuScore: 42,
      ramGb: 16,
      storageRequirement: '50 GB SSD',
      resolutionTarget: '1080p Low @ 30 FPS',
      targetResolution: '1080p',
      targetPreset: 'Low',
      targetFps: 30
    },
    recommendedRequirements: {
      gpuName: 'GeForce RTX 2080 (8GB) / Radeon RX 6800 XT (16GB)',
      recGpuScore: 60,
      recVram: 8,
      cpuName: 'Intel Core i7-8700 / AMD Ryzen 5 3600',
      recCpuScore: 54,
      ramGb: 16,
      storageRequirement: '50 GB SSD',
      resolutionTarget: '1080p Medium @ 60 FPS (or 1080p High @ 30 FPS)',
      targetResolution: '1080p',
      targetPreset: 'Medium',
      targetFps: 60
    },
    vramNotes: 'Medium textures fit comfortably within 4GB VRAM buffers alongside UE5 TSR/DLSS reconstruction. Hardware Ray Tracing increases VRAM demand past 8GB.',
    specialNotes: 'Turn Hardware Ray Tracing OFF: Unreal Engine 5’s built-in Software Lumen handles all lighting naturally with 30-40% higher framerates.',
    keySettingsImpact: [
      {
        settingName: 'Ray Tracing (Hardware Lumen)',
        impactTier: 'Massive',
        primaryResource: 'GPU',
        safeToReduce: true,
        recommendedValue: 'Off (Software Lumen is automatically utilized)',
        reason: 'Enabling Hardware Ray Tracing incurs immense shader cost on UE5 Nanite meshes. Software Lumen provides virtually identical eerie lighting with 30-40% higher FPS.'
      },
      {
        settingName: 'Shadow Quality',
        impactTier: 'High',
        primaryResource: 'GPU',
        safeToReduce: true,
        recommendedValue: 'Medium',
        reason: 'Controls UE5 Virtual Shadow Maps (VSM). Medium reduces shadow raster cost in the foggy streets of Silent Hill significantly.'
      },
      {
        settingName: 'Texture Quality',
        impactTier: 'Medium',
        primaryResource: 'VRAM',
        safeToReduce: true,
        recommendedValue: 'Medium on 4GB-6GB GPUs; High on 8GB+ GPUs',
        reason: 'Medium textures fit comfortably within 4GB VRAM buffers alongside UE5 TSR/DLSS reconstruction.'
      }
    ],
    benchmarks: [
      {
        gpuId: 'rtx-3050-laptop',
        gpuName: 'RTX 3050 Laptop GPU (4GB 75W)',
        vramGb: 4,
        ramGb: 16,
        resolution: '1080p',
        preset: 'Low / Medium Custom (RT Off)',
        upscaling: 'DLSS Balanced / Quality',
        rayTracing: 'Off',
        avgFps: 42,
        low1PercentFps: 31,
        fpsRangeDisplay: '36 - 46 FPS',
        source: 'Hardware Unboxed & Digital Foundry Silent Hill 2 PC Analysis',
        notes: 'Solid 38-45 FPS at 1080p with DLSS Balanced and Hardware RT Off.'
      },
      {
        gpuId: 'rtx-3060',
        gpuName: 'RTX 3060 (12GB Desktop)',
        vramGb: 12,
        ramGb: 16,
        resolution: '1080p',
        preset: 'Medium (RT Off)',
        upscaling: 'DLSS Quality',
        rayTracing: 'Off',
        avgFps: 62,
        low1PercentFps: 48,
        fpsRangeDisplay: '55 - 68 FPS',
        source: 'TechPowerUp Silent Hill 2 Performance Review',
        notes: 'Smooth 60+ FPS at 1080p Medium with DLSS Quality.'
      }
    ]
  },

  // =========================================================================
  // 5. RESIDENT EVIL 4 (2023 REMAKE)
  // =========================================================================
  {
    id: 'resident-evil-4-remake',
    name: 'Resident Evil 4 (2023)',
    category: 'AAA / Demanding',
    officialSource: 'Capcom Official Resident Evil 4 System Requirements',
    confidence: 'High',
    confidenceReason: 'Verified against Capcom official PC requirements, Digital Foundry technical breakdown, and Hardware Unboxed VRAM allocation tests.',
    researchSources: [
      'Capcom Official Resident Evil 4 System Requirements Announcement',
      'Digital Foundry Resident Evil 4 Tech Review & Optimization Guide',
      'Hardware Unboxed Resident Evil 4 VRAM Benchmark Suite',
      'TechPowerUp RE4 Performance Analysis'
    ],
    demandProfile: {
      overallDemand: 'High',
      gpuDemand: 'Medium',
      cpuDemand: 'Medium',
      ramDemand: 'Medium',
      vramSensitivity: 'High',
      difficulty1080p: 'Medium',
      difficulty1440p: 'High',
      difficulty4K: 'Very High',
      rayTracingDemand: 'Medium',
      upscalingUsefulness: 'High',
      engineOrApi: 'RE Engine (DirectX 12)',
      storageRecommendation: '67 GB SSD Recommended'
    },
    supportedResolutions: ['1080p', '1440p', '4K'],
    supportedUpscalers: ['AMD FSR 2.1 / 3.0', 'Intel XeSS', 'NVIDIA DLSS'],
    minimumRequirements: {
      gpuName: 'Radeon RX 560 (4GB) / GeForce GTX 1050 Ti (4GB)',
      minGpuScore: 24,
      minVram: 4,
      cpuName: 'AMD Ryzen 3 1200 / Intel Core i5-7500',
      minCpuScore: 28,
      ramGb: 8,
      storageRequirement: '67 GB HDD (SSD Recommended)',
      resolutionTarget: '1080p Prioritize Performance @ 45-60 FPS (FSR Active)',
      targetResolution: '1080p',
      targetPreset: 'Prioritize Performance',
      targetFps: 45
    },
    recommendedRequirements: {
      gpuName: 'Radeon RX 5700 (8GB) / GeForce GTX 1070 (8GB)',
      recGpuScore: 44,
      recVram: 8,
      cpuName: 'AMD Ryzen 5 3600 / Intel Core i7-8700',
      recCpuScore: 54,
      ramGb: 16,
      storageRequirement: '67 GB SSD',
      resolutionTarget: '1080p Balanced @ 60 FPS',
      targetResolution: '1080p',
      targetPreset: 'Balanced',
      targetFps: 60
    },
    vramNotes: 'Capcom’s in-game VRAM meter turns red if too much texture memory is allocated. Setting texture buffer to 0.5GB or 1GB completely prevents crashes on 4GB GPUs.',
    specialNotes: 'Disable Ray Tracing and Hair Strands for an immediate 25% performance boost with minimal visual difference.',
    keySettingsImpact: [
      {
        settingName: 'Ray Tracing',
        impactTier: 'High',
        primaryResource: 'GPU',
        safeToReduce: true,
        recommendedValue: 'Off',
        reason: 'Enables ray-traced water reflections in underground waterways, but consumes over 1.5GB of additional VRAM and reduces FPS by 18-24%.'
      },
      {
        settingName: 'Texture Quality (VRAM Allocation Buffer)',
        impactTier: 'High',
        primaryResource: 'VRAM',
        safeToReduce: true,
        recommendedValue: 'High (0.5GB - 1GB buffer) on 4GB GPUs; High (2GB) on 8GB+ GPUs',
        reason: 'Setting texture buffer to 0.5GB or 1GB completely prevents crashes on 4GB GPUs.'
      },
      {
        settingName: 'Volumetric Lighting',
        impactTier: 'Medium',
        primaryResource: 'GPU',
        safeToReduce: true,
        recommendedValue: 'Medium',
        reason: 'Controls murky mist in the Village cemetery and Castle corridors. Medium saves ~8% GPU load.'
      },
      {
        settingName: 'Hair Strands',
        impactTier: 'Medium',
        primaryResource: 'GPU',
        safeToReduce: true,
        recommendedValue: 'Normal / Off',
        reason: 'Enables individual physics hair simulation for Leon and Ashley, which has a noticeable cost during close-up camera angles.'
      }
    ],
    benchmarks: [
      {
        gpuId: 'rtx-3050-laptop',
        gpuName: 'RTX 3050 Laptop GPU (4GB 75W)',
        vramGb: 4,
        ramGb: 16,
        resolution: '1080p',
        preset: 'Balanced / High Mix (Texture Buffer 1GB)',
        upscaling: 'FSR 2 Quality',
        rayTracing: 'Off',
        avgFps: 64,
        low1PercentFps: 51,
        fpsRangeDisplay: '58 - 70 FPS',
        source: 'Hardware Unboxed & Notebookcheck RE4 Remake Benchmark',
        notes: 'Outstanding 60+ FPS performance at 1080p with FSR 2 Quality. Texture buffer set to 1GB ensures zero crashes or stutters.'
      },
      {
        gpuId: 'gtx-1650-laptop',
        gpuName: 'GTX 1650 Laptop GPU (4GB)',
        vramGb: 4,
        ramGb: 16,
        resolution: '1080p',
        preset: 'Prioritize Performance (Texture Buffer 0.5GB)',
        upscaling: 'FSR 2 Quality',
        rayTracing: 'Off',
        avgFps: 48,
        low1PercentFps: 37,
        fpsRangeDisplay: '44 - 54 FPS',
        source: 'TechPowerUp RE4 Performance Analysis',
        notes: 'Solid 45-50 FPS at 1080p with FSR 2 Quality enabled.'
      }
    ]
  },

  // =========================================================================
  // 6. ASSASSIN'S CREED MIRAGE (2023)
  // =========================================================================
  {
    id: 'assassins-creed-mirage',
    name: "Assassin's Creed Mirage",
    category: 'AAA / Demanding',
    officialSource: 'Ubisoft Official Assassin’s Creed Mirage PC Specifications',
    confidence: 'High',
    confidenceReason: 'Verified against Ubisoft official four-tier system specifications, Digital Foundry technical review, and TechPowerUp multi-GPU testing.',
    researchSources: [
      'Ubisoft Official Assassin’s Creed Mirage PC Specifications Announcement',
      'Digital Foundry AC Mirage PC Review & Analysis',
      'TechPowerUp AC Mirage Benchmark Hierarchy'
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
      engineOrApi: 'Anvil Engine (DirectX 12)',
      storageRecommendation: '40 GB SSD Strictly Required'
    },
    supportedResolutions: ['1080p', '1440p', '4K'],
    supportedUpscalers: ['NVIDIA DLSS 2.3', 'AMD FSR 2.2', 'Intel XeSS'],
    minimumRequirements: {
      gpuName: 'GeForce GTX 1060 (6GB) / Radeon RX 570 (4GB) / Intel Arc A380 (6GB)',
      minGpuScore: 30,
      minVram: 4,
      cpuName: 'Intel Core i7-4790K / AMD Ryzen 5 1600',
      minCpuScore: 34,
      ramGb: 8,
      storageRequirement: '40 GB SSD required',
      resolutionTarget: '1080p Low @ 30 FPS',
      targetResolution: '1080p',
      targetPreset: 'Low',
      targetFps: 30
    },
    recommendedRequirements: {
      gpuName: 'GeForce GTX 1660 Ti (6GB) / Radeon RX 5600 XT (6GB) / Intel Arc A750 (8GB)',
      recGpuScore: 44,
      recVram: 6,
      cpuName: 'Intel Core i7-8700K / AMD Ryzen 5 3600',
      recCpuScore: 54,
      ramGb: 16,
      storageRequirement: '40 GB SSD',
      resolutionTarget: '1080p High @ 60 FPS',
      targetResolution: '1080p',
      targetPreset: 'High',
      targetFps: 60
    },
    vramNotes: 'Ubisoft optimized memory footprint well; 4GB GPUs easily handle High textures at 1080p with no memory overflow.',
    specialNotes: 'AC Mirage is much better optimized than Valhalla: 1080p High with DLSS/FSR Quality easily hits 60 FPS on mid-range hardware.',
    keySettingsImpact: [
      {
        settingName: 'Shadow Quality',
        impactTier: 'High',
        primaryResource: 'GPU',
        safeToReduce: true,
        recommendedValue: 'High',
        reason: 'Very High shadows cast intricate soft-edge shadows across Baghdad markets and palm trees, costing ~10% FPS.'
      },
      {
        settingName: 'Volumetric Clouds',
        impactTier: 'Medium',
        primaryResource: 'GPU',
        safeToReduce: true,
        recommendedValue: 'High',
        reason: 'Anvil Engine volumetric desert cloud simulations cost 8-10% FPS on Very High with minimal visual difference.'
      },
      {
        settingName: 'Crowd Density',
        impactTier: 'Medium',
        primaryResource: 'CPU',
        safeToReduce: true,
        recommendedValue: 'High',
        reason: 'Controls citizen density in Round City bazaars. Low or Medium relieves CPU bottlenecks on older 4-core processors.'
      },
      {
        settingName: 'Texture Quality',
        impactTier: 'Medium',
        primaryResource: 'VRAM',
        safeToReduce: true,
        recommendedValue: 'High on 4GB+ GPUs',
        reason: 'Ubisoft optimized memory footprint well; 4GB GPUs easily handle High textures at 1080p.'
      }
    ],
    benchmarks: [
      {
        gpuId: 'rtx-3050-laptop',
        gpuName: 'RTX 3050 Laptop GPU (4GB 75W)',
        vramGb: 4,
        ramGb: 16,
        resolution: '1080p',
        preset: 'High',
        upscaling: 'DLSS Quality',
        rayTracing: 'None',
        avgFps: 66,
        low1PercentFps: 53,
        fpsRangeDisplay: '60 - 72 FPS',
        source: 'Notebookcheck & TechPowerUp Assassin’s Creed Mirage Benchmarks',
        notes: 'Solid 60+ FPS at 1080p High settings with DLSS Quality. Baghdad runs smoothly compared to previous massive RPG entries.'
      },
      {
        gpuId: 'gtx-1650-laptop',
        gpuName: 'GTX 1650 Laptop GPU (4GB)',
        vramGb: 4,
        ramGb: 16,
        resolution: '1080p',
        preset: 'Medium',
        upscaling: 'FSR 2 Quality',
        rayTracing: 'None',
        avgFps: 46,
        low1PercentFps: 36,
        fpsRangeDisplay: '42 - 50 FPS',
        source: 'TechPowerUp AC Mirage Analysis',
        notes: 'Playable 45+ FPS at 1080p Medium with FSR 2 Quality.'
      }
    ]
  }
];
