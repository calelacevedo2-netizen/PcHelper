export type Manufacturer = 'NVIDIA' | 'AMD' | 'Intel';
export type DeviceType = 'desktop' | 'laptop';

export interface VramVariant {
  vram: number; // in GB
  busWidthBits?: number;
  performanceScore?: number; // optional score override if variant has different shader/bus config
  notes?: string;
}

export interface GPU {
  id: string;
  name: string;
  manufacturer: Manufacturer;
  type: 'desktop' | 'laptop';
  vram: number; // default VRAM in GB
  vramVariants?: VramVariant[]; // legitimate verified hardware VRAM configurations
  busWidthBits?: number;
  memoryType?: string; // e.g. 'GDDR6', 'GDDR6X', 'DDR4', 'LPDDR5'
  memoryBandwidthGbs?: number; // memory bandwidth in GB/s
  computeUnits?: number; // CUDA cores, Stream processors, or Xe cores
  rayTracingCapability?: 'None' | 'Basic' | 'Moderate' | 'Advanced' | 'Enthusiast';
  upscalingSupport?: string[]; // e.g. ['DLSS 3.5', 'FSR 3', 'XeSS']
  tdpWatts?: string; // e.g. "115W" or "35W - 80W TGP"
  tgpRangeWatts?: string; // e.g. "35W - 75W TGP" for laptops
  architecture?: string;
  performanceTier: number; // 1 to 10
  performanceScore: number; // 1 to 100 relative index (TechPowerUp & Tom's Hardware raster baseline)
  confidence?: 'High' | 'Medium' | 'Low';
  benchmarkNotes?: string;
  notes?: string;
  source?: string;
}

export interface CPU {
  id: string;
  name: string;
  manufacturer: 'Intel' | 'AMD';
  type: 'desktop' | 'laptop';
  generation?: string; // e.g. 'Zen 1', 'Zen 3', 'Zen 4', 'Alder Lake'
  family?: string; // e.g. 'Ryzen 7', 'Ryzen 5', 'Core i7'
  suffix?: string; // e.g. 'X', 'X3D', 'H', 'HS', 'U', 'G'
  architecture?: string; // e.g. 'Zen 3', 'Raptor Lake'
  performanceTier: number; // 1 to 10
  performanceScore: number; // 1 to 100 relative gaming performance index
  cores?: number;
  threads?: number;
  baseClockGhz?: number;
  boostClockGhz?: number;
  cacheMb?: number; // L3 cache in MB
  singleCoreScore?: number; // relative 1-100 single-thread gaming throughput
  multiCoreScore?: number; // relative 1-100 multi-thread throughput
  tdpWatts?: string;
  socketOrPlatform?: string; // e.g. 'AM4', 'AM5', 'FP7 Mobile', 'LGA1700'
  aliases?: string[]; // for alternate naming variations (e.g. "AMD Ryzen 7 170 with Radeon Graphics")
  confidence?: 'High' | 'Medium' | 'Low';
  notes?: string;
  source?: string;
}

export interface GameMinRequirements {
  gpuName: string;
  minGpuScore: number;
  minVram: number;
  cpuName: string;
  minCpuScore: number;
  ramGb: number;
  storageRequirement?: string;
  resolutionTarget?: string;
  targetResolution?: '720p' | '1080p' | '1440p';
  targetPreset?: string;
  targetFps?: number;
}

export interface GameRecRequirements {
  gpuName: string;
  recGpuScore: number;
  recVram: number;
  cpuName: string;
  recCpuScore: number;
  ramGb: number;
  storageRequirement?: string;
  resolutionTarget?: string;
  targetResolution?: '1080p' | '1440p' | '4K';
  targetPreset?: string;
  targetFps?: number;
}

export interface GameDemandProfile {
  overallDemand: 'Very Light' | 'Light' | 'Low' | 'Moderate' | 'Medium' | 'High' | 'Very Demanding' | 'Extremely Demanding' | 'Extreme';
  gpuDemand: 'Very Low' | 'Low' | 'Medium' | 'Medium-High' | 'High' | 'Very High' | 'Extreme';
  cpuDemand: 'Very Low' | 'Low' | 'Medium' | 'Medium-High' | 'High' | 'Very High' | 'Extreme';
  ramDemand: 'Low' | 'Medium' | 'High';
  vramSensitivity: 'Low' | 'Medium' | 'High' | 'Extreme';
  difficulty1080p: 'Very Low' | 'Low' | 'Low to Medium' | 'Moderate' | 'Medium' | 'Moderate to High' | 'High' | 'Very High' | 'Extreme';
  difficulty1440p: 'Very Low' | 'Low' | 'Low to Medium' | 'Moderate' | 'Medium' | 'Moderate to High' | 'High' | 'Very High' | 'Extreme';
  difficulty4K: 'Very Low' | 'Low' | 'Low to Medium' | 'Moderate' | 'Medium' | 'Moderate to High' | 'High' | 'Very High' | 'Extreme';
  rayTracingDemand: 'None' | 'Low' | 'Moderate' | 'Medium' | 'High' | 'Very High' | 'Extreme';
  upscalingUsefulness: 'None' | 'Low' | 'Helpful' | 'Medium' | 'High' | 'Essential';
  engineOrApi?: string;
  storageRecommendation?: string;
}

export interface BenchmarkRecord {
  gpuId: string;
  gpuName: string;
  vramGb: number;
  ramGb: number;
  resolution: '1080p' | '1440p' | '4K';
  preset: string;
  upscaling: string;
  rayTracing: string;
  avgFps: number;
  low1PercentFps?: number;
  fpsRangeDisplay: string;
  source: string;
  notes?: string;
}

export type ConfidenceLevel = 'High' | 'Medium' | 'Low';

export interface GameSettingImpact {
  settingName: string;
  impactTier: 'Massive' | 'High' | 'Medium' | 'Low';
  primaryResource?: 'GPU' | 'VRAM' | 'CPU' | 'RAM' | 'Balanced';
  safeToReduce: boolean; // true if lowering yields large FPS boost with minimal visual difference
  recommendedValue: string;
  reason: string;
}

export interface VerifiedBenchmark {
  fpsRange: string;
  resolution: string;
  preset: string;
  source: string;
  disclaimer: string;
}

export interface Game {
  id: string;
  name: string;
  category?: string;
  officialSource: string; // Source citation for official requirements
  confidence: ConfidenceLevel;
  confidenceReason?: string;
  researchSources: string[];
  demandProfile: GameDemandProfile;
  supportedResolutions: Array<'1080p' | '1440p' | '4K'>;
  supportedUpscalers: string[]; // e.g. ['DLSS 3.5 (Frame Gen)', 'FSR 3.0', 'Intel XeSS']
  minimumRequirements: GameMinRequirements;
  recommendedRequirements: GameRecRequirements;
  vramNotes?: string;
  specialNotes?: string;
  keySettingsImpact: GameSettingImpact[];
  benchmarks?: BenchmarkRecord[];
  knownBenchmarks?: Record<string, VerifiedBenchmark>;
}

export type Resolution = '1080p' | '1440p' | '4K';
export type RamOption = 4 | 8 | 12 | 16 | 24 | 32 | 48 | 64 | 96 | 128;
export type MemoryChannel = 'Single-Channel' | 'Dual-Channel';

export type RamUpgradeStatus =
  | 'factory'
  | 'supported_upgrade'
  | 'unsupported'
  | 'custom_manual';

export interface DeviceRamSpecs {
  factoryRamGb: number;
  factoryChannel: MemoryChannel;
  ramType: string;
  ramSpeedMhz?: number;
  ramSlots: number;
  solderedRamGb: number;
  upgradeable: boolean;
  maxSupportedRamGb: number;
  supportedCapacities: number[];
  supportedChannels: MemoryChannel[];
  moduleConfigurations: Record<number, {
    singleChannel?: string;
    dualChannel?: string;
    mixed?: string;
  }>;
  sourceDoc?: string;
  notes?: string;
}

export type OverallStatus = 'green' | 'yellow' | 'red';

export type PerformanceCategory =
  | 'Excellent'
  | 'Good'
  | 'Playable'
  | 'Reduced settings recommended'
  | 'Very demanding';

export type HardwareLimitation = 'GPU' | 'CPU' | 'RAM' | 'VRAM' | 'Balanced';

export type OptimizationGoal = 'graphics' | 'balanced' | 'fps';
export type TargetFpsOption = 'any' | '30' | '45' | '60' | '90' | '120' | '144' | 'custom';

export interface SettingExplanation {
  settingName: string;
  recommendedValue: string;
  explanation: string;
  primaryResource?: 'GPU' | 'VRAM' | 'CPU' | 'RAM' | 'Balanced';
  safeToReduce?: boolean;
}

export interface FpsOptimizationStep {
  stepNumber: number;
  settingName: string;
  fromValue: string;
  toValue: string;
  potentialEffect: 'Small' | 'Moderate' | 'Large';
  visualTradeoff: string;
  fpsGainEstimate?: string;
  primaryResource?: string;
}

export interface GraphicsOptimizationStep {
  stepNumber: number;
  settingName: string;
  fromValue: string;
  toValue: string;
  hardwareCondition: string;
  visualImprovement: string;
  resourceImpact?: string;
}

export interface RecommendedSettings {
  resolutionLabel: string;
  preset: string;
  textures: string;
  shadows: string;
  reflections: string;
  effects: string;
  viewDistance: string;
  volumetrics: string;
  rayTracing: string;
  upscaling: string;
  frameGeneration?: string;
  otherImportantSettings?: string[];
  gameSpecificAdjustments?: string[];
  explanations?: Record<string, SettingExplanation>;
}

export interface ComponentRatings {
  gpu: {
    status: 'Strong' | 'Adequate' | 'Below Spec';
    score: number;
    required: number;
  };
  cpu: {
    status: 'Strong' | 'Adequate' | 'Below Spec';
    score: number;
    required: number;
  };
  ram: {
    status: 'Ample' | 'Adequate' | 'Limited';
    capacityGb: number;
    recommendedGb: number;
    channel?: MemoryChannel;
    moduleSetup?: string;
    upgradeStatus?: RamUpgradeStatus;
  };
  vram: {
    status: 'Ample' | 'Adequate' | 'Limited';
    capacityGb: number;
    recommendedGb: number;
  };
}

export interface GameOptimizationGuide {
  biggestKillers: string[];
  safeToLowerWithoutVisualLoss: string[];
  upscalingAdvice: string;
  sourceCitation: string;
}

export interface EvidenceDetails {
  benchmarkReferences: string[];
  hardwareComparisonTarget: string;
  hardwareMatchingTier: 'exact_model' | 'same_cpu_gpu' | 'similar_tgp' | 'same_gpu_class' | 'broader_hardware';
  configurationDifferences: string[];
  relevantAssumptions: string[];
}

export interface RecommendationResult {
  overallStatus: OverallStatus;
  statusTitle: string;
  statusBadgeText: string;
  performanceCategory: PerformanceCategory;
  recommendedSettings: RecommendedSettings;
  whyExplanation: string;
  limitation: HardwareLimitation;
  limitationExplanation: string;
  recommendationHeadline: string;
  isUpgradeable?: boolean;
  deviceType?: DeviceType;
  confidence?: ConfidenceLevel;
  confidenceReason?: string;
  optimizationGoal?: OptimizationGoal;
  targetFps?: string;
  fpsSteps?: FpsOptimizationStep[];
  graphicsSteps?: GraphicsOptimizationStep[];
  expectedFpsRange?: string;
  expectedLow1Percent?: string;
  renderedFpsRange?: string;
  displayedFpsWithFrameGen?: string;
  workloadLimitationType?: 'GPU-bound' | 'CPU-bound' | 'VRAM-limited' | 'RAM-limited' | 'Mixed / Balanced';
  hasSufficientFpsEvidence?: boolean;
  qualitativeAssessment?: string;
  evidenceDetails?: EvidenceDetails;
  benchmarkInfo?: {
    fpsRange: string;
    avgFps?: number;
    low1PercentFps?: number;
    note: string;
    source?: string;
    isExactMatch?: boolean;
    calibratedFromGpu?: string;
    matchingTier?: string;
  };
  ratings: ComponentRatings;
  isCustomHardware: boolean;
  customHardwareNotes?: string[];
  gameSpecificGuide?: GameOptimizationGuide;
  selectedDevice?: DeviceModel;
  isHardwareMismatch?: boolean;
  mismatchNotice?: string;
  deviceTgpNote?: string;
  memoryChannel?: MemoryChannel;
  ramUpgradeStatus?: RamUpgradeStatus;
  ramModuleSetup?: string;
  ramStatusNote?: string;
  memoryChannelLimitation?: string;
}

export type MainTier = 'Potato' | 'Entry-Level' | 'Mid-Range' | 'High-End' | 'Top-Tier';

export type SubTier =
  // Special Rare Tier (Extremely outdated hardware)
  | 'Potato Laptop'
  | 'Potato Desktop'
  // Entry-Level
  | 'Low Entry-Level'
  | 'Average Entry-Level'
  | 'Good Entry-Level'
  // Mid-Range
  | 'Low Mid-Range'
  | 'Average Mid-Range'
  | 'Good Mid-Range'
  // High-End
  | 'Low High-End'
  | 'Average High-End'
  | 'Good High-End'
  // Top-Tier
  | 'Low Top-Tier'
  | 'Average Top-Tier'
  | 'Good Top-Tier';

export type TierLimitation = 'GPU' | 'CPU' | 'RAM' | 'VRAM' | 'None / Balanced';

export interface DeviceBenchmark {
  game: string;
  resolution: string;
  preset: string;
  avgFps: number;
  low1PercentFps?: number;
  upscaling?: string;
  source: string;
}

export interface DeviceModel {
  id: string;
  name: string;
  brand: string;
  manufacturer?: string;
  productFamily: string;
  series?: string;
  generation?: string;
  modelNumber?: string;
  exactModel?: string;
  exactSku?: string;
  skus?: string[];
  type: DeviceType;
  year?: number;
  defaultCpuId: string;
  defaultGpuId: string;
  defaultVram: number;
  defaultRam: RamOption;
  defaultChannel?: MemoryChannel;
  ramType?: string;
  ramDetails?: string;
  ramSlots?: string;
  ramSpecs?: DeviceRamSpecs;
  gpuTgpWatts?: string;
  tgpFactor?: number;
  tgpScoreOverride?: number;
  coolingNotes?: string;
  display?: string;
  displayResolution?: string;
  refreshRate?: number;
  storage?: string;
  isDiscreteGpu: boolean;
  benchmarks?: DeviceBenchmark[];
  confidence?: 'High' | 'Medium' | 'Low';
  source: string;
  sourceUrl?: string;
  keywords: string[];
}

export type ComponentLevelTier = 'Low' | 'Average' | 'Good';

export interface ComponentTierBreakdown {
  tier: SubTier | ComponentLevelTier;
  score: number;
  explanation: string;
  limitationWarning?: string;
}

export interface PcTierResult {
  mainTier: MainTier;
  subTier: SubTier;
  overallScore: number;
  overallExplanation: string;
  mainTierDescription: string;
  biggestLimitation: TierLimitation;
  limitationExplanation: string;
  gpu: ComponentTierBreakdown & { name: string; vram: number; tgpWatts?: string };
  cpu: ComponentTierBreakdown & { name: string };
  ram: ComponentTierBreakdown & {
    capacityGb: number;
    channel?: MemoryChannel;
    moduleSetup?: string;
    upgradeStatus?: RamUpgradeStatus;
    details?: string;
  };
  vram: ComponentTierBreakdown & { capacityGb: number };
  deviceType: DeviceType;
  selectedDevice?: DeviceModel;
  hardwareMismatch?: boolean;
  mismatchNotice?: string;
  deviceTgpNote?: string;
  deviceCoolingNote?: string;
  deviceDisplayNote?: string;
  deviceConfidence?: 'High' | 'Medium' | 'Low';
  confidence: ConfidenceLevel;
  confidenceReason?: string;
  deviceBenchmarkNotes?: DeviceBenchmark[];
  memoryChannel?: MemoryChannel;
  ramUpgradeStatus?: RamUpgradeStatus;
  ramModuleSetup?: string;
  ramStatusNote?: string;
  memoryChannelLimitation?: string;
}

// ============================================================================
// FEATURE 1: FPS DIAGNOSTIC ("Why Am I Getting This FPS?")
// ============================================================================

export type StutteringLevel = 'none' | 'minor' | 'frequent' | 'severe';

export interface FpsDiagnosticInput {
  gameName: string;
  gameId?: string;
  resolution: string; // '1080p' | '1440p' | '4K' | other
  graphicsPreset: 'Low' | 'Medium' | 'High' | 'Ultra' | 'Custom';
  actualFps: number;
  targetFps?: number;
  gpuUsagePercent?: number;
  cpuUsagePercent?: number;
  ramUsageGb?: number;
  totalRamGb?: number;
  vramUsageGb?: number;
  totalVramGb?: number;
  stutteringLevel: StutteringLevel;
  low1PercentFps?: number;
  temperatureCelsius?: number;
  // System context
  gpuName?: string;
  cpuName?: string;
  memoryChannel?: MemoryChannel;
  isLaptop?: boolean;
  laptopModelName?: string;
  deviceTgpWatts?: string;
}

export interface FpsDiagnosticActionItem {
  rank: number;
  action: string;
  detail: string;
  expectedImpact: string;
  category: 'settings' | 'upscaling' | 'resolution' | 'hardware' | 'system';
}

export type DiagnosticLimitationCategory =
  | 'GPU'
  | 'CPU'
  | 'RAM'
  | 'SingleChannel'
  | 'VRAM'
  | 'ThermalOrPower'
  | 'GameOptimization'
  | 'SettingsDemand'
  | 'BackgroundApps'
  | 'FramerateCapOrVSync'
  | 'InsufficientInfo';

export interface ComponentBottleneckBreakdown {
  component: 'GPU' | 'CPU' | 'RAM' | 'VRAM' | 'Engine/Software';
  status: 'Critical Bottleneck' | 'Moderate Limitation' | 'Healthy Headroom' | 'Optimal State';
  bottleneckScore: number; // 0 to 100% saturation or limitation
  utilizationText: string;
  headroomDescription: string;
  isPrimaryLimiter: boolean;
}

export interface FpsDiagnosticResult {
  mostLikelyCause: string;
  causeCategory: DiagnosticLimitationCategory;
  whyExplanation: string;
  summaryExplanation: string;
  detailedAnalysis: string;
  changeFirstAction: {
    action: string;
    impact: string;
    detail?: string;
  };
  thenConsiderActions: Array<{
    action: string;
    impact: string;
    detail?: string;
  }>;
  evidence: string[];
  whatToChangeFirst: FpsDiagnosticActionItem[];
  expectedEffect: string;
  otherPossibleCauses: string[];
  confidenceLevel: 'High' | 'Medium' | 'Low';
  confidenceReason: string;
  metricsSuppliedCount: number;
  suggestedMonitoringTips?: string[];
  componentBreakdowns: ComponentBottleneckBreakdown[];
}

// ============================================================================
// FEATURE 2: LAPTOP REALITY (Exact-Laptop Real-World Performance)
// ============================================================================

export interface LaptopRealityProfile {
  device: DeviceModel;
  cpu?: CPU;
  gpu?: GPU;
  verifiedTgp: string;
  tgpTierClassification: 'Max TGP / Full Power' | 'Standard / Balanced TGP' | 'Lower TGP / Slim Portable' | 'Custom / Unspecified';
  tgpExplanation: string;
  coolingAnalysis: string;
  ramAnalysis: {
    factoryConfig: string;
    isSingleChannel: boolean;
    channelRiskNote?: string;
    upgradePathNote: string;
  };
  displayAnalysis: {
    resolutionLabel: string;
    refreshRateLabel: string;
    pixelLoadVersus1080p: string;
    nativeGamingAdvice: string;
  };
  realWorldPerformanceSummary: string;
  benchmarkEvidence: DeviceBenchmark[];
  isEstimateOnly: boolean;
  varianceFactors: string[];
  limitationsOfData: string[];
}

// ============================================================================
// FEATURE 3: BENCHMARK RATING ("Is My PC Performing Normally?")
// ============================================================================

export type BenchmarkRatingLevel = 'Below Typical' | 'Typical' | 'Above Typical' | 'Exceptional' | 'Insufficient Data';

export interface BenchmarkRatingInput {
  deviceType: DeviceType;
  selectedDevice?: DeviceModel | null;
  gpuId: string;
  gpuName: string;
  vramGb: number;
  cpuId: string;
  cpuName: string;
  ramGb: number;
  memoryChannel?: MemoryChannel;
  // Game & Settings
  gameId: string;
  gameName: string;
  resolution: Resolution;
  graphicsPreset: 'Low' | 'Medium' | 'High' | 'Ultra';
  upscaling: string; // 'Native / Off' | 'DLSS Quality' | 'DLSS Balanced' | 'FSR Quality' | 'FSR Balanced' | 'XeSS Quality'
  rayTracing: boolean;
  // Benchmark Results
  avgFps: number; // Required
  low1PercentFps?: number; // Strictly Optional - User should never have to guess 1% low
  // Optional Advanced Metrics
  gpuUsagePercent?: number;
  cpuUsagePercent?: number;
  ramUsageGb?: number;
  vramUsageGb?: number;
  temperatureCelsius?: number;
  targetFps?: number;
  stutteringSeverity?: 'none' | 'minor' | 'frequent';
}

export type BenchmarkMatchPriority =
  | 'exact_device_model'
  | 'same_cpu_gpu'
  | 'similar_gpu_tgp'
  | 'same_gpu_class'
  | 'comparable_hardware';

export interface BenchmarkComparisonBaseline {
  matchPriority: BenchmarkMatchPriority;
  matchDescription: string;
  baselineAvgFps: number;
  baselineLow1PercentFps?: number;
  expectedFpsMin: number;
  expectedFpsMax: number;
  expectedLow1PercentMin?: number;
  expectedLow1PercentMax?: number;
  sourceCitation: string;
  sampleCount: number;
  sampleSources: string[];
  sampleCountOrConfidence: string;
  notes?: string;
  isExactHardwareMatch: boolean;
  isExactSettingsMatch: boolean;
}

export interface BenchmarkEvidenceDetails {
  benchmarkReferences: string[];
  hardwareComparison: string;
  configurationDifferences: string[];
  relevantAssumptions: string[];
}

export interface BenchmarkRatingResult {
  rating: BenchmarkRatingLevel;
  ratingBadgeText: string;
  ratingColor: 'rose' | 'amber' | 'emerald' | 'purple' | 'zinc';
  userAvgFps: number;
  userLow1PercentFps?: number;
  isLow1PercentProvided: boolean;
  baseline: BenchmarkComparisonBaseline;
  avgFpsDeltaPercent: number; // e.g. -14% or +8%
  low1PercentDeltaPercent?: number; // e.g. -22% or +5% (undefined if 1% low not provided)
  differenceFromNormalRange: {
    valueFps: number;
    percentFromBoundary: number;
    direction: 'below' | 'above' | 'within';
    label: string;
  };
  framePacingStatus?: 'Smooth & Consistent' | 'Minor Inconsistencies' | 'Frequent Stuttering / Poor 1% Lows' | 'High Framerate Variance' | 'Not Evaluated (No 1% Low Provided)';
  framePacingRatio?: number; // user low1PercentFps / user avgFps
  expectedFramePacingRatio?: number;
  verdictSummary: string;
  whyExplanation: string;
  unusualWarning?: string;
  statisticalAnalysis?: {
    medianFps: number;
    typicalRangeMin: number;
    typicalRangeMax: number;
    normalVariancePercent: number;
    outlierStatus: 'Normal' | 'Mild Outlier' | 'Extreme High Outlier' | 'Extreme Low Outlier';
  };
  keyContributingFactors: Array<{
    title: string;
    description: string;
    impact: 'Negative' | 'Neutral' | 'Positive';
  }>;
  actionableRecommendations: Array<{
    priority: number;
    title: string;
    detail: string;
    type: 'settings' | 'hardware' | 'system' | 'verification';
  }>;
  comparableHardwareSummary: string;
  confidence: 'High' | 'Medium' | 'Low';
  confidenceReason: string;
  evidenceDetails: BenchmarkEvidenceDetails;
}

