export default function TeachBack({ result }) {

  if (result.risk_level === "Safe") {
    return (
      <div className="bg-green-900 p-4 mt-4 rounded">
        ✅ This looks safe. Always verify URLs manually.
      </div>
    );
  }

  return (
    <div className="bg-red-900 p-4 mt-4 rounded text-white">
      <h3 className="font-bold">Why This Is Dangerous:</h3>
      <ul className="list-disc ml-6">
        <li>Attackers use urgency & fear tactics.</li>
        <li>Fake login pages steal credentials.</li>
        <li>Never click unknown links.</li>
        <li>Always check domain carefully.</li>
      </ul>
    </div>
  );
}