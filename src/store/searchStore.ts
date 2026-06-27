import { create } from 'zustand';
import { SearchFilters, SortOption, PropertyType, PossessionStatus } from '@/constants/types';

const defaultFilters: SearchFilters = {
  query: '',
  types: [],
  areas: [],
  minPrice: 0,
  maxPrice: 150000000,
  possessionStatus: [],
  minBedrooms: 0,
};

interface SearchState {
  filters: SearchFilters;
  sortBy: SortOption;
  setQuery: (query: string) => void;
  setTypes: (types: PropertyType[]) => void;
  toggleType: (type: PropertyType) => void;
  setPriceRange: (min: number, max: number) => void;
  togglePossessionStatus: (status: PossessionStatus) => void;
  setSortBy: (sort: SortOption) => void;
  resetFilters: () => void;
  applyFromNL: (partial: Partial<SearchFilters>) => void;
}

export const useSearchStore = create<SearchState>((set) => ({
  filters: defaultFilters,
  sortBy: 'relevance',

  setQuery: (query) =>
    set((s) => ({ filters: { ...s.filters, query } })),

  setTypes: (types) =>
    set((s) => ({ filters: { ...s.filters, types } })),

  toggleType: (type) =>
    set((s) => {
      const types = s.filters.types.includes(type)
        ? s.filters.types.filter((t) => t !== type)
        : [...s.filters.types, type];
      return { filters: { ...s.filters, types } };
    }),

  setPriceRange: (minPrice, maxPrice) =>
    set((s) => ({ filters: { ...s.filters, minPrice, maxPrice } })),

  togglePossessionStatus: (status) =>
    set((s) => {
      const statuses = s.filters.possessionStatus.includes(status)
        ? s.filters.possessionStatus.filter((st) => st !== status)
        : [...s.filters.possessionStatus, status];
      return { filters: { ...s.filters, possessionStatus: statuses } };
    }),

  setSortBy: (sortBy) => set({ sortBy }),

  resetFilters: () => set({ filters: defaultFilters, sortBy: 'relevance' }),

  applyFromNL: (partial) =>
    set((s) => ({ filters: { ...s.filters, ...partial } })),
}));
