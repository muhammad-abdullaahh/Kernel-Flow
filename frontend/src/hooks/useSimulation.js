import { useState, useCallback, useRef } from 'react';
import { useSimulationStore } from '../store/simulationStore';
import { simulationApi } from '../api/simulationApi';

export const useSimulation = () => {
  const {
    processes,
    algorithm,
    timeQuantum,
    setSessionId,
    setIsRunning,
    setCurrentTime,
    setReadyQueue,
    addGanttBlock,
    setMetrics,
    setProcesses,
    addLog,
    simulationMode,
    simulationSpeed,
    resetSimulation
  } = useSimulationStore();

  const [error, setError] = useState(null);
  const eventSourceRef = useRef(null);

  const startSimulation = useCallback(async () => {
    if (processes.length === 0) {
      setError("Add at least one process to start simulation");
      return;
    }

    setError(null);
    resetSimulation();

    try {
      console.log("Starting simulation with:", { processes, algorithm, timeQuantum, simulationMode });
      if (simulationMode === 'batch') {
        const { data } = await simulationApi.runBatch({
          processes,
          algorithm,
          time_quantum: timeQuantum
        });
        setProcesses(data.processes);
        setMetrics(data.metrics);
        data.gantt_blocks.forEach(block => addGanttBlock(block));
        addLog({ time: 0, message: "Batch simulation completed instantly.", type: "system" });
        setIsRunning(false);
        return;
      }

      const { data } = await simulationApi.start({
        processes,
        algorithm,
        time_quantum: timeQuantum
      });

      const sid = data.session_id;
      console.log("Simulation started, session_id:", sid);
      setSessionId(sid);
      setIsRunning(true);

      // Connect SSE
      const baseUrl = import.meta.env.VITE_API_URL || '/api';
      const eventSource = new EventSource(`${baseUrl}/simulation/stream/${sid}?speed=${simulationSpeed}`);
      eventSourceRef.current = eventSource;

      eventSource.onmessage = (e) => {
        const event = JSON.parse(e.data);
        
        if (event.event_type === 'done') {
          setIsRunning(false);
          setProcesses(event.processes);
          setMetrics(event.metrics);
          
          // Add to persistent history
          const { addReport, algorithm } = useSimulationStore.getState();
          const now = new Date();
          addReport({
            id: `sim_${Math.random().toString(36).substr(2, 5)}`,
            date: now.toISOString().split('T')[0],
            time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            algo: algorithm,
            wait: event.metrics.avg_waiting_time,
            tat: event.metrics.avg_turnaround_time,
            util: event.metrics.cpu_load,
            completed: event.metrics.completed,
            total_time: event.metrics.total_time,
            throughput: event.metrics.throughput
          });

          addLog({ time: event.time, message: "Simulation completed.", type: "system" });
          eventSource.close();
          return;
        }

        // Generate human-readable logs based on event types
        if (event.event_type === 'start') {
          addLog({ time: event.time, message: `P${event.running_pid} started running.`, type: 'start' });
        } else if (event.event_type === 'context_switch') {
          addLog({ time: event.time, message: `Context switch: P${event.running_pid} took CPU.`, type: 'switch' });
        } else if (event.event_type === 'stop') {
          // Find which process finished in the process list
          const finished = event.processes.find(p => p.finish_time === event.time);
          if (finished) {
            addLog({ time: event.time, message: `P${finished.pid} finished execution.`, type: 'stop' });
          }
        }

        // Check for new arrivals
        const newArrivals = event.processes.filter(p => p.arrival_time === event.time);
        newArrivals.forEach(p => {
           addLog({ time: event.time, message: `P${p.pid} arrived in Ready Queue.`, type: 'arrival' });
        });

        setCurrentTime(event.time);
        setReadyQueue(event.ready_queue);
        setProcesses(event.processes);
        setMetrics(event.metrics);

        if (event.gantt_update) {
          addGanttBlock(event.gantt_update);
        }
      };

      eventSource.onerror = (err) => {
        console.error("SSE Error:", err);
        eventSource.close();
        setIsRunning(false);
        setError("Connection to simulation stream lost.");
      };

    } catch (err) {
      console.error("Failed to start simulation:", err);
      setError(err.response?.data?.detail || "Failed to start simulation");
    }
  }, [processes, algorithm, timeQuantum, simulationMode, simulationSpeed, resetSimulation, setProcesses, setMetrics, addGanttBlock, addLog, setIsRunning, setSessionId, setCurrentTime, setReadyQueue]);

  const stopSimulation = useCallback(async (sid) => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }
    if (sid) {
      await simulationApi.stop(sid);
    }
    resetSimulation();
  }, [resetSimulation]);

  const togglePause = useCallback(async () => {
    const { sessionId, isPaused, setIsPaused } = useSimulationStore.getState();
    if (!sessionId) return;
    
    try {
      if (isPaused) {
        await simulationApi.resume(sessionId);
        setIsPaused(false);
      } else {
        await simulationApi.pause(sessionId);
        setIsPaused(true);
      }
    } catch (err) {
      console.error("Failed to toggle pause:", err);
    }
  }, []);

  const step = useCallback(async () => {
    const { sessionId, isPaused, setIsPaused } = useSimulationStore.getState();
    if (!sessionId) return;
    
    try {
      if (!isPaused) {
        // Pause first if it's running
        await simulationApi.pause(sessionId);
        setIsPaused(true);
      }
      await simulationApi.step(sessionId);
    } catch (err) {
      console.error("Failed to step simulation:", err);
    }
  }, []);

  return { startSimulation, stopSimulation, togglePause, step, error };
};
