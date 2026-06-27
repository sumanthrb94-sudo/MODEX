import { useMemo } from 'react';
import { projects } from '@/data/projects';
import { useSearchStore } from '@/store/searchStore';
import { Project, SearchFilters, PropertyType, PossessionStatus } from '@/constants/types';

export function parseNaturalLanguage(input: string): Partial<SearchFilters> {
  const lower = input.toLowerCase();
  const result: Partial<SearchFilters> = {};

  // Property types
  const typeMap: Record<string, PropertyType> = {
    villa: 'villa', villas: 'villa',
    apartment: 'apartment', flat: 'apartment', flats: 'apartment', apartments: 'apartment',
    plot: 'plot', plots: 'plot', land: 'plot',
    farm: 'farmland', farmland: 'farmland', farmlands: 'farmland', 'farm land': 'farmland',
    commercial: 'commercial', office: 'commercial', shop: 'commercial',
    standalone: 'standalone', bungalow: 'standalone', independent: 'standalone',
  };
  const detectedTypes: PropertyType[] = [];
  for (const [keyword, type] of Object.entries(typeMap)) {
    if (lower.includes(keyword) && !detectedTypes.includes(type)) {
      detectedTypes.push(type);
    }
  }
  if (detectedTypes.length) result.types = detectedTypes;

  // Budget detection
  const croreMatch = lower.match(/(\d+(?:\.\d+)?)\s*(?:cr|crore|crores)/);
  const lakhMatch = lower.match(/(\d+(?:\.\d+)?)\s*(?:l|lakh|lakhs)/);
  if (croreMatch) {
    result.maxPrice = parseFloat(croreMatch[1]) * 10000000;
  } else if (lakhMatch) {
    result.maxPrice = parseFloat(lakhMatch[1]) * 100000;
  }
  if (lower.includes('affordable') || lower.includes('budget') || lower.includes('cheap')) {
    result.maxPrice = result.maxPrice ?? 8000000;
  }

  // Possession status
  const statuses: PossessionStatus[] = [];
  if (lower.includes('ready') || lower.includes('immediate') || lower.includes('move in')) {
    statuses.push('ready');
  }
  if (lower.includes('new launch') || lower.includes('pre-launch') || lower.includes('prelaunch')) {
    statuses.push('new_launch');
  }
  if (lower.includes('under construction') || lower.includes('upcoming')) {
    statuses.push('under_construction');
  }
  if (statuses.length) result.possessionStatus = statuses;

  // Area detection
  const areas = [
    'tukkuguda', 'shamshabad', 'chevella', 'kokapet', 'narsingi',
    'financial district', 'gachibowli', 'shankarpally', 'shadnagar',
    'moinabad', 'nanakramguda', 'jubilee hills', 'abdullapurmet', 'hitech city',
  ];
  const detectedAreas: string[] = [];
  for (const area of areas) {
    if (lower.includes(area)) detectedAreas.push(area);
  }
  if (detectedAreas.length) result.areas = detectedAreas;

  return result;
}

export function filterAndSort(allProjects: Project[], filters: SearchFilters, sortBy: string): Project[] {
  let result = [...allProjects];

  if (filters.query) {
    const q = filters.query.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.location.area.toLowerCase().includes(q) ||
        p.location.city.toLowerCase().includes(q) ||
        p.developer.name.toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q),
    );
  }

  if (filters.types.length > 0) {
    result = result.filter((p) => filters.types.includes(p.type));
  }

  if (filters.areas.length > 0) {
    result = result.filter((p) =>
      filters.areas.some((a) => p.location.area.toLowerCase().includes(a.toLowerCase())),
    );
  }

  if (filters.maxPrice < 150000000) {
    result = result.filter((p) => p.pricing.minPrice <= filters.maxPrice);
  }
  if (filters.minPrice > 0) {
    result = result.filter((p) => p.pricing.maxPrice >= filters.minPrice);
  }

  if (filters.possessionStatus.length > 0) {
    result = result.filter((p) => filters.possessionStatus.includes(p.possession.status));
  }

  switch (sortBy) {
    case 'price_asc':
      result.sort((a, b) => a.pricing.minPrice - b.pricing.minPrice);
      break;
    case 'price_desc':
      result.sort((a, b) => b.pricing.minPrice - a.pricing.minPrice);
      break;
    case 'score':
      result.sort((a, b) => b.investmentScore - a.investmentScore);
      break;
    case 'newest':
      result.sort((a, b) => (a.possession.status === 'new_launch' ? -1 : 1));
      break;
    default:
      result.sort((a, b) => b.investmentScore - a.investmentScore);
  }

  return result;
}

export function useSearch() {
  const { filters, sortBy } = useSearchStore();
  const filtered = useMemo(() => filterAndSort(projects, filters, sortBy), [filters, sortBy]);
  return { projects: filtered, total: filtered.length };
}
