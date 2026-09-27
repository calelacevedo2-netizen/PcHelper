import { DeviceModel } from '../../types';

/**
 * Gigabyte, Razer, and Corsair Gaming Devices Database
 * Covers Gigabyte G5 (KD/KF/MF), Aorus 15/17, Razer Blade 14/15/16/18,
 * and Corsair Vengeance prebuilt gaming towers.
 * 
 * Sources: Gigabyte Official Tech Specs, Razer Technical Specifications,
 * Corsair Product Guides, Notebookcheck, Jarrod’s Tech.
 */
export const OTHER_BRANDS_DEVICES: DeviceModel[] = [
  // =========================================================================
  // GIGABYTE G5 & AORUS
  // =========================================================================
  {
    id: 'gigabyte-g5-kd',
    name: 'Gigabyte G5 KD (RTX 3060)',
    brand: 'Gigabyte',
    productFamily: 'Gigabyte G5',
    exactModel: 'G5 KD',
    exactSku: 'KD-52US123SO',
    skus: ['KD-52US123SO'],
    modelNumber: 'G5 KD-52US123SO',
    type: 'laptop',
    year: 2021,
    defaultCpuId: 'intel-i5-11400h',
    defaultGpuId: 'rtx-3060-laptop',
    defaultVram: 6,
    defaultRam: 16,
    ramDetails: '16 GB DDR4-3200 (2x 8GB Dual-Channel, 2 slots up to 64GB)',
    ramSlots: '2x SO-DIMM slots',
    gpuTgpWatts: '105W Max TGP (with Dynamic Boost)',
    tgpFactor: 1.0,
    coolingNotes: 'WINDFORCE cooling system with 2x 59-blade fans and 4 heatpipes.',
    display: '15.6" FHD (1920x1080) 144Hz IPS-level',
    storage: '512GB PCIe 3.0 NVMe SSD',
    isDiscreteGpu: true,
    confidence: 'High',
    benchmarks: [
      { game: 'Cyberpunk 2077', resolution: '1080p', preset: 'Ultra (DLSS Quality)', avgFps: 65, low1PercentFps: 52, source: 'Jarrod’s Tech Gigabyte G5 Review' },
      { game: 'Shadow of the Tomb Raider', resolution: '1080p', preset: 'Highest', avgFps: 88, low1PercentFps: 70, source: 'Notebookcheck' }
    ],
    source: 'Gigabyte G5 KD Specifications Sheet',
    sourceUrl: 'https://www.gigabyte.com/Laptop/G5--Intel-11th-Gen',
    keywords: ['gigabyte', 'g5', 'g5 kd', '11400h', 'rtx 3060', 'gaming laptop']
  },
  {
    id: 'gigabyte-g5-kf',
    name: 'Gigabyte G5 KF (RTX 4060)',
    brand: 'Gigabyte',
    productFamily: 'Gigabyte G5',
    exactModel: 'G5 KF',
    exactSku: 'KF-E3US333SH',
    skus: ['KF-E3US333SH'],
    modelNumber: 'G5 KF-E3US333SH',
    type: 'laptop',
    year: 2023,
    defaultCpuId: 'intel-i5-12500h',
    defaultGpuId: 'rtx-4060-laptop',
    defaultVram: 8,
    defaultRam: 8,
    ramDetails: '8 GB DDR4-3200 (1x 8GB Single-Channel, 2 slots up to 64GB)',
    ramSlots: '2x SO-DIMM slots (1 free)',
    gpuTgpWatts: '75W Max TGP (with Dynamic Boost, MUX Switch)',
    tgpFactor: 0.95,
    tgpScoreOverride: 56,
    coolingNotes: 'WINDFORCE cooling system with dual fans and 4 heatpipes. Capped to 75W TGP.',
    display: '15.6" FHD (1920x1080) 144Hz IPS-level',
    storage: '512GB PCIe 4.0 NVMe SSD',
    isDiscreteGpu: true,
    confidence: 'High',
    benchmarks: [
      { game: 'Cyberpunk 2077', resolution: '1080p', preset: 'Ultra (DLSS 3 Frame Gen)', avgFps: 82, low1PercentFps: 65, source: 'Notebookcheck G5 KF Review' },
      { game: 'Forza Horizon 5', resolution: '1080p', preset: 'Extreme', avgFps: 85, low1PercentFps: 70, source: 'Jarrod’s Tech' }
    ],
    source: 'Gigabyte G5 KF Technical Specifications',
    sourceUrl: 'https://www.gigabyte.com/Laptop/G5--2023',
    keywords: ['gigabyte', 'g5', 'g5 kf', '12500h', 'rtx 4060', 'gaming laptop']
  },
  {
    id: 'gigabyte-aorus-15-bsf',
    name: 'Gigabyte Aorus 15 BSF (RTX 4070)',
    brand: 'Gigabyte',
    productFamily: 'Aorus 15',
    exactModel: 'Aorus 15 BSF',
    exactSku: 'BSF-73US754SH',
    skus: ['BSF-73US754SH'],
    modelNumber: 'Aorus 15 BSF-73US754SH',
    type: 'laptop',
    year: 2023,
    defaultCpuId: 'intel-i7-13700h',
    defaultGpuId: 'rtx-4070-laptop',
    defaultVram: 8,
    defaultRam: 16,
    ramDetails: '16 GB DDR5-4800 (2x 8GB Dual-Channel, 2 slots)',
    ramSlots: '2x SO-DIMM slots',
    gpuTgpWatts: '140W Max TGP (with Dynamic Boost, MUX Switch)',
    tgpFactor: 1.05,
    tgpScoreOverride: 75,
    coolingNotes: 'WINDFORCE Infinity thermal system with 5 heatpipes and full 140W maximum power budget.',
    display: '15.6" QHD (2560x1440) 165Hz IPS 100% DCI-P3, G-Sync',
    storage: '1TB PCIe 4.0 NVMe SSD',
    isDiscreteGpu: true,
    confidence: 'High',
    benchmarks: [
      { game: 'Cyberpunk 2077', resolution: '1440p', preset: 'Ultra (DLSS 3 Frame Gen)', avgFps: 81, low1PercentFps: 65, source: 'Notebookcheck Aorus 15 Review' },
      { game: 'Black Myth: Wukong', resolution: '1440p', preset: 'Medium (DLSS FG)', avgFps: 68, low1PercentFps: 54, source: 'Hardware Unboxed' }
    ],
    source: 'Gigabyte Aorus 15 BSF Technical Sheet',
    sourceUrl: 'https://www.gigabyte.com/Laptop/AORUS-15--2023',
    keywords: ['gigabyte', 'aorus', 'aorus 15', 'bsf', '13700h', 'rtx 4070', 'gaming laptop']
  },

  // =========================================================================
  // RAZER BLADE (14 / 15 / 16 / 18)
  // =========================================================================
  {
    id: 'razer-blade-14-2023-4070',
    name: 'Razer Blade 14 (2023 - RTX 4070)',
    brand: 'Razer',
    productFamily: 'Razer Blade 14',
    exactModel: 'Blade 14 (2023)',
    exactSku: 'RZ09-0482',
    skus: ['RZ09-0482'],
    modelNumber: 'RZ09-0482',
    type: 'laptop',
    year: 2023,
    defaultCpuId: 'amd-ryzen-9-7940hs',
    defaultGpuId: 'rtx-4070-laptop',
    defaultVram: 8,
    defaultRam: 16,
    ramDetails: '16 GB DDR5-5600 (2x 8GB Dual-Channel, 2 slots up to 64GB - first upgradeable Blade 14)',
    ramSlots: '2x SO-DIMM slots',
    gpuTgpWatts: '140W Max TGP (with Dynamic Boost, MUX Switch + Advanced Optimus)',
    tgpFactor: 1.05,
    tgpScoreOverride: 75,
    coolingNotes: 'Next-gen dual vapor chamber with server-grade thermal graphite material in CNC aluminum chassis.',
    display: '14" QHD+ (2560x1600, 16:10) 240Hz IPS 100% DCI-P3 500 nits, G-Sync',
    storage: '1TB PCIe 4.0 NVMe SSD',
    isDiscreteGpu: true,
    confidence: 'High',
    benchmarks: [
      { game: 'Cyberpunk 2077', resolution: '1600p', preset: 'Ultra (DLSS 3 Frame Gen)', avgFps: 80, low1PercentFps: 64, source: 'Dave2D Blade 14 Review' },
      { game: 'Forza Horizon 5', resolution: '1600p', preset: 'Extreme', avgFps: 88, low1PercentFps: 73, source: 'Notebookcheck' }
    ],
    source: 'Razer Blade 14 2023 Official Technical Specifications',
    sourceUrl: 'https://www.razer.com/gaming-laptops/razer-blade-14',
    keywords: ['razer', 'blade', 'blade 14', 'rz09-0482', '7940hs', 'rtx 4070', 'gaming laptop']
  },
  {
    id: 'razer-blade-16-2023-4080',
    name: 'Razer Blade 16 (2023 - RTX 4080)',
    brand: 'Razer',
    productFamily: 'Razer Blade 16',
    exactModel: 'Blade 16 (2023)',
    exactSku: 'RZ09-0483',
    skus: ['RZ09-0483'],
    modelNumber: 'RZ09-0483',
    type: 'laptop',
    year: 2023,
    defaultCpuId: 'intel-i9-13950hx',
    defaultGpuId: 'rtx-4080-laptop',
    defaultVram: 12,
    defaultRam: 32,
    ramDetails: '32 GB DDR5-5600 (2x 16GB Dual-Channel, 2 slots up to 64GB)',
    ramSlots: '2x SO-DIMM slots',
    gpuTgpWatts: '175W Max TGP (150W + 25W Dynamic Boost, MUX Switch)',
    tgpFactor: 1.06,
    tgpScoreOverride: 89,
    coolingNotes: 'Patented full-board vapor chamber with 0.05mm exhaust fins and dual 44-blade fans.',
    display: '16" Dual-Mode Mini-LED (UHD+ 120Hz or FHD+ 240Hz) 1000 nits 100% DCI-P3, HDR1000, G-Sync',
    storage: '1TB PCIe 4.0 NVMe SSD',
    isDiscreteGpu: true,
    confidence: 'High',
    benchmarks: [
      { game: 'Cyberpunk 2077', resolution: '1600p', preset: 'Ray Tracing Overdrive (DLSS 3.5 RR)', avgFps: 83, low1PercentFps: 66, source: 'Notebookcheck Blade 16 Review' },
      { game: 'Alan Wake 2', resolution: '1600p', preset: 'High (DLSS Quality)', avgFps: 92, low1PercentFps: 74, source: 'Jarrod’s Tech' }
    ],
    source: 'Razer Blade 16 Specifications',
    sourceUrl: 'https://www.razer.com/gaming-laptops/razer-blade-16',
    keywords: ['razer', 'blade', 'blade 16', 'rz09-0483', '13950hx', 'rtx 4080', 'gaming laptop']
  },

  // =========================================================================
  // CORSAIR PREBUILT GAMING TOWERS (Vengeance)
  // =========================================================================
  {
    id: 'corsair-vengeance-a7200',
    name: 'Corsair Vengeance a7200 Desktop',
    brand: 'Corsair',
    productFamily: 'Corsair Vengeance',
    exactModel: 'a7200',
    exactSku: 'CS-9050011-NA',
    skus: ['CS-9050011-NA'],
    modelNumber: 'CS-9050011-NA',
    type: 'desktop',
    year: 2021,
    defaultCpuId: 'amd-ryzen-7-5800x',
    defaultGpuId: 'rtx-3070',
    defaultVram: 8,
    defaultRam: 16,
    ramDetails: '16 GB Corsair Vengeance RGB PRO DDR4-3200 (2x 8GB Dual-Channel, 4 slots)',
    ramSlots: '4x DIMM slots',
    coolingNotes: 'Corsair H100i RGB PRO XT 240mm Liquid CPU cooler, 4000D Airflow case, 750W 80+ Gold PSU.',
    storage: '1TB M.2 PCIe NVMe SSD + 2TB HDD',
    isDiscreteGpu: true,
    confidence: 'High',
    benchmarks: [
      { game: 'Cyberpunk 2077', resolution: '1440p', preset: 'Ultra (DLSS Quality)', avgFps: 76, low1PercentFps: 61, source: 'Tom’s Hardware Vengeance Review' },
      { game: 'Forza Horizon 5', resolution: '1440p', preset: 'Extreme', avgFps: 90, low1PercentFps: 74, source: 'PC Gamer' }
    ],
    source: 'Corsair Vengeance a7200 Technical Specifications',
    sourceUrl: 'https://www.corsair.com/us/en/p/gaming-computers/cs-9050011-na/vengeance-a7200-gaming-pc',
    keywords: ['corsair', 'vengeance', 'a7200', '5800x', 'rtx 3070', 'gaming desktop', 'prebuilt']
  },
  {
    id: 'corsair-vengeance-i7400',
    name: 'Corsair Vengeance i7400 Desktop',
    brand: 'Corsair',
    productFamily: 'Corsair Vengeance',
    exactModel: 'i7400',
    exactSku: 'CS-9050047-NA',
    skus: ['CS-9050047-NA'],
    modelNumber: 'CS-9050047-NA',
    type: 'desktop',
    year: 2023,
    defaultCpuId: 'intel-i7-13700k',
    defaultGpuId: 'rtx-4070-ti',
    defaultVram: 12,
    defaultRam: 32,
    ramDetails: '32 GB Corsair Vengeance RGB DDR5-5600 (2x 16GB Dual-Channel, 4 slots)',
    ramSlots: '4x DIMM slots',
    coolingNotes: 'Corsair H100i ELITE CAPELLIX XT Liquid CPU cooler, 4000D Airflow case, 850W 80+ Gold PSU.',
    storage: '1TB M.2 PCIe 4.0 NVMe SSD',
    isDiscreteGpu: true,
    confidence: 'High',
    benchmarks: [
      { game: 'Cyberpunk 2077', resolution: '1440p', preset: 'Ray Tracing Ultra (DLSS 3 FG)', avgFps: 108, low1PercentFps: 86, source: 'Tom’s Hardware i7400 Test' },
      { game: 'Alan Wake 2', resolution: '1440p', preset: 'High (DLSS Quality)', avgFps: 86, low1PercentFps: 70, source: 'TechPowerUp' }
    ],
    source: 'Corsair Vengeance i7400 Technical Specifications',
    sourceUrl: 'https://www.corsair.com/us/en/p/gaming-computers/cs-9050047-na/vengeance-i7400-gaming-pc',
    keywords: ['corsair', 'vengeance', 'i7400', '13700k', 'rtx 4070 ti', 'gaming desktop', 'prebuilt']
  }
];
