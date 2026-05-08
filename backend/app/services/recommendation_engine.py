import pandas as pd
from typing import List, Dict
from app.core.process import Process
from app.models.process_model import ProcessInput

class RecommendationEngine:
    """Heuristic-based intelligent recommendation engine."""

    @staticmethod
    def recommend(processes: List[ProcessInput]) -> Dict[str, str]:
        if not processes:
            return {"algorithm": "FCFS", "reasoning": "No processes provided. Defaulting to FCFS."}

        num_processes = len(processes)
        burst_times = [p.burst_time for p in processes]
        arrival_times = [p.arrival_time for p in processes]
        priorities = [p.priority for p in processes]
        
        # Analyze variance
        df_burst = pd.Series(burst_times)
        burst_variance = df_burst.var() if num_processes > 1 else 0
        
        all_arrive_at_zero = all(a == 0 for a in arrival_times)
        priorities_differ = len(set(priorities)) > 1
        
        # Heuristic Logic
        if priorities_differ:
            return {
                "algorithm": "Priority Preemptive",
                "reasoning": "Processes have varying priorities. Priority-based scheduling ensures critical tasks are handled first."
            }
        
        if all_arrive_at_zero:
            if burst_variance > 50:
                return {
                    "algorithm": "SJF",
                    "reasoning": "High variance in burst times with simultaneous arrivals. Shortest Job First minimizes average waiting time."
                }
            else:
                return {
                    "algorithm": "FCFS",
                    "reasoning": "Burst times are similar and all arrive at once. First-Come First-Served is simple and fair here."
                }
        
        if burst_variance < 10:
            return {
                "algorithm": "RR",
                "reasoning": "Processes have similar burst times and staggered arrivals. Round Robin provides good responsiveness and fairness."
            }
            
        return {
            "algorithm": "SRTF",
            "reasoning": "Staggered arrivals and varying burst times. Shortest Remaining Time First optimizes for throughput and minimal waiting time."
        }
