import { PropertyType } from '@/constants/types';

// Stable Unsplash CDN photo IDs grouped by property type. Unsplash photo URLs
// (images.unsplash.com/photo-<id>) are permanent, so these are safe to hardcode
// for a no-backend demo. Images are loaded by the client browser, not the server.
const UNSPLASH = (id: string, w = 800) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

const POOLS: Record<PropertyType, string[]> = {
  villa: [
    '1613490493576-7fde63acd811', // modern villa exterior
    '1600596542815-ffad4c1539a9', // white modern house
    '1600585154340-be6161a56a0c', // contemporary home
    '1564013799919-ab600027ffc6', // house with lawn
    '1602343168117-bb8ffe3e2e9f', // luxury villa
    '1600047509807-ba8f99d2cdde', // villa with pool
  ],
  apartment: [
    '1545324418-cc1a3fa10c00', // apartment tower
    '1512917774080-9991f1c4c750', // modern residential block
    '1460317442991-0ec209397118', // high-rise
    '1551361415-69c87624334f', // apartment balconies
    '1493809842364-78817add7ffb', // apartment building
    '1518005020951-eccb494ad742', // residential highrise
  ],
  plot: [
    '1500382017468-9049fed747ef', // open green plot
    '1628624747186-a941c476b7ef', // land parcel
    '1542621334-a254cf47733d', // open field
    '1416879595882-3373a0480b5b', // farmland plot
    '1500076656116-558758c991c1', // surveyed land
    '1485470733090-0aae1788d5af', // open ground
  ],
  farmland: [
    '1500651230702-0e2d8a49d4ad', // farm fields
    '1574943320219-553eb213f72d', // green farmland
    '1625246333195-78d9c38ad449', // farm landscape
    '1464822759023-fed622ff2c3b', // hills & fields
    '1471193945509-9ad0617afabf', // orchard
    '1592982537447-6f2a6a0c8b6b', // rural farm
  ],
  commercial: [
    '1486406146926-c627a92ad1ab', // office tower
    '1497366216548-37526070297c', // office interior
    '1554469384-e58fac16e23a', // glass commercial building
    '1564069114553-7215e1ff1890', // corporate facade
    '1497366811353-6870744d04b2', // open office floor
    '1582407947304-fd86f028f716', // business tower
  ],
  standalone: [
    '1605276374104-dee2a0ed3cd6', // luxury bungalow
    '1576941089067-2de3c901e126', // mansion exterior
    '1613977257363-707ba9348227', // luxury home night
    '1600607687939-ce8a6c25118c', // modern interior
    '1599809275671-b5942cabc7a2', // grand house
    '1583608205776-bfd35f0d9f83', // upscale residence
  ],
};

// Deterministic per-project selection so each project gets a stable, distinct
// set of 3 images (rotating through its type pool by index).
export function getProjectImages(type: PropertyType, index: number, count = 3): string[] {
  const pool = POOLS[type] ?? POOLS.apartment;
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    const id = pool[(index + i) % pool.length];
    out.push(UNSPLASH(id));
  }
  return out;
}

export const heroImage = UNSPLASH('1582407947304-fd86f028f716', 1200);
