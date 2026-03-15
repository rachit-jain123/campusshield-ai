import React, { useState } from 'react';
import { AlignLeft, Loader2 } from 'lucide-react';
import XAIPanel from './XAIPanel';

export default function TextScanner() {
    const [text, setText] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    const handleScan = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;

        setLoading(true);
        setError('');
        setResult(null);

        try {
            const response = await fetch('http://127.0.0.1:8000/scan-text', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text })
            });

            if (!response.ok) throw new Error('Failed to analyze text');
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
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <h3 className="text-2xl font-bold mb-2">Text & Message Analyzer</h3>
                <p className="text-slate-400 mb-8">Paste suspicious emails, SMS messages, or social media posts to detect potential social engineering attempts.</p>

                <form onSubmit={handleScan} className="relative group">
                    <div className="absolute top-4 left-4 pointer-events-none text-slate-400 group-focus-within:text-indigo-400 transition-colors">
                        <AlignLeft className="h-5 w-5" />
                    </div>
                    <textarea
                        required
                        rows="5"
                        placeholder="Paste suspicious message here..."
                        className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-mono text-sm resize-none"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    ></textarea>

                    <div className="flex justify-end mt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium rounded-xl transition-all shadow-lg shadow-indigo-500/25 disabled:opacity-50 flex items-center"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                            {loading ? 'Analyzing...' : 'Analyze Message'}
                        </button>
                    </div>
                </form>

                {error && (
                    <div className="mt-4 text-rose-400 text-sm">{error}</div>
                )}
            </div>

            <XAIPanel result={result} />
        </div>
    );
}
