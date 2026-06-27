import { create } from 'zustand';
import { SavedLocation } from '@/constants/types';

interface SavedState {
  savedIds: string[];
  compareIds: string[];
  savedLocations: SavedLocation[];
  toggleSave: (id: string) => void;
  isSaved: (id: string) => boolean;
  toggleCompare: (id: string) => void;
  isInCompare: (id: string) => boolean;
  clearCompare: () => void;
  addLocation: (location: SavedLocation) => void;
  removeLocation: (id: string) => void;
}

const defaultLocations: SavedLocation[] = [
  {
    id: 'home',
    label: 'Home',
    icon: 'home',
    coordinates: { lat: 17.4116, lng: 78.3521 },
  },
  {
    id: 'office',
    label: 'Office',
    icon: 'briefcase',
    coordinates: { lat: 17.4401, lng: 78.3489 },
  },
];

export const useSavedStore = create<SavedState>((set, get) => ({
  savedIds: [],
  compareIds: [],
  savedLocations: defaultLocations,

  toggleSave: (id) =>
    set((s) => ({
      savedIds: s.savedIds.includes(id)
        ? s.savedIds.filter((i) => i !== id)
        : [...s.savedIds, id],
    })),

  isSaved: (id) => get().savedIds.includes(id),

  toggleCompare: (id) =>
    set((s) => {
      if (s.compareIds.includes(id)) {
        return { compareIds: s.compareIds.filter((i) => i !== id) };
      }
      if (s.compareIds.length >= 3) {
        return { compareIds: [...s.compareIds.slice(1), id] };
      }
      return { compareIds: [...s.compareIds, id] };
    }),

  isInCompare: (id) => get().compareIds.includes(id),

  clearCompare: () => set({ compareIds: [] }),

  addLocation: (location) =>
    set((s) => ({ savedLocations: [...s.savedLocations, location] })),

  removeLocation: (id) =>
    set((s) => ({ savedLocations: s.savedLocations.filter((l) => l.id !== id) })),
}));
