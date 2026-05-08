import pytest
from app.algorithms.fcfs import FCFSScheduler
from app.core.process import Process

def make_process(pid, arrival, burst):
    return Process(pid=pid, arrival_time=arrival, burst_time=burst)

def test_fcfs_selects_earliest_arrival():
    scheduler = FCFSScheduler()
    p1 = make_process(1, 3, 5)
    p2 = make_process(2, 1, 3)
    p3 = make_process(3, 2, 4)
    result = scheduler.select_next([p1, p2, p3])
    assert result.pid == 2

def test_fcfs_returns_none_on_empty_queue():
    scheduler = FCFSScheduler()
    assert scheduler.select_next([]) is None

def test_fcfs_single_process():
    scheduler = FCFSScheduler()
    p = make_process(1, 0, 5)
    assert scheduler.select_next([p]) == p
