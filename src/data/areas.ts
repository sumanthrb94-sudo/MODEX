import { Area, AreaInfra, Project } from '@/constants/types';
import { projects } from './projects';

// Curated location intelligence per locality — the kind of "understand the area"
// data that a listing portal doesn't have. Mock but realistic for Hyderabad.
const CURATED: Record<
  string,
  { tagline: string; summary: string; schools: number; hospitals: number; itParks: number; growth: number; infrastructure: AreaInfra[] }
> = {
  Tukkuguda: {
    tagline: 'Airport-corridor growth belt',
    summary:
      'Tukkuguda sits on the booming Outer Ring Road–Airport corridor in South Hyderabad. Large land parcels, new gated villa communities and proposed industrial/aerospace SEZs make it one of the fastest-appreciating belts for mid-to-premium buyers and investors.',
    schools: 6, hospitals: 4, itParks: 3, growth: 84,
    infrastructure: [
      { name: 'Outer Ring Road (ORR)', type: 'road', status: 'operational', impact: 'Direct city-wide connectivity' },
      { name: 'Regional Ring Road (RRR)', type: 'road', status: 'under_construction', eta: '2027', impact: 'Second ring boosting land value' },
      { name: 'Aerospace & Defence SEZ', type: 'it_park', status: 'planned', eta: '2028', impact: 'Job catchment & rental demand' },
      { name: 'Airport Metro extension', type: 'metro', status: 'under_construction', eta: '2026', impact: 'Mass transit to the corridor' },
    ],
  },
  Kokapet: {
    tagline: 'Hyderabad’s premium financial frontier',
    summary:
      'Kokapet (Neopolis) is the western premium hub adjoining the Financial District. Record land auctions, Grade-A high-rises and top developers make it a blue-chip residential bet with strong rental demand from IT/finance professionals.',
    schools: 8, hospitals: 5, itParks: 6, growth: 91,
    infrastructure: [
      { name: 'Financial District', type: 'it_park', status: 'operational', impact: 'Premier employment hub next door' },
      { name: 'Nehru ORR', type: 'road', status: 'operational', impact: 'Fast access to airport & city' },
      { name: 'Biodiversity–Kokapet Metro (proposed)', type: 'metro', status: 'planned', eta: '2028', impact: 'Future transit upside' },
    ],
  },
  'Financial District': {
    tagline: 'The corporate core of West Hyderabad',
    summary:
      'Home to global capability centres (Deloitte, JP Morgan, Qualcomm). Walk-to-work premium apartments command the highest rents in the city; supply is tight, keeping appreciation strong.',
    schools: 7, hospitals: 6, itParks: 9, growth: 88,
    infrastructure: [
      { name: 'Raidurg Metro', type: 'metro', status: 'operational', impact: 'Connected to IT corridor' },
      { name: 'ORR Exit 2/3', type: 'road', status: 'operational', impact: 'Airport in ~25 min' },
      { name: 'Metro Phase-2 (Airport line)', type: 'metro', status: 'under_construction', eta: '2026', impact: 'Direct airport link' },
    ],
  },
  Narsingi: {
    tagline: 'Connectivity sweet-spot off ORR',
    summary:
      'Narsingi offers quick ORR access and proximity to the Financial District at a relative discount, attracting families and mid-segment investors with strong rental traction.',
    schools: 6, hospitals: 4, itParks: 5, growth: 82,
    infrastructure: [
      { name: 'ORR Narsingi Junction', type: 'road', status: 'operational', impact: 'Multi-directional connectivity' },
      { name: 'Raheja Mindspace', type: 'it_park', status: 'operational', impact: 'Nearby job hub' },
      { name: 'Proposed Metro spur', type: 'metro', status: 'planned', eta: '2029', impact: 'Long-term transit upside' },
    ],
  },
  Shamshabad: {
    tagline: 'At the gateway to the airport',
    summary:
      'Minutes from Rajiv Gandhi International Airport, Shamshabad is an emerging luxury-villa and logistics belt with the new Multi-Modal Transport hub planned around the airport.',
    schools: 5, hospitals: 3, itParks: 2, growth: 79,
    infrastructure: [
      { name: 'RGIA International Airport', type: 'airport', status: 'operational', impact: '8–15 min drive' },
      { name: 'Airport Metro Express', type: 'metro', status: 'under_construction', eta: '2026', impact: 'High-speed city link' },
      { name: 'NH-44 / ORR interchange', type: 'road', status: 'operational', impact: 'Pan-India highway access' },
    ],
  },
  Chevella: {
    tagline: 'Weekend-home & farmland green belt',
    summary:
      'A scenic, low-density green belt favoured for farmlands and weekend villas. Clean air and large parcels appeal to lifestyle buyers and long-horizon land investors.',
    schools: 3, hospitals: 2, itParks: 0, growth: 71,
    infrastructure: [
      { name: 'Chevella–Vikarabad Highway', type: 'road', status: 'operational', impact: 'City access in ~60 min' },
      { name: 'Regional Ring Road (RRR)', type: 'road', status: 'planned', eta: '2028', impact: 'Major future value driver' },
    ],
  },
  Gachibowli: {
    tagline: 'Established IT & sports hub',
    summary:
      'A mature, high-demand micro-market with deep IT employment, stadiums and top schools. Limited new supply keeps capital values and rents resilient.',
    schools: 9, hospitals: 7, itParks: 10, growth: 80,
    infrastructure: [
      { name: 'Hitec City / DLF', type: 'it_park', status: 'operational', impact: 'Massive job catchment' },
      { name: 'Gachibowli Metro (proposed)', type: 'metro', status: 'planned', eta: '2028', impact: 'Adds mass transit' },
      { name: 'ORR & elevated corridors', type: 'road', status: 'operational', impact: 'Eased commute' },
    ],
  },
  'Jubilee Hills': {
    tagline: 'The city’s blue-chip address',
    summary:
      'Hyderabad’s most prestigious neighbourhood — limited supply, ultra-premium standalone homes, and unmatched social infrastructure. A wealth-preservation market.',
    schools: 10, hospitals: 8, itParks: 4, growth: 74,
    infrastructure: [
      { name: 'Jubilee Hills Metro', type: 'metro', status: 'operational', impact: 'Central connectivity' },
      { name: 'KBR Park & arterial roads', type: 'road', status: 'operational', impact: 'Prime central location' },
    ],
  },
  Shankarpally: {
    tagline: 'Fast-emerging plotted-development corridor',
    summary:
      'West Hyderabad’s plotted-development frontier near IIT-H and BHEL, with strong land appreciation as the city expands westward.',
    schools: 4, hospitals: 2, itParks: 2, growth: 77,
    infrastructure: [
      { name: 'IIT Hyderabad', type: 'it_park', status: 'operational', impact: 'Knowledge-economy anchor' },
      { name: 'Regional Ring Road (RRR)', type: 'road', status: 'under_construction', eta: '2027', impact: 'Major connectivity upgrade' },
    ],
  },
  Shadnagar: {
    tagline: 'Affordable smart-city corridor',
    summary:
      'On the Hyderabad–Bangalore highway, designated for smart-city and industrial growth. The lowest entry prices in the metro with high long-term land upside.',
    schools: 3, hospitals: 2, itParks: 1, growth: 75,
    infrastructure: [
      { name: 'NH-44 (Hyd–Bangalore)', type: 'road', status: 'operational', impact: 'National highway frontage' },
      { name: 'Regional Ring Road (RRR)', type: 'road', status: 'planned', eta: '2028', impact: 'Connectivity catalyst' },
      { name: 'Industrial / FAB City corridor', type: 'it_park', status: 'under_construction', eta: '2027', impact: 'Employment & demand' },
    ],
  },
};

function round(n: number) {
  return Math.round(n);
}

function buildArea(name: string, areaProjects: Project[]): Area {
  const curated = CURATED[name];
  const prices = areaProjects.map((p) => p.pricing.minPrice);
  const psf = areaProjects.map((p) => p.pricing.pricePerSqft ?? 0).filter((v) => v > 0);
  const liv = areaProjects.map((p) => p.environment?.livabilityScore ?? 0).filter((v) => v > 0);
  const appr = areaProjects.map((p) => p.appreciationPct ?? 0).filter((v) => v > 0);

  const avgPsf = psf.length ? round(psf.reduce((a, b) => a + b, 0) / psf.length) : 0;
  const avgLiv = liv.length ? round(liv.reduce((a, b) => a + b, 0) / liv.length) : 0;
  const avgAppr = appr.length ? Math.round((appr.reduce((a, b) => a + b, 0) / appr.length) * 10) / 10 : 0;

  // Build a plausible 5-quarter price/sqft trend ending at the current average.
  const q = avgPsf || 5000;
  const growthPerQ = (avgAppr || 12) / 100 / 4; // quarterly growth
  const priceTrend = [4, 3, 2, 1, 0].map((back) => round(q / Math.pow(1 + growthPerQ, back)));

  return {
    name,
    tagline: curated?.tagline ?? 'Emerging Hyderabad locality',
    summary: curated?.summary ?? `${name} is a developing locality in Hyderabad with ${areaProjects.length} live project(s) on MODEX.`,
    projectCount: areaProjects.length,
    minPrice: prices.length ? Math.min(...prices) : 0,
    maxPrice: prices.length ? Math.max(...prices) : 0,
    avgPricePerSqft: avgPsf,
    avgLivability: avgLiv,
    avgAppreciation: avgAppr,
    growthScore: curated?.growth ?? round(Math.min(95, 55 + avgAppr * 1.2)),
    schools: curated?.schools ?? 4,
    hospitals: curated?.hospitals ?? 3,
    itParks: curated?.itParks ?? 2,
    priceTrend,
    infrastructure: curated?.infrastructure ?? [],
  };
}

// All areas that have at least one project, sorted by growth score.
export function getAllAreas(): Area[] {
  const byArea = new Map<string, Project[]>();
  projects.forEach((p) => {
    const arr = byArea.get(p.location.area) ?? [];
    arr.push(p);
    byArea.set(p.location.area, arr);
  });
  return Array.from(byArea.entries())
    .map(([name, ps]) => buildArea(name, ps))
    .sort((a, b) => b.growthScore - a.growthScore);
}

export function getAreaByName(name: string): Area | undefined {
  const match = projects.filter((p) => p.location.area.toLowerCase() === name.toLowerCase());
  if (!match.length) return undefined;
  return buildArea(match[0].location.area, match);
}

export function getProjectsInArea(name: string): Project[] {
  return projects.filter((p) => p.location.area.toLowerCase() === name.toLowerCase());
}
