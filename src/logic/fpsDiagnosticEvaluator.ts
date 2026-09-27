import {
  FpsDiagnosticInput,
  FpsDiagnosticResult,
  FpsDiagnosticActionItem,
  DiagnosticLimitationCategory,
  ComponentBottleneckBreakdown
} from '../types';
import { GAMES_DATABASE } from '../data/games';

/**
 * Known engine characteristics for specific games to detect shader compilation
 * or traversal stutter rather than blaming hardware.
 */
const ENGINE_CHARACTERISTICS: Record<string, { engine: string; traversalStutterKnown: boolean; cpuHeavy: boolean; vramHeavy: boolean }> = {
  'cyberpunk-2077': { engine: 'REDengine 4', traversalStutterKnown: false, cpuHeavy: true, vramHeavy: true },
  'black-myth-wukong': { engine: 'Unreal Engine 5', traversalStutterKnown: true, cpuHeavy: true, vramHeavy: true },
  'star-wars-jedi-survivor': { engine: 'Unreal Engine 4', traversalStutterKnown: true, cpuHeavy: true, vramHeavy: true },
  'hogwarts-legacy': { engine: 'Unreal Engine 4', traversalStutterKnown: true, cpuHeavy: true, vramHeavy: true },
  'alan-wake-2': { engine: 'Northlight Engine', traversalStutterKnown: false, cpuHeavy: true, vramHeavy: true },
  'dragon-s-dogma-2': { engine: 'RE Engine', traversalStutterKnown: true, cpuHeavy: true, vramHeavy: false },
  'helldivers-2': { engine: 'Autodesk Stingray', traversalStutterKnown: false, cpuHeavy: true, vramHeavy: false },
  'valorant': { engine: 'Unreal Engine 4 (Custom)', traversalStutterKnown: false, cpuHeavy: true, vramHeavy: false },
  'counter-strike-2': { engine: 'Source 2', traversalStutterKnown: false, cpuHeavy: true, vramHeavy: false },
  'fortnite': { engine: 'Unreal Engine 5.4', traversalStutterKnown: true, cpuHeavy: true, vramHeavy: false },
  'gta-v': { engine: 'RAGE Engine', traversalStutterKnown: false, cpuHeavy: false, vramHeavy: false },
  'red-dead-redemption-2': { engine: 'RAGE Engine', traversalStutterKnown: false, cpuHeavy: false, vramHeavy: true },
  'elden-ring': { engine: 'FromSoftware Proprietary', traversalStutterKnown: true, cpuHeavy: false, vramHeavy: false }
};

export function evaluateFpsDiagnostic(input: FpsDiagnosticInput): FpsDiagnosticResult {
  const evidence: string[] = [];
  const otherPossibleCauses: string[] = [];

  // Key numerical indicators
  const actualFps = input.actualFps;
  const targetFps = input.targetFps;
  const gpuUsage = input.gpuUsagePercent;
  const cpuUsage = input.cpuUsagePercent;
  const ramUsage = input.ramUsageGb;
  const totalRam = input.totalRamGb || 16;
  const vramUsage = input.vramUsageGb;
  const totalVram = input.totalVramGb;
  const isStuttering = input.stutteringLevel === 'frequent' || input.stutteringLevel === 'severe';
  const hasMinorStutter = input.stutteringLevel === 'minor';
  const low1Pct = input.low1PercentFps;
  const isSingleChannel = input.memoryChannel === 'Single-Channel';
  const tempC = input.temperatureCelsius;

  // Check matched game profile
  const matchedGame = input.gameId
    ? GAMES_DATABASE.find(g => g.id === input.gameId)
    : GAMES_DATABASE.find(g => g.name.toLowerCase() === input.gameName.toLowerCase());
  const engineProfile = matchedGame && ENGINE_CHARACTERISTICS[matchedGame.id]
    ? ENGINE_CHARACTERISTICS[matchedGame.id]
    : undefined;

  // Count supplied telemetry
  let telemetryCount = 0;
  if (gpuUsage !== undefined) telemetryCount++;
  if (cpuUsage !== undefined) telemetryCount++;
  if (ramUsage !== undefined) telemetryCount++;
  if (vramUsage !== undefined) telemetryCount++;
  if (tempC !== undefined) telemetryCount++;
  if (low1Pct !== undefined) telemetryCount++;

  let causeCategory: DiagnosticLimitationCategory = 'GPU';
  let mostLikelyCause = 'GPU limitation';
  let whyExplanation = '';
  let summaryExplanation = '';
  let detailedAnalysis = '';
  let confidenceLevel: 'High' | 'Medium' | 'Low' = 'Low';
  let confidenceReason = '';

  let changeFirstAction = {
    action: 'Lower Shadows from High → Medium',
    impact: 'Moderate improvement',
    detail: 'Shadows are one of the most GPU-intensive settings. Lowering them eases graphics load while preserving world quality.'
  };

  let thenConsiderActions: Array<{ action: string; impact: string; detail?: string }> = [
    {
      action: 'Enable DLSS, FSR, or XeSS upscaling',
      impact: 'Large improvement',
      detail: 'Renders at a slightly lower internal resolution and cleanly reconstructs the image for a noticeable framerate uplift.'
    },
    {
      action: 'Lower Volumetric Fog and Clouds to Medium',
      impact: 'Moderate improvement',
      detail: 'Volumetrics place heavy demands on graphics shaders with minimal visual difference during motion.'
    },
    {
      action: input.resolution === '4K' || input.resolution === '1440p'
        ? `Lower Resolution to ${input.resolution === '4K' ? '1440p' : '1080p'}`
        : 'Lower Screen Space Reflections',
      impact: input.resolution === '4K' || input.resolution === '1440p' ? 'Large improvement' : 'Small improvement',
      detail: 'Reduces raw pixel shading volume.'
    }
  ];

  // --------------------------------------------------------------------------
  // DECISION LOGIC: Prioritized & Intelligent
  // Avoid using one metric alone when other information contradicts it.
  // --------------------------------------------------------------------------

  // 1. Framerate Cap or V-Sync Active
  // High confidence if GPU is idling (< 75%) and FPS is hovering right at standard refresh rate
  const isCappedFps =
    gpuUsage !== undefined &&
    gpuUsage < 75 &&
    [30, 60, 75, 120, 144, 165, 240].some(cap => Math.abs(actualFps - cap) <= 2) &&
    !isStuttering;

  if (isCappedFps) {
    causeCategory = 'FramerateCapOrVSync';
    mostLikelyCause = 'Framerate cap or V-Sync active';
    whyExplanation = `Your GPU is only at ${gpuUsage}% usage and your framerate is holding steady at ~${Math.round(actualFps)} FPS. This indicates your game is locked to your monitor refresh rate or an in-game FPS cap.`;
    summaryExplanation = `Your graphics card has plenty of spare power, but a software limit or V-Sync is keeping FPS capped at ${Math.round(actualFps)}.`;
    confidenceLevel = 'High';
    confidenceReason = `Your GPU usage is only ${gpuUsage}% while your framerate is holding steady at exactly a standard refresh rate (${Math.round(actualFps)} FPS).`;

    changeFirstAction = {
      action: 'Turn off V-Sync or raise Max Framerate in the game settings',
      impact: 'Large improvement',
      detail: 'Disabling V-Sync or setting the FPS limiter to Uncapped immediately lets your GPU render at full speed.'
    };
    thenConsiderActions = [
      {
        action: 'Check Windows display refresh rate (Settings > System > Display > Advanced)',
        impact: 'Moderate improvement',
        detail: 'Make sure your monitor is set to its highest Hz (e.g., 144Hz or 165Hz instead of 60Hz).'
      },
      {
        action: 'Check Nvidia Control Panel or AMD Adrenalin for a global frame rate cap',
        impact: 'Moderate improvement',
        detail: 'Verify "Max Frame Rate" or "Radeon Chill" is not restricting performance.'
      }
    ];

    evidence.push(`FPS is holding at ~${Math.round(actualFps)} FPS.`);
    evidence.push(`GPU usage is only ${gpuUsage}%, showing large unused rendering headroom.`);
  }

  // 2. Thermal / Power Limitation
  // Component temperature >= 84°C indicates thermal throttling
  else if (tempC !== undefined && tempC >= 84) {
    causeCategory = 'ThermalOrPower';
    mostLikelyCause = 'Thermal/power limitation';
    whyExplanation = `Your reported temperature is ${tempC}°C. When temperatures exceed 83–85°C, modern PC components automatically reduce their clock speeds (thermal throttling) to protect against overheating, causing frame drops.`;
    summaryExplanation = `High heat is forcing your hardware to slow down. Lowering operating temperatures will restore lost performance and smooth out frametimes.`;
    confidenceLevel = 'High';
    confidenceReason = `Hardware temperatures at ${tempC}°C are known to cause automatic thermal downclocking.`;

    changeFirstAction = {
      action: 'Clean dust from ventilation vents and elevate your laptop or PC case for better airflow',
      impact: 'Moderate improvement',
      detail: 'Better airflow lowers component temperatures and lets your CPU and GPU sustain their full boost speeds.'
    };
    thenConsiderActions = [
      {
        action: 'Cap in-game framerate to your display refresh rate',
        impact: 'Mainly helps 1% lows/stability',
        detail: 'Capping framerate stops your hardware from generating unnecessary heat on extra frames.'
      },
      {
        action: input.isLaptop
          ? 'Check laptop power profile in manufacturer software (set to Performance, not Quiet)'
          : 'Check case fan curves in BIOS or fan control software',
        impact: 'Moderate improvement',
        detail: 'Increases cooling fan speed to prevent heat buildup under heavy load.'
      },
      {
        action: 'Lower power-hungry graphics settings (Shadows, Volumetrics, Ray Tracing)',
        impact: 'Moderate improvement',
        detail: 'Less computational load translates directly into lower operating temperatures.'
      }
    ];

    evidence.push(`Hardware temperature is running high at ${tempC}°C.`);
    if (isStuttering) {
      evidence.push(`Frequent stuttering is consistent with clock speed dips during thermal throttling.`);
    }
  }

  // 3. VRAM Limitation
  // VRAM buffer full (e.g. >= 90% full or <= 4GB card on High/Ultra/1440p)
  else if (
    (vramUsage !== undefined && totalVram && vramUsage >= totalVram * 0.90) ||
    (vramUsage !== undefined && totalVram && (totalVram - vramUsage) < 0.6) ||
    (totalVram && totalVram <= 4 && (input.graphicsPreset === 'High' || input.graphicsPreset === 'Ultra' || input.resolution === '1440p' || input.resolution === '4K'))
  ) {
    causeCategory = 'VRAM';
    mostLikelyCause = 'VRAM limitation';
    whyExplanation = `Your dedicated video memory (VRAM) is full${vramUsage ? ` (${vramUsage}GB used${totalVram ? ` of ${totalVram}GB` : ''})` : totalVram ? ` (${totalVram}GB total)` : ''}. When VRAM fills up, the graphics card must swap textures through system memory, which causes sudden freezes and framerate drops.`;
    summaryExplanation = `Your graphics card's onboard video memory is running out of space for textures, shadow maps, and render buffers.`;
    confidenceLevel = vramUsage !== undefined ? 'High' : 'Medium';
    confidenceReason = vramUsage !== undefined
      ? `Reported VRAM allocation is near 100% capacity, which directly forces memory bus swapping.`
      : `Running ${input.graphicsPreset} settings on a ${totalVram}GB card exceeds the VRAM requirements of modern games.`;

    changeFirstAction = {
      action: 'Lower Texture Quality from High/Ultra → Medium',
      impact: 'Large improvement',
      detail: 'Texture quality is the single largest consumer of VRAM. Dropping it one notch immediately frees 1–2GB of video memory without slowing down the GPU.'
    };
    thenConsiderActions = [
      {
        action: 'Enable DLSS, FSR, or XeSS upscaling (Quality mode)',
        impact: 'Moderate improvement',
        detail: 'Upscaling reduces render target size, saving hundreds of megabytes of VRAM.'
      },
      {
        action: 'Disable Ray Tracing and lower Shadow Quality',
        impact: 'Moderate improvement',
        detail: 'Ray tracing and ultra shadows allocate massive memory buffers in VRAM.'
      }
    ];

    if (vramUsage && totalVram) {
      evidence.push(`VRAM allocation is ${vramUsage}GB of ${totalVram}GB (~${Math.round((vramUsage / totalVram) * 100)}% full).`);
    }
    if (isStuttering) {
      evidence.push(`Reported stuttering matches the signature of PCIe texture swapping.`);
    }
  }

  // 4. Insufficient System RAM
  // RAM usage >= 88% or <= 8GB with stuttering
  else if (
    (ramUsage !== undefined && totalRam && ramUsage >= totalRam * 0.88) ||
    (ramUsage !== undefined && ramUsage >= 14 && totalRam <= 16 && isStuttering) ||
    (totalRam <= 8 && isStuttering)
  ) {
    causeCategory = 'RAM';
    mostLikelyCause = 'Insufficient RAM';
    whyExplanation = `Your system memory is near maximum capacity${ramUsage ? ` (${ramUsage}GB used of ${totalRam}GB)` : ` (${totalRam}GB total)`}. When RAM runs out, Windows temporarily moves data to your storage drive, causing gameplay freezes.`;
    summaryExplanation = `Your computer has very little free RAM available while running the game and background processes.`;
    confidenceLevel = ramUsage !== undefined ? 'High' : 'Medium';
    confidenceReason = ramUsage !== undefined
      ? `RAM usage is at ~${Math.round((ramUsage / totalRam) * 100)}%, which triggers Windows disk paging.`
      : `8GB of RAM is very constrained for modern PC gaming with background applications.`;

    changeFirstAction = {
      action: 'Close memory-heavy background apps (Chrome, Edge, Discord, launchers) before playing',
      impact: 'Moderate improvement',
      detail: 'Web browsers and chat apps often consume 2–4GB of system RAM in the background.'
    };
    thenConsiderActions = [
      {
        action: 'Lower Draw Distance and View Distance in game settings',
        impact: 'Small improvement',
        detail: 'Reduces the quantity of world assets loaded into system memory at once.'
      },
      {
        action: 'Upgrade to 16GB or 32GB Dual-Channel RAM',
        impact: 'Mainly helps 1% lows/stability',
        detail: 'Providing adequate physical memory permanently eliminates disk paging hitches.'
      }
    ];

    if (ramUsage && totalRam) {
      evidence.push(`RAM usage is ${ramUsage}GB out of ${totalRam}GB (${Math.round((ramUsage / totalRam) * 100)}% utilized).`);
    }
    if (isStuttering) {
      evidence.push(`Stuttering is consistent with virtual memory swapping to disk.`);
    }
  }

  // 5. Single-Channel RAM Restriction
  else if (
    isSingleChannel &&
    (isStuttering || (low1Pct !== undefined && low1Pct < actualFps * 0.6) || (gpuUsage !== undefined && gpuUsage < 85))
  ) {
    causeCategory = 'SingleChannel';
    mostLikelyCause = 'Single-channel RAM limitation';
    whyExplanation = `Your computer is running on a single stick of RAM (single-channel). This cuts memory bandwidth in half, starving your processor and graphics card of data during busy scenes.`;
    summaryExplanation = `Memory throughput is restricted by having only one active memory channel.`;
    confidenceLevel = 'High';
    confidenceReason = `Single-channel memory bandwidth is a proven bottleneck in modern gaming, causing frametime instability.`;

    changeFirstAction = {
      action: 'Install a second matching RAM stick to enable Dual-Channel',
      impact: 'Moderate improvement',
      detail: 'Dual-channel memory doubles memory bandwidth, significantly boosting 1% low FPS and eliminating micro-stutters.'
    };
    thenConsiderActions = [
      {
        action: 'Lower CPU simulation settings (Crowd Density, Traffic)',
        impact: 'Small improvement',
        detail: 'Reduces the amount of simulation data passed through the memory bus.'
      },
      {
        action: 'Enable XMP or EXPO in BIOS if supported by your motherboard',
        impact: 'Small improvement',
        detail: 'Ensures your memory is running at its rated speed rather than slow base clock speeds.'
      }
    ];

    evidence.push(`Single-channel RAM configuration halves memory throughput.`);
    if (low1Pct) {
      evidence.push(`1% low FPS (${low1Pct} FPS) is significantly below average (${actualFps} FPS).`);
    }
  }

  // 6. CPU Limitation
  // CPU usage high while GPU usage < 85%, or GPU clearly underutilized while below target
  else if (
    gpuUsage !== undefined &&
    gpuUsage < 85 &&
    (
      (cpuUsage !== undefined && cpuUsage > 70) ||
      gpuUsage < 75 ||
      (targetFps && actualFps < targetFps * 0.8) ||
      (low1Pct !== undefined && low1Pct < actualFps * 0.55)
    )
  ) {
    causeCategory = 'CPU';
    mostLikelyCause = 'CPU limitation';
    whyExplanation = `Your GPU is only at ${gpuUsage}% usage because your processor is struggling to prepare game logic and draw calls fast enough to keep the graphics card busy.`;
    summaryExplanation = `Your graphics card has idle headroom, but your CPU or game engine thread is maxing out.`;
    confidenceLevel = 'High';
    confidenceReason = `Your GPU usage is ${gpuUsage}% while CPU usage is under heavy load, indicating a processor bottleneck.`;

    changeFirstAction = {
      action: 'Lower CPU-heavy settings: Crowd Density, NPC Count, and Draw Distance',
      impact: 'Moderate improvement',
      detail: 'These settings directly reduce the calculations your processor has to perform every frame.'
    };
    thenConsiderActions = [
      {
        action: 'Close CPU-heavy background applications (antivirus scans, browser tabs, Discord)',
        impact: 'Small improvement',
        detail: 'Gives the game dedicated access to processor cores.'
      },
      {
        action: 'Turn off Ray Tracing',
        impact: 'Moderate improvement',
        detail: 'Ray tracing adds significant CPU overhead to construct bounding volume structures.'
      },
      {
        action: 'Enable DLSS 3 or FSR 3 Frame Generation (if supported)',
        impact: 'Large improvement',
        detail: 'Frame generation inserts frames entirely on the graphics card, effectively bypassing CPU limits.'
      }
    ];

    evidence.push(`GPU usage is underutilized at ${gpuUsage}% (ideal gaming load is 95–100%).`);
    if (cpuUsage !== undefined) {
      evidence.push(`CPU usage is reported at ${cpuUsage}%.`);
    }
  }

  // 7. Background Applications
  // CPU usage high (> 85%) while GPU is low (< 75%) and user notes general sluggishness
  else if (cpuUsage !== undefined && cpuUsage > 85 && gpuUsage !== undefined && gpuUsage < 75) {
    causeCategory = 'BackgroundApps';
    mostLikelyCause = 'Background applications';
    whyExplanation = `Your CPU is under heavy load (${cpuUsage}%) while your graphics card is only at ${gpuUsage}%. Background programs (such as web browsers, screen recorders, or system scans) are stealing CPU cycles away from the game.`;
    summaryExplanation = `Non-game software running in Windows is consuming valuable processing power.`;
    confidenceLevel = 'Medium';
    confidenceReason = `Very high CPU usage paired with low GPU usage points toward active background tasks competing for resources.`;

    changeFirstAction = {
      action: 'Open Task Manager (Ctrl + Shift + Esc) and close high-CPU background tasks',
      impact: 'Moderate improvement',
      detail: 'Ending background software frees up processor cores for your game.'
    };
    thenConsiderActions = [
      {
        action: 'Pause any active Windows updates, cloud backups, or virus scans',
        impact: 'Small improvement'
      },
      {
        action: 'Disable hardware acceleration or close web browser tabs',
        impact: 'Small improvement'
      }
    ];

    evidence.push(`CPU usage is very high at ${cpuUsage}%.`);
    evidence.push(`GPU usage is only ${gpuUsage}%, starved by non-game processes.`);
  }

  // 8. Known Game Optimization / Engine Stutter
  else if (engineProfile && engineProfile.traversalStutterKnown && isStuttering && actualFps >= 45) {
    causeCategory = 'GameOptimization';
    mostLikelyCause = 'Game optimization';
    whyExplanation = `${input.gameName} is built on ${engineProfile.engine}, an engine known across the PC gaming community for traversal hitching and shader compilation stutters that affect all hardware tiers, including top-end PCs.`;
    summaryExplanation = `The stuttering you experience when entering new areas is an engine characteristic, not a hardware defect.`;
    confidenceLevel = 'Medium';
    confidenceReason = `Known engine trait: ${input.gameName} suffers from shader compilation and open-world streaming stutters.`;

    changeFirstAction = {
      action: 'Allow shaders to pre-compile 100% in the game menu before playing',
      impact: 'Mainly helps 1% lows/stability',
      detail: 'Letting shaders compile upon first launch prevents severe in-game combat hitches.'
    };
    thenConsiderActions = [
      {
        action: 'Ensure the game is installed on a fast NVMe SSD rather than a hard drive',
        impact: 'Moderate improvement',
        detail: 'Reduces asset loading times as you move across the map.'
      },
      {
        action: 'Cap framerate to a stable 60 FPS in game settings',
        impact: 'Mainly helps 1% lows/stability',
        detail: 'Capping framerate smooths out sudden frametime swings.'
      }
    ];

    evidence.push(`${input.gameName} runs on ${engineProfile.engine}, known for traversal stutter.`);
    evidence.push(`Reported ${input.stutteringLevel} stuttering aligns with engine asset streaming.`);
  }

  // 9. Resolution Too High
  else if (
    (input.resolution === '4K' || (input.resolution === '1440p' && actualFps < 45)) &&
    (gpuUsage === undefined || gpuUsage >= 85)
  ) {
    causeCategory = 'SettingsDemand';
    mostLikelyCause = 'Resolution too high';
    whyExplanation = `You are playing at ${input.resolution}, which requires your graphics card to render millions of pixels every frame. At ${actualFps} FPS, pixel shading workload is the dominant factor holding back your framerate.`;
    summaryExplanation = `Rendering at ${input.resolution} is placing a very heavy load on your graphics card.`;
    confidenceLevel = gpuUsage !== undefined ? 'High' : 'Medium';
    confidenceReason = gpuUsage !== undefined
      ? `GPU usage is high at ${input.resolution}, confirming pixel shading is the primary bottleneck.`
      : `Playing at ${input.resolution} demands significantly more GPU power than standard 1080p.`;

    changeFirstAction = {
      action: 'Enable DLSS, FSR, or XeSS upscaling (Quality or Balanced mode)',
      impact: 'Large improvement',
      detail: 'Upscaling renders at a lower internal resolution and reconstructs the image, giving a large FPS boost with crisp details.'
    };
    thenConsiderActions = [
      {
        action: `Lower Resolution to ${input.resolution === '4K' ? '1440p' : '1080p'}`,
        impact: 'Large improvement',
        detail: 'Significantly reduces the number of pixels your GPU has to shade every second.'
      },
      {
        action: 'Lower Shadows and Volumetric Lighting to Medium',
        impact: 'Moderate improvement',
        detail: 'Eases GPU compute load without hurting gameplay clarity.'
      }
    ];

    evidence.push(`Display resolution is set to ${input.resolution}.`);
    evidence.push(`Reported ${actualFps} FPS reflects native high-resolution shading load.`);
  }

  // 10. Graphics Settings Too Demanding
  else if (
    (input.graphicsPreset === 'Ultra' || input.graphicsPreset === 'High') &&
    actualFps < 50 &&
    (targetFps ? actualFps < targetFps : true) &&
    (gpuUsage === undefined || gpuUsage >= 85)
  ) {
    causeCategory = 'SettingsDemand';
    mostLikelyCause = 'Graphics settings too demanding';
    whyExplanation = `Your game is running on ${input.graphicsPreset} settings, which enables computationally demanding visual effects with diminishing returns. Lowering just a few heavy settings will give you a big jump in FPS.`;
    summaryExplanation = `Current graphics preset is heavier than ideal for sustained high framerates on your setup.`;
    confidenceLevel = gpuUsage !== undefined ? 'High' : 'Medium';
    confidenceReason = gpuUsage !== undefined
      ? `GPU usage is near maximum under ${input.graphicsPreset} settings.`
      : `High and Ultra presets include heavy post-processing that demands significant GPU power.`;

    changeFirstAction = {
      action: 'Lower Shadows from High → Medium',
      impact: 'Moderate improvement',
      detail: 'Shadows have a large impact on GPU performance while providing minimal visual difference during motion.'
    };
    thenConsiderActions = [
      {
        action: 'Enable DLSS, FSR, or XeSS upscaling',
        impact: 'Large improvement',
        detail: 'Boosts framerate cleanly without requiring lower texture quality.'
      },
      {
        action: 'Lower Volumetric Fog and Screen Space Reflections to Medium',
        impact: 'Moderate improvement',
        detail: 'Cuts unnecessary shader calculations.'
      },
      {
        action: 'Lower Resolution',
        impact: 'Large improvement',
        detail: 'Reduces the total pixel rendering workload.'
      }
    ];

    evidence.push(`Graphics preset is set to ${input.graphicsPreset}.`);
    evidence.push(`Reported FPS is ${actualFps} FPS${targetFps ? ` vs desired ${targetFps} FPS` : ''}.`);
  }

  // 11. Standard GPU Limitation (Clean GPU bound)
  else if (gpuUsage !== undefined && gpuUsage >= 88) {
    causeCategory = 'GPU';
    mostLikelyCause = 'GPU limitation';
    whyExplanation = `Your GPU is doing most of the work (${gpuUsage}% usage), so lowering graphics settings or enabling upscaling is the most effective way to increase your FPS.`;
    summaryExplanation = `Your graphics card is operating at full capacity, which is the expected state for gaming.`;
    confidenceLevel = 'High';
    confidenceReason = `Your GPU usage is ${gpuUsage}% while CPU usage is much lower, which strongly suggests the GPU is limiting performance.`;

    changeFirstAction = {
      action: 'Lower Shadows from High → Medium',
      impact: 'Moderate improvement',
      detail: 'Reduces shadow map resolution and filtering overhead, directly freeing up GPU compute.'
    };
    thenConsiderActions = [
      {
        action: 'Enable DLSS, FSR, or XeSS upscaling',
        impact: 'Large improvement',
        detail: 'Renders at a lower internal resolution and intelligently upscales for higher FPS.'
      },
      {
        action: 'Lower Volumetrics and Ambient Occlusion to Medium',
        impact: 'Moderate improvement',
        detail: 'Saves GPU shader power with virtually no noticeable difference during gameplay.'
      },
      {
        action: input.resolution === '4K' || input.resolution === '1440p'
          ? `Lower Resolution to ${input.resolution === '4K' ? '1440p' : '1080p'}`
          : 'Turn off Motion Blur and Depth of Field',
        impact: input.resolution === '4K' || input.resolution === '1440p' ? 'Large improvement' : 'Usually has little FPS impact',
        detail: input.resolution === '4K' || input.resolution === '1440p' ? 'Directly cuts pixel workload.' : 'Improves visual clarity in fast motion.'
      }
    ];

    evidence.push(`GPU usage is pegged at ${gpuUsage}%, showing graphics shaders are fully utilized.`);
    if (cpuUsage !== undefined) {
      evidence.push(`CPU usage is comfortable at ${cpuUsage}%, showing the processor is easily keeping up.`);
    }
  }

  // 12. Fallback / Only Basic Inputs Provided
  else {
    // If only basic inputs were entered without telemetry:
    if (telemetryCount === 0) {
      causeCategory = 'GPU';
      mostLikelyCause = 'GPU limitation';
      whyExplanation = `Your GPU is likely the main limitation because you are playing at ${input.resolution} with ${input.graphicsPreset.toLowerCase()} graphics settings and your reported FPS (${actualFps} FPS) is below expected high-fluidity targets.`;
      summaryExplanation = `Based on your resolution and graphics settings, the graphics card is typically the primary factor determining FPS.`;
      confidenceLevel = 'Medium';
      confidenceReason = `Only basic inputs were provided without hardware utilization percentages (GPU % / CPU %). This diagnosis is based on your selected resolution (${input.resolution}) and preset (${input.graphicsPreset}).`;

      changeFirstAction = {
        action: 'Lower Shadows from High → Medium',
        impact: 'Moderate improvement',
        detail: 'Shadows are consistently the highest GPU-impact setting across modern games.'
      };
      thenConsiderActions = [
        {
          action: 'Enable DLSS, FSR, or XeSS upscaling',
          impact: 'Large improvement',
          detail: 'Provides an immediate framerate boost while preserving image sharpness.'
        },
        {
          action: 'Lower Volumetrics and Reflections to Medium',
          impact: 'Moderate improvement',
          detail: 'Reduces shader load on the graphics card.'
        },
        {
          action: input.resolution === '4K' || input.resolution === '1440p'
            ? `Lower Resolution (${input.resolution} → ${input.resolution === '4K' ? '1440p' : '1080p'})`
            : 'Check GPU and CPU usage in Windows Game Bar (Win + G)',
          impact: input.resolution === '4K' || input.resolution === '1440p' ? 'Large improvement' : 'Usually has little FPS impact',
          detail: 'Provides 100% diagnostic certainty on whether your GPU or CPU is limiting FPS.'
        }
      ];

      evidence.push(`Tested at ${input.resolution} on ${input.graphicsPreset} preset.`);
      evidence.push(`Reported FPS: ${actualFps} FPS${targetFps ? ` (target: ${targetFps} FPS)` : ''}.`);
      evidence.push(`No hardware telemetry provided; enter GPU and CPU % under Advanced Information for high confidence.`);
    } else {
      causeCategory = 'InsufficientInfo';
      mostLikelyCause = 'Insufficient information';
      whyExplanation = `Based on your reported ${actualFps} FPS at ${input.resolution}, your hardware is operating within normal boundaries, but more telemetry is needed to identify any subtle bottleneck with certainty.`;
      summaryExplanation = `The provided telemetry metrics do not show a clear hardware or thermal limit.`;
      confidenceLevel = 'Low';
      confidenceReason = `Reported metrics do not show an obvious bottleneck. Providing both GPU usage % and CPU usage % will give an exact answer.`;

      changeFirstAction = {
        action: 'Check GPU and CPU usage using Windows Game Bar (Win + G)',
        impact: 'Usually has little FPS impact',
        detail: 'Pressing Windows + G brings up the built-in performance overlay so you can see live GPU% and CPU%.'
      };
      thenConsiderActions = [
        {
          action: 'Lower Shadows and Volumetrics to Medium',
          impact: 'Moderate improvement'
        },
        {
          action: 'Enable DLSS or FSR upscaling',
          impact: 'Large improvement'
        }
      ];

      evidence.push(`Reported FPS: ${actualFps} FPS.`);
    }
  }

  // Build whatToChangeFirst for backwards compatibility with any existing components
  const actionItems: FpsDiagnosticActionItem[] = [
    {
      rank: 1,
      action: changeFirstAction.action,
      detail: changeFirstAction.detail || 'The most effective single adjustment to increase FPS.',
      expectedImpact: changeFirstAction.impact,
      category: 'settings'
    },
    ...thenConsiderActions.map((item, idx) => ({
      rank: idx + 2,
      action: item.action,
      detail: item.detail || 'Additional recommended adjustment to consider.',
      expectedImpact: item.impact,
      category: (item.action.toLowerCase().includes('dlss') || item.action.toLowerCase().includes('fsr')
        ? 'upscaling'
        : item.action.toLowerCase().includes('resolution')
        ? 'resolution'
        : 'settings') as FpsDiagnosticActionItem['category']
    }))
  ];

  // Secondary causes to check
  otherPossibleCauses.push('Background recording software (OBS, Medal, GeForce ShadowPlay) using encoding power.');
  otherPossibleCauses.push('Windows Power Plan set to Power Saver instead of Balanced or High Performance.');
  if (input.isLaptop) {
    otherPossibleCauses.push('Laptop running on battery power or unplugged from the original high-wattage charger.');
  }

  detailedAnalysis = summaryExplanation;
  const expectedEffect = `Applying the recommended changes (lowering heavy settings like shadows and turning on upscaling) will provide a smoother, more consistent framerate without hurting visual quality.`;

  // Monitoring tips
  const suggestedMonitoringTips = [
    'Windows Xbox Game Bar: Press Win + G while in-game to view the built-in performance widget (FPS, GPU %, CPU %, and RAM).',
    'Nvidia GeForce: Press Alt + R to toggle the GeForce performance overlay.',
    'AMD Adrenalin: Press Ctrl + Shift + O to open the Radeon performance overlay.'
  ];

  // ==========================================================================
  // COMPONENT BREAKDOWN (GPU, CPU, RAM, VRAM)
  // Clean, realistic saturation & headroom breakdown
  // ==========================================================================
  const componentBreakdowns: ComponentBottleneckBreakdown[] = [];

  // GPU
  const isGpuPrimary = causeCategory === 'GPU' || causeCategory === 'SettingsDemand';
  const effectiveGpuUsage = gpuUsage !== undefined ? gpuUsage : (isGpuPrimary ? 98 : 75);
  let gpuStatus: ComponentBottleneckBreakdown['status'] = 'Optimal State';
  let gpuHeadroom = 'GPU has plenty of rendering headroom available.';
  if (effectiveGpuUsage >= 95) {
    gpuStatus = 'Critical Bottleneck';
    gpuHeadroom = 'GPU is working at 100% capacity. Lowering graphics settings will directly increase FPS.';
  } else if (effectiveGpuUsage >= 85) {
    gpuStatus = 'Moderate Limitation';
    gpuHeadroom = 'GPU is heavily loaded with small headroom remaining.';
  } else if (effectiveGpuUsage < 70) {
    gpuStatus = 'Healthy Headroom';
    gpuHeadroom = `GPU is idling at ~${effectiveGpuUsage}%, waiting for CPU draw calls or capped by V-Sync.`;
  }
  componentBreakdowns.push({
    component: 'GPU',
    status: isGpuPrimary && gpuStatus !== 'Critical Bottleneck' ? 'Critical Bottleneck' : gpuStatus,
    bottleneckScore: Math.min(100, Math.round(effectiveGpuUsage)),
    utilizationText: gpuUsage !== undefined ? `${gpuUsage}% Usage` : (isGpuPrimary ? '~98% (Estimated GPU-limited)' : 'Not reported'),
    headroomDescription: gpuHeadroom,
    isPrimaryLimiter: isGpuPrimary
  });

  // CPU
  const isCpuPrimary = causeCategory === 'CPU' || causeCategory === 'BackgroundApps';
  const effectiveCpuUsage = cpuUsage !== undefined ? cpuUsage : (isCpuPrimary ? 88 : 45);
  let cpuStatus: ComponentBottleneckBreakdown['status'] = 'Healthy Headroom';
  let cpuHeadroom = 'CPU is comfortably handling game logic without holding back the GPU.';
  if (isCpuPrimary || effectiveCpuUsage >= 85) {
    cpuStatus = 'Critical Bottleneck';
    cpuHeadroom = 'Processor or main render thread is limiting draw calls. Lower crowd density or draw distance.';
  } else if (effectiveCpuUsage >= 65 || (gpuUsage !== undefined && gpuUsage < 85 && actualFps < 60)) {
    cpuStatus = 'Moderate Limitation';
    cpuHeadroom = 'Main render thread may be limiting performance despite moderate overall CPU reading.';
  }
  componentBreakdowns.push({
    component: 'CPU',
    status: cpuStatus,
    bottleneckScore: Math.min(100, Math.round(isCpuPrimary ? Math.max(88, effectiveCpuUsage) : effectiveCpuUsage)),
    utilizationText: cpuUsage !== undefined ? `${cpuUsage}% Usage` : (isCpuPrimary ? 'Main-Thread Limited' : 'Healthy'),
    headroomDescription: cpuHeadroom,
    isPrimaryLimiter: isCpuPrimary
  });

  // RAM
  const isRamPrimary = causeCategory === 'RAM' || causeCategory === 'SingleChannel';
  const effectiveRamUsage = ramUsage !== undefined ? ramUsage : (isRamPrimary ? Math.round(totalRam * 0.9) : Math.round(totalRam * 0.6));
  const ramPercent = Math.min(100, Math.round((effectiveRamUsage / totalRam) * 100));
  let ramStatus: ComponentBottleneckBreakdown['status'] = 'Optimal State';
  let ramHeadroom = `${totalRam}GB RAM is sufficient for this game.`;
  if (isSingleChannel) {
    ramStatus = 'Critical Bottleneck';
    ramHeadroom = 'Single-channel memory cuts bandwidth in half. Adding a second stick will boost stability.';
  } else if (ramPercent >= 90 || totalRam <= 8) {
    ramStatus = 'Critical Bottleneck';
    ramHeadroom = 'System RAM is full. Close background apps to stop Windows from swapping to disk.';
  } else if (ramPercent >= 78) {
    ramStatus = 'Moderate Limitation';
    ramHeadroom = 'High memory usage. Close web browser tabs to keep memory free.';
  }
  componentBreakdowns.push({
    component: 'RAM',
    status: ramStatus,
    bottleneckScore: isSingleChannel ? 95 : ramPercent,
    utilizationText: ramUsage !== undefined ? `${ramUsage}GB / ${totalRam}GB (${ramPercent}%)` : `${totalRam}GB RAM ${isSingleChannel ? '(Single-Channel ⚠️)' : '(Dual-Channel)'}`,
    headroomDescription: ramHeadroom,
    isPrimaryLimiter: isRamPrimary
  });

  // VRAM
  const isVramPrimary = causeCategory === 'VRAM';
  const assumedTotalVram = totalVram || (input.isLaptop ? 6 : 8);
  const effectiveVramUsage = vramUsage !== undefined ? vramUsage : (isVramPrimary ? assumedTotalVram * 0.98 : assumedTotalVram * 0.7);
  const vramPercent = Math.min(100, Math.round((effectiveVramUsage / assumedTotalVram) * 100));
  let vramStatus: ComponentBottleneckBreakdown['status'] = 'Optimal State';
  let vramHeadroom = 'Game textures fit comfortably inside video memory.';
  if (isVramPrimary || vramPercent >= 92) {
    vramStatus = 'Critical Bottleneck';
    vramHeadroom = `VRAM limit reached (${assumedTotalVram}GB). Lower Texture Quality immediately.`;
  } else if (vramPercent >= 80) {
    vramStatus = 'Moderate Limitation';
    vramHeadroom = 'VRAM is close to capacity. Avoid Ultra textures or Ray Tracing.';
  }
  componentBreakdowns.push({
    component: 'VRAM',
    status: vramStatus,
    bottleneckScore: isVramPrimary ? 98 : vramPercent,
    utilizationText: vramUsage !== undefined ? `${vramUsage}GB / ${assumedTotalVram}GB (${vramPercent}%)` : `${assumedTotalVram}GB Video Memory`,
    headroomDescription: vramHeadroom,
    isPrimaryLimiter: isVramPrimary
  });

  return {
    mostLikelyCause,
    causeCategory,
    whyExplanation,
    summaryExplanation,
    detailedAnalysis,
    changeFirstAction,
    thenConsiderActions,
    evidence,
    whatToChangeFirst: actionItems,
    expectedEffect,
    otherPossibleCauses,
    confidenceLevel,
    confidenceReason,
    metricsSuppliedCount: telemetryCount + 1,
    suggestedMonitoringTips,
    componentBreakdowns
  };
}
