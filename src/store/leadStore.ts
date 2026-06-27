import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import { Lead } from '@/constants/types';

// Cross-platform storage: localStorage on web, in-memory no-op on native
// (keeps the demo working without adding AsyncStorage as a dependency).
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

interface LeadState {
  leads: Lead[];
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'status'>) => Lead;
  removeLead: (id: string) => void;
  clearLeads: () => void;
}

export const useLeadStore = create<LeadState>()(
  persist(
    (set, get) => ({
      leads: [],
      addLead: (input) => {
        const lead: Lead = {
          ...input,
          id: `lead-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          createdAt: Date.now(),
          status: 'new',
        };
        set((s) => ({ leads: [lead, ...s.leads] }));
        return lead;
      },
      removeLead: (id) => set((s) => ({ leads: s.leads.filter((l) => l.id !== id) })),
      clearLeads: () => set({ leads: [] }),
    }),
    {
      name: 'modex-leads',
      storage: createJSONStorage(() => safeStorage),
    },
  ),
);
