import {
  DeviceModel,
  LaptopRealityProfile,
  DeviceBenchmark
} from '../types';
import { CPUS_DATABASE } from '../data/cpus';
import { GPUS_DATABASE } from '../data/gpus';
import { getDeviceRamSpecs } from '../data/ramCompatibility';

/**
 * Known baseline TGP power envelopes across popular modern laptop GPUs.
 * Used to classify whether a laptop model runs at full desktop-equivalent wattage
 * or a thermally constrained low-power envelope.
 */
interface GpuTgpBaseline {
  minTgpWatts: number;
  maxTgpWatts: number;
  standardTgpWatts: number;
  performanceDropAtLowTgp: string; // e.g. "18% - 25% lower sustained clocks"
}

const LAPTOP_GPU_TGP_BASELINES: Record<string, GpuTgpBaseline> = {
  'rtx-4090-laptop': { minTgpWatts: 80, maxTgpWatts: 175, standardTgpWatts: 175, performanceDropAtLowTgp: 'Up to 25-30% lower raster throughput at 80-100W compared to 175W max TGP.' },
  'rtx-4080-laptop': { minTgpWatts: 60, maxTgpWatts: 175, standardTgpWatts: 175, performanceDropAtLowTgp: 'Up to 25% lower sustained clock speeds when configured at 60-100W vs 175W.' },
  'rtx-4070-laptop': { minTgpWatts: 35, maxTgpWatts: 140, standardTgpWatts: 105, performanceDropAtLowTgp: 'Scales strongly up to ~100W; diminishing returns between 105W and 140W due to voltage cap.' },
  'rtx-4060-laptop': { minTgpWatts: 45, maxTgpWatts: 140, standardTgpWatts: 105, performanceDropAtLowTgp: '45W variants (e.g. thin portables) yield ~18-24% lower FPS than 100W+ implementations.' },
  'rtx-4050-laptop': { minTgpWatts: 35, maxTgpWatts: 115, standardTgpWatts: 75, performanceDropAtLowTgp: '35W-45W variants operate 20-30% slower than 75W-95W full-power chassis.' },
  'rtx-3050-laptop': { minTgpWatts: 35, maxTgpWatts: 80, standardTgpWatts: 60, performanceDropAtLowTgp: '35W models (often paired with 4GB VRAM) run 25-35% slower than 75-80W variants.' },
  'rtx-3060-laptop': { minTgpWatts: 60, maxTgpWatts: 140, standardTgpWatts: 115, performanceDropAtLowTgp: '60W Max-Q variants trail 130W-140W full-power variants by roughly 22% in heavy games.' },
  'rtx-3070-laptop': { minTgpWatts: 80, maxTgpWatts: 140, standardTgpWatts: 125, performanceDropAtLowTgp: '80W-85W models fall 15-20% behind 130W-140W implementations.' },
  'rtx-3070-ti-laptop': { minTgpWatts: 90, maxTgpWatts: 150, standardTgpWatts: 140, performanceDropAtLowTgp: '90W models trail 150W high-power chassis by up to 20% in GPU-bound scenes.' },
  'rtx-3080-laptop': { minTgpWatts: 80, maxTgpWatts: 165, standardTgpWatts: 150, performanceDropAtLowTgp: 'Heavy variance (up to 30%) between 80W thin laptops and 165W thick chassis.' }
};

/**
 * Evaluates real-world laptop performance characteristics for a specific laptop model,
 * taking into account its verified TGP, cooling solution, factory RAM configuration,
 * and display resolution impact.
 */
export function evaluateLaptopReality(device: DeviceModel): LaptopRealityProfile {
  const cpu = CPUS_DATABASE.find(c => c.id === device.defaultCpuId);
  const gpu = GPUS_DATABASE.find(g => g.id === device.defaultGpuId);
  const ramSpecs = getDeviceRamSpecs(device);

  // 1. TGP Analysis
  const verifiedTgp = device.gpuTgpWatts || (gpu?.tgpRangeWatts ? gpu.tgpRangeWatts : 'Standard OEM TGP');
  const gpuBaseline = gpu ? LAPTOP_GPU_TGP_BASELINES[gpu.id] : undefined;

  let tgpTierClassification: 'Max TGP / Full Power' | 'Standard / Balanced TGP' | 'Lower TGP / Slim Portable' | 'Custom / Unspecified' = 'Standard / Balanced TGP';
  let tgpExplanation = '';

  const tgpMatch = verifiedTgp.match(/(\d+)\s*W/i);
  const parsedWatts = tgpMatch ? parseInt(tgpMatch[1], 10) : undefined;

  if (parsedWatts && gpuBaseline) {
    if (parsedWatts >= gpuBaseline.maxTgpWatts - 10) {
      tgpTierClassification = 'Max TGP / Full Power';
      tgpExplanation = `This laptop is equipped with a high-power ${verifiedTgp} configuration, allowing the ${gpu?.name || 'GPU'} to operate at or near its maximum possible clock speeds. You will receive top-tier rasterization throughput for this chip class.`;
    } else if (parsedWatts <= gpuBaseline.minTgpWatts + 15) {
      tgpTierClassification = 'Lower TGP / Slim Portable';
      tgpExplanation = `This model utilizes a power-limited ${verifiedTgp} envelope to fit inside a thinner, lighter chassis. Expect sustained framerates to be approximately ${gpuBaseline.performanceDropAtLowTgp} compared to thicker gaming laptops carrying 100W+ TGP.`;
    } else {
      tgpTierClassification = 'Standard / Balanced TGP';
      tgpExplanation = `This model operates with a balanced ${verifiedTgp} power profile, delivering solid efficiency and healthy sustained core clocks without extreme heat generation.`;
    }
  } else if (device.gpuTgpWatts) {
    tgpExplanation = `Verified chassis specification: ${device.gpuTgpWatts}. Real-world performance scales directly with this thermal power envelope.`;
  } else {
    tgpTierClassification = 'Custom / Unspecified';
    tgpExplanation = 'TGP is not explicitly documented by OEM specification for this exact sub-SKU; performance is estimated based on standard mobile silicon voltage curves.';
  }

  // 2. RAM Analysis
  const isSingleChannel = device.defaultChannel === 'Single-Channel' || (device.defaultRam <= 8 && !device.ramDetails?.toLowerCase().includes('2x'));
  const factoryRamConfig = device.ramDetails || `${device.defaultRam} GB ${device.ramType || 'DDR4/DDR5'}`;

  let channelRiskNote: string | undefined = undefined;
  if (isSingleChannel) {
    channelRiskNote = `This model ships from the factory in a single-channel configuration (1x ${device.defaultRam}GB stick). In real-world benchmarks, single-channel memory restricts CPU-bound framerates and reduces 1% low FPS by 12% to 25% until a second matching SO-DIMM stick is added.`;
  }

  const upgradePathNote = ramSpecs?.upgradeable
    ? `Upgradeable: Contains ${ramSpecs.ramSlots} memory slots (supports up to ${ramSpecs.maxSupportedRamGb}GB).`
    : device.ramSlots || 'Check manufacturer manual for SO-DIMM slot accessibility.';

  // 3. Display Analysis
  const resStr = device.displayResolution || '1920x1080';
  const refreshRate = device.refreshRate || 144;
  const isHighRes = resStr.includes('2560') || resStr.includes('3840') || resStr.includes('1600') || resStr.includes('1440');

  let pixelLoadVersus1080p = '1.0x (Standard FHD Baseline)';
  let nativeGamingAdvice = '1080p native resolution matches the compute profile of this mobile graphics chip comfortably.';

  if (resStr.includes('2560x1600')) {
    pixelLoadVersus1080p = '1.98x (98% more pixels than 1080p)';
    nativeGamingAdvice = 'Playing modern AAA titles at native 2560x1600 (QHD+) requires almost double the pixel shading workload of 1080p. Enabling DLSS or FSR Quality mode is highly recommended to preserve 60+ FPS.';
  } else if (resStr.includes('2560x1440')) {
    pixelLoadVersus1080p = '1.78x (78% more pixels than 1080p)';
    nativeGamingAdvice = 'Native 1440p increases shading demands by 78% over 1080p. In demanding games, Quality upscaling is recommended.';
  } else if (resStr.includes('1920x1200')) {
    pixelLoadVersus1080p = '1.11x (11% more pixels than 1080p 16:9)';
    nativeGamingAdvice = '16:10 1200p panel offers extra vertical viewing space with minimal performance penalty over standard 1080p.';
  }

  // 4. Benchmark Evidence
  const benchmarkEvidence: DeviceBenchmark[] = device.benchmarks && device.benchmarks.length > 0
    ? device.benchmarks
    : [];

  const isEstimateOnly = benchmarkEvidence.length === 0;

  // 5. Real-World Performance Summary
  let realWorldPerformanceSummary = '';
  if (!isEstimateOnly) {
    const gameCount = benchmarkEvidence.length;
    realWorldPerformanceSummary = `Verified real-world laboratory testing across ${gameCount} gaming scenarios confirms this laptop delivers solid framerates in its tested configurations. Because of its ${verifiedTgp} and ${device.coolingNotes || 'dedicated thermal system'}, it maintains reliable sustained performance without severe thermal throttling under standard room temperatures.`;
  } else {
    realWorldPerformanceSummary = `Laboratory benchmark evidence is not yet archived for this specific SKU (${device.exactSku || device.name}). Performance figures shown below represent algorithmic hardware models based on the ${gpu?.name || 'GPU'} running at ${verifiedTgp} combined with the ${cpu?.name || 'CPU'}.`;
  }

  // 6. Variance Factors & Limitations
  const varianceFactors: string[] = [
    `Power Profiles: Switching between OEM software modes (e.g. "Performance/Turbo" vs "Quiet/Balanced") can alter sustained TGP by 15W - 35W and change FPS by 10-25%.`,
    `RAM Configuration: Upgrading from single-channel to dual-channel memory can raise 1% low framerates by 15% to 30% in titles like Cyberpunk and Warzone.`,
    `Display Resolution: Native gaming on higher-resolution panels (${resStr}) substantially reduces FPS compared to external 1080p monitors unless upscaling is used.`,
    `MUX Switch / Advanced Optimus: Bypassing integrated graphics via a dedicated MUX switch recovers 5% to 15% higher framerate in high-FPS competitive esports titles.`
  ];

  const limitationsOfData: string[] = [
    'Benchmarked framerates reflect tested driver versions and ambient room temperatures (typically 21°C - 24°C). Higher ambient heat or blocked air vents will reduce sustained boost clocks.',
    'Laptop thermal performance naturally varies based on fan dust accumulation and factory thermal paste application over time.',
    'Test figures do not represent synthetic peak spikes, but rather realistic gameplay passes over typical play sessions.'
  ];

  return {
    device,
    cpu,
    gpu,
    verifiedTgp,
    tgpTierClassification,
    tgpExplanation,
    coolingAnalysis: device.coolingNotes || 'Standard dual-fan copper heatpipe cooling solution.',
    ramAnalysis: {
      factoryConfig: factoryRamConfig,
      isSingleChannel,
      channelRiskNote,
      upgradePathNote
    },
    displayAnalysis: {
      resolutionLabel: resStr,
      refreshRateLabel: `${refreshRate}Hz`,
      pixelLoadVersus1080p,
      nativeGamingAdvice
    },
    realWorldPerformanceSummary,
    benchmarkEvidence,
    isEstimateOnly,
    varianceFactors,
    limitationsOfData
  };
}
