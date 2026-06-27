import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';

// Cross-platform storage: localStorage on web, in-memory on native.
const memory: Record<string, string> = {};
const safeStorage: StateStorage =
  typeof localStorage !== 'undefined'
    ? localStorage
    : {
        getItem: (k) => memory[k] ?? null,
        setItem: (k, v) => {
          memory[k] = v;
        },
        removeItem: (k) => {
          delete memory[k];
        },
      };

interface FollowState {
  followedAreas: string[];
  toggleFollow: (area: string) => void;
  isFollowing: (area: string) => boolean;
}

export const useFollowStore = create<FollowState>()(
  persist(
    (set, get) => ({
      followedAreas: [],
      toggleFollow: (area) =>
        set((s) => ({
          followedAreas: s.followedAreas.includes(area)
            ? s.followedAreas.filter((a) => a !== area)
            : [...s.followedAreas, area],
        })),
      isFollowing: (area) => get().followedAreas.includes(area),
    }),
    {
      name: 'modex-followed-areas',
      storage: createJSONStorage(() => safeStorage),
    },
  ),
);
