import { create } from 'zustand';

export const useMetricsStore = create((set) => ({
  comparisonResults: [],
  lastRecommendation: null,
  
  setComparisonResults: (results) => set({ comparisonResults: results }),
  setLastRecommendation: (recommendation) => set({ lastRecommendation: recommendation }),
}));
