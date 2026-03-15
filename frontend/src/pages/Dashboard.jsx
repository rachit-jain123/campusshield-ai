import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/stats")
      .then(res => setStats(res.data));
  }, []);

  if (!stats) return <p>Loading...</p>;

  return (
    <div className="grid grid-cols-3 gap-4 mt-6 text-white">
      <div className="bg-blue-900 p-4 rounded">
        Total Scans: {stats.total_scans}
      </div>
      <div className="bg-red-900 p-4 rounded">
        High Risk: {stats.high_risk}
      </div>
      <div className="bg-green-900 p-4 rounded">
        Safe: {stats.safe}
      </div>
    </div>
  );
}