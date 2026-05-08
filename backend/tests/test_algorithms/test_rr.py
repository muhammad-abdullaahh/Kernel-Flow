import pytest
from app.algorithms.round_robin import RoundRobinScheduler
from app.core.process import Process

def make_process(pid, arrival, burst):
    return Process(pid=pid, arrival_time=arrival, burst_time=burst)

def test_rr_default_quantum():
    scheduler = RoundRobinScheduler(time_quantum=2)
    assert scheduler.time_quantum == 2

def test_rr_returns_none_on_empty():
    scheduler = RoundRobinScheduler()
    assert scheduler.select_next([]) is None

def test_rr_single_process_selected():
    scheduler = RoundRobinScheduler(time_quantum=2)
    p = make_process(1, 0, 5)
    result = scheduler.select_next([p])
    assert result.pid == 1
