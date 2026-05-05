import React, { useMemo, useState } from "react";
import { holesByTee } from "../data/courseData";
import { blankHoles, first, getResult, shots, stableford } from "../utils/scoring";
import { makeRoster } from "../data/roster";
import { cx } from "./ui";

const gold = "#d1c79f";

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
    if (next) openHole(next.hole);
    else setSelectedHole(null);
  }

  return (
    <div className="min-h-[100svh] bg-[#050505] p-4 text-white">
      <div className="mx-auto max-w-[430px]">
        <div className="rounded-[28px] border border-[#d1c79f]/30 bg-gradient-to-b from-[#101010] to-black p-4 shadow-2xl">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-semibold tracking-[0.26em] text-white/50">
                ST MICHAELS • {tee.toUpperCase()}
              </div>
              <div className="mt-1 text-[12px] font-bold tracking-[0.18em]" style={{ color: gold }}>
                Hole {current.hole} • SI {current.si} • {current.metres}m
              </div>
            </div>

            <button
              onClick={() => setScreen("home")}
              className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white/80"
            >
              Back
            </button>
          </div>

          <div className="grid grid-cols-[1fr_46px_1fr] items-center gap-3">
            <PlayerBadge team="red" name={redPlayer.name} />
            <div className="text-center text-[22px] font-black text-white/65">VS</div>
            <PlayerBadge team="blue" name={bluePlayer.name} />
          </div>

          <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-center">
            <div className="text-[22px] font-black tracking-[0.08em]">
              {result.main}
            </div>
            <div className="mt-1 text-[10px] tracking-[0.18em] text-white/50">
              {result.sub}
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-[28px] border border-white/10 bg-gradient-to-b from-[#101010] to-black p-4 shadow-xl">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <div className="text-[10px] font-semibold tracking-[0.24em] text-white/45">
                HOLE TRACKER
              </div>
              <div className="mt-1 text-[15px] font-bold tracking-[0.08em]">
                Next: Hole <span style={{ color: gold }}>{current.hole}</span>
              </div>
            </div>

            <div
              className="rounded-full px-3 py-1 text-[10px] font-black tracking-[0.16em] text-black"
              style={{ background: gold }}
            >
              LIVE
            </div>
          </div>

          <div className="grid grid-cols-6 gap-2.5">
            {holes.map((h: any) => {
              const detail = (holesByTee as any)[h.hole][tee];
              const isCurrent = h.hole === nextHoleNumber;

              return (
                <button
                  key={h.hole}
                  onClick={() => openHole(h.hole)}
                  className={cx(
                    "relative h-[88px] rounded-[18px] border px-2 py-2 text-center transition-all",
                    h.status === "red" && "border-red-400/50 bg-gradient-to-b from-red-800 to-black",
                    h.status === "blue" && "border-blue-400/50 bg-gradient-to-b from-blue-800 to-black",
                    h.status === "as" && "border-white/20 bg-gradient-to-b from-neutral-700 to-black",
                    h.status === "pending" && "border-white/10 bg-gradient-to-b from-[#111] to-black"
                  )}
                  style={
                    isCurrent
                      ? {
                          border: `2px solid ${gold}`,
                          boxShadow:
                            "0 0 0 2px rgba(209,199,159,0.45), 0 0 20px rgba(209,199,159,0.75)",
                          transform: "scale(1.06)",
                          zIndex: 2,
                        }
                      : undefined
                  }
                >
                  {isCurrent && (
                    <div
                      className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full px-2 py-0.5 text-[8px] font-black text-black"
                      style={{ background: gold }}
                    >
                      NOW
                    </div>
                  )}

                  <div className="h-5 text-[10px] font-black">
                    {h.status === "red" && "R"}
                    {h.status === "blue" && "B"}
                    {h.status === "as" && "AS"}
                  </div>

                  <div className="mt-1 text-[16px] font-black">{h.hole}</div>
                  <div className="mt-1 text-[9px] text-white/45">SI {detail.si}</div>
                </button>
              );
            })}
          </div>
        </div>

        {selectedHole && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
            <div className="w-full max-w-[390px] rounded-[28px] border border-[#d1c79f]/35 bg-gradient-to-b from-[#101010] to-black p-4 shadow-2xl">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-semibold tracking-[0.26em] text-white/45">
                    SCORE HOLE
                  </div>
                  <div className="mt-1 text-[16px] font-black" style={{ color: gold }}>
                    Hole {selectedHole.hole} • Par {selectedHole.par} • SI {selectedHole.si}
                  </div>
                </div>

                <button
                  onClick={saveHole}
                  className="rounded-full px-5 py-2 text-sm font-black text-black"
                  style={{ background: gold }}
                >
                  Save
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
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
    </div>
  );
}

function PlayerBadge({ name, team }: any) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={cx(
          "flex h-16 w-16 items-center justify-center rounded-full border border-white/15 text-3xl font-black shadow-xl",
          team === "red"
            ? "bg-gradient-to-b from-red-600 to-red-950"
            : "bg-gradient-to-b from-blue-500 to-blue-950"
        )}
      >
        {team === "red" ? "R" : "B"}
      </div>
      <div className="mt-2 max-w-[90px] truncate text-[12px] font-semibold">
        {first(name)}
      </div>
    </div>
  );
}

function ScoreBox({ name, score, setScore, team, par }: any) {
  return (
      <div style={{ color: "#d1c79f", textAlign: "center", marginBottom: 10 }}>
    SCORE SCREEN LIVE
  </div>
    <div className="overflow-hidden rounded-[22px] border border-[#d1c79f]/20 bg-black/60">
      <div
        className={cx(
          "px-3 py-2 text-center text-[11px] font-black tracking-[0.12em]",
          team === "red" ? "bg-red-900 text-red-100" : "bg-blue-900 text-blue-100"
        )}
      >
        {name}
      </div>

      <div className="relative h-[112px]">
        <button
          onClick={() => setScore(Math.max(0, score - 1))}
          className="absolute left-3 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full border border-white/20 bg-black/75 text-2xl font-black"
        >
          −
        </button>

        <div className="flex h-full items-center justify-center text-[64px] font-black">
          {score === par + 4 ? "P" : score}
        </div>

        <button
          onClick={() => setScore(Math.min(par + 4, score + 1))}
          className="absolute right-3 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full border border-white/20 bg-black/75 text-2xl font-black"
        >
          +
        </button>
      </div>

      <div
        className={cx(
          "px-3 py-2 text-center text-[10px] font-bold tracking-[0.16em]",
          team === "red" ? "bg-red-900 text-red-100" : "bg-blue-900 text-blue-100"
        )}
      >
        {stableford(score, par, 0)} POINTS
      </div>
    </div>
  );
}
