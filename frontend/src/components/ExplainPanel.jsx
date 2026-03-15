export default function ExplainPanel({ result }) {
  return (
    <div className="bg-gray-900 p-4 rounded mt-4 text-white">
      <h2 className="text-xl font-bold mb-2">Why this result?</h2>
      <p><strong>ML Prediction:</strong> {result.ml_prediction}</p>
      <p><strong>Confidence:</strong> {result.confidence}%</p>
      <p><strong>Matched Suspicious Keywords:</strong></p>
      <ul>
        {result.matched_keywords.map((word, index) => (
          <li key={index}>⚠ {word}</li>
        ))}
      </ul>
    </div>
  );
}