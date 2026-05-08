# KernelFlow — API Reference

Base URL: `http://localhost:8000/api`

---

## Simulation

### `POST /start`
Start a new simulation.

**Body**
```json
{
  "processes": [
    { "pid": 1, "arrival_time": 0, "burst_time": 5, "priority": 0 }
  ],
  "algorithm": "fcfs",
  "time_quantum": 2
}
```

**Response** `200 OK`
```json
{ "status": "started", "state": { ... } }
```

---

### `POST /pause`
Pause the running simulation.

**Response** `200 OK`
```json
{ "status": "paused" }
```

---

### `POST /step`
Advance the simulation by one clock tick.

**Response** `200 OK`
```json
{ "status": "stepped", "state": { ... } }
```

---

### `POST /stop`
Stop and reset the simulation.

**Response** `200 OK`
```json
{ "status": "stopped" }
```

---

### `GET /state`
Return the current simulation snapshot.

---

## Algorithms

### `GET /algorithms`
List all available scheduling algorithms.

**Response**
```json
{
  "algorithms": [
    { "id": "fcfs", "name": "First Come First Served", "preemptive": false },
    ...
  ]
}
```

---

## Compare

### `POST /compare`
Run multiple algorithms on the same process set and return metrics for each.

**Body**
```json
{
  "processes": [ ... ],
  "algorithms": ["fcfs", "sjf", "rr"],
  "time_quantum": 2
}
```

---

## Recommend

### `POST /recommend`
Get a heuristic algorithm recommendation based on the workload.

**Body**
```json
{ "processes": [ ... ] }
```

**Response**
```json
{ "recommendation": { "algorithm": "srtf", "reason": "..." } }
```

---

## Import / Export

### `POST /upload-csv`
Upload a CSV file containing process data.

**Form Data:** `file` (CSV with columns: `pid`, `arrival_time`, `burst_time`, `priority`)

---

### `GET /export-report/{filename}`
Download a previously generated report.

---

## Metrics

### `POST /metrics`
Calculate performance metrics for a given algorithm and process set.

---

## WebSocket

### `WS /ws/simulation`
Real-time simulation updates. Connect and receive JSON state objects on each tick.
