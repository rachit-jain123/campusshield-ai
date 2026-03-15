import { AlertTriangle, ShieldCheck, Activity } from "lucide-react";

function RiskBar({ score }) {
  return (
    <div className="w-full bg-gray-700 rounded-full h-4 mt-2">
      <div
        className="h-4 rounded-full transition-all duration-700 ease-out"
        style={{
          width: `${score}%`,
          background:
            score >= 70
              ? "#ef4444"
              : score >= 40
              ? "#facc15"
              : "#22c55e",
        }}
      />
    </div>
  );
}

function ResultCard({ result }) {
  if (!result) return null;

  const { risk_score, category, services } = result;

  return (
    <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-3xl mt-8 border border-gray-700">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">
          Threat Analysis Report
        </h2>
        {risk_score >= 70 ? (
          <AlertTriangle className="text-red-500" />
        ) : (
          <ShieldCheck className="text-green-500" />
        )}
      </div>

      {/* Risk Score */}
      <div className="mt-6">
        <p className="text-gray-300 text-lg">
          Risk Score: 
          <span className="ml-2 font-bold text-white">
            {risk_score}%
          </span>
        </p>

        <RiskBar score={risk_score} />

        <p className="mt-3 text-gray-400">
          Category: <span className="font-semibold text-white">{category}</span>
        </p>
      </div>

      {/* Services Breakdown */}
      <div className="grid md:grid-cols-3 gap-6 mt-8">

        {/* Keyword Analysis */}
        <div className="bg-gray-900 p-5 rounded-xl border border-gray-700">
          <h3 className="text-green-400 font-semibold flex items-center gap-2">
            <Activity size={18} /> Keyword Analysis
          </h3>

          <p className="text-gray-400 mt-2 text-sm">
            Score: {services.keyword_analysis.keyword_score}
          </p>

          <ul className="mt-3 text-gray-300 text-sm space-y-1">
            {services.keyword_analysis.matched_keywords.length > 0 ? (
              services.keyword_analysis.matched_keywords.map((k, i) => (
                <li key={i}>• {k}</li>
              ))
            ) : (
              <li>No suspicious keywords</li>
            )}
          </ul>
        </div>

        {/* URL Analysis */}
        <div className="bg-gray-900 p-5 rounded-xl border border-gray-700">
          <h3 className="text-yellow-400 font-semibold">
            URL Analysis
          </h3>

          <p className="text-gray-400 mt-2 text-sm">
            Score: {services.url_analysis.url_score}
          </p>

          <ul className="mt-3 text-gray-300 text-sm space-y-1">
            {services.url_analysis.url_flags.length > 0 ? (
              services.url_analysis.url_flags.map((flag, i) => (
                <li key={i}>• {flag}</li>
              ))
            ) : (
              <li>No suspicious URL patterns</li>
            )}
          </ul>
        </div>

        {/* Hygiene Analysis */}
        <div className="bg-gray-900 p-5 rounded-xl border border-gray-700">
          <h3 className="text-blue-400 font-semibold">
            Hygiene Score
          </h3>

          <p className="text-gray-300 mt-4 text-2xl font-bold">
            {services.hygiene_analysis.hygiene_score}%
          </p>

          <p className="text-gray-500 text-sm mt-2">
            Overall structural safety indicator.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ResultCard;