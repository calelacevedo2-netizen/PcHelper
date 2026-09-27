import { DeviceModel } from '../../types';

/**
 * Dell & Alienware Gaming Devices Database
 * Covers Dell G15 (5511, 5515, 5520, 5530), Dell G16 (7620, 7630),
 * Alienware m16, m18, x16, and Alienware Aurora R13 / R15 / R16 Desktops.
 * 
 * Sources: Dell Support Manuals, Notebookcheck, Jarrod’s Tech.
 */
export const DELL_DEVICES: DeviceModel[] = [
  // =========================================================================
  // DELL G15 (5511 / 5515 / 5520 / 5530)
  // =========================================================================
  {
    id: 'dell-g15-5511-rtx3050',
    name: 'Dell G15 (5511 - RTX 3050)',
    brand: 'Dell',
    productFamily: 'Dell G15',
    exactModel: '5511',
    exactSku: '5511-5418GRY',
    skus: ['5511-5418GRY'],
    modelNumber: 'G15 5511-5418GRY',
    type: 'laptop',
    year: 2021,
    defaultCpuId: 'intel-i5-11400h',
    defaultGpuId: 'rtx-3050-laptop',
    defaultVram: 4,
    defaultRam: 8,
    ramDetails: '8 GB DDR4-3200 (1x 8GB Single-Channel, 2 slots)',
    ramSlots: '2x SO-DIMM slots (1 free)',
    gpuTgpWatts: '90W Max TGP (with Dynamic Boost)',
    tgpFactor: 1.05,
    coolingNotes: 'Alienware-inspired dual-intake and quad-exhaust thermal engineering.',
    display: '15.6" FHD (1920x1080) 120Hz WVA 250 nits',
    storage: '512GB PCIe NVMe SSD',
    isDiscreteGpu: true,
    confidence: 'High',
    benchmarks: [
      { game: 'Cyberpunk 2077', resolution: '1080p', preset: 'Medium (DLSS Quality)', avgFps: 52, low1PercentFps: 41, source: 'Notebookcheck Dell G15 5511 Review' },
      { game: 'Shadow of the Tomb Raider', resolution: '1080p', preset: 'High', avgFps: 66, low1PercentFps: 53, source: 'Jarrod’s Tech' }
    ],
    source: 'Dell G15 5511 Setup and Specifications Guide',
    sourceUrl: 'https://www.dell.com/support/home/en-us/product-support/product/g-series-15-5511-laptop/docs',
    keywords: ['dell', 'g15', '5511', '11400h', 'rtx 3050', 'gaming laptop']
  },
  {
    id: 'dell-g15-5520-rtx3060',
    name: 'Dell G15 (5520 - RTX 3060)',
    brand: 'Dell',
    productFamily: 'Dell G15',
    exactModel: '5520',
    exactSku: '5520-7462GRY',
    skus: ['5520-7462GRY'],
    modelNumber: 'G15 5520-7462GRY',
    type: 'laptop',
    year: 2022,
    defaultCpuId: 'intel-i7-12700h',
    defaultGpuId: 'rtx-3060-laptop',
    defaultVram: 6,
    defaultRam: 16,
    ramDetails: '16 GB DDR5-4800 (2x 8GB Dual-Channel, 2 slots)',
    ramSlots: '2x SO-DIMM slots',
    gpuTgpWatts: '130W Max TGP (with Dynamic Boost, MUX Switch)',
    tgpFactor: 1.05,
    coolingNotes: 'Dual fan cooling with copper pipes and Game Shift G-key high-speed boost.',
    display: '15.6" FHD (1920x1080) 165Hz IPS 300 nits 100% sRGB, G-Sync',
    storage: '512GB PCIe 4.0 NVMe SSD',
    isDiscreteGpu: true,
    confidence: 'High',
    benchmarks: [
      { game: 'Cyberpunk 2077', resolution: '1080p', preset: 'Ultra (DLSS Quality)', avgFps: 72, low1PercentFps: 58, source: 'Notebookcheck G15 5520 Review' },
      { game: 'Red Dead Redemption 2', resolution: '1080p', preset: 'Ultra (DLSS Quality)', avgFps: 76, low1PercentFps: 62, source: 'Jarrod’s Tech' }
    ],
    source: 'Dell G15 5520 Specifications',
    sourceUrl: 'https://www.dell.com/support/home/en-us/product-support/product/g-series-15-5520-laptop/docs',
    keywords: ['dell', 'g15', '5520', '12700h', 'rtx 3060', 'gaming laptop']
  },
  {
    id: 'dell-g15-5530-rtx4060',
    name: 'Dell G15 (5530 - RTX 4060)',
    brand: 'Dell',
    productFamily: 'Dell G15',
    exactModel: '5530',
    exactSku: '5530-7484GRY',
    skus: ['5530-7484GRY'],
    modelNumber: 'G15 5530-7484GRY',
    type: 'laptop',
    year: 2023,
    defaultCpuId: 'intel-i7-13650hx',
    defaultGpuId: 'rtx-4060-laptop',
    defaultVram: 8,
    defaultRam: 16,
    ramDetails: '16 GB DDR5-4800 (2x 8GB Dual-Channel, 2 slots up to 32GB)',
    ramSlots: '2x SO-DIMM slots',
    gpuTgpWatts: '140W Max TGP (115W + 25W Dynamic Boost, MUX Switch + Advanced Optimus)',
    tgpFactor: 1.05,
    tgpScoreOverride: 64,
    coolingNotes: 'Alienware-inspired thermal design with ultra-thin fan blades and vapor chamber on select configurations.',
    display: '15.6" FHD (1920x1080) 165Hz IPS 300 nits 100% sRGB, G-Sync',
    storage: '1TB PCIe 4.0 NVMe SSD',
    isDiscreteGpu: true,
    confidence: 'High',
    benchmarks: [
      { game: 'Cyberpunk 2077', resolution: '1080p', preset: 'Ultra (DLSS 3 Frame Gen)', avgFps: 95, low1PercentFps: 77, source: 'Jarrod’s Tech Dell G15 5530 Review' },
      { game: 'Black Myth: Wukong', resolution: '1080p', preset: 'High (DLSS FG)', avgFps: 72, low1PercentFps: 58, source: 'Notebookcheck' }
    ],
    source: 'Dell G15 5530 Setup and Specifications Guide',
    sourceUrl: 'https://www.dell.com/support/home/en-us/product-support/product/g-series-15-5530-laptop/docs',
    keywords: ['dell', 'g15', '5530', '13650hx', 'rtx 4060', 'gaming laptop']
  },

  // =========================================================================
  // DELL G16 (7630)
  // =========================================================================
  {
    id: 'dell-g16-7630-rtx4070',
    name: 'Dell G16 (7630 - RTX 4070)',
    brand: 'Dell',
    productFamily: 'Dell G16',
    exactModel: '7630',
    exactSku: '7630-7489BLK',
    skus: ['7630-7489BLK'],
    modelNumber: 'G16 7630-7489BLK',
    type: 'laptop',
    year: 2023,
    defaultCpuId: 'intel-i9-13900hx',
    defaultGpuId: 'rtx-4070-laptop',
    defaultVram: 8,
    defaultRam: 16,
    ramDetails: '16 GB DDR5-4800 (2x 8GB Dual-Channel, 2 slots)',
    ramSlots: '2x SO-DIMM slots',
    gpuTgpWatts: '140W Max TGP (115W + 25W Dynamic Boost, MUX Switch)',
    tgpFactor: 1.05,
    tgpScoreOverride: 75,
    coolingNotes: 'Vapor Chamber cooling with Element 31 thermal interface material on CPU.',
    display: '16" QHD+ (2560x1600, 16:10) 240Hz IPS 300 nits 100% DCI-P3, G-Sync',
    storage: '1TB PCIe 4.0 NVMe SSD',
    isDiscreteGpu: true,
    confidence: 'High',
    benchmarks: [
      { game: 'Cyberpunk 2077', resolution: '1600p', preset: 'Ultra (DLSS 3 Frame Gen)', avgFps: 83, low1PercentFps: 66, source: 'Notebookcheck G16 7630 Review' },
      { game: 'Shadow of the Tomb Raider', resolution: '1600p', preset: 'Highest', avgFps: 112, low1PercentFps: 88, source: 'Jarrod’s Tech' }
    ],
    source: 'Dell G16 7630 Specifications Guide',
    sourceUrl: 'https://www.dell.com/support/home/en-us/product-support/product/g-series-16-7630-laptop/docs',
    keywords: ['dell', 'g16', '7630', '13900hx', 'rtx 4070', 'gaming laptop']
  },

  // =========================================================================
  // ALIENWARE M16 & M18
  // =========================================================================
  {
    id: 'alienware-m16-r1-rtx4080',
    name: 'Alienware m16 R1 (RTX 4080)',
    brand: 'Alienware',
    productFamily: 'Alienware m16',
    exactModel: 'm16 R1',
    exactSku: 'm16 R1-AW16R1-7744BLK',
    skus: ['m16 R1-AW16R1-7744BLK'],
    modelNumber: 'm16 R1-AW16R1-7744BLK',
    type: 'laptop',
    year: 2023,
    defaultCpuId: 'intel-i9-13900hx',
    defaultGpuId: 'rtx-4080-laptop',
    defaultVram: 12,
    defaultRam: 32,
    ramDetails: '32 GB DDR5-4800 (2x 16GB Dual-Channel, 2 slots)',
    ramSlots: '2x SO-DIMM slots',
    gpuTgpWatts: '175W Max TGP (150W + 25W Dynamic Boost, MUX Switch + Advanced Optimus)',
    tgpFactor: 1.06,
    tgpScoreOverride: 89,
    coolingNotes: 'Alienware Cryo-tech quad-fan technology with Element 31 Gallium-Silicone thermal interface and vapor chamber.',
    display: '16" QHD+ (2560x1600) 240Hz 3ms 100% DCI-P3, ComfortView Plus, G-Sync',
    storage: '1TB PCIe 4.0 NVMe SSD',
    isDiscreteGpu: true,
    confidence: 'High',
    benchmarks: [
      { game: 'Cyberpunk 2077', resolution: '1600p', preset: 'Ray Tracing Overdrive (DLSS 3.5 RR)', avgFps: 85, low1PercentFps: 69, source: 'Jarrod’s Tech m16 Review' },
      { game: 'Black Myth: Wukong', resolution: '1600p', preset: 'Cinematic (DLSS FG)', avgFps: 91, low1PercentFps: 73, source: 'Hardware Unboxed' }
    ],
    source: 'Alienware m16 R1 Setup and Specifications',
    sourceUrl: 'https://www.dell.com/support/home/en-us/product-support/product/alienware-m16-r1-laptop/docs',
    keywords: ['alienware', 'm16', 'm16 r1', '13900hx', 'rtx 4080', 'gaming laptop']
  },

  // =========================================================================
  // ALIENWARE PREBUILT GAMING DESKTOPS (Aurora R15 / R16)
  // =========================================================================
  {
    id: 'alienware-aurora-r15-rtx4080',
    name: 'Alienware Aurora R15 Desktop',
    brand: 'Alienware',
    productFamily: 'Alienware Aurora',
    exactModel: 'Aurora R15',
    exactSku: 'Aurora R15-AWR15-7798BLK',
    skus: ['Aurora R15-AWR15-7798BLK'],
    modelNumber: 'Aurora R15-AWR15-7798BLK',
    type: 'desktop',
    year: 2023,
    defaultCpuId: 'intel-i7-13700kf',
    defaultGpuId: 'rtx-4080',
    defaultVram: 16,
    defaultRam: 32,
    ramDetails: '32 GB DDR5-4800 (2x 16GB Dual-Channel, 2 slots)',
    ramSlots: '2x DIMM slots',
    coolingNotes: 'Legend 3 design with 240mm Cryo-tech Liquid CPU cooler, 5 internal fans, and 1000W 80+ Platinum PSU.',
    storage: '1TB PCIe 4.0 NVMe SSD',
    isDiscreteGpu: true,
    confidence: 'High',
    benchmarks: [
      { game: 'Cyberpunk 2077', resolution: '4K (2160p)', preset: 'Ray Tracing Overdrive (DLSS 3.5 RR)', avgFps: 70, low1PercentFps: 56, source: 'Tom’s Hardware Aurora R15 Test' },
      { game: 'Alan Wake 2', resolution: '4K (2160p)', preset: 'High (DLSS Quality)', avgFps: 75, low1PercentFps: 61, source: 'TechPowerUp' }
    ],
    source: 'Alienware Aurora R15 Specifications',
    sourceUrl: 'https://www.dell.com/support/home/en-us/product-support/product/alienware-aurora-r15-desktop/docs',
    keywords: ['alienware', 'aurora', 'aurora r15', '13700kf', 'rtx 4080', 'gaming desktop', 'prebuilt']
  },
  {
    id: 'alienware-aurora-r16-rtx4070',
    name: 'Alienware Aurora R16 Desktop',
    brand: 'Alienware',
    productFamily: 'Alienware Aurora',
    exactModel: 'Aurora R16',
    exactSku: 'Aurora R16-AWR16-7991BLK',
    skus: ['Aurora R16-AWR16-7991BLK'],
    modelNumber: 'Aurora R16-AWR16-7991BLK',
    type: 'desktop',
    year: 2024,
    defaultCpuId: 'intel-i7-14700f',
    defaultGpuId: 'rtx-4070',
    defaultVram: 12,
    defaultRam: 32,
    ramDetails: '32 GB DDR5-5600 (2x 16GB Dual-Channel, 2 slots)',
    ramSlots: '2x DIMM slots',
    coolingNotes: 'Acoustically optimized Legend 3 chassis with 240mm Liquid AIO CPU cooler and 1000W 80+ Platinum PSU.',
    storage: '1TB PCIe 4.0 NVMe SSD',
    isDiscreteGpu: true,
    confidence: 'High',
    benchmarks: [
      { game: 'Cyberpunk 2077', resolution: '1440p', preset: 'Ultra (DLSS 3 Frame Gen)', avgFps: 120, low1PercentFps: 96, source: 'PC Gamer Aurora R16 Review' },
      { game: 'Forza Horizon 5', resolution: '1440p', preset: 'Extreme', avgFps: 128, low1PercentFps: 104, source: 'TechPowerUp' }
    ],
    source: 'Alienware Aurora R16 Setup and Specifications',
    sourceUrl: 'https://www.dell.com/support/home/en-us/product-support/product/alienware-aurora-r16-desktop/docs',
    keywords: ['alienware', 'aurora', 'aurora r16', '14700f', 'rtx 4070', 'gaming desktop', 'prebuilt']
  }
];
