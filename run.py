import subprocess
import os
import sys
import time
import signal

def run_project():
    # Get the absolute path of the KernelFlow directory
    base_dir = os.path.dirname(os.path.abspath(__file__))
    backend_dir = os.path.join(base_dir, "backend")
    frontend_dir = os.path.join(base_dir, "frontend")

    print("🚀 Starting KernelFlow Platform...")

    # 1. Start Backend
    print("📦 Initializing Backend...")
    # Determine the python path in venv
    venv_python = os.path.join(backend_dir, "venv", "bin", "python")
    
    # Run backend using uvicorn as a module
    backend_process = subprocess.Popen(
        [venv_python, "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"],
        cwd=backend_dir
    )

    # 2. Start Frontend
    print("🎨 Initializing Frontend...")
    frontend_process = subprocess.Popen(
        ["npm", "run", "dev"],
        cwd=frontend_dir
    )

    print("\n✅ Both services are starting!")
    print("🔗 Backend API: http://localhost:8000")
    print("🔗 Frontend UI: Check terminal output for Vite link (usually http://localhost:5173)")
    print("\nPress Ctrl+C to stop both services.\n")

    try:
        # Keep the script running
        while True:
            time.sleep(1)
            # Check if processes are still running
            if backend_process.poll() is not None:
                print("❌ Backend process stopped unexpectedly.")
                break
            if frontend_process.poll() is not None:
                print("❌ Frontend process stopped unexpectedly.")
                break
    except KeyboardInterrupt:
        print("\n🛑 Stopping services...")
    finally:
        # Gracefully terminate processes
        backend_process.terminate()
        frontend_process.terminate()
        print("👋 KernelFlow shut down successfully.")

if __name__ == "__main__":
    run_project()
