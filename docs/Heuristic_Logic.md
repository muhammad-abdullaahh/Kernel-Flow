# KernelFlow — Heuristic Recommendation Logic

The `RecommendationEngine` analyses the submitted process workload and applies
the following decision rules to recommend the most appropriate CPU scheduling algorithm.

---

## Decision Rules (in order of priority)

### 1. Priority-based workload
**Condition:** Any process has a non-zero priority value.  
**Recommendation:** `priority_p` (Preemptive Priority)  
**Rationale:** When priorities exist they should be respected. The preemptive variant
ensures high-priority processes are not blocked by lower-priority ones already running.

---

### 2. Homogeneous burst times (low variance)
**Condition:** Burst time variance < 2.0  
**Recommendation:** `rr` (Round Robin)  
**Rationale:** When all processes require similar CPU time, Round Robin provides fair,
starvation-free scheduling with predictable response times.

---

### 3. Heterogeneous burst times, small process count
**Condition:** Burst time variance ≥ 2.0 AND number of processes ≤ 10  
**Recommendation:** `srtf` (Shortest Remaining Time First)  
**Rationale:** SRTF minimises average waiting time when burst times vary significantly.
The overhead of frequent preemptions is acceptable for small process sets.

---

### 4. General / large workload (default)
**Condition:** None of the above conditions met  
**Recommendation:** `fcfs` (First Come First Served)  
**Rationale:** FCFS is simple, predictable, and has no overhead — a safe default for
general or unknown workloads.

---

## Variance Calculation

```
variance = Σ (burst_i − mean_burst)² / n
```

A variance below **2.0** indicates that burst times are clustered closely together.

---

## Extending the Engine

To add new heuristics, edit `backend/app/services/recommendation_engine.py`
and add conditions before the default `fcfs` fallback.
