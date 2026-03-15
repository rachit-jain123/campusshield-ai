import React from "react";

export default function RiskMeter({ confidence }) {
  const color =
    confidence > 75 ? "red" :
    confidence > 40 ? "orange" : "green";

  return (
    <div className="text-center mt-4">
      <div
        className="w-40 h-40 rounded-full flex items-center justify-center mx-auto"
        style={{
          background: `conic-gradient(${color} ${confidence}%, #111 ${confidence}%)`
        }}
      >
        <div className="bg-black w-32 h-32 rounded-full flex items-center justify-center text-white text-xl font-bold">
          {confidence}%
        </div>
      </div>
    </div>
  );
}