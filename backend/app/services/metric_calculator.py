from typing import List
from app.core.process import Process
from app.models.metrics_model import SystemMetrics

class MetricCalculator:
    """Calculates aggregate system metrics from a list of completed processes."""

    @staticmethod
    def calculate_system_metrics(
        processes: List[Process], total_time: int, busy_time: int
    ) -> SystemMetrics:
        if not processes:
            return SystemMetrics(
                cpu_load=0,
                throughput=0,
                avg_waiting_time=0,
                avg_turnaround_time=0,
                avg_response_time=0,
            )

        # Calculate averages based on all processes that have arrived to provide live feedback
        arrived_processes = [p for p in processes if p.state != 'new' or p.arrival_time <= total_time]
        num_arrived = len(arrived_processes)
        
        # Guard: total_time should be at least 1 if any process has started
        # and it should reflect the duration of the simulation.
        effective_time = max(1, total_time)
        
        if num_arrived == 0:
            return SystemMetrics(
                completed=0,
                total_time=effective_time,
                cpu_load=round(busy_time / effective_time * 100, 2),
                throughput=0.0,
                avg_waiting_time=0.0,
                avg_turnaround_time=0.0,
                avg_response_time=0.0,
            )

        # Use the manually tracked waiting_time from StateManager
        total_waiting_time = sum(p.waiting_time for p in arrived_processes)
        
        started_procs = [p for p in arrived_processes if p.start_time is not None]
        finished_procs = [p for p in arrived_processes if p.finish_time is not None]
        
        avg_tat = (sum(p.turnaround_time for p in finished_procs) / len(finished_procs)) if finished_procs else 0
        avg_resp = (sum(p.response_time for p in started_procs) / len(started_procs)) if started_procs else 0

        cpu_load = (busy_time / effective_time * 100)
        throughput = (len(finished_procs) / effective_time)

        return SystemMetrics(
            completed=len(finished_procs),
            total_time=effective_time,
            cpu_load=round(cpu_load, 2),
            throughput=round(throughput, 4),
            avg_waiting_time=round(total_waiting_time / num_arrived, 2),
            avg_turnaround_time=round(avg_tat, 2),
            avg_response_time=round(avg_resp, 2),
        )
