# KernelFlow – CPU Scheduling Analysis Platform

KernelFlow is a comprehensive simulation platform designed to visualize, analyze, and compare various CPU scheduling algorithms.

## Features
- **Real-time Simulation**: Watch process state transitions (Ready, Running, Waiting) step-by-step.
- **Visualizations**: Live Gantt charts, Timeline flows, and Queue state diagrams.
- **6 Algorithms**: FCFS, SJF, SRTF, Round Robin, Priority Preemptive, and Priority Non-preemptive.
- **Performance Benchmarking**: Side-by-side comparison of multiple algorithms on the same dataset.
- **Intelligent Recommendations**: Heuristic engine that suggests the best algorithm for your workload.
- **Data Import/Export**: Upload process lists via CSV and export detailed performance reports.

## Tech Stack
- **Backend**: Python 3.10+, FastAPI, Pydantic, Pandas
- **Frontend**: React 18+, Vite, Tailwind CSS, D3.js, Zustand

## Setup Instructions

### Backend Setup
1. Navigate to `backend/`
2. Create a virtual environment: `python -m venv venv`
3. Activate it: `source venv/bin/activate` (Linux/Mac) or `venv\Scripts\activate` (Windows)
4. Install dependencies: `pip install -r requirements.txt`
5. Run the server: `uvicorn app.main:app --reload`
6. API Docs available at `http://localhost:8000/docs`

### Frontend Setup
1. Navigate to `frontend/`
2. Install dependencies: `npm install`
3. Start dev server: `npm run dev`
4. Open `http://localhost:5173` in your browser

### Docker Setup
Run both services with a single command:
```bash
docker-compose up --build
```

## Sample Data
You can find a sample CSV file in `backend/uploads/sample_processes.csv` to quickly test the import functionality.
