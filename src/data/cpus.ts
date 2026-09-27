import { CPU } from '../types';
import { CPUS_RYZEN } from './cpusRyzen';
import { CPUS_INTEL } from './cpusIntel';

/**
 * Comprehensive Verified CPU Database
 * Sources: AMD Official Product Specifications, Intel ARK / Product Specifications,
 * Tom's Hardware CPU Hierarchy, TechPowerUp CPU Database, AnandTech, & Notebookcheck.
 * 
 * ARCHITECTURAL GUIDELINES:
 * - Desktop vs. Laptop distinction is preserved (desktop chips have higher sustained power & cache).
 * - AMD Ryzen 7 170 is a 2025 mobile Zen 3+ processor (FP7/FP7r2, Radeon 680M).
 * - AMD Ryzen 7 1700 is a 2017 desktop Zen 1 processor (AM4, DDR4, no iGPU).
 * - Intel Core Ultra 7 155H (Series 1 Meteor Lake Laptop BGA) and Core Ultra 7 265K (Series 2 Arrow Lake-S Desktop LGA1851)
 *   are completely distinct entries and never merged.
 * - Aliases handle naming variations reported by Windows Device Manager, DXDiag, or OEM catalogs.
 */
export const CPUS_DATABASE: CPU[] = [
  ...CPUS_RYZEN,
  ...CPUS_INTEL
];
