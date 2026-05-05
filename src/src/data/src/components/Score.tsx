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
      <div className="rounded-[26px] border border-white/15 bg-black/50 p-4">
        <div className="mb-2 flex items-center justify-between">
          <div className="text-[11px] font-semibold tracking-[0.22em] text-white/60">
            ST MICHAELS • {tee.toUpperCase()}
          </div>

          <button
            onClick={() => setScreen("home")}
            className="rounded-full border border-white/15 bg-black/40 px-4 py-2 text-xs font-semibold"
          >
            Back
          </button>
        </div>

        <div className="text-center text-[11px] font-black tracking-[0.28em] text-white/80">
          SINGLES MATCH PLAY
        </div>

        <div className="mt-4 grid grid-cols-[1fr_44px_1fr] items-center gap-3 text-center">
          <PlayerBadge name={redPlayer.name} team="red" />
          <div className="text-2xl font-bold text-white/70">VS</div>
          <PlayerBadge name={bluePlayer.name} team="blue" />
        </div>

        <div className="mt-4 text-center">
          <div className="text-[22px] font-black tracking-[0.08em]">
            {result.main}
          </div>
          <div className="mt-1 text-[10px] tracking-[0.18em] text-white/55">
            {result.sub}
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-[26px] border border-white/10 bg-black/45 p-4">
        <div className="mb-4">
          <div className="text-[10px] tracking-[0.22em] text-white/60">
            HOLE TRACKER
          </div>
          <div className="text-[14px] font-bold tracking-[0.16em]">
            Hole {current.hole} • SI {current.si} • {current.metres}m
          </div>
        </div>

        <div className="grid grid-cols-6 gap-2.5">
          {holes.map((h: any) => {
            const detail = (holesByTee as any)[h.hole][tee];

            return (
              <button
                key={h.hole}
                onClick={() => openHole(h.hole)}
                className={cx(
                  "h-[86px] rounded-[18px] border bg-gradient-to-b px-2 py-1 text-center transition-all",
                  h.status === "red" && "border-red-400/40 from-red-900 to-black",
                  h.status === "blue" && "border-blue-400/40 from-blue-900 to-black",
                  h.status === "as" && "border-white/20 from-neutral-700 to-black",
                  h.status === "pending" && "border-white/10 from-black/60 to-black/30",
                  h.hole === nextHoleNumber &&
                   "scale-[1.05] border-[#d1c79f] shadow-[0_0_0_2px_#d1c79f,0_0_16px_rgba(209,199,159,0.75)]"
                )}
              >
                <div className="h-5 text-[10px] font-bold">
                  {h.status === "red" && "R"}
                  {h.status === "blue" && "B"}
                  {h.status === "as" && "AS"}
                </div>

                <div className="text-[13px] font-medium">{h.hole}</div>
                <div className="mt-1 text-[9px] text-white/50">
                  SI {detail.si}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {selectedHole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-[390px] rounded-[26px] border border-[#d1c79f]/25 bg-black p-4">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-[11px] tracking-[0.28em] text-white/60">
                  SCORE HOLE
                </div>
                <div className="mt-2 text-[14px] font-bold tracking-[0.16em]">
                  Hole {selectedHole.hole} • Par {selectedHole.par} • SI{" "}
                  {selectedHole.si}
                </div>
              </div>

              <button
                onClick={saveHole}
                className="rounded-full border border-[#d1c79f]/40 bg-[#d1c79f]/15 px-4 py-2 text-sm font-semibold text-[#efe6bf]"
              >
                Save
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <ScoreBox
                team="red"
                name={first(redPlayer.name)}
                score={redScore}
                setScore={setRedScore}
                par={selectedHole.par}
              />

              <ScoreBox
                team="blue"
                name={first(bluePlayer.name)}
                score={blueScore}
                setScore={setBlueScore}
                par={selectedHole.par}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PlayerBadge({ name, team }: any) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={cx(
          "flex h-16 w-16 items-center justify-center rounded-full text-3xl font-black",
          team === "red" ? "bg-red-800" : "bg-blue-800"
        )}
      >
        {team === "red" ? "R" : "B"}
      </div>
      <div className="mt-1 text-[11px]">{first(name)}</div>
    </div>
  );
}

function ScoreBox({ team, name, score, setScore, par }: any) {
  return (
    <div className="overflow-hidden rounded-[20px] border border-[#d1c79f]/20 bg-black/55">
      <div
        className={cx(
          "px-3 py-2 text-center text-[11px] font-semibold tracking-[0.14em]",
          team === "red" ? "bg-red-900 text-red-100" : "bg-blue-900 text-blue-100"
        )}
      >
        {name}
      </div>

      <div className="relative h-[92px]">
        <button
          onClick={() => setScore(Math.max(0, score - 1))}
          className="absolute left-3 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full border border-white/20 bg-black/65 text-xl"
        >
          −
        </button>

        <div className="flex h-full items-center justify-center text-[56px] font-black">
          {score === par + 4 ? "P" : score}
        </div>

        <button
          onClick={() => setScore(Math.min(par + 4, score + 1))}
          className="absolute right-3 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full border border-white/20 bg-black/65 text-xl"
        >
          +
        </button>
      </div>

      <div
        className={cx(
          "px-3 py-2 text-center text-[10px] font-semibold tracking-[0.18em]",
          team === "red" ? "bg-red-900 text-red-100" : "bg-blue-900 text-blue-100"
        )}
      >
        {stableford(score, par, 0)} POINTS
      </div>
    </div>
  );
}
