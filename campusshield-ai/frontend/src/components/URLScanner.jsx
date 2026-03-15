import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import XAIPanel from './XAIPanel';

export default function URLScanner() {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleScan = async (e) => {
        e.preventDefault();
        if (!url) return;

        setLoading(true);
        setError('');
        setResult(null);

        try {
            const response = await fetch('http://127.0.0.1:8000/scan-url', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            });

            if (!response.ok) throw new Error('Failed to scan URL');
            const data = await response.json();
            setResult(data);
        } catch (err) {
            setError(err.message || 'An error occurred during scan.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full">
            <div className="glass-panel p-8 rounded-3xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <h3 className="text-2xl font-bold mb-2">URL Threat Scanner</h3>
                <p className="text-slate-400 mb-8">Analyze links for phishing attempts, credential masking, and malicious domains using our ML model.</p>

                <form onSubmit={handleScan} className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                        type="url"
                        required
                        placeholder="https://example.com/login"
                        className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-32 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-mono text-sm"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="absolute inset-y-2 right-2 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium rounded-xl transition-all shadow-lg disabled:opacity-50 flex items-center"
                    >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Scan URL'}
                    </button>
                </form>

                {error && (
                    <div className="mt-4 text-rose-400 text-sm">{error}</div>
                )}
            </div>

            <XAIPanel result={result} />
        </div>
    );
}
