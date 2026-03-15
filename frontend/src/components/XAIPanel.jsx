import React from 'react';
import { AlertTriangle, CheckCircle, Info, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';

export default function XAIPanel({ result }) {
    if (!result) return null;

    const isSafe = result.risk_level === 'Safe';
    const isHighRisk = result.risk_level === 'High Risk';

    const StatusIcon = isSafe ? CheckCircle : isHighRisk ? ShieldAlert : AlertTriangle;
    const statusColor = isSafe ? 'text-emerald-400' : isHighRisk ? 'text-rose-500' : 'text-amber-400';
    const bgGradient = isSafe ? 'from-emerald-500/10 to-emerald-500/5' : isHighRisk ? 'from-rose-500/10 to-rose-500/5' : 'from-amber-500/10 to-amber-500/5';
    const borderCol = isSafe ? 'border-emerald-500/20' : isHighRisk ? 'border-rose-500/20' : 'border-amber-500/20';

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 space-y-6"
        >
            {/* Overview Card */}
            <div className={`glass-panel p-6 rounded-2xl border ${borderCol} bg-gradient-to-br ${bgGradient}`}>
                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-xl bg-slate-900/50 ${statusColor}`}>
                            <StatusIcon className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white mb-1">
                                {result.xai_analysis?.summary || `Scan Result: ${result.risk_level}`}
                            </h3>
                            <p className="text-sm text-slate-300 truncate max-w-sm" title={result.input}>
                                Scanned: <span className="text-slate-400 font-mono">{result.input}</span>
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className={`text-3xl font-black ${statusColor}`}>
                            {result.confidence.toFixed(1)}%
                        </div>
                        <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">
                            Confidence
                        </div>
                    </div>
                </div>
            </div>

            {/* XAI Details */}
            {result.xai_analysis?.reasons && result.xai_analysis.reasons.length > 0 && (
                <div className="space-y-4">
                    <h4 className="text-lg font-semibold flex items-center">
                        <Info className="w-5 h-5 mr-2 text-blue-400" />
                        AI Reasoning Breakdown
                    </h4>
                    <div className="grid gap-3">
                        {result.xai_analysis.reasons.map((reason, idx) => {
                            const impactCol = reason.impact === 'Critical' ? 'text-rose-400 border-rose-400/20 bg-rose-400/5' :
                                reason.impact === 'High' ? 'text-orange-400 border-orange-400/20 bg-orange-400/5' :
                                    reason.impact === 'Medium' ? 'text-amber-400 border-amber-400/20 bg-amber-400/5' :
                                        reason.impact === 'Positive' ? 'text-emerald-400 border-emerald-400/20 bg-emerald-400/5' :
                                            'text-blue-400 border-blue-400/20 bg-blue-400/5';
                            return (
                                <div key={idx} className={`p-4 rounded-xl border ${impactCol} flex items-start space-x-3`}>
                                    <div className="mt-0.5">•</div>
                                    <div>
                                        <div className="font-semibold mb-1">{reason.factor}</div>
                                        <div className="text-sm opacity-80">{reason.description}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </motion.div>
    );
}
