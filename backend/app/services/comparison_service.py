from typing import List
from app.core.process import Process
from app.core.simulator import Simulator
from app.services.metric_calculator import MetricCalculator
from app.models.simulation_model import ComparisonResult
from app.algorithms.fcfs import FCFS
from app.algorithms.sjf import SJF
from app.algorithms.srtf import SRTF
from app.algorithms.round_robin import RoundRobin
from app.algorithms.priority_preemptive import PriorityPreemptive
from app.algorithms.priority_nonpreemptive import PriorityNonPreemptive

class ComparisonService:
    """Runs multiple scheduling algorithms on the same dataset for comparison."""

    ALGORITHMS = {
        "FCFS": FCFS,
        "SJF": SJF,
        "SRTF": SRTF,
        "RR": RoundRobin,
        "Priority Preemptive": PriorityPreemptive,
        "Priority Non-preemptive": PriorityNonPreemptive,
    }

    @classmethod
    def compare_algorithms(
        cls, processes: List[Process], algo_names: List[str], time_quantum: int
    ) -> List[ComparisonResult]:
        results = []
        
        for name in algo_names:
            if name not in cls.ALGORITHMS:
                continue
            
            # Fresh copies of processes for each run
            run_processes = [p.clone() for p in processes]
            
            # Instantiate algorithm
            algo_class = cls.ALGORITHMS[name]
            if name == "RR":
                algo = algo_class(time_quantum=time_quantum)
            else:
                algo = algo_class()
                
            # Run simulation
            sim = Simulator(run_processes, algo)
            sim_result = sim.run()
            
            # Calculate metrics
            metrics = MetricCalculator.calculate_system_metrics(
                sim_result.processes, sim_result.total_time, sim_result.busy_time
            )
            
            results.append(ComparisonResult(
                algorithm=name,
                metrics=metrics,
                processes=[p.to_dict() for p in sim_result.processes]
            ))
            
        return results
