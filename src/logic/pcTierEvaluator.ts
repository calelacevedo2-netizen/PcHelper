import {
  GPU,
  CPU as CPUType,
  RamOption,
  DeviceType,
  MainTier,
  SubTier,
  TierLimitation,
  PcTierResult,
  ComponentTierBreakdown,
  DeviceModel,
  MemoryChannel,
  ConfidenceLevel
} from '../types';
import { evaluateRamUpgrade, getDeviceRamSpecs } from '../data/ramCompatibility';

/**
 * Maps an internal performance score into one of the 3 standardized subtiers
 * (Low, Average, Good) for GPU.
 */
export function getGpuSubTier(score: number, isLaptop: boolean): SubTier {
  if (score <= 15) {
    return isLaptop ? 'Potato Laptop' : 'Potato Desktop';
  }
  // Entry-Level (16 - 44)
  if (score <= 44) {
    if (score <= 26) return 'Low Entry-Level';
    if (score <= 35) return 'Average Entry-Level';
    return 'Good Entry-Level';
  }
  // Mid-Range (45 - 71)
  if (score <= 71) {
    if (score <= 53) return 'Low Mid-Range';
    if (score <= 62) return 'Average Mid-Range';
    return 'Good Mid-Range';
  }
  // High-End (72 - 92)
  if (score <= 92) {
    if (score <= 76) return 'Low High-End';
    if (score <= 84) return 'Average High-End';
    return 'Good High-End';
  }
  // Top-Tier (93 - 100)
  if (score <= 94) return 'Low Top-Tier';
  if (score <= 97) return 'Average Top-Tier';
  return 'Good Top-Tier';
}

/**
 * Maps an internal performance score into one of the 3 standardized subtiers
 * (Low, Average, Good) for CPU.
 */
export function getCpuSubTier(score: number, isLaptop: boolean): SubTier {
  if (score <= 18) {
    return isLaptop ? 'Potato Laptop' : 'Potato Desktop';
  }
  // Entry-Level (19 - 44)
  if (score <= 44) {
    if (score <= 28) return 'Low Entry-Level';
    if (score <= 35) return 'Average Entry-Level';
    return 'Good Entry-Level';
  }
  // Mid-Range (45 - 71)
  if (score <= 71) {
    if (score <= 54) return 'Low Mid-Range';
    if (score <= 62) return 'Average Mid-Range';
    return 'Good Mid-Range';
  }
  // High-End (72 - 89)
  if (score <= 89) {
    if (score <= 76) return 'Low High-End';
    if (score <= 83) return 'Average High-End';
    return 'Good High-End';
  }
  // Top-Tier (90 - 100)
  if (score <= 94) return 'Low Top-Tier';
  if (score <= 97) return 'Average Top-Tier';
  return 'Good Top-Tier';
}

/**
 * Extracts the Main Tier from any SubTier
 */
export function getMainTierFromSubTier(subTier: SubTier): MainTier {
  if (subTier.includes('Potato')) return 'Potato';
  if (subTier.includes('Entry-Level')) return 'Entry-Level';
  if (subTier.includes('Mid-Range')) return 'Mid-Range';
  if (subTier.includes('High-End')) return 'High-End';
  return 'Top-Tier';
}

/**
 * Standard tier descriptions required by specification
 */
export const MAIN_TIER_DESCRIPTIONS: Record<MainTier, string> = {
  'Potato':
    'Extremely outdated hardware that is far below the requirements of modern games and generally unsuitable for contemporary gaming.',
  'Entry-Level':
    'Designed mainly for lighter games and 1080p gaming with lower-to-medium settings depending on the hardware.',
  'Mid-Range':
    'Generally suitable for 1080p gaming with medium-to-high settings and can handle many demanding games with appropriate settings.',
  'High-End':
    'Strong gaming hardware capable of high settings at 1080p and often higher resolutions depending on the game.',
  'Top-Tier':
    'Very powerful hardware designed for demanding games, high refresh rates, and higher resolutions.'
};

/**
 * Computes RAM tier (Low, Average, Good) and evaluation
 */
export function evaluateRam(ramGb: number): ComponentTierBreakdown {
  if (ramGb <= 4) {
    return {
      tier: 'Low',
      score: 18,
      explanation: '4 GB is significantly below the modern standard and will struggle with newer operating systems and games.',
      limitationWarning: 'Significant bottleneck: 4 GB will cause game crashes or severe stuttering in modern titles.'
    };
  }
  if (ramGb <= 8) {
    return {
      tier: 'Low',
      score: 50,
      explanation: '8 GB is workable for lighter games and esports, but newer open-world titles will experience memory pressure.',
      limitationWarning: '8 GB may restrict performance and cause stuttering in newer memory-heavy games.'
    };
  }
  if (ramGb <= 16) {
    return {
      tier: 'Average',
      score: 80,
      explanation: '16 GB is the recommended modern gaming standard, providing stable multitasking and texture streaming.'
    };
  }
  if (ramGb <= 32) {
    return {
      tier: 'Good',
      score: 95,
      explanation: '32 GB provides exceptional headroom for heavy simulation games, extensive modding, and background multitasking.'
    };
  }
  return {
    tier: 'Good',
    score: 100,
    explanation: '64 GB offers maximum memory capacity with zero risk of RAM bottlenecks in any gaming or productivity scenario.'
  };
}

/**
 * Computes VRAM tier (Low, Average, Good) and evaluation
 */
export function evaluateVram(vramGb: number): ComponentTierBreakdown {
  if (vramGb <= 2) {
    return {
      tier: 'Low',
      score: 15,
      explanation: '2 GB of VRAM severely limits graphical fidelity, restricting games to low resolution or lowest texture settings.',
      limitationWarning: '2 GB will fail to load textures properly in most games released after 2018.'
    };
  }
  if (vramGb <= 4) {
    return {
      tier: 'Low',
      score: 35,
      explanation: '4 GB of VRAM is workable for 1080p esports, but demanding modern games will require lowering texture quality.',
      limitationWarning: '4 GB of VRAM may limit some demanding games and higher texture settings.'
    };
  }
  if (vramGb <= 6) {
    return {
      tier: 'Average',
      score: 55,
      explanation: '6 GB of VRAM handles medium to high textures well at 1080p, with occasional limitations on ultra textures.',
      limitationWarning: '6 GB can encounter texture budget limits in newer 1440p and ray-traced games.'
    };
  }
  if (vramGb <= 8) {
    return {
      tier: 'Average',
      score: 70,
      explanation: '8 GB of VRAM provides the standard baseline buffer for 1080p and 1440p gaming across modern titles.'
    };
  }
  if (vramGb <= 12) {
    return {
      tier: 'Good',
      score: 85,
      explanation: '12 GB of VRAM delivers great headroom for 1440p ultra settings, high-res texture packs, and modern ray tracing.'
    };
  }
  return {
    tier: 'Good',
    score: 98,
    explanation: '16+ GB of VRAM provides expansive capacity for 4K gaming, ultra-high-resolution textures, and intensive rendering.'
  };
}

/**
 * Evaluates the full PC hardware to produce an accurate, researched tier and sub-tier.
 * 
 * CORE RULES & PRINCIPLES:
 * 1. Potato Tier:
 *    - Very rare, applies only to genuinely outdated hardware far below modern gaming capability
 *      (e.g., ancient integrated graphics, pre-DX12 low-end cards, old dual-cores).
 *    - Modern budget hardware (GTX 1650, RTX 2050, RTX 3050 Laptop, Radeon 680M) is NOT Potato.
 * 
 * 2. Boundary Rule & Uncommon Low Tiers:
 *    - When hardware is near the boundary between two main tiers:
 *      Prefer the "Good" label of the lower tier unless the evidence clearly shows that the hardware
 *      genuinely belongs in the next category.
 *    - Example: RTX 3050 Laptop (4GB) + Ryzen 7 170 -> Stronger than average Entry-Level, but not true
 *      Mid-Range due to 4GB VRAM and entry GPU throughput -> "Good Entry-Level" (NOT "Low Mid-Range").
 *    - Low still exists for hardware that is clearly toward the lower end of its category.
 * 
 * 3. 3-Subtier Structure:
 *    - Only "Low", "Average", and "Good" for each main tier.
 * 
 * 4. Component Breakdown:
 *    - CPU and GPU show their researched tier (e.g. "Good Entry-Level").
 *    - VRAM and RAM show "Low", "Average", or "Good".
 */
export function evaluatePcTier(
  gpu: GPU,
  cpu: CPUType,
  ramGb: RamOption,
  selectedVram: number | null,
  deviceType: DeviceType,
  selectedDevice?: DeviceModel | null,
  hardwareMismatch?: boolean,
  memoryChannel: MemoryChannel = 'Single-Channel'
): PcTierResult {
  const actualVram = selectedVram ?? gpu.vram;
  const isLaptop = deviceType === 'laptop' || gpu.type === 'laptop' || cpu.type === 'laptop';

  // 1. Researched Component Scores (1 - 100)
  let gpuScore = Math.max(1, Math.min(100, gpu.performanceScore));
  let cpuScore = Math.max(1, Math.min(100, cpu.performanceScore));

  // If an exact device model is selected without hardware mismatch, apply researched TGP calibration
  if (selectedDevice && !hardwareMismatch) {
    if (selectedDevice.tgpScoreOverride !== undefined) {
      gpuScore = selectedDevice.tgpScoreOverride;
    } else if (selectedDevice.tgpFactor !== undefined) {
      gpuScore = Math.max(1, Math.min(100, Math.round(gpuScore * selectedDevice.tgpFactor)));
    }
  }

  // Researched RAM Upgrade & Channel Evaluation
  const isDiscreteGpu = gpu.performanceTier > 2;
  const ramUpgradeDetails = evaluateRamUpgrade(selectedDevice ?? null, ramGb, memoryChannel, isDiscreteGpu);
  const ramSpecs = selectedDevice ? getDeviceRamSpecs(selectedDevice, deviceType) : null;

  const ramEvaluation = evaluateRam(ramGb);
  const vramEvaluation = evaluateVram(actualVram);

  // 2. Component Sub-Tiers
  const gpuSubTier = getGpuSubTier(gpuScore, isLaptop);
  const cpuSubTier = getCpuSubTier(cpuScore, isLaptop);

  // 3. Component Explanations
  let gpuExplanation = '';
  const tgpSuffix = selectedDevice && !hardwareMismatch && selectedDevice.gpuTgpWatts
    ? ` (${selectedDevice.gpuTgpWatts})`
    : (isLaptop && gpu.tdpWatts ? ` (~${gpu.tdpWatts})` : '');

  if (gpuScore <= 15) {
    gpuExplanation = `Your ${gpu.name}${tgpSuffix} is an outdated legacy graphics adapter far below the requirements of contemporary 3D games.`;
  } else if (gpuScore >= 93) {
    gpuExplanation = `Your ${gpu.name}${tgpSuffix} delivers top-tier enthusiast graphical power for high-refresh 1440p and 4K gaming at ultra settings.`;
  } else if (gpuScore >= 72) {
    gpuExplanation = `Your ${gpu.name}${tgpSuffix} provides strong high-end gaming performance capable of high settings at 1080p and fluid 1440p gameplay.`;
  } else if (gpuScore >= 45) {
    gpuExplanation = `Your ${gpu.name}${tgpSuffix} provides dependable mid-range 1080p gaming performance with solid medium-to-high settings in modern releases.`;
  } else {
    gpuExplanation = `Your ${gpu.name}${tgpSuffix} handles entry-level and esports gaming at 1080p, but requires lower settings in demanding modern titles.`;
  }

  let cpuExplanation = '';
  if (cpuScore <= 18) {
    cpuExplanation = `Your ${cpu.name} is an outdated legacy processor that struggles with modern multitasking and contemporary game engines.`;
  } else if (cpuScore >= 90) {
    cpuExplanation = `Your ${cpu.name} is a top-tier processor with immense single-core and multi-core throughput, eliminating CPU-side bottlenecks.`;
  } else if (cpuScore >= 72) {
    cpuExplanation = `Your ${cpu.name} is a high-performance processor capable of sustaining high frame rates and heavy game simulation loads.`;
  } else if (cpuScore >= 45) {
    cpuExplanation = `Your ${cpu.name} is a capable mid-range processor for modern gaming, delivering consistent pacing in most titles.`;
  } else {
    cpuExplanation = `Your ${cpu.name} handles general esports and lighter gaming, but may become a limitation in newer CPU-intensive titles.`;
  }

  // 4. POTATO TIER CHECK (Very rare special tier)
  // Only applies to genuinely outdated computers far below modern gaming capability.
  // Modern budget gaming hardware (e.g. GTX 1650, RTX 2050, RTX 3050 Laptop) is NOT Potato.
  const isPotato = (gpuScore <= 15) || (cpuScore <= 18 && gpuScore <= 20) || ((gpuScore + cpuScore) / 2 < 16);

  if (isPotato) {
    const potatoSubTier: SubTier = isLaptop ? 'Potato Laptop' : 'Potato Desktop';
    const potatoScore = Math.max(1, Math.min(16, Math.round((gpuScore + cpuScore) / 2)));
    const deviceLabel = isLaptop ? 'laptop' : 'desktop PC';
    const overallExplanation = selectedDevice && !hardwareMismatch
      ? `Your ${selectedDevice.name} is classified as ${potatoSubTier} based on its legacy hardware, which is far below contemporary gaming requirements.`
      : `Your ${deviceLabel} is classified as ${potatoSubTier} based on its legacy CPU and GPU, which are unsuitable for modern gaming.`;

    const biggestLimitation: TierLimitation = gpuScore <= cpuScore ? 'GPU' : 'CPU';
    const limitationExplanation = 'The hardware in this system is from an earlier computing era and lacks the graphical or processing architecture required for modern 3D titles.';

    return {
      mainTier: 'Potato',
      subTier: potatoSubTier,
      overallScore: potatoScore,
      overallExplanation,
      mainTierDescription: MAIN_TIER_DESCRIPTIONS['Potato'],
      biggestLimitation,
      limitationExplanation,
      gpu: {
        tier: gpuSubTier,
        score: gpuScore,
        explanation: gpuExplanation,
        name: gpu.name,
        vram: actualVram,
        tgpWatts: selectedDevice && !hardwareMismatch ? selectedDevice.gpuTgpWatts : undefined,
        limitationWarning: 'Outdated graphics processor unsuitable for modern 3D games.'
      },
      cpu: {
        tier: cpuSubTier,
        score: cpuScore,
        explanation: cpuExplanation,
        name: cpu.name,
        limitationWarning: cpuScore <= 18 ? 'Legacy processor with severe single-core throughput constraints.' : undefined
      },
      ram: {
        ...ramEvaluation,
        capacityGb: ramGb,
        channel: memoryChannel,
        moduleSetup: ramUpgradeDetails.moduleConfig,
        upgradeStatus: ramUpgradeDetails.status,
        details: selectedDevice && !hardwareMismatch ? selectedDevice.ramDetails : undefined
      },
      vram: {
        ...vramEvaluation,
        capacityGb: actualVram
      },
      deviceType,
      selectedDevice: selectedDevice ?? undefined,
      hardwareMismatch,
      mismatchNotice: hardwareMismatch && selectedDevice
        ? 'Your custom hardware configuration differs from the selected device model, so the result is based on your manually entered hardware.'
        : undefined,
      deviceTgpNote: selectedDevice && !hardwareMismatch ? selectedDevice.gpuTgpWatts : undefined,
      deviceCoolingNote: selectedDevice ? selectedDevice.coolingNotes : undefined,
      deviceDisplayNote: selectedDevice ? selectedDevice.display : undefined,
      confidence: selectedDevice && !hardwareMismatch ? 'High' : 'Medium',
      confidenceReason: 'Verified legacy hardware architecture data.',
      deviceConfidence: selectedDevice ? selectedDevice.confidence ?? 'High' : undefined,
      deviceBenchmarkNotes: selectedDevice ? selectedDevice.benchmarks : undefined,
      memoryChannel,
      ramUpgradeStatus: ramUpgradeDetails.status,
      ramModuleSetup: ramUpgradeDetails.moduleConfig
    };
  }

  // 5. STANDARD PROGRESSION: ENTRY-LEVEL -> MID-RANGE -> HIGH-END -> TOP-TIER
  // Effective CPU accounting for gaming dynamics and memory channel bandwidth
  let effectiveCpu = cpuScore;
  if (memoryChannel === 'Single-Channel') {
    // Single-channel memory cuts RAM bus width in half, reducing CPU draw-call feed rate
    effectiveCpu = Math.round(effectiveCpu * ramUpgradeDetails.channelPerformanceFactor);
  }

  // Diminishing returns: when CPU is much faster than GPU, games are GPU-bound
  if (effectiveCpu > gpuScore + 10) {
    effectiveCpu = gpuScore + 10 + (effectiveCpu - (gpuScore + 10)) * 0.18;
  }

  // Adequate CPU protection (Requirement 16):
  // A powerful GPU + modern adequate 6-core+ CPU (cpuScore >= 50) at 1440p+ is mostly GPU-bound.
  // CPU should not drag down an otherwise capable machine excessively.
  if (gpuScore > cpuScore && cpuScore >= 50) {
    const adequateFloor = gpuScore * 0.72;
    if (effectiveCpu < adequateFloor) {
      effectiveCpu = effectiveCpu * 0.6 + adequateFloor * 0.4;
    }
  }

  // Primary weighting: GPU carries 72%, CPU carries 28%
  let baseScore = gpuScore * 0.72 + effectiveCpu * 0.28;

  // Secondary modifiers:
  // 1. RAM Capacity (Requirement 17: RAM should be a limitation, not an automatic tier destroyer)
  if (ramGb <= 4) {
    baseScore -= 6.0; // Severe memory pressure and swapping
  } else if (ramGb <= 8) {
    if (gpuScore >= 72) baseScore -= 3.0; // Restricts high-end texture streaming
    else if (gpuScore >= 45) baseScore -= 2.0;
    else baseScore -= 1.0;
  } else if (ramGb >= 32) {
    baseScore += 1.0; // Headroom for heavy sim/mods
  } else if (ramGb >= 64) {
    baseScore += 1.5;
  }

  // 2. VRAM Capacity (Requirement 17: VRAM should be a limitation, not an automatic tier destroyer)
  if (actualVram <= 2) {
    baseScore -= 4.5;
  } else if (actualVram <= 4) {
    if (gpuScore >= 60) baseScore -= 3.0;
    else if (gpuScore >= 40) baseScore -= 1.5;
  } else if (actualVram <= 6) {
    if (gpuScore >= 72) baseScore -= 1.5;
  } else if (actualVram >= 12 && gpuScore >= 72) {
    baseScore += 1.0;
  } else if (actualVram >= 16 && gpuScore >= 85) {
    baseScore += 1.5;
  }

  // 3. Memory Channel Secondary Impact (Requirement 18)
  if (memoryChannel === 'Single-Channel') {
    if (isDiscreteGpu) {
      baseScore -= 1.5; // Mild penalty for 1% low frame time instability
    } else {
      baseScore -= 4.5; // iGPU shares system RAM as video buffer
    }
  }

  const overallScore = Math.max(17, Math.min(100, Math.round(baseScore)));

  // 6. Main Tier Qualification & Boundary Rule (Requirements 9, 10, 11, 20, 21)
  // Strong evidence checks for promoting into a higher main tier
  const hasClearTopTierGpu = (gpuScore >= 92 && actualVram >= 16) ||
    (gpuScore >= 85 && actualVram >= 16 && isLaptop && gpu.name.includes('4090'));
  const hasClearHighEndGpu = (gpuScore >= 72 && actualVram >= 8);
  const hasClearMidRangeGpu = (gpuScore >= 45 && actualVram >= 6);

  let mainTier: MainTier = 'Entry-Level';
  let overallSubTier: SubTier = 'Average Entry-Level';

  // Top-Tier Qualification
  if (overallScore >= 91 && hasClearTopTierGpu) {
    mainTier = 'Top-Tier';
    if (overallScore <= 93) overallSubTier = 'Low Top-Tier';
    else if (overallScore <= 96) overallSubTier = 'Average Top-Tier';
    else overallSubTier = 'Good Top-Tier';
  }
  // High-End Qualification
  else if (overallScore >= 72 && hasClearHighEndGpu) {
    mainTier = 'High-End';
    // Balanced distribution:
    // 84 - 90: Good High-End (strong desktop high-end or top-tier mobile with robust CPU and memory)
    // 75 - 83: Average High-End (solid high-performance laptops like RTX 4070/5070 Mobile + capable CPU, or desktop cards with moderate CPU)
    // 72 - 74: Low High-End (entry boundary of High-End, or high-end GPU bottlenecked by RAM/CPU/TGP)
    if (overallScore >= 84) overallSubTier = 'Good High-End';
    else if (overallScore >= 75) overallSubTier = 'Average High-End';
    else overallSubTier = 'Low High-End';
  }
  // Mid-Range Qualification
  else if (overallScore >= 46 && hasClearMidRangeGpu) {
    mainTier = 'Mid-Range';
    // Borderline rule (Section 9): If score is high (63+) or near 70 without clear high-end qualification, prefer Good Mid-Range
    if (overallScore >= 63) overallSubTier = 'Good Mid-Range';
    else if (overallScore >= 54) overallSubTier = 'Average Mid-Range';
    else overallSubTier = 'Low Mid-Range';
  }
  // Entry-Level
  else {
    mainTier = 'Entry-Level';
    // Borderline rule (Section 9): If score is high (36+) without mid-range qualification, prefer Good Entry-Level
    if (overallScore >= 36) overallSubTier = 'Good Entry-Level';
    else if (overallScore >= 27) overallSubTier = 'Average Entry-Level';
    else overallSubTier = 'Low Entry-Level';
  }

  // 7. Confidence Level Determination (Requirement 25)
  let confidence: ConfidenceLevel = 'Medium';
  let confidenceReason = '';

  if (selectedDevice && !hardwareMismatch) {
    confidence = 'High';
    confidenceReason = `Verified exact hardware specifications and thermal envelope for ${selectedDevice.name} from official manufacturer documentation and direct chassis performance records.`;
  } else if (!isLaptop) {
    confidence = 'Medium';
    confidenceReason = `Standardized desktop components with documented architectural specifications and extensive benchmark coverage.`;
  } else {
    // Custom laptop hardware without verified chassis model
    if (gpu.tdpWatts && gpu.tdpWatts.includes('-')) {
      confidence = 'Low';
      confidenceReason = `Custom laptop configuration without a verified chassis model. Mobile GPU gaming throughput varies significantly (up to 25–35%) based on manufacturer-set TGP power envelopes (${gpu.tdpWatts}) and cooling implementation.`;
    } else {
      confidence = 'Medium';
      confidenceReason = `Custom laptop hardware configuration evaluated using standard mobile power and thermal baselines.`;
    }
  }

  // 8. Determine Biggest Limitation (RAM Capacity vs RAM Channel vs VRAM vs GPU vs CPU)
  let biggestLimitation: TierLimitation = 'None / Balanced';
  let limitationExplanation = 'Your hardware components are well balanced without any single constraint severely restricting your overall gaming capability.';
  let memoryChannelLimitation: string | undefined = undefined;

  if (memoryChannel === 'Single-Channel' && ramGb >= 16) {
    memoryChannelLimitation = `Operating in Single-Channel memory mode (${ramUpgradeDetails.moduleConfig}) halves memory bus bandwidth compared to dual-channel. Adding a second matched module for Dual-Channel operation will improve 1% low frame rates and smooth frame pacing in CPU-heavy scenes.`;
  }

  // If RAM is 8 GB or less, RAM is an actual capacity bottleneck
  if (ramGb <= 4) {
    biggestLimitation = 'RAM';
    limitationExplanation = '4 GB of system RAM is significantly below modern gaming standards and is currently your machine\'s most severe constraint, causing game crashes or paging stutters.';
  } else if (ramGb <= 8 && (gpuScore >= 35 || cpuScore >= 45)) {
    biggestLimitation = 'RAM';
    limitationExplanation = `Your CPU and GPU have solid throughput, but ${ramGb} GB system RAM is low for newer memory-heavy titles and may cause background memory paging stutter. Upgrading to 16 GB Dual-Channel will eliminate memory pressure.`;
  } else if (actualVram <= 4 && gpuScore >= 34) {
    // 16 GB+ RAM makes RAM ample, so VRAM buffer becomes the main limitation on 4GB GPUs
    biggestLimitation = 'VRAM';
    limitationExplanation = `Your GPU core is capable, but its ${actualVram} GB VRAM capacity limits higher texture settings and requires lowering texture budgets in demanding games to avoid video memory overflows. System RAM (${ramGb} GB) is sufficient.`;
  } else if (actualVram <= 6 && gpuScore >= 70) {
    biggestLimitation = 'VRAM';
    limitationExplanation = `Your GPU is fast, but ${actualVram} GB VRAM will fill quickly when enabling modern ray tracing or ultra high-resolution textures. System RAM (${ramGb} GB) is well equipped.`;
  } else if (gpuScore + 16 < cpuScore) {
    biggestLimitation = 'GPU';
    limitationExplanation = 'Your CPU provides strong processing headroom, making your graphics card the primary factor limiting higher graphics presets and resolutions.';
  } else if (cpuScore + 16 < gpuScore) {
    biggestLimitation = 'CPU';
    limitationExplanation = 'Your graphics card is powerful, but your CPU may hold back maximum frame rates in high-refresh esports or simulation-heavy games.';
  }

  // 9. Overall explanation tailored to main tier, device model, and key specs (Requirement 27)
  const deviceLabel = isLaptop ? 'laptop' : 'desktop PC';
  let overallExplanation = '';

  const memoryDesc = `${ramGb} GB ${memoryChannel}`;
  const tgpText = selectedDevice && !hardwareMismatch && selectedDevice.gpuTgpWatts
    ? ` at ${selectedDevice.gpuTgpWatts}`
    : (isLaptop && gpu.tdpWatts ? ` (~${gpu.tdpWatts})` : '');

  if (selectedDevice && !hardwareMismatch) {
    if (ramUpgradeDetails.status === 'supported_upgrade') {
      overallExplanation = `Your ${selectedDevice.name} (with Supported RAM Upgrade to ${memoryDesc}) is classified as ${overallSubTier} based on its verified ${gpu.name}${tgpText}, ${cpu.name}, and realistic benchmark evidence.`;
    } else if (ramUpgradeDetails.status === 'unsupported') {
      overallExplanation = `Your ${selectedDevice.name} (with Unverified RAM configuration of ${memoryDesc}) is classified as ${overallSubTier}. Note that ${ramGb} GB exceeds the verified manufacturer maximum of ${ramSpecs?.maxSupportedRamGb ?? 32} GB.`;
    } else {
      overallExplanation = `Your ${selectedDevice.name} is classified as ${overallSubTier} based on its verified ${gpu.name}${tgpText}, ${cpu.name}, and ${memoryDesc} memory configuration.`;
    }
  } else {
    overallExplanation = `Your ${deviceLabel} is classified as ${overallSubTier} based on its ${gpu.name} (${actualVram} GB VRAM${tgpText}), ${cpu.name}, and ${memoryDesc} memory.`;
  }

  const mismatchNotice = hardwareMismatch && selectedDevice
    ? 'Your custom hardware configuration differs from the selected device model, so the result is based on your manually entered hardware.'
    : undefined;

  return {
    mainTier,
    subTier: overallSubTier,
    overallScore,
    overallExplanation,
    mainTierDescription: MAIN_TIER_DESCRIPTIONS[mainTier],
    biggestLimitation,
    limitationExplanation,
    gpu: {
      tier: gpuSubTier,
      score: gpuScore,
      explanation: gpuExplanation,
      name: gpu.name,
      vram: actualVram,
      tgpWatts: selectedDevice && !hardwareMismatch ? selectedDevice.gpuTgpWatts : undefined,
      limitationWarning: actualVram <= 4 && gpuScore >= 35
        ? '⚠️ Limited 4 GB VRAM buffer for higher texture settings.'
        : undefined
    },
    cpu: {
      tier: cpuSubTier,
      score: cpuScore,
      explanation: cpuExplanation,
      name: cpu.name,
      limitationWarning: cpuScore + 16 < gpuScore
        ? '⚠️ CPU may limit high-framerate throughput in simulation titles.'
        : undefined
    },
    ram: {
      ...ramEvaluation,
      capacityGb: ramGb,
      channel: memoryChannel,
      moduleSetup: ramUpgradeDetails.moduleConfig,
      upgradeStatus: ramUpgradeDetails.status,
      details: selectedDevice && !hardwareMismatch ? (selectedDevice.ramDetails || ramUpgradeDetails.explanation) : undefined
    },
    vram: {
      ...vramEvaluation,
      capacityGb: actualVram
    },
    deviceType,
    selectedDevice: selectedDevice ?? undefined,
    hardwareMismatch,
    mismatchNotice,
    deviceTgpNote: selectedDevice && !hardwareMismatch ? selectedDevice.gpuTgpWatts : undefined,
    deviceCoolingNote: selectedDevice ? selectedDevice.coolingNotes : undefined,
    deviceDisplayNote: selectedDevice ? selectedDevice.display : undefined,
    confidence,
    confidenceReason,
    deviceConfidence: selectedDevice ? selectedDevice.confidence ?? 'High' : undefined,
    deviceBenchmarkNotes: selectedDevice ? selectedDevice.benchmarks : undefined,
    memoryChannel,
    ramUpgradeStatus: ramUpgradeDetails.status,
    ramModuleSetup: ramUpgradeDetails.moduleConfig,
    ramStatusNote: ramUpgradeDetails.warningMessage || (ramUpgradeDetails.status === 'supported_upgrade' ? 'Supported RAM upgrade' : undefined),
    memoryChannelLimitation
  };
}
