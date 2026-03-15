import { useState } from "react";
import API from "../api/api";
import RiskMeter from "./RiskMeter";

export default function Scanner() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState(null);

  const scanURL = async () => {
    const res = await API.post("/scan", {
      url,
      user_id: "student1"
    });
    setResult(res.data);
  };

  return (
    <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Phishing URL Scanner</h2>

      <input
        type="text"
        placeholder="Enter URL..."
        className="w-full p-3 rounded-lg bg-slate-700"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      <button
        onClick={scanURL}
        className="mt-4 w-full bg-cyan-500 hover:bg-cyan-600 p-3 rounded-lg font-semibold"
      >
        Scan Now
      </button>

      {result && (
        <div className="mt-6">
          <RiskMeter score={result.risk_score} />
          <div className="mt-4">
            <p className="font-bold">{result.explanation.summary}</p>
            <ul className="list-disc ml-6 mt-2">
              {result.explanation.reasons.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}