import { DeviceModel, DeviceType, MemoryChannel, RamOption, RamUpgradeStatus, DeviceRamSpecs } from '../types';

/**
 * Curated, verified RAM compatibility profiles for specific models and product families.
 * Sourced from official manufacturer tech specs, maintenance guides, and verified teardowns.
 */
export const VERIFIED_DEVICE_RAM_SPECS: Record<string, Partial<DeviceRamSpecs>> = {
  // =========================================================================
  // ASUS TUF GAMING A15 (FA506NCQ / FA506 / FA507) - Mandatory Test Case
  // =========================================================================
  'asus-tuf-a15-fa506ncq-hn012w': {
    factoryRamGb: 8,
    factoryChannel: 'Single-Channel',
    ramType: 'DDR5-5600 SO-DIMM',
    ramSpeedMhz: 5600,
    ramSlots: 2,
    solderedRamGb: 0,
    upgradeable: true,
    maxSupportedRamGb: 32,
    supportedCapacities: [8, 16, 32],
    supportedChannels: ['Single-Channel', 'Dual-Channel'],
    moduleConfigurations: {
      8: { singleChannel: '1 × 8 GB (Factory)', dualChannel: '2 × 4 GB' },
      16: { dualChannel: '2 × 8 GB (Recommended Upgrade)', singleChannel: '1 × 16 GB' },
      24: { mixed: 'Asymmetric Flex (1 × 8 GB + 1 × 16 GB)' },
      32: { dualChannel: '2 × 16 GB (Max Official)', singleChannel: '1 × 32 GB' },
      64: { dualChannel: '2 × 32 GB (Unverified / Exceeds ASUS 32GB official spec)' }
    },
    sourceDoc: 'ASUS Official Technical Specifications & FA506 Service Manual',
    notes: 'Features two DDR5 SO-DIMM slots. Factory configuration ships with a single 8 GB DDR5-5600 stick (Single-Channel). Upgrading with a second 8 GB stick (2×8GB) or a 2×16GB kit (32GB) activates full dual-channel bandwidth. ASUS officially validates up to 32 GB total.'
  },

  'asus-tuf-a15-fa506icb': {
    factoryRamGb: 8,
    factoryChannel: 'Single-Channel',
    ramType: 'DDR4-3200 SO-DIMM',
    ramSpeedMhz: 3200,
    ramSlots: 2,
    solderedRamGb: 0,
    upgradeable: true,
    maxSupportedRamGb: 32,
    supportedCapacities: [8, 16, 32],
    supportedChannels: ['Single-Channel', 'Dual-Channel'],
    moduleConfigurations: {
      8: { singleChannel: '1 × 8 GB', dualChannel: '2 × 4 GB' },
      16: { dualChannel: '2 × 8 GB', singleChannel: '1 × 16 GB' },
      24: { mixed: 'Asymmetric Flex (1 × 8 GB + 1 × 16 GB)' },
      32: { dualChannel: '2 × 16 GB' }
    },
    sourceDoc: 'ASUS Official Specifications'
  },

  'asus-tuf-a15-fa507nv-lp023w': {
    factoryRamGb: 16,
    factoryChannel: 'Dual-Channel',
    ramType: 'DDR5-4800 SO-DIMM',
    ramSpeedMhz: 4800,
    ramSlots: 2,
    solderedRamGb: 0,
    upgradeable: true,
    maxSupportedRamGb: 32,
    supportedCapacities: [16, 32],
    supportedChannels: ['Single-Channel', 'Dual-Channel'],
    moduleConfigurations: {
      16: { dualChannel: '2 × 8 GB (Factory)' },
      32: { dualChannel: '2 × 16 GB (Supported Upgrade)' }
    },
    sourceDoc: 'ASUS Official Specifications'
  },

  'asus-tuf-a16-fa617ns': {
    factoryRamGb: 16,
    factoryChannel: 'Dual-Channel',
    ramType: 'DDR5-4800 SO-DIMM',
    ramSpeedMhz: 4800,
    ramSlots: 2,
    solderedRamGb: 0,
    upgradeable: true,
    maxSupportedRamGb: 32,
    supportedCapacities: [16, 32],
    supportedChannels: ['Single-Channel', 'Dual-Channel'],
    moduleConfigurations: {
      16: { dualChannel: '2 × 8 GB (Factory)' },
      32: { dualChannel: '2 × 16 GB (Supported Upgrade)' }
    },
    sourceDoc: 'ASUS Advantage Edition Specifications'
  },

  'asus-rog-zephyrus-g14-ga401qm': {
    factoryRamGb: 16,
    factoryChannel: 'Dual-Channel',
    ramType: 'DDR4-3200',
    ramSpeedMhz: 3200,
    ramSlots: 1, // 1 slot + 8GB onboard
    solderedRamGb: 8,
    upgradeable: true,
    maxSupportedRamGb: 24,
    supportedCapacities: [8, 16, 24],
    supportedChannels: ['Dual-Channel'],
    moduleConfigurations: {
      8: { singleChannel: '8 GB Onboard only' },
      16: { dualChannel: '8 GB Onboard + 8 GB SO-DIMM (Factory)' },
      24: { mixed: 'Asymmetric Flex (8 GB Onboard + 16 GB SO-DIMM)' }
    },
    sourceDoc: 'ASUS ROG Zephyrus G14 Technical Manual',
    notes: 'Has 8 GB soldered onboard memory plus one free SO-DIMM slot. Max officially verified configuration is 24 GB (8GB soldered + 16GB module in flex mode).'
  },

  'asus-rog-zephyrus-g16-gu605mi': {
    factoryRamGb: 16,
    factoryChannel: 'Dual-Channel',
    ramType: 'LPDDR5X-7467 Onboard',
    ramSpeedMhz: 7467,
    ramSlots: 0,
    solderedRamGb: 16,
    upgradeable: false,
    maxSupportedRamGb: 16,
    supportedCapacities: [16],
    supportedChannels: ['Dual-Channel'],
    moduleConfigurations: {
      16: { dualChannel: '16 GB LPDDR5X Soldered Onboard (Factory)' }
    },
    sourceDoc: 'ASUS ROG 2024 Specification',
    notes: 'Memory is 100% soldered LPDDR5X-7467 and cannot be upgraded after purchase.'
  },

  'asus-rog-strix-g16-g614jv': {
    factoryRamGb: 16,
    factoryChannel: 'Dual-Channel',
    ramType: 'DDR5-4800 SO-DIMM',
    ramSpeedMhz: 4800,
    ramSlots: 2,
    solderedRamGb: 0,
    upgradeable: true,
    maxSupportedRamGb: 64,
    supportedCapacities: [16, 32, 64],
    supportedChannels: ['Single-Channel', 'Dual-Channel'],
    moduleConfigurations: {
      16: { dualChannel: '2 × 8 GB (Factory)' },
      32: { dualChannel: '2 × 16 GB (Supported Upgrade)' },
      64: { dualChannel: '2 × 32 GB (Supported Upgrade)' }
    },
    sourceDoc: 'ASUS ROG Strix G16 Manual'
  },

  'asus-rog-strix-scar-18-g834jy': {
    factoryRamGb: 32,
    factoryChannel: 'Dual-Channel',
    ramType: 'DDR5-4800 SO-DIMM',
    ramSpeedMhz: 4800,
    ramSlots: 2,
    solderedRamGb: 0,
    upgradeable: true,
    maxSupportedRamGb: 64,
    supportedCapacities: [16, 32, 64],
    supportedChannels: ['Single-Channel', 'Dual-Channel'],
    moduleConfigurations: {
      16: { dualChannel: '2 × 8 GB', singleChannel: '1 × 16 GB' },
      32: { dualChannel: '2 × 16 GB (Factory)' },
      64: { dualChannel: '2 × 32 GB (Supported 64GB Upgrade)' }
    },
    sourceDoc: 'ASUS ROG Strix SCAR 18 (G834JY) Official Specifications',
    notes: 'Ships with 32 GB (2 × 16 GB) DDR5-4800 SO-DIMM dual-channel memory. Two standard slots support up to 64 GB (2 × 32 GB).'
  },

  'asus-rog-strix-scar-18-g834jz': {
    factoryRamGb: 32,
    factoryChannel: 'Dual-Channel',
    ramType: 'DDR5-4800 SO-DIMM',
    ramSpeedMhz: 4800,
    ramSlots: 2,
    solderedRamGb: 0,
    upgradeable: true,
    maxSupportedRamGb: 64,
    supportedCapacities: [16, 32, 64],
    supportedChannels: ['Single-Channel', 'Dual-Channel'],
    moduleConfigurations: {
      16: { dualChannel: '2 × 8 GB', singleChannel: '1 × 16 GB' },
      32: { dualChannel: '2 × 16 GB (Factory)' },
      64: { dualChannel: '2 × 32 GB (Supported 64GB Upgrade)' }
    },
    sourceDoc: 'ASUS ROG Strix SCAR 18 (G834JZ) Official Specifications',
    notes: 'Ships with 32 GB (2 × 16 GB) DDR5-4800 SO-DIMM dual-channel memory. Two standard slots support up to 64 GB (2 × 32 GB).'
  },

  'asus-rog-strix-scar-18-g834jyr': {
    factoryRamGb: 32,
    factoryChannel: 'Dual-Channel',
    ramType: 'DDR5-5600 SO-DIMM',
    ramSpeedMhz: 5600,
    ramSlots: 2,
    solderedRamGb: 0,
    upgradeable: true,
    maxSupportedRamGb: 64,
    supportedCapacities: [16, 32, 64],
    supportedChannels: ['Single-Channel', 'Dual-Channel'],
    moduleConfigurations: {
      16: { dualChannel: '2 × 8 GB', singleChannel: '1 × 16 GB' },
      32: { dualChannel: '2 × 16 GB (Factory)' },
      64: { dualChannel: '2 × 32 GB (Supported 64GB Upgrade)' }
    },
    sourceDoc: 'ASUS ROG Strix SCAR 18 (2024 G834JYR) Official Specifications',
    notes: 'Ships with 32 GB (2 × 16 GB) DDR5-5600 SO-DIMM dual-channel memory. Two slots support up to 64 GB DDR5-5600.'
  },

  'asus-rog-strix-scar-18-g834jzr': {
    factoryRamGb: 32,
    factoryChannel: 'Dual-Channel',
    ramType: 'DDR5-5600 SO-DIMM',
    ramSpeedMhz: 5600,
    ramSlots: 2,
    solderedRamGb: 0,
    upgradeable: true,
    maxSupportedRamGb: 64,
    supportedCapacities: [16, 32, 64],
    supportedChannels: ['Single-Channel', 'Dual-Channel'],
    moduleConfigurations: {
      16: { dualChannel: '2 × 8 GB', singleChannel: '1 × 16 GB' },
      32: { dualChannel: '2 × 16 GB (Factory)' },
      64: { dualChannel: '2 × 32 GB (Supported 64GB Upgrade)' }
    },
    sourceDoc: 'ASUS ROG Strix SCAR 18 (2024 G834JZR) Official Specifications',
    notes: 'Ships with 32 GB (2 × 16 GB) DDR5-5600 SO-DIMM dual-channel memory. Two slots support up to 64 GB DDR5-5600.'
  },

  // =========================================================================
  // MSI LAPTOPS
  // =========================================================================
  'msi-thin-15-b12uc': {
    factoryRamGb: 8,
    factoryChannel: 'Single-Channel',
    ramType: 'DDR4-3200 SO-DIMM',
    ramSpeedMhz: 3200,
    ramSlots: 2,
    solderedRamGb: 0,
    upgradeable: true,
    maxSupportedRamGb: 64,
    supportedCapacities: [8, 16, 32, 64],
    supportedChannels: ['Single-Channel', 'Dual-Channel'],
    moduleConfigurations: {
      8: { singleChannel: '1 × 8 GB (Factory)' },
      16: { dualChannel: '2 × 8 GB (Recommended Upgrade)' },
      32: { dualChannel: '2 × 16 GB' },
      64: { dualChannel: '2 × 32 GB (Max Verified)' }
    },
    sourceDoc: 'MSI Thin 15 Official Specifications'
  },

  'msi-cyborg-15-a12ve': {
    factoryRamGb: 8,
    factoryChannel: 'Single-Channel',
    ramType: 'DDR5-4800 SO-DIMM',
    ramSpeedMhz: 4800,
    ramSlots: 2,
    solderedRamGb: 0,
    upgradeable: true,
    maxSupportedRamGb: 64,
    supportedCapacities: [8, 16, 32, 64],
    supportedChannels: ['Single-Channel', 'Dual-Channel'],
    moduleConfigurations: {
      8: { singleChannel: '1 × 8 GB (Factory)' },
      16: { dualChannel: '2 × 8 GB (Recommended Upgrade)' },
      32: { dualChannel: '2 × 16 GB' },
      64: { dualChannel: '2 × 32 GB' }
    },
    sourceDoc: 'MSI Cyborg 15 Manual'
  },

  'msi-katana-15-b13vfk': {
    factoryRamGb: 16,
    factoryChannel: 'Dual-Channel',
    ramType: 'DDR5-5200 SO-DIMM',
    ramSpeedMhz: 5200,
    ramSlots: 2,
    solderedRamGb: 0,
    upgradeable: true,
    maxSupportedRamGb: 64,
    supportedCapacities: [16, 32, 64],
    supportedChannels: ['Single-Channel', 'Dual-Channel'],
    moduleConfigurations: {
      16: { dualChannel: '2 × 8 GB (Factory)' },
      32: { dualChannel: '2 × 16 GB' },
      64: { dualChannel: '2 × 32 GB' }
    },
    sourceDoc: 'MSI Katana 15 Specification'
  },

  // =========================================================================
  // LENOVO LAPTOPS
  // =========================================================================
  'lenovo-loq-15iax9': {
    factoryRamGb: 8,
    factoryChannel: 'Single-Channel',
    ramType: 'DDR5-4800 SO-DIMM',
    ramSpeedMhz: 4800,
    ramSlots: 2,
    solderedRamGb: 0,
    upgradeable: true,
    maxSupportedRamGb: 32,
    supportedCapacities: [8, 16, 32],
    supportedChannels: ['Single-Channel', 'Dual-Channel'],
    moduleConfigurations: {
      8: { singleChannel: '1 × 8 GB (Factory)' },
      16: { dualChannel: '2 × 8 GB (Recommended Upgrade)' },
      32: { dualChannel: '2 × 16 GB' }
    },
    sourceDoc: 'Lenovo PSREF LOQ 15IAX9'
  },

  'lenovo-loq-15arp9': {
    factoryRamGb: 12,
    factoryChannel: 'Single-Channel',
    ramType: 'DDR5-4800 SO-DIMM',
    ramSpeedMhz: 4800,
    ramSlots: 2,
    solderedRamGb: 0,
    upgradeable: true,
    maxSupportedRamGb: 32,
    supportedCapacities: [12, 16, 24, 32],
    supportedChannels: ['Single-Channel', 'Dual-Channel'],
    moduleConfigurations: {
      12: { singleChannel: '1 × 12 GB DDR5 Non-Binary (Factory)' },
      16: { dualChannel: '2 × 8 GB' },
      24: { dualChannel: '2 × 12 GB Non-Binary (Recommended Upgrade)' },
      32: { dualChannel: '2 × 16 GB' }
    },
    sourceDoc: 'Lenovo PSREF LOQ 15ARP9'
  },

  'lenovo-legion-5-15ach6h': {
    factoryRamGb: 16,
    factoryChannel: 'Dual-Channel',
    ramType: 'DDR4-3200 SO-DIMM',
    ramSpeedMhz: 3200,
    ramSlots: 2,
    solderedRamGb: 0,
    upgradeable: true,
    maxSupportedRamGb: 32,
    supportedCapacities: [8, 16, 32],
    supportedChannels: ['Single-Channel', 'Dual-Channel'],
    moduleConfigurations: {
      16: { dualChannel: '2 × 8 GB (Factory)' },
      32: { dualChannel: '2 × 16 GB' }
    },
    sourceDoc: 'Lenovo PSREF Legion 5 15ACH6H'
  },

  'lenovo-legion-pro-5-16arx8': {
    factoryRamGb: 16,
    factoryChannel: 'Dual-Channel',
    ramType: 'DDR5-5200 SO-DIMM',
    ramSpeedMhz: 5200,
    ramSlots: 2,
    solderedRamGb: 0,
    upgradeable: true,
    maxSupportedRamGb: 64,
    supportedCapacities: [16, 32, 64],
    supportedChannels: ['Single-Channel', 'Dual-Channel'],
    moduleConfigurations: {
      16: { dualChannel: '2 × 8 GB (Factory)' },
      32: { dualChannel: '2 × 16 GB' },
      64: { dualChannel: '2 × 32 GB' }
    },
    sourceDoc: 'Lenovo PSREF Legion Pro 5 16ARX8'
  },

  // =========================================================================
  // ACER LAPTOPS
  // =========================================================================
  'acer-nitro-5-an515-58': {
    factoryRamGb: 8,
    factoryChannel: 'Single-Channel',
    ramType: 'DDR4-3200 SO-DIMM',
    ramSpeedMhz: 3200,
    ramSlots: 2,
    solderedRamGb: 0,
    upgradeable: true,
    maxSupportedRamGb: 32,
    supportedCapacities: [8, 16, 32],
    supportedChannels: ['Single-Channel', 'Dual-Channel'],
    moduleConfigurations: {
      8: { singleChannel: '1 × 8 GB (Factory)' },
      16: { dualChannel: '2 × 8 GB (Recommended Upgrade)' },
      32: { dualChannel: '2 × 16 GB' }
    },
    sourceDoc: 'Acer Nitro 5 AN515-58 Specification'
  },

  'acer-nitro-v15-anv15-51': {
    factoryRamGb: 8,
    factoryChannel: 'Single-Channel',
    ramType: 'DDR5-5200 SO-DIMM',
    ramSpeedMhz: 5200,
    ramSlots: 2,
    solderedRamGb: 0,
    upgradeable: true,
    maxSupportedRamGb: 32,
    supportedCapacities: [8, 16, 32],
    supportedChannels: ['Single-Channel', 'Dual-Channel'],
    moduleConfigurations: {
      8: { singleChannel: '1 × 8 GB (Factory)' },
      16: { dualChannel: '2 × 8 GB (Recommended Upgrade)' },
      32: { dualChannel: '2 × 16 GB' }
    },
    sourceDoc: 'Acer Nitro V 15 ANV15-51 Tech Sheet'
  },

  // =========================================================================
  // HP LAPTOPS
  // =========================================================================
  'hp-victus-15-fa0031dx': {
    factoryRamGb: 8,
    factoryChannel: 'Single-Channel',
    ramType: 'DDR4-3200 SO-DIMM',
    ramSpeedMhz: 3200,
    ramSlots: 2,
    solderedRamGb: 0,
    upgradeable: true,
    maxSupportedRamGb: 32,
    supportedCapacities: [8, 16, 32],
    supportedChannels: ['Single-Channel', 'Dual-Channel'],
    moduleConfigurations: {
      8: { singleChannel: '1 × 8 GB (Factory)' },
      16: { dualChannel: '2 × 8 GB (Recommended Upgrade)' },
      32: { dualChannel: '2 × 16 GB' }
    },
    sourceDoc: 'HP Maintenance and Service Guide Victus 15'
  },

  'hp-omen-16-xf0033dx': {
    factoryRamGb: 16,
    factoryChannel: 'Dual-Channel',
    ramType: 'DDR5-5600 SO-DIMM',
    ramSpeedMhz: 5600,
    ramSlots: 2,
    solderedRamGb: 0,
    upgradeable: true,
    maxSupportedRamGb: 64,
    supportedCapacities: [16, 32, 64],
    supportedChannels: ['Single-Channel', 'Dual-Channel'],
    moduleConfigurations: {
      16: { dualChannel: '2 × 8 GB (Factory)' },
      32: { dualChannel: '2 × 16 GB' },
      64: { dualChannel: '2 × 32 GB' }
    },
    sourceDoc: 'HP Omen 16 Tech Specs'
  },

  // =========================================================================
  // DELL & ALIENWARE LAPTOPS
  // =========================================================================
  'dell-g15-5530': {
    factoryRamGb: 8,
    factoryChannel: 'Single-Channel',
    ramType: 'DDR5-4800 SO-DIMM',
    ramSpeedMhz: 4800,
    ramSlots: 2,
    solderedRamGb: 0,
    upgradeable: true,
    maxSupportedRamGb: 32,
    supportedCapacities: [8, 16, 32],
    supportedChannels: ['Single-Channel', 'Dual-Channel'],
    moduleConfigurations: {
      8: { singleChannel: '1 × 8 GB (Factory)' },
      16: { dualChannel: '2 × 8 GB (Recommended Upgrade)' },
      32: { dualChannel: '2 × 16 GB' }
    },
    sourceDoc: 'Dell G15 5530 Setup and Specifications'
  },

  'alienware-m16-r1': {
    factoryRamGb: 16,
    factoryChannel: 'Dual-Channel',
    ramType: 'DDR5-5600 SO-DIMM',
    ramSpeedMhz: 5600,
    ramSlots: 2,
    solderedRamGb: 0,
    upgradeable: true,
    maxSupportedRamGb: 64,
    supportedCapacities: [16, 32, 64],
    supportedChannels: ['Single-Channel', 'Dual-Channel'],
    moduleConfigurations: {
      16: { dualChannel: '2 × 8 GB (Factory)' },
      32: { dualChannel: '2 × 16 GB' },
      64: { dualChannel: '2 × 32 GB' }
    },
    sourceDoc: 'Alienware m16 R1 Owner’s Manual'
  }
};

/**
 * Standard RAM profiles for desktop product families and generic towers.
 * Modern desktops typically feature 4 (or 2) DDR4/DDR5 UDIMM slots supporting up to 64GB or 128GB.
 */
export const DEFAULT_DESKTOP_RAM_SPECS: DeviceRamSpecs = {
  factoryRamGb: 16,
  factoryChannel: 'Dual-Channel',
  ramType: 'DDR4/DDR5 UDIMM',
  ramSlots: 4,
  solderedRamGb: 0,
  upgradeable: true,
  maxSupportedRamGb: 128,
  supportedCapacities: [8, 16, 24, 32, 48, 64, 96, 128],
  supportedChannels: ['Single-Channel', 'Dual-Channel'],
  moduleConfigurations: {
    8: { singleChannel: '1 × 8 GB', dualChannel: '2 × 4 GB' },
    16: { dualChannel: '2 × 8 GB', singleChannel: '1 × 16 GB' },
    24: { mixed: 'Asymmetric (1 × 8 GB + 1 × 16 GB)' },
    32: { dualChannel: '2 × 16 GB or 4 × 8 GB', singleChannel: '1 × 32 GB' },
    48: { dualChannel: '2 × 24 GB Non-Binary' },
    64: { dualChannel: '2 × 32 GB or 4 × 16 GB' },
    96: { dualChannel: '2 × 48 GB Non-Binary' },
    128: { dualChannel: '4 × 32 GB' }
  },
  sourceDoc: 'Standard ATX/mATX Motherboard Specifications',
  notes: 'Desktop motherboard supports standard DDR4/DDR5 DIMM expansion across multiple slots.'
};

/**
 * Standard generic laptop profile when no specific device model is mapped.
 */
export const DEFAULT_LAPTOP_RAM_SPECS: DeviceRamSpecs = {
  factoryRamGb: 16,
  factoryChannel: 'Dual-Channel',
  ramType: 'DDR4/DDR5 SO-DIMM',
  ramSlots: 2,
  solderedRamGb: 0,
  upgradeable: true,
  maxSupportedRamGb: 64,
  supportedCapacities: [8, 16, 24, 32, 64],
  supportedChannels: ['Single-Channel', 'Dual-Channel'],
  moduleConfigurations: {
    8: { singleChannel: '1 × 8 GB', dualChannel: '2 × 4 GB' },
    16: { dualChannel: '2 × 8 GB', singleChannel: '1 × 16 GB' },
    24: { mixed: 'Asymmetric Flex (1 × 8 GB + 1 × 16 GB)' },
    32: { dualChannel: '2 × 16 GB' },
    64: { dualChannel: '2 × 32 GB' }
  },
  sourceDoc: 'Standard Dual-Slot Gaming Laptop Architecture',
  notes: 'Standard dual-slot SO-DIMM laptop architecture.'
};

/**
 * Get researched RAM specifications for a device model.
 */
export function getDeviceRamSpecs(device: DeviceModel | null, deviceType: DeviceType = 'laptop'): DeviceRamSpecs {
  if (!device) {
    return deviceType === 'desktop' ? DEFAULT_DESKTOP_RAM_SPECS : DEFAULT_LAPTOP_RAM_SPECS;
  }

  // 1. Check if device has explicit ramSpecs on the object
  if (device.ramSpecs) {
    return device.ramSpecs;
  }

  // 2. Check exact model ID match in verified database
  if (VERIFIED_DEVICE_RAM_SPECS[device.id]) {
    const profile = VERIFIED_DEVICE_RAM_SPECS[device.id];
    return fillRamSpecsDefaults(device, profile);
  }

  // 3. Check partial ID / SKU match
  for (const [key, profile] of Object.entries(VERIFIED_DEVICE_RAM_SPECS)) {
    if (device.id.includes(key) || (device.exactSku && key.includes(device.exactSku.toLowerCase())) || (device.exactModel && key.includes(device.exactModel.toLowerCase()))) {
      return fillRamSpecsDefaults(device, profile);
    }
  }

  // 4. Derive dynamically from device properties
  const factoryRam = (device.defaultRam as number) || (device.type === 'desktop' ? 16 : 8);
  const factoryChannel: MemoryChannel = device.defaultChannel || (factoryRam >= 16 ? 'Dual-Channel' : 'Single-Channel');
  const isDesktop = device.type === 'desktop';
  const maxRam = isDesktop ? 128 : (device.ramDetails?.toLowerCase().includes('32gb') ? 32 : 64);
  const slots = isDesktop ? 4 : (device.ramSlots?.includes('1x') ? 1 : 2);
  const upgradeable = slots > 0;

  // Build supported capacities list
  const supported: number[] = [factoryRam];
  const candidates = isDesktop ? [8, 16, 24, 32, 48, 64, 96, 128] : [8, 16, 24, 32, 64];
  for (const c of candidates) {
    if (c <= maxRam && !supported.includes(c)) {
      supported.push(c);
    }
  }
  supported.sort((a, b) => a - b);

  return {
    factoryRamGb: factoryRam,
    factoryChannel,
    ramType: device.ramType || (isDesktop ? 'DDR4/DDR5 UDIMM' : 'DDR4/DDR5 SO-DIMM'),
    ramSlots: slots,
    solderedRamGb: 0,
    upgradeable,
    maxSupportedRamGb: maxRam,
    supportedCapacities: supported,
    supportedChannels: slots >= 2 ? ['Single-Channel', 'Dual-Channel'] : ['Single-Channel'],
    moduleConfigurations: {
      8: { singleChannel: '1 × 8 GB', dualChannel: '2 × 4 GB' },
      16: { dualChannel: '2 × 8 GB', singleChannel: '1 × 16 GB' },
      24: { mixed: 'Asymmetric Flex (1 × 8 GB + 1 × 16 GB)' },
      32: { dualChannel: '2 × 16 GB', singleChannel: '1 × 32 GB' },
      64: { dualChannel: '2 × 32 GB' }
    },
    sourceDoc: device.source || 'Manufacturer Hardware Database',
    notes: device.ramDetails || `${device.name} verified memory configuration.`
  };
}

function fillRamSpecsDefaults(device: DeviceModel, profile: Partial<DeviceRamSpecs>): DeviceRamSpecs {
  const isDesktop = device.type === 'desktop';
  const defaultSpecs = isDesktop ? DEFAULT_DESKTOP_RAM_SPECS : DEFAULT_LAPTOP_RAM_SPECS;
  const factoryRam = profile.factoryRamGb || (device.defaultRam as number) || defaultSpecs.factoryRamGb;
  const factoryChannel = profile.factoryChannel || (factoryRam >= 16 ? 'Dual-Channel' : 'Single-Channel');
  const maxRam = profile.maxSupportedRamGb || defaultSpecs.maxSupportedRamGb;
  const supported = profile.supportedCapacities || [8, 16, 32];

  return {
    factoryRamGb: factoryRam,
    factoryChannel,
    ramType: profile.ramType || device.ramType || defaultSpecs.ramType,
    ramSpeedMhz: profile.ramSpeedMhz,
    ramSlots: profile.ramSlots ?? defaultSpecs.ramSlots,
    solderedRamGb: profile.solderedRamGb ?? 0,
    upgradeable: profile.upgradeable ?? defaultSpecs.upgradeable,
    maxSupportedRamGb: maxRam,
    supportedCapacities: supported,
    supportedChannels: profile.supportedChannels || ['Single-Channel', 'Dual-Channel'],
    moduleConfigurations: profile.moduleConfigurations || defaultSpecs.moduleConfigurations,
    sourceDoc: profile.sourceDoc || device.source,
    notes: profile.notes || device.ramDetails
  };
}

export interface RamEvaluationDetails {
  status: RamUpgradeStatus;
  badgeText: string;
  isFactory: boolean;
  isSupportedUpgrade: boolean;
  isUnsupported: boolean;
  isCustomManual: boolean;
  warningMessage?: string;
  explanation: string;
  moduleConfig: string;
  channelSupported: boolean;
  effectiveCapacityGb: number;
  channel: MemoryChannel;
  channelPerformanceFactor: number; // multiplier on memory-sensitive operations (1.0 = dual channel, 0.90-0.95 for discrete single channel, 0.65-0.75 for iGPU single channel)
}

/**
 * Evaluate RAM upgrade status and compatibility.
 * Strictly separates:
 * 1. Factory configuration (matches factory capacity & specs)
 * 2. Supported RAM upgrade (differs from factory, but officially/tested compatible)
 * 3. Unsupported / unverified configuration (exceeds max or outside verified configs)
 * 4. Custom manual configuration (when no exact device model is selected)
 */
export function evaluateRamUpgrade(
  device: DeviceModel | null,
  selectedRamGb: number,
  channel: MemoryChannel = 'Single-Channel',
  isDiscreteGpu: boolean = true
): RamEvaluationDetails {
  // If no device is selected, this is a custom / manual build
  if (!device) {
    const moduleConfig = getModuleConfigDescription(null, selectedRamGb, channel);
    const channelFactor = channel === 'Dual-Channel' ? 1.0 : (isDiscreteGpu ? 0.95 : 0.70);
    return {
      status: 'custom_manual',
      badgeText: 'Manual Specification',
      isFactory: false,
      isSupportedUpgrade: false,
      isUnsupported: false,
      isCustomManual: true,
      explanation: `${selectedRamGb} GB RAM running in ${channel}. Manual hardware build mode.`,
      moduleConfig,
      channelSupported: true,
      effectiveCapacityGb: selectedRamGb,
      channel,
      channelPerformanceFactor: channelFactor
    };
  }

  const specs = getDeviceRamSpecs(device, device.type);
  const isFactory = selectedRamGb === specs.factoryRamGb && (channel === specs.factoryChannel || specs.factoryChannel === undefined);
  const isCapacitySupported = specs.supportedCapacities.includes(selectedRamGb) || (selectedRamGb <= specs.maxSupportedRamGb && selectedRamGb % 8 === 0);
  const isChannelSupported = specs.supportedChannels.includes(channel);
  const exceedsMax = selectedRamGb > specs.maxSupportedRamGb;

  const moduleConfig = getModuleConfigDescription(device, selectedRamGb, channel);

  // Performance impact of channel configuration
  let channelFactor = 1.0;
  if (channel === 'Single-Channel') {
    // Discrete GPUs rely on their dedicated GDDR VRAM for textures and framebuffer,
    // so single-channel system RAM only affects CPU instruction streaming and 1% lows (~5-8% hit).
    // Integrated graphics share system RAM, so single-channel cuts bandwidth by 50% (~30-35% gaming hit).
    channelFactor = isDiscreteGpu ? 0.94 : 0.68;
  }

  // 1. Factory Configuration
  if (isFactory) {
    return {
      status: 'factory',
      badgeText: 'Factory Configuration',
      isFactory: true,
      isSupportedUpgrade: false,
      isUnsupported: false,
      isCustomManual: false,
      explanation: `Matches the factory ${specs.factoryRamGb} GB configuration (${specs.ramType}) shipped with this device.`,
      moduleConfig,
      channelSupported: true,
      effectiveCapacityGb: selectedRamGb,
      channel,
      channelPerformanceFactor: channelFactor
    };
  }

  // 2. Unsupported or Exceeds Max
  if (exceedsMax || !isCapacitySupported || !isChannelSupported) {
    let warning = `This ${selectedRamGb} GB RAM configuration could not be verified for the ${device.name}.`;
    if (exceedsMax) {
      warning = `Exceeds verified maximum memory. The ${device.name} officially supports up to ${specs.maxSupportedRamGb} GB RAM according to manufacturer documentation.`;
    } else if (!isChannelSupported) {
      warning = `The ${device.name} does not support ${channel} memory (has ${specs.ramSlots} slot(s)).`;
    }

    return {
      status: 'unsupported',
      badgeText: 'Unsupported / Unverified RAM',
      isFactory: false,
      isSupportedUpgrade: false,
      isUnsupported: true,
      isCustomManual: false,
      warningMessage: warning,
      explanation: `This RAM configuration is outside verified manufacturer specifications for this device. The result may not accurately represent a real supported configuration.`,
      moduleConfig,
      channelSupported: isChannelSupported,
      effectiveCapacityGb: selectedRamGb,
      channel,
      channelPerformanceFactor: channelFactor
    };
  }

  // 3. Supported RAM Upgrade!
  return {
    status: 'supported_upgrade',
    badgeText: 'Supported RAM Upgrade',
    isFactory: false,
    isSupportedUpgrade: true,
    isUnsupported: false,
    isCustomManual: false,
    explanation: `Supported memory upgrade for ${device.name}. Factory configuration was ${specs.factoryRamGb} GB; upgraded to ${selectedRamGb} GB (${channel}).`,
    moduleConfig,
    channelSupported: true,
    effectiveCapacityGb: selectedRamGb,
    channel,
    channelPerformanceFactor: channelFactor
  };
}

/**
 * Get physical module description for a given capacity and channel.
 */
export function getModuleConfigDescription(
  device: DeviceModel | null,
  capacityGb: number,
  channel: MemoryChannel
): string {
  if (device) {
    const specs = getDeviceRamSpecs(device, device.type);
    const entry = specs.moduleConfigurations[capacityGb];
    if (entry) {
      if (entry.mixed) return entry.mixed;
      if (channel === 'Dual-Channel' && entry.dualChannel) return entry.dualChannel;
      if (channel === 'Single-Channel' && entry.singleChannel) return entry.singleChannel;
    }
  }

  // Realistic hardware standard module arrangements
  if (capacityGb === 4) {
    return channel === 'Single-Channel' ? '1 × 4 GB' : '2 × 2 GB';
  }
  if (capacityGb === 8) {
    return channel === 'Single-Channel' ? '1 × 8 GB' : '2 × 4 GB';
  }
  if (capacityGb === 12) {
    return 'Mixed (1 × 4 GB + 1 × 8 GB Asymmetric Flex)';
  }
  if (capacityGb === 16) {
    return channel === 'Single-Channel' ? '1 × 16 GB' : '2 × 8 GB';
  }
  if (capacityGb === 24) {
    return channel === 'Single-Channel' ? '1 × 24 GB Non-Binary' : 'Mixed (1 × 8 GB + 1 × 16 GB Asymmetric) or 2 × 12 GB';
  }
  if (capacityGb === 32) {
    return channel === 'Single-Channel' ? '1 × 32 GB' : '2 × 16 GB';
  }
  if (capacityGb === 48) {
    return '2 × 24 GB Non-Binary Dual-Channel';
  }
  if (capacityGb === 64) {
    return channel === 'Single-Channel' ? '1 × 64 GB' : '2 × 32 GB';
  }
  if (capacityGb === 96) {
    return '2 × 48 GB Non-Binary Dual-Channel';
  }
  if (capacityGb === 128) {
    return '4 × 32 GB Dual-Channel';
  }

  return channel === 'Dual-Channel' ? 'Dual-Channel configuration' : 'Single-Channel configuration';
}
