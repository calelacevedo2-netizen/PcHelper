import { DeviceModel } from '../types';
import { ASUS_DEVICES } from './devices/asus';
import { MSI_DEVICES } from './devices/msi';
import { LENOVO_DEVICES } from './devices/lenovo';
import { ACER_DEVICES } from './devices/acer';
import { HP_DEVICES } from './devices/hp';
import { DELL_DEVICES } from './devices/dell';
import { OTHER_BRANDS_DEVICES } from './devices/otherBrands';

/**
 * Comprehensive Gaming Devices Database
 * Aggregates laptops and desktops across ASUS, MSI, Lenovo, Acer, HP, Dell, Alienware,
 * Gigabyte, Razer, and Corsair with verified specifications, TGP power envelopes,
 * RAM configurations, displays, cooling descriptions, and benchmark scores.
 */
export const DEVICES_DATABASE: DeviceModel[] = [
  ...ASUS_DEVICES,
  ...MSI_DEVICES,
  ...LENOVO_DEVICES,
  ...ACER_DEVICES,
  ...HP_DEVICES,
  ...DELL_DEVICES,
  ...OTHER_BRANDS_DEVICES
];

/**
 * Get distinct brands in the database for the given device type
 */
export function getAvailableBrands(deviceType: 'laptop' | 'desktop'): string[] {
  const brands = new Set<string>();
  for (const device of DEVICES_DATABASE) {
    if (device.type === deviceType) {
      brands.add(device.brand);
    }
  }
  return Array.from(brands).sort();
}

/**
 * Get distinct product families in the database for a brand and device type
 */
export function getProductFamilies(brand: string, deviceType: 'laptop' | 'desktop'): string[] {
  const families = new Set<string>();
  for (const device of DEVICES_DATABASE) {
    if (device.type === deviceType && device.brand.toLowerCase() === brand.toLowerCase()) {
      families.add(device.productFamily);
    }
  }
  return Array.from(families).sort();
}

/**
 * Helper to find a device by ID
 */
export function findDeviceById(id: string): DeviceModel | undefined {
  return DEVICES_DATABASE.find(d => d.id === id);
}
