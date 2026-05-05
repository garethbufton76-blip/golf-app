import React, { useMemo, useState } from "react";
import { holesByTee } from "../data/courseData";
import { blankHoles, first, getResult, shots, stableford } from "../utils/scoring";
import { makeRoster } from "../data/roster";
import { cx } from "./ui";

export default function Score({ setScreen }: any) {
  const tee = "Blue";
  const roster = useMemo(() => makeRoster(), []);
  const redPlayer = roster.Red[0];
  const bluePlayer = roster.Blue[0];

  const [holes, setHoles] = useState(blankHoles());
  const [selectedHole, setSelectedHole] = useState<any>(null);
  const [redScore, setRedScore] = useState(4);
  const [blueScore, setBlueScore] = useState(4);

  const result = getResult(holes);
  const nextHoleNumber = holes.find((h: any) => h.status === "pending")?.hole || 18;
  const current = (holesByTee as any)[nextHoleNumber][tee];

  function openHole(holeNumber: number) {
    const detail = (holesByTee as any)[holeNumber][tee];
    setSelectedHole(detail);
    setRedScore(detail.par);
    setBlueScore(detail.par);
  }

  function saveHole() {
    if (!selectedHole) return;

    const redNet =
      redScore -
      shots(
        Math.max(0, Number(redPlayer.handicap) - Number(bluePlayer.handicap)),
        selectedHole.si
      );

    const blueNet =
      blueScore -
      shots(
        Math.max(0, Number(bluePlayer.handicap) - Number(redPlayer.handicap)),
        selectedHole.si
      );

    const status = redNet < blueNet ? "red" : blueNet < redNet ? "blue" : "as";

    const updated = holes.map((h: any) =>
      h.hole === selectedHole.hole ? { ...h, status } : h
    );

    setHoles(updated);

    const next = updated.find((h: any) => h.status === "pending");

    if (next) {
      openHole(next.hole);
    } else {
      setSelectedHole(null);
    }
  }

  return (
    <div className="min-h-[100svh] bg-black p-4 text-white">
      {/* HEADER */}
      <div className="rounded-[26px] border border-white/15 bg-black/50 p-4">
        <div className="mb-2 flex justify-between">
          <div className="text-[11px] tracking-[0.22em] text-white/60">
            ST MICHAELS • {tee}
          </div>

          <button
            onClick={() => setScreen("home")}
            className="rounded-full border border-white/15 px-4 py-2 text-xs"
          >
            Back
          </button>
        </div>

        <div className="text-center text-[22px] font-black">
          {result.main}
        </div>

        <div className="text-center text-[10px] text-white/60">
          {result.sub}
        </div>
      </div>

      {/* HOLES */}
      <div className="mt-4 grid grid-cols-6 gap-2">
        {holes.map((h: any) => {
          const detail = (holesByTee as any)[h.hole][tee];

          return (
            <button
              key={h.hole}
              onClick={() => openHole(h.hole)}
              style={
                h.hole === nextHoleNumber
                  ? {
                      boxShadow:
                        "0 0 0 2px #d1c79f, 0 0 18px rgba(209,199,159,0.85)",
                      transform: "scale(1.05)",
                    }
                  : undefined
              }
              className={cx(
                "h-[86px] rounded-[18px] border text-center transition-all",
                h.status === "red" && "bg-red-900 border-red-500",
                h.status === "blue" && "bg-blue-900 border-blue-500",
                h.status === "as" && "bg-gray-700",
                h.status === "pending" && "bg-black/40 border-white/10"
              )}
            >
              <div className="text-[10px]">
                {h.status === "red" && "R"}
                {h.status === "blue" && "B"}
                {h.status === "as" && "AS"}
              </div>

              <div className="text-[14px] font-bold">{h.hole}</div>
              <div className="text-[9px] text-white/50">SI {detail.si}</div>
            </button>
          );
        })}
      </div>

      {/* POPUP */}
      {selectedHole && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70">
          <div className="w-[90%] max-w-[380px] bg-black p-4 rounded-xl border border-white/20">
            <div className="mb-4 flex justify-between">
              <div>
                Hole {selectedHole.hole} • Par {selectedHole.par}
              </div>

              <button onClick={saveHole}>Save</button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <ScoreBox
                name={first(redPlayer.name)}
                score={redScore}
                setScore={setRedScore}
                team="red"
                par={selectedHole.par}
              />

              <ScoreBox
                name={first(bluePlayer.name)}
                score={blueScore}
                setScore={setBlueScore}
                team="blue"
                par={selectedHole.par}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ScoreBox({ name, score, setScore, team, par }: any) {
  return (
    <div className="border p-3 rounded-lg text-center">
      <div className={team === "red" ? "text-red-400" : "text-blue-400"}>
        {name}
      </div>

      <div className="text-4xl">{score}</div>

      <div className="flex justify-between mt-2">
        <button onClick={() => setScore(score - 1)}>-</button>
        <button onClick={() => setScore(score + 1)}>+</button>
      </div>

      <div className="text-xs mt-2">
        {stableford(score, par, 0)} pts
      </div>
    </div>
  );
}
