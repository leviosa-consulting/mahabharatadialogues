import { create } from 'zustand'

interface WorkshopState {
  showSections: number;
  setShowSections: (value: number) => void;
  currentSectionIndex: number;
  setCurrentSectionIndex: (value: number | ((prev: number) => number)) => void;
  showProgramSections: number;
  setShowProgramSections: (value: number) => void;
  currentProgramSectionIndex: number;
  setCurrentProgramSectionIndex: (value: number | ((prev: number) => number)) => void;
  
  // New Impact Stories state
  showImpactSections: number;
  setShowImpactSections: (value: number) => void;
  currentImpactSectionIndex: number;
  setCurrentImpactSectionIndex: (value: number | ((prev: number) => number)) => void;
}

export const useWorkshopStore = create<WorkshopState>((set) => ({
  showSections: -1,
  setShowSections: (value) => set({ showSections: value }),
  currentSectionIndex: 0,
  setCurrentSectionIndex: (value) =>
    set((state) => ({
      currentSectionIndex:
        typeof value === 'function' ? value(state.currentSectionIndex) : value,
    })),
  showProgramSections: -1,
  setShowProgramSections: (value) => set({ showProgramSections: value }),
  currentProgramSectionIndex: 0,
  setCurrentProgramSectionIndex: (value) =>
    set((state) => ({
      currentProgramSectionIndex:
        typeof value === 'function' ? value(state.currentProgramSectionIndex) : value,
    })),
    
  // New Impact Stories state
  showImpactSections: -1,
  setShowImpactSections: (value) => set({ showImpactSections: value }),
  currentImpactSectionIndex: 0,
  setCurrentImpactSectionIndex: (value) =>
    set((state) => ({
      currentImpactSectionIndex:
        typeof value === 'function' ? value(state.currentImpactSectionIndex) : value,
    })),
}));