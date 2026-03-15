import React, { useState, useRef } from 'react';
import { UploadCloud, File, Loader2, X } from 'lucide-react';
import XAIPanel from './XAIPanel';

export default function DocumentScanner() {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileChange(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (selectedFile) => {
        console.log("File picker onChange triggered. Selected File:", selectedFile);
        setError('');
        setResult(null);
        if (selectedFile) {
            const fileName = selectedFile.name.toLowerCase();
            console.log("Extracted filename:", fileName);
            if (!fileName.endsWith('.pdf') && !fileName.endsWith('.txt')) {
                console.error("Validation failed: Not a pdf or txt.");
                setError('Please upload a valid .pdf or .txt file');
                setFile(null);
                return;
            }
            console.log("Validation passed! Setting file state.");
            setFile(selectedFile);
        } else {
            console.warn("onChange triggered but selectedFile is null/undefined.");
        }
    };

    const handleScan = async () => {
        if (!file) return;

        console.log("Starting document scan for file:", file.name, "Size:", file.size);
        setLoading(true);
        setError('');
        setResult(null);

        const formData = new FormData();
        formData.append('file', file);

        console.log("FormData prepared:", formData.get('file'));

        try {
            console.log("Executing fetch to http://127.0.0.1:8000/scan-doc ...");
            const response = await fetch('http://127.0.0.1:8000/scan-doc', {
                method: 'POST',
                body: formData
            });

            console.log("Fetch response received. Status:", response.status);
            if (!response.ok) {
                const errData = await response.json();
                console.error("Backend Error Data:", errData);
                throw new Error(errData.detail || 'Failed to scan document');
            }

            const data = await response.json();
            setResult(data);
        } catch (err) {
            setError(err.message || 'An error occurred during scan.');
        } finally {
            setLoading(false);
        }
    };

    const clearFile = () => {
        setFile(null);
        setResult(null);
        setError('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="w-full">
            <div className="glass-panel p-8 rounded-3xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <h3 className="text-2xl font-bold mb-2">Document Risk Scan</h3>
                <p className="text-slate-400 mb-8">Upload PDF or Text files to hunt for embedded malicious links or advanced social engineering tactics.</p>

                {!file ? (
                    <div
                        className={`border-2 border-dashed rounded-3xl p-12 text-center transition-all ${isDragging
                            ? 'border-emerald-500 bg-emerald-500/10'
                            : 'border-white/20 bg-slate-900/50 hover:border-emerald-500/50 hover:bg-slate-900/80'
                            }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <input
                            type="file"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-50"
                            accept=".pdf,.txt"
                            onChange={(e) => {
                                if (e.target.files && e.target.files.length > 0) {
                                    handleFileChange(e.target.files[0]);
                                }
                            }}
                        />
                        <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-4 text-emerald-400 shadow-xl relative z-10 pointer-events-none">
                            <UploadCloud className="w-8 h-8" />
                        </div>
                        <p className="text-lg font-medium text-slate-200 mb-1 relative z-10 pointer-events-none">Drag and drop file here</p>
                        <p className="text-sm text-slate-400 relative z-10 pointer-events-none">or click to browse (.pdf, .txt max 10MB)</p>
                    </div>
                ) : (
                    <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 relative">
                        <button
                            onClick={clearFile}
                            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <div className="flex items-center space-x-4 mb-6">
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                                <File className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-slate-200 truncate max-w-[200px] md:max-w-md" title={file.name}>{file.name}</h4>
                                <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(1)} KB</p>
                            </div>
                        </div>
                        <button
                            onClick={handleScan}
                            disabled={loading}
                            className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-emerald-500/25 disabled:opacity-50 flex items-center justify-center text-lg"
                        >
                            {loading ? <Loader2 className="w-6 h-6 animate-spin mr-2" /> : null}
                            {loading ? 'Analyzing Source Document...' : 'Scan Document Now'}
                        </button>
                    </div>
                )}

                {error && (
                    <div className="mt-4 text-rose-400 text-sm text-center">{error}</div>
                )}
            </div>

            <XAIPanel result={result} />
        </div>
    );
}
