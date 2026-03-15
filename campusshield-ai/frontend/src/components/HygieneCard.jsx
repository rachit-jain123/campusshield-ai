import { useState } from "react";
import API from "../api/api";

export default function HygieneCard() {
  const [score, setScore] = useState(null);

  const getScore = async () => {
    const res = await API.post("/hygiene?user_id=student1");
    setScore(res.data.hygiene_score);
  };

  return (
    <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold mb-4">
        Digital Hygiene Score
      </h2>

      <button
        onClick={getScore}
        className="bg-purple-500 hover:bg-purple-600 p-3 rounded-lg w-full"
      >
        Check Score
      </button>

      {score !== null && (
        <div className="mt-4 text-3xl font-bold text-center">
          {score} / 100
        </div>
      )}
    </div>
  );
}