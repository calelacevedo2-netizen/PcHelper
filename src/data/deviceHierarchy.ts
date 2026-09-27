import { DeviceModel, DeviceType } from '../types';
import { DEVICES_DATABASE } from './devices';
import { CPUS_DATABASE } from './cpus';
import { GPUS_DATABASE } from './gpus';

export interface ExactModelItem {
  id: string; // e.g. "FA506NCQ"
  displayName: string; // e.g. "FA506NCQ"
  productFamilyId: string;
  productFamilyName: string;
  brand: string;
  type: DeviceType;
  primaryDevice: DeviceModel;
  configurations: DeviceModel[];
  skus: string[];
  cpuName: string;
  gpuName: string;
  vram: number;
  ram: number;
  ramType?: string;
  gpuTgpWatts?: string;
  display?: string;
  coolingNotes?: string;
  year?: number;
  searchTokens: string[];
}

export interface ProductFamilyItem {
  id: string; // e.g. "asus-tuf-gaming-a15"
  displayName: string; // e.g. "ASUS TUF Gaming A15"
  brand: string; // e.g. "ASUS"
  type: DeviceType; // "laptop" | "desktop"
  modelCount: number;
  sampleModels: string[];
  devices: DeviceModel[];
  exactModels: ExactModelItem[];
  searchTokens: string[];
}

/**
 * Format a unified product family display name.
 * Handles cases where brand is already included or separated.
 */
function formatFamilyDisplayName(brand: string, family: string, type: DeviceType): string {
  const cleanBrand = brand.trim();
  const cleanFamily = family.trim();

  // Desktop specific overrides matching user instructions
  if (type === 'desktop') {
    if (cleanFamily.toLowerCase().includes('rog')) return 'ASUS ROG Gaming Desktop';
    if (cleanFamily.toLowerCase().includes('tuf')) return 'ASUS TUF Gaming Desktop';
    if (cleanFamily.toLowerCase().includes('codex')) return 'MSI MAG Codex';
    if (cleanFamily.toLowerCase().includes('infinite')) return 'MSI MAG Infinite';
    if (cleanFamily.toLowerCase().includes('aegis')) return 'MSI Aegis';
    if (cleanFamily.toLowerCase().includes('legion tower')) return 'Lenovo Legion Tower';
    if (cleanFamily.toLowerCase().includes('omen')) return 'HP Omen Desktop';
    if (cleanFamily.toLowerCase().includes('victus')) return 'HP Victus Desktop';
    if (cleanFamily.toLowerCase().includes('nitro')) return 'Acer Nitro Desktop';
    if (cleanFamily.toLowerCase().includes('orion')) return 'Acer Predator Orion';
    if (cleanFamily.toLowerCase().includes('aurora')) return 'Alienware Aurora';
    if (cleanFamily.toLowerCase().includes('vengeance')) return 'Corsair Vengeance';
  }

  // If family already starts with brand, return as is
  if (cleanFamily.toLowerCase().startsWith(cleanBrand.toLowerCase())) {
    return cleanFamily;
  }

  // Prepend brand for cleaner product family naming (e.g., ASUS TUF Gaming A15, MSI Thin 15)
  return `${cleanBrand} ${cleanFamily}`;
}

/**
 * Extract clean exact model identifier from a DeviceModel.
 */
function extractExactModelIdentifier(device: DeviceModel): string {
  if (device.exactModel && device.exactModel.trim().length > 0) {
    return device.exactModel.trim();
  }

  // Fallback to modelNumber base before hyphen
  if (device.modelNumber) {
    const parts = device.modelNumber.split('-');
    if (parts.length > 0 && parts[0].trim().length > 0) {
      return parts[0].trim();
    }
  }

  // Fallback: extract from name
  const parenMatch = device.name.match(/\(([^)]+)\)/);
  if (parenMatch) {
    const inside = parenMatch[1].split('-')[0].trim();
    if (inside.length > 0) return inside;
  }

  return device.productFamily;
}

/**
 * Build the hierarchical index of all devices in the database.
 */
function buildDeviceHierarchy(): { laptops: ProductFamilyItem[]; desktops: ProductFamilyItem[] } {
  const familiesMap = new Map<string, {
    id: string;
    displayName: string;
    brand: string;
    type: DeviceType;
    devices: DeviceModel[];
  }>();

  for (const device of DEVICES_DATABASE) {
    const type = device.type || 'laptop';
    const displayName = formatFamilyDisplayName(device.brand, device.productFamily, type);
    const familyId = `${type}-${displayName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

    if (!familiesMap.has(familyId)) {
      familiesMap.set(familyId, {
        id: familyId,
        displayName,
        brand: device.brand,
        type,
        devices: []
      });
    }

    familiesMap.get(familyId)!.devices.push(device);
  }

  const laptops: ProductFamilyItem[] = [];
  const desktops: ProductFamilyItem[] = [];

  for (const [, fam] of familiesMap) {
    // Group devices by exact model identifier
    const exactModelMap = new Map<string, DeviceModel[]>();

    for (const dev of fam.devices) {
      const modelId = extractExactModelIdentifier(dev);
      if (!exactModelMap.has(modelId)) {
        exactModelMap.set(modelId, []);
      }
      exactModelMap.get(modelId)!.push(dev);
    }

    const exactModels: ExactModelItem[] = [];

    for (const [modelId, devs] of exactModelMap) {
      const primaryDevice = devs[0];
      const cpu = CPUS_DATABASE.find(c => c.id === primaryDevice.defaultCpuId);
      const gpu = GPUS_DATABASE.find(g => g.id === primaryDevice.defaultGpuId);

      const allSkus: string[] = [];
      for (const d of devs) {
        if (d.exactSku) allSkus.push(d.exactSku);
        if (d.skus) {
          for (const s of d.skus) {
            if (!allSkus.includes(s)) allSkus.push(s);
          }
        }
      }

      const searchTokens = [
        modelId.toLowerCase(),
        ...allSkus.map(s => s.toLowerCase()),
        (cpu?.name || '').toLowerCase(),
        (gpu?.name || '').toLowerCase()
      ];

      exactModels.push({
        id: modelId,
        displayName: modelId,
        productFamilyId: fam.id,
        productFamilyName: fam.displayName,
        brand: fam.brand,
        type: fam.type,
        primaryDevice,
        configurations: devs,
        skus: allSkus,
        cpuName: cpu?.name || primaryDevice.defaultCpuId,
        gpuName: gpu?.name || primaryDevice.defaultGpuId,
        vram: primaryDevice.defaultVram,
        ram: primaryDevice.defaultRam,
        ramType: primaryDevice.ramType,
        gpuTgpWatts: primaryDevice.gpuTgpWatts,
        display: primaryDevice.display,
        coolingNotes: primaryDevice.coolingNotes,
        year: primaryDevice.year,
        searchTokens
      });
    }

    // Sort exact models logically (alphabetical or generational)
    exactModels.sort((a, b) => a.displayName.localeCompare(b.displayName));

    const sampleModels = exactModels.slice(0, 4).map(m => m.displayName);

    // Build comprehensive search tokens for the product family
    const familySearchTokens = [
      fam.displayName.toLowerCase(),
      fam.brand.toLowerCase(),
      ...exactModels.map(m => m.displayName.toLowerCase()),
      ...exactModels.flatMap(m => m.skus.map(s => s.toLowerCase()))
    ];

    const familyItem: ProductFamilyItem = {
      id: fam.id,
      displayName: fam.displayName,
      brand: fam.brand,
      type: fam.type,
      modelCount: exactModels.length,
      sampleModels,
      devices: fam.devices,
      exactModels,
      searchTokens: familySearchTokens
    };

    if (fam.type === 'laptop') {
      laptops.push(familyItem);
    } else {
      desktops.push(familyItem);
    }
  }

  // Sort families with major popular families first
  const sortFamilies = (a: ProductFamilyItem, b: ProductFamilyItem) => {
    return a.displayName.localeCompare(b.displayName);
  };

  laptops.sort(sortFamilies);
  desktops.sort(sortFamilies);

  return { laptops, desktops };
}

// Cached singleton hierarchy
let cachedHierarchy: { laptops: ProductFamilyItem[]; desktops: ProductFamilyItem[] } | null = null;

export function getDeviceHierarchy(): { laptops: ProductFamilyItem[]; desktops: ProductFamilyItem[] } {
  if (!cachedHierarchy) {
    cachedHierarchy = buildDeviceHierarchy();
  }
  return cachedHierarchy;
}

/**
 * Get product families for a given device type (laptop or desktop).
 */
export function getProductFamilies(deviceType: DeviceType): ProductFamilyItem[] {
  const hierarchy = getDeviceHierarchy();
  return deviceType === 'laptop' ? hierarchy.laptops : hierarchy.desktops;
}

/**
 * Search product families for a device type.
 * Prioritizes:
 * 1. Exact / prefix match on family name
 * 2. Token match on family name (e.g. "TUF A15" matches "ASUS TUF Gaming A15")
 * 3. Contained exact model match (e.g. "FA506" or "FA506NCQ" matches family)
 * 4. Contained SKU match (e.g. "HN012W" matches family)
 */
export function searchProductFamilies(query: string, deviceType: DeviceType): ProductFamilyItem[] {
  const families = getProductFamilies(deviceType);
  const q = query.trim().toLowerCase();

  if (!q) return families;

  const qTokens = q.split(/\s+/).filter(t => t.length > 0);

  const scored = families.map(fam => {
    const nameLower = fam.displayName.toLowerCase();
    let score = 0;

    // Exact match on family name
    if (nameLower === q) {
      score += 1000;
    }
    // Prefix match
    else if (nameLower.startsWith(q)) {
      score += 800;
    }
    // Substring match
    else if (nameLower.includes(q)) {
      score += 500;
    }

    // All query tokens match in family name
    const allTokensMatch = qTokens.every(tok => nameLower.includes(tok));
    if (allTokensMatch) {
      score += 400;
    }

    // Check if query matches any exact model directly
    for (const em of fam.exactModels) {
      const emLower = em.displayName.toLowerCase();
      if (emLower === q) {
        score += 600;
      } else if (emLower.startsWith(q)) {
        score += 350;
      } else if (emLower.includes(q)) {
        score += 200;
      }

      // Check SKUs
      for (const sku of em.skus) {
        const skuLower = sku.toLowerCase();
        if (skuLower.includes(q)) {
          score += 250;
        }
      }
    }

    return { fam, score };
  });

  return scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.fam);
}

/**
 * Search exact models under a chosen product family.
 * Prioritizes exact matches, prefixes, and SKUs.
 */
export function searchExactModels(query: string, family: ProductFamilyItem): ExactModelItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return family.exactModels;

  const scored = family.exactModels.map(em => {
    const idLower = em.displayName.toLowerCase();
    let score = 0;

    if (idLower === q) {
      score += 1000;
    } else if (idLower.startsWith(q)) {
      score += 700;
    } else if (idLower.includes(q)) {
      score += 400;
    }

    // SKU matching
    for (const sku of em.skus) {
      const skuLower = sku.toLowerCase();
      if (skuLower === q) {
        score += 900;
      } else if (skuLower.includes(q)) {
        score += 500;
      }
    }

    // Hardware tokens
    if (em.cpuName.toLowerCase().includes(q)) score += 200;
    if (em.gpuName.toLowerCase().includes(q)) score += 200;

    return { em, score };
  });

  return scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.em);
}
