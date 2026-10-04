import {
  Resolution,
  MemoryChannel,
  DeviceType,
  DeviceBenchmark,
  BenchmarkRecord
} from '../types';
import { DEVICES_DATABASE } from './devices';
import { GAMES_DATABASE } from './games';

export interface BenchmarkSample {
  id: string;
  source: 'verified' | 'user_submitted';
  verifiedSource?: string;
  deviceType: DeviceType;
  deviceModelId?: string;
  deviceModelName?: string;
  gpuId: string;
  gpuName: string;
  vramGb: number;
  tgpWatts?: string;
  cpuId: string;
  cpuName: string;
  ramGb: number;
  ramSpeedMhz?: number;
  memoryChannel: MemoryChannel;
  gameId: string;
  gameName: string;
  resolution: Resolution;
  preset: 'Low' | 'Medium' | 'High' | 'Ultra';
  upscaling?: string;
  rayTracing: boolean;
  frameGeneration: boolean;
  avgFps: number;
  low1PercentFps?: number;
  gpuUsagePercent?: number;
  cpuUsagePercent?: number;
  ramUsageGb?: number;
  vramUsageGb?: number;
  gpuTempC?: number;
  cpuTempC?: number;
  dateSubmitted: string;
  notes?: string;
  verificationStatus: 'verified' | 'community' | 'flagged';
}

export interface BenchmarkQuery {
  gameId?: string;
  gameName?: string;
  gpuId?: string;
  gpuName?: string;
  resolution?: Resolution;
  preset?: string;
  deviceType?: DeviceType;
  deviceModelName?: string;
}

export interface BenchmarkStats {
  count: number;
  verifiedCount: number;
  userSubmittedCount: number;
  medianAvgFps: number;
  typicalRangeMin: number;
  typicalRangeMax: number;
  medianLow1Percent?: number;
  typicalLow1PercentMin?: number;
  typicalLow1PercentMax?: number;
  allAvgFps: number[];
  allLow1PercentFps: number[];
  samples: BenchmarkSample[];
  confidence: 'High' | 'Medium' | 'Low';
  evidenceLevel: 'Strong Verified Evidence' | 'Community & Verified Evidence' | 'User-Submitted Data Available' | 'Limited Evidence';
}

const LOCAL_STORAGE_KEY = 'pc_gaming_helper_user_benchmarks_v1';

// Seed base verified benchmarks from verified database
function extractVerifiedSeeds(): BenchmarkSample[] {
  const samples: BenchmarkSample[] = [];

  // 1. From DEVICES_DATABASE (Verified Laptops & Desktops)
  DEVICES_DATABASE.forEach((device) => {
    if (device.benchmarks && device.benchmarks.length > 0) {
      device.benchmarks.forEach((b, idx) => {
        // Find matching game if possible
        const matchedGame = GAMES_DATABASE.find((g) =>
          g.id.toLowerCase().includes(b.game.toLowerCase()) ||
          g.name.toLowerCase().includes(b.game.toLowerCase()) ||
          b.game.toLowerCase().includes(g.id.toLowerCase()) ||
          b.game.toLowerCase().includes(g.name.toLowerCase())
        );

        const cleanRes: Resolution = b.resolution.includes('1440')
          ? '1440p'
          : b.resolution.includes('4K') || b.resolution.includes('2160')
          ? '4K'
          : '1080p';

        const cleanPreset: 'Low' | 'Medium' | 'High' | 'Ultra' = b.preset.toLowerCase().includes('ultra')
          ? 'Ultra'
          : b.preset.toLowerCase().includes('high')
          ? 'High'
          : b.preset.toLowerCase().includes('low')
          ? 'Low'
          : 'Medium';

        samples.push({
          id: `seed-device-${device.id}-${idx}`,
          source: 'verified',
          verifiedSource: b.source || `${device.name} Lab Benchmark`,
          deviceType: device.type,
          deviceModelId: device.id,
          deviceModelName: device.name,
          gpuId: device.defaultGpuId,
          gpuName: device.defaultGpuId.replace(/-/g, ' ').toUpperCase(),
          vramGb: device.defaultVram,
          tgpWatts: device.gpuTgpWatts,
          cpuId: device.defaultCpuId,
          cpuName: device.defaultCpuId.replace(/-/g, ' ').toUpperCase(),
          ramGb: device.defaultRam,
          memoryChannel: device.defaultChannel || 'Dual-Channel',
          gameId: matchedGame ? matchedGame.id : b.game.toLowerCase().replace(/\s+/g, '-'),
          gameName: matchedGame ? matchedGame.name : b.game,
          resolution: cleanRes,
          preset: cleanPreset,
          upscaling: b.upscaling || 'Native / Off',
          rayTracing: Boolean(b.rayTracing && b.rayTracing !== 'Off' && b.rayTracing !== 'None'),
          frameGeneration: false,
          avgFps: b.avgFps,
          low1PercentFps: b.low1PercentFps,
          dateSubmitted: '2025-06-01',
          notes: b.notes,
          verificationStatus: 'verified'
        });
      });
    }
  });

  // 2. From GAMES_DATABASE (Verified GPU test matrix)
  GAMES_DATABASE.forEach((game) => {
    if (game.benchmarks && game.benchmarks.length > 0) {
      game.benchmarks.forEach((gb, idx) => {
        const cleanPreset: 'Low' | 'Medium' | 'High' | 'Ultra' = gb.preset.toLowerCase().includes('ultra')
          ? 'Ultra'
          : gb.preset.toLowerCase().includes('high')
          ? 'High'
          : gb.preset.toLowerCase().includes('low')
          ? 'Low'
          : 'Medium';

        samples.push({
          id: `seed-game-${game.id}-${gb.gpuId}-${idx}`,
          source: 'verified',
          verifiedSource: gb.source || 'TechPowerUp / Tom’s Hardware Matrix',
          deviceType: gb.gpuId.includes('laptop') ? 'laptop' : 'desktop',
          gpuId: gb.gpuId,
          gpuName: gb.gpuName,
          vramGb: gb.vramGb,
          cpuId: 'desktop-reference-cpu',
          cpuName: 'Core i7-13700K / Ryzen 7 7800X3D Benchmark Rig',
          ramGb: gb.ramGb || 16,
          memoryChannel: 'Dual-Channel',
          gameId: game.id,
          gameName: game.name,
          resolution: gb.resolution,
          preset: cleanPreset,
          upscaling: gb.upscaling || 'Native / Off',
          rayTracing: Boolean(gb.rayTracing && gb.rayTracing !== 'Off' && gb.rayTracing !== 'None'),
          frameGeneration: false,
          avgFps: gb.avgFps,
          low1PercentFps: gb.low1PercentFps,
          dateSubmitted: '2025-08-15',
          notes: gb.notes,
          verificationStatus: 'verified'
        });
      });
    }
  });

  return samples;
}

const SEED_BENCHMARKS = extractVerifiedSeeds();

export function getStoredUserBenchmarks(): BenchmarkSample[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (err) {
    console.warn('Failed to load user benchmarks from localStorage', err);
    return [];
  }
}

export function saveUserBenchmark(
  sample: Omit<BenchmarkSample, 'id' | 'source' | 'dateSubmitted' | 'verificationStatus'>
): BenchmarkSample {
  const newSample: BenchmarkSample = {
    ...sample,
    id: `user-bench-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    source: 'user_submitted',
    dateSubmitted: new Date().toISOString().split('T')[0],
    verificationStatus: 'community'
  };

  try {
    const existing = getStoredUserBenchmarks();
    const updated = [newSample, ...existing];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save benchmark to localStorage', err);
  }

  return newSample;
}

export function getAllBenchmarks(): BenchmarkSample[] {
  const userSamples = getStoredUserBenchmarks();
  return [...userSamples, ...SEED_BENCHMARKS];
}

/**
 * Robust statistical calculations (Median, IQR, Outlier-resilient typical range)
 */
export function calculateStatisticalDistribution(values: number[]): {
  median: number;
  typicalMin: number;
  typicalMax: number;
  q1: number;
  q3: number;
  min: number;
  max: number;
} {
  if (values.length === 0) {
    return { median: 0, typicalMin: 0, typicalMax: 0, q1: 0, q3: 0, min: 0, max: 0 };
  }

  const sorted = [...values].sort((a, b) => a - b);
  const n = sorted.length;
  const min = sorted[0];
  const max = sorted[n - 1];

  // Median
  const mid = Math.floor(n / 2);
  const median = n % 2 !== 0 ? sorted[mid] : Math.round(((sorted[mid - 1] + sorted[mid]) / 2) * 10) / 10;

  // Q1 & Q3
  const lowerHalf = sorted.slice(0, mid);
  const upperHalf = n % 2 !== 0 ? sorted.slice(mid + 1) : sorted.slice(mid);

  const getMedianOfSub = (sub: number[]) => {
    if (sub.length === 0) return median;
    const sm = Math.floor(sub.length / 2);
    return sub.length % 2 !== 0 ? sub[sm] : (sub[sm - 1] + sub[sm]) / 2;
  };

  const q1 = Math.round(getMedianOfSub(lowerHalf));
  const q3 = Math.round(getMedianOfSub(upperHalf));

  // Determine typical range:
  // For small samples (1 to 3), use normal variation of +/- 8-12% around median or min-max
  let typicalMin: number;
  let typicalMax: number;

  if (n <= 3) {
    typicalMin = Math.round(Math.min(min, median * 0.90));
    typicalMax = Math.round(Math.max(max, median * 1.10));
  } else {
    // 20th - 80th percentile approximation
    const idx20 = Math.floor(n * 0.2);
    const idx80 = Math.min(n - 1, Math.ceil(n * 0.8) - 1);
    typicalMin = Math.min(sorted[idx20], Math.round(median * 0.92));
    typicalMax = Math.max(sorted[idx80], Math.round(median * 1.08));
  }

  return {
    median: Math.round(median),
    typicalMin,
    typicalMax,
    q1,
    q3,
    min,
    max
  };
}

/**
 * Find comparable real-world benchmark samples matching hardware & game criteria
 */
export function findComparableBenchmarks(query: BenchmarkQuery): BenchmarkStats {
  const all = getAllBenchmarks();

  const matchingSamples = all.filter((s) => {
    // 1. Game Matching
    if (query.gameId) {
      const matchGameId = s.gameId.toLowerCase() === query.gameId.toLowerCase();
      const matchGameName = query.gameName && (
        s.gameName.toLowerCase().includes(query.gameName.toLowerCase()) ||
        query.gameName.toLowerCase().includes(s.gameName.toLowerCase())
      );
      if (!matchGameId && !matchGameName) return false;
    }

    // 2. GPU Matching
    if (query.gpuId) {
      const targetGpu = query.gpuId.toLowerCase();
      const sampleGpu = s.gpuId.toLowerCase();

      // Check exact ID match or normalized match
      const exactId = sampleGpu === targetGpu;
      const strippedTarget = targetGpu.replace(/-laptop|-mobile/g, '');
      const strippedSample = sampleGpu.replace(/-laptop|-mobile/g, '');

      // Strict desktop vs laptop separation unless deviceType is not constrained
      if (query.deviceType && s.deviceType !== query.deviceType) {
        return false;
      }

      if (!exactId && strippedTarget !== strippedSample) {
        return false;
      }
    }

    // 3. Resolution Matching (if specified)
    if (query.resolution && s.resolution !== query.resolution) {
      return false;
    }

    return true;
  });

  const allAvg = matchingSamples.map((s) => s.avgFps).sort((a, b) => a - b);
  const allLow = matchingSamples
    .map((s) => s.low1PercentFps)
    .filter((v): v is number => typeof v === 'number' && v > 0)
    .sort((a, b) => a - b);

  const avgStats = calculateStatisticalDistribution(allAvg);
  const lowStats = allLow.length > 0 ? calculateStatisticalDistribution(allLow) : undefined;

  const verifiedCount = matchingSamples.filter((s) => s.source === 'verified').length;
  const userSubmittedCount = matchingSamples.filter((s) => s.source === 'user_submitted').length;

  let confidence: 'High' | 'Medium' | 'Low' = 'Low';
  let evidenceLevel: BenchmarkStats['evidenceLevel'] = 'Limited Evidence';

  if (verifiedCount >= 3 || matchingSamples.length >= 6) {
    confidence = 'High';
    evidenceLevel = verifiedCount > 0 ? 'Strong Verified Evidence' : 'Community & Verified Evidence';
  } else if (matchingSamples.length >= 2) {
    confidence = 'Medium';
    evidenceLevel = userSubmittedCount > verifiedCount ? 'User-Submitted Data Available' : 'Community & Verified Evidence';
  }

  return {
    count: matchingSamples.length,
    verifiedCount,
    userSubmittedCount,
    medianAvgFps: avgStats.median,
    typicalRangeMin: avgStats.typicalMin,
    typicalRangeMax: avgStats.typicalMax,
    medianLow1Percent: lowStats ? lowStats.median : undefined,
    typicalLow1PercentMin: lowStats ? lowStats.typicalMin : undefined,
    typicalLow1PercentMax: lowStats ? lowStats.typicalMax : undefined,
    allAvgFps: allAvg,
    allLow1PercentFps: allLow,
    samples: matchingSamples,
    confidence,
    evidenceLevel
  };
}
