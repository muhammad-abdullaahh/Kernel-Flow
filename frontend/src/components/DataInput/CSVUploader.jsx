import React, { useRef, useState } from 'react';
import { Upload, FileCheck, X, AlertCircle } from 'lucide-react';
import { importApi } from '../../api/importApi';
import { useSimulationStore } from '../../store/simulationStore';

const CSVUploader = () => {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const { setProcesses } = useSimulationStore();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      setError("Please upload a valid CSV file");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const response = await importApi.uploadCsv(file);
      setProcesses(response.data.processes);
      setIsUploading(false);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to upload CSV");
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div 
        onClick={() => fileInputRef.current?.click()}
        className={`
          group relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-all cursor-pointer
          ${isUploading ? 'border-primary-500 bg-primary-500/5' : 'border-slate-800 hover:border-primary-500/50 hover:bg-slate-900/50'}
        `}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept=".csv"
          onChange={handleFileChange}
        />
        
        {isUploading ? (
          <div className="flex flex-col items-center animate-pulse">
            <Upload className="mb-2 text-primary-500" size={32} />
            <p className="text-sm font-medium text-primary-500">Processing File...</p>
          </div>
        ) : (
          <>
            <Upload className="mb-2 text-slate-500 group-hover:text-primary-500 transition-colors" size={32} />
            <p className="text-sm font-medium text-slate-300">Click to upload CSV</p>
            <p className="text-xs text-slate-500 mt-1">Required: pid, arrival_time, burst_time</p>
          </>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-rose-500/10 p-3 text-xs font-medium text-rose-500 border border-rose-500/20">
          <AlertCircle size={14} />
          {error}
          <button onClick={() => setError(null)} className="ml-auto">
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export default CSVUploader;
