import { formats, minPlayers } from "../data/constants";

export const blankHoles = () =>
  Array.from({ length: 18 }, (_, i) => ({ hole: i + 1, status: "pending" }));

export const first = (name = "Player") => String(name).split(" ")[0];

export const validFormats = (players: number) =>
  formats.filter((f) => players >= (minPlayers[f] || 1));

export const matchCount = (players: number, format: string) =>
  /singles|stableford|par|bogey/i.test(format) && !/4 Player/i.test(format)
    ? players
    : Math.max(1, Math.ceil(players / 2));

export const keyFor = (day: number, match: number) => `${day}-${match}`;

export const shots = (allowance: number, si: number) =>
  allowance < si ? 0 : 1 + Math.floor((allowance - si) / 18);

export const stableford = (gross: number, par: number, shotCount: number) =>
  Math.max(0, 2 + (par - (Number(gross) - shotCount)));

export function getResult(holes: any[]) {
  const done = holes.filter((h) => h.status !== "pending");
  const red = done.filter((h) => h.status === "red").length;
  const blue = done.filter((h) => h.status === "blue").length;
  const as = done.filter((h) => h.status === "as").length;
  const diff = red - blue;
  const left = 18 - done.length;

  if (!done.length || diff === 0) {
    return { main: "ALL SQUARE", sub: `${red}-${blue}-${as} • ${left} TO PLAY`, leader: null };
  }

  const leader = diff > 0 ? "red" : "blue";
  const lead = Math.abs(diff);

  if (lead > left) return { main: `${leader.toUpperCase()} ${lead}&${left}`, sub: "MATCH CLOSED", leader };
  if (lead === left && left > 0) return { main: `${leader.toUpperCase()} DORMIE`, sub: `${lead}UP • ${left} TO PLAY`, leader };

  return { main: `${leader.toUpperCase()} ${lead}UP`, sub: `${red}-${blue}-${as} • ${left} TO PLAY`, leader };
}

export function matchSummary(holes: any[]) {
  const done = holes.filter((h) => h.status !== "pending");
  const result = getResult(holes);
  const official = { red: 0, blue: 0 };
  const live = { red: 0, blue: 0 };

  const allDone = done.length === 18;

  if (allDone) {
    const red = done.filter((h) => h.status === "red").length;
    const blue = done.filter((h) => h.status === "blue").length;
    red > blue ? (official.red = 1) : blue > red ? (official.blue = 1) : ((official.red = 0.5), (official.blue = 0.5));
  }

  if (!allDone) {
    result.leader ? (live[result.leader] = 1) : done.length ? ((live.red = 0.5), (live.blue = 0.5)) : null;
  }

  return { official, live };
}
