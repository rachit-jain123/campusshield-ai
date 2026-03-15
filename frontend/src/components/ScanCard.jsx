import { useState } from "react";
import { scanText } from "../api/api";

function ScanCard({ setResult }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleScan = async () => {
    if (!input.trim()) return;

    setLoading(true);
    try {
      const response = await scanText({ text: input });
      setResult(response.data);
    } catch (error) {
      alert("Backend not connected!");
    }
    setLoading(false);
  };

  return (
    <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-3xl border border-gray-700">

      <h2 className="text-xl font-bold text-white mb-4">
        Analyze Suspicious Message / URL
      </h2>

      <textarea
        className="w-full p-4 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
        rows="5"
        placeholder="Paste suspicious URL or phishing message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button
        onClick={handleScan}
        className="mt-6 bg-green-500 hover:bg-green-600 text-black px-6 py-3 rounded-lg font-semibold w-full transition-all duration-300"
      >
        {loading ? "Scanning..." : "Scan Threat"}
      </button>
    </div>
  );
}

export default ScanCard;