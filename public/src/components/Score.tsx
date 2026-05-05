import React, { useState } from "react";

const gold = "#d1c79f";

export default function Score({ setScreen }: any) {
  const [holes, setHoles] = useState(
    Array.from({ length: 18 }, (_, i) => ({
      hole: i + 1,
      status: "pending",
    }))
  );

  const nextHole = holes.find(h => h.status === "pending")?.hole || 18;

  function setResult(hole: number, result: string) {
    setHoles(holes.map(h =>
      h.hole === hole ? { ...h, status: result } : h
    ));
  }

  return (
    <div className="min-h-[100svh] bg-black p-4 text-white">
      <div className="max-w-[430px] mx-auto">

        {/* HEADER */}
        <div className="mb-4 flex justify-between items-center">
          <div className="text-sm">Match Play</div>
          <button onClick={() => setScreen("home")}>Back</button>
        </div>

        {/* HOLES GRID */}
        <div className="grid grid-cols-6 gap-2">
          {holes.map(h => {
            const isCurrent = h.hole === nextHole;

            return (
              <button
                key={h.hole}
                onClick={() => setResult(h.hole, "red")}
                style={
                  isCurrent
                    ? {
                        border: `2px solid ${gold}`,
                        boxShadow: `0 0 12px ${gold}`,
                        transform: "scale(1.05)"
                      }
                    : undefined
                }
                className="h-[70px] rounded-lg border border-white/20"
              >
                <div>{h.hole}</div>
                <div className="text-xs">
                  {h.status === "red" && "R"}
                  {h.status === "blue" && "B"}
                  {h.status === "as" && "AS"}
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
}
