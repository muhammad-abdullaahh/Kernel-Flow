import pytest
from app.algorithms.sjf import SJFScheduler
from app.core.process import Process

def make_process(pid, arrival, burst):
    return Process(pid=pid, arrival_time=arrival, burst_time=burst)

def test_sjf_selects_shortest_burst():
    scheduler = SJFScheduler()
    p1 = make_process(1, 0, 8)
    p2 = make_process(2, 0, 3)
    p3 = make_process(3, 0, 5)
    result = scheduler.select_next([p1, p2, p3])
    assert result.pid == 2

def test_sjf_returns_none_on_empty():
    scheduler = SJFScheduler()
    assert scheduler.select_next([]) is None

def test_sjf_tiebreak_by_arrival():
    scheduler = SJFScheduler()
    p1 = make_process(1, 2, 4)
    p2 = make_process(2, 0, 4)
    result = scheduler.select_next([p1, p2])
    assert result.pid == 2
