import { create } from 'zustand';

export const useSimulationStore = create((set) => ({
  processes: [],
  algorithm: 'FCFS',
  timeQuantum: 2,
  isRunning: false,
  isPaused: false,
  currentTime: 0,
  sessionId: null,
  ganttData: [],
  readyQueue: [],
  simulationEvents: [],
  logs: [],
  simulationMode: 'live', // 'live' or 'batch'
  simulationSpeed: 1.0,   // delay in seconds
  simulationHistory: [],  // persistent records
  metrics: {
    completed: 0,
    avg_waiting_time: 0,
    avg_turnaround_time: 0,
    cpu_load: 0,
    throughput: 0
  },

  setProcesses: (processes) => set({ processes }),
  setAlgorithm: (algorithm) => set({ algorithm }),
  setTimeQuantum: (timeQuantum) => set({ timeQuantum }),
  setIsRunning: (isRunning) => set({ isRunning }),
  setIsPaused: (isPaused) => set({ isPaused }),
  setCurrentTime: (currentTime) => set({ currentTime }),
  setSessionId: (sessionId) => set({ sessionId }),
  setReadyQueue: (readyQueue) => set({ readyQueue }),
  setSimulationMode: (simulationMode) => set({ simulationMode }),
  setSimulationSpeed: (simulationSpeed) => set({ simulationSpeed }),
  setMetrics: (metrics) => set({ metrics }),
  addReport: (report) => set((state) => ({ 
    simulationHistory: [report, ...state.simulationHistory] 
  })),
  clearHistory: () => set({ simulationHistory: [] }),
  deleteReport: (id) => set((state) => ({
    simulationHistory: state.simulationHistory.filter(r => r.id !== id)
  })),
  addGanttBlock: (block) => set((state) => {
    const existingIndex = state.ganttData.findIndex(
      (b) => b.pid === block.pid && b.start === block.start
    );
    if (existingIndex >= 0) {
      const newData = [...state.ganttData];
      newData[existingIndex] = { ...newData[existingIndex], ...block };
      return { ganttData: newData };
    }
    return { ganttData: [...state.ganttData, block] };
  }),
  addLog: (log) => set((state) => ({ logs: [log, ...state.logs].slice(0, 50) })),
  resetSimulation: () => set({
    isRunning: false,
    isPaused: false,
    currentTime: 0,
    sessionId: null,
    ganttData: [],
    readyQueue: [],
    simulationEvents: [],
    logs: [],
    metrics: {
      completed: 0,
      avg_waiting_time: 0,
      avg_turnaround_time: 0,
      cpu_load: 0,
      throughput: 0
    }
  }),
}));
