import { useState } from "react";
import API from "../api/api";

export default function LoginRisk() {
  const [result, setResult] = useState(null);

  const checkLogin = async () => {
    const res = await API.post("/login-check", {
      user_id: "student1",
      new_device: true,
      new_location: true
    });
    setResult(res.data);
  };

  return (
    <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold mb-4">
        Login Risk Simulation
      </h2>

      <button
        onClick={checkLogin}
        className="bg-red-500 hover:bg-red-600 p-3 rounded-lg w-full"
      >
        Simulate Suspicious Login
      </button>

      {result && (
        <div className="mt-4">
          <p className="font-bold">{result.action}</p>
          <p>Risk Score: {result.risk_score}</p>
          <ul className="list-disc ml-6">
            {result.reasons.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}