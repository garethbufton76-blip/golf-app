import React, { useMemo, useState } from "react";

const cx = (...v) => v.filter(Boolean).join(" ");
const gold = "bg-gradient-to-b from-[#efe6bf] via-[#d1c79f] to-[#b7ab7d] text-black font-semibold";
const dark = "border border-[#d1c79f]/25 bg-black/40 text-white/90";
const panel = "rounded-[24px] border border-[#d1c79f]/25 bg-black/40 backdrop-blur-xl";
const inputClass = "w-full rounded-xl border border-[#d1c79f]/25 bg-black/45 px-3 py-2 text-sm text-white outline-none placeholder:text-white/35 focus:border-[#d1c79f]/55";

const TEAM = {
  red: { label: "R", title: "Team Red", grad: "from-[#9e2535] via-[#6f1725] to-[#2b080f]", bg: "from-[#381018] via-[#101010] to-black", dot: "bg-[#ff6d6d]" },
  blue: { label: "B", title: "Team Blue", grad: "from-[#244fb4] via-[#132a70] to-[#07102c]", bg: "from-[#10224e] via-[#101010] to-black", dot: "bg-[#67a6ff]" },
};

const BACKGROUND_IMAGES = {
  home: "https://i.ibb.co/B5MCPFwV/hf-20260406-212338-4e6f71fe-a63d-4837-9341-31237b0552c3.png",
  rosterP: "",
  rosterB: "",
  score: "",
  admin: "",
};

const playerOptions = [1, 2, 4, 6, 8, 10, 12];
const dayOptions = [1, 2, 3, 4];
const formats = ["Singles Match Play", "2-Ball Better Ball", "4 Player Stableford", "Foursomes", "2-Ball Ambrose", "Stableford", "Par / Bogey", "Chapman (Pinehurst)", "Greensomes"];
const minPlayers = { "Singles Match Play": 1, Stableford: 1, "Par / Bogey": 1, "2-Ball Better Ball": 2, "2-Ball Ambrose": 2, Foursomes: 2, "Chapman (Pinehurst)": 2, Greensomes: 2, "4 Player Stableford": 4 };
const times = ["7:00", "7:30", "8:00", "8:30", "9:00", "9:30", "10:00"];
const tees = ["Blue", "White", "Gold", "Red"];

const names = [
  ["Gareth Bufton", "4.0"], ["Mark McLeod", "7.0"], ["Nick Gerard", "10.0"], ["Jimmy Neale", "13.0"],
  ["Hayden Abercrombie", "16.0"], ["Areef Vohra", "19.0"], ["Player 7", "21.0"], ["Player 8", "23.0"],
  ["Player 9", "25.0"], ["Player 10", "27.0"], ["Player 11", "29.0"], ["Player 12", "31.0"],
];

const holeRows = [
  [1,399,1,4,378,2,4,351,6,4,378,17,5],[2,317,4,4,303,4,4,290,8,4,291,1,4],[3,170,10,3,166,12,3,130,16,3,133,12,3],
  [4,346,8,4,291,16,4,274,12,4,272,16,4],[5,203,6,3,170,10,3,129,18,3,150,9,3],[6,501,16,5,433,18,5,425,14,5,425,14,5],
  [7,492,14,5,472,8,5,441,2,5,446,3,5],[8,398,12,4,390,6,4,378,4,4,398,18,5],[9,298,18,4,287,14,4,263,10,4,275,7,4],
  [10,375,7,4,368,1,4,305,13,4,307,8,4],[11,373,3,4,339,5,4,325,5,4,328,2,4],[12,176,13,3,155,17,3,135,15,3,137,11,3],
  [13,472,15,5,457,11,5,385,1,4,385,13,5],[14,340,17,4,333,15,4,324,7,4,283,10,4],[15,206,11,3,200,13,3,171,17,3,179,15,3],
  [16,379,5,4,352,9,4,330,11,4,333,4,4],[17,498,2,5,417,7,5,402,3,4,403,5,5],[18,402,9,4,375,3,4,321,9,4,324,6,4],
];

const holesByTee = Object.fromEntries(holeRows.map(([hole, ...v]) => [hole, Object.fromEntries(tees.map((tee, i) => {
  const [metres, si, par] = v.slice(i * 3, i * 3 + 3);
  return [tee, { hole, metres, si, par }];
}))]));

const blankHoles = () => Array.from({ length: 18 }, (_, i) => ({ hole: i + 1, status: "pending" }));
const first = (name = "Player") => String(name).split(" ")[0];
const validFormats = (players) => formats.filter((f) => players >= (minPlayers[f] || 1));
const matchCount = (players, format) => /singles|stableford|par|bogey/i.test(format) && !/4 Player/i.test(format) ? players : Math.max(1, Math.ceil(players / 2));
const keyFor = (day, match) => `${day}-${match}`;
const shots = (allowance, si) => allowance < si ? 0 : 1 + Math.floor((allowance - si) / 18);
const stableford = (gross, par, shotCount) => Math.max(0, 2 + (par - (Number(gross) - shotCount)));

function Logo({ team, size = "h-24 w-24", small = false, src = "", letterClass = "", bare = false }) {
  const t = TEAM[team] || TEAM.red;
  const circleClass = cx(
    "relative inline-flex aspect-square shrink-0 items-center justify-center overflow-hidden rounded-full border border-[#d1c79f]/40 shadow-xl",
    size
  );
  if (src) {
    if (bare) {
      return <img src={src} alt="" className={cx("aspect-square shrink-0 rounded-full object-cover", size)} />;
    }
    return (
      <div className={cx(circleClass, "bg-black/40")}> 
        <img src={src} alt="" className="absolute inset-0 h-full w-full rounded-full object-cover" />
      </div>
    );
  }
  return <div className={cx(circleClass, "bg-gradient-to-br", t.grad)}>
    <div className="absolute inset-[6px] rounded-full border border-white/15" />
    <div className={cx("font-black leading-none text-transparent bg-clip-text bg-gradient-to-b from-[#fff4c8] via-[#d1c79f] to-[#8f8256]", letterClass || (small ? "text-[18px]" : "text-[58px]"))}>{t.label}</div>
  </div>;
}

function AdminIcon() {
  return <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#d1c79f]/50 bg-gradient-to-br from-[#efe6bf] via-[#d1c79f] to-[#8f8256] text-sm font-black text-black">⚙</div>;
}

function Button({ active, onClick, children, className = "" }) {
  return <button type="button" onClick={onClick} className={cx("rounded-xl py-2 text-sm", active ? gold : dark, className)}>{children}</button>;
}

function Select({ value, onChange, options, darkMode = false }) {
  return <select value={value} onChange={(e) => onChange(e.target.value)} className={cx("w-full rounded-xl border px-2.5 py-2 text-sm font-semibold outline-none", darkMode ? "border-[#d1c79f]/25 bg-[#0e241b]/80 text-white" : "border-[#d1c79f]/30 bg-gradient-to-b from-[#efe6bf] via-[#d1c79f] to-[#b7ab7d] text-black")}>{options.map((o) => <option key={o} value={o} className="bg-[#111] text-white">{o}</option>)}</select>;
}

function rosterMeta(list) {
  return list.map((p, i) => ({ ...p, slot: `SLOT ${i + 1}`, pair: i === 0 ? "CAPTAIN" : (i + 1) % 2 === 0 ? `PAIR ${Math.floor((i + 1) / 2)}` : "" }));
}

function makeRoster() {
  const makePlayer = ([name, handicap]) => ({ name, handicap, photo: "" });
  return {
    Red: rosterMeta(names.map(makePlayer)),
    Blue: rosterMeta([["Hayden Abercrombie", "4.0"], ...names.slice(1)].map(makePlayer)),
  };
}

function playersForMatch(roster, playersPerTeam, format, index) {
  const red = roster.Red.slice(0, playersPerTeam).map((p, rosterIndex) => ({ ...p, rosterIndex, team: "red" }));
  const blue = roster.Blue.slice(0, playersPerTeam).map((p, rosterIndex) => ({ ...p, rosterIndex, team: "blue" }));
  if (/singles|stableford|par|bogey/i.test(format) && !/4 Player/i.test(format)) return { red: red[index] ? [red[index]] : [], blue: blue[index] ? [blue[index]] : [] };
  return { red: red.slice(index * 2, index * 2 + 2), blue: blue.slice(index * 2, index * 2 + 2) };
}

function getResult(holes) {
  const done = holes.filter((h) => h.status !== "pending");
  const red = done.filter((h) => h.status === "red").length;
  const blue = done.filter((h) => h.status === "blue").length;
  const as = done.filter((h) => h.status === "as").length;
  const diff = red - blue;
  const left = 18 - done.length;
  if (!done.length || diff === 0) return { main: "ALL SQUARE", sub: `${red}-${blue}-${as} • ${left} TO PLAY`, leader: null };
  const leader = diff > 0 ? "red" : "blue";
  const lead = Math.abs(diff);
  if (lead > left) return { main: `${leader.toUpperCase()} ${lead}&${left}`, sub: "MATCH CLOSED", leader };
  if (lead === left && left > 0) return { main: `${leader.toUpperCase()} DORMIE`, sub: `${lead}UP • ${left} TO PLAY`, leader };
  return { main: `${leader.toUpperCase()} ${lead}UP`, sub: `${red}-${blue}-${as} • ${left} TO PLAY`, leader };
}

function matchSummary(holes) {
  const done = holes.filter((h) => h.status !== "pending");
  const result = getResult(holes);
  const official = { red: 0, blue: 0 };
  const live = { red: 0, blue: 0 };
  const allDone = done.length === 18;
  if (allDone) {
    const red = done.filter((h) => h.status === "red").length;
    const blue = done.filter((h) => h.status === "blue").length;
    red > blue ? official.red = 1 : blue > red ? official.blue = 1 : (official.red = official.blue = 0.5);
  }
  if (!allDone) result.leader ? live[result.leader] = 1 : done.length ? (live.red = live.blue = 0.5) : null;
  return { official, live };
}

function homeTotals(dayConfigs, days, players, states) {
  const total = { official: { red: 0, blue: 0 }, live: { red: 0, blue: 0 } };
  dayConfigs.slice(0, days).forEach((day, d) => {
    for (let m = 0; m < matchCount(players, day.format); m++) {
      const s = matchSummary(states[keyFor(d, m)] || blankHoles());
      ["official", "live"].forEach((type) => ["red", "blue"].forEach((team) => total[type][team] += s[type][team]));
    }
  });
  return total;
}

function DayButtons({ dayConfigs, days, active, setActive }) {
  const shown = dayConfigs.slice(0, days);
  return <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${shown.length}, minmax(0, 1fr))` }}>{shown.map((d, i) => <Button key={d.label} active={i === active} onClick={() => setActive(i)}>{d.label}</Button>)}</div>;
}

function MatchButtons({ count, active = 0, setActive }) {
  return <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${Math.min(6, count)}, minmax(0, 1fr))` }}>{Array.from({ length: count }, (_, i) => <Button key={i} active={i === active} onClick={() => setActive(i)} className="rounded-2xl py-3">Match {i + 1}</Button>)}</div>;
}

function Home({ setScreen, dayConfigs, days, players, activeDay, setActiveDay, totals, openMatch, teamLogos, teamNames }) {
  const count = matchCount(players, dayConfigs[activeDay].format);
  return (<>
    <div className="flex justify-center mt-4">
      <div className="relative">
        <img
          src="https://i.ibb.co/23Rs55J9/DUEL-LOGO.png"
          alt="DUEL"
          className="h-20 object-contain opacity-95 drop-shadow-[0_10px_30px_rgba(0,0,0,0.65)]"
        />
      </div>
    </div>
    <div className="mt-[108px] grid grid-cols-2 text-center">
      {[["red", "rosterP"], ["blue", "rosterB"]].map(([team, screen]) => (
        <button key={team} onClick={() => setScreen(screen)}>
          <Logo team={team} size="mx-auto h-36 w-36" src={teamLogos[team === "red" ? "Red" : "Blue"]} />
          <div className="mt-2 text-[11px] font-semibold tracking-[0.18em] text-white/75">{teamNames[team === "red" ? "Red" : "Blue"]}</div>
          <div className="text-[140px] font-black leading-none text-transparent bg-clip-text bg-gradient-to-b from-[#efe6bf] via-[#d1c79f] to-[#b7ab7d]">
            {totals.official[team]}
          </div>
        </button>
      ))}
    </div>
    <div className="mt-3 flex justify-center"><div className="inline-flex items-center gap-4 rounded-full border border-[#d1c79f]/20 bg-black/55 px-4 py-2 backdrop-blur-xl"><b>{totals.live.red}</b><span className="text-[11px] tracking-[0.18em] text-white/65">LIVE</span><b>{totals.live.blue}</b></div></div>
    <div className={cx("absolute bottom-[max(16px,env(safe-area-inset-bottom))] left-4 right-4 z-30 p-3", panel)}>
      <DayButtons dayConfigs={dayConfigs} days={days} active={activeDay} setActive={setActiveDay} />
      <div className="mt-2 text-[9px] tracking-[0.22em] text-white/60">MATCHES</div>
      <div className="mt-1.5"><MatchButtons count={count} setActive={openMatch} /></div>
    </div>
  </>);
}

function Roster({ team, setScreen, roster, setRoster, players, dayConfigs, days, activeDay, setActiveDay, teamLogos, teamNames }) {
  const [dragged, setDragged] = useState(null);
  const list = roster[team].slice(0, players);
  const move = (to) => {
    if (dragged == null || dragged === to) return;
    const next = [...roster[team]];
    const [item] = next.splice(dragged, 1);
    next.splice(to, 0, item);
    setRoster((r) => ({ ...r, [team]: rosterMeta(next) }));
    setDragged(null);
  };
  const pairs = Array.from({ length: Math.floor(list.length / 2) }, (_, i) => [list[i * 2], list[i * 2 + 1]]);
  return (<>
    <div className="flex items-center justify-between pt-2"><div className="text-sm font-semibold tracking-[0.18em] text-white/75">{teamNames[team]}</div><button onClick={() => setScreen("home")} className="rounded-full border border-white/15 bg-black/40 px-4 py-2 text-xs font-semibold">Back</button></div>
    <div className={cx("mt-3 p-3", panel)}><div className="mb-3 text-[10px] tracking-[0.24em] text-white/55">PAIRING PREVIEW</div><div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.max(1, Math.min(3, pairs.length))}, minmax(0, 1fr))` }}>{pairs.slice(0, 3).map(([a, b], i) => <div key={i} className="rounded-[20px] border border-[#d1c79f]/25 bg-black/30 p-3"><div className="mb-2 text-[10px] text-white/50">PAIR {i + 1}</div><div className="truncate text-xs font-semibold">{a.name}</div><div className="truncate text-xs font-semibold">{b.name}</div></div>)}</div></div>
    <div className="mt-2 flex-1 space-y-3 overflow-y-auto pb-3">{list.map((p, i) => <div key={`${p.name}-${i}`} draggable onDragStart={() => setDragged(i)} onDragOver={(e) => e.preventDefault()} onDrop={() => move(i)} className="rounded-[24px] border border-white/15 bg-black/35 p-3 backdrop-blur-xl"><div className="flex items-center gap-3"><Logo team={team === "Red" ? "red" : "blue"} size="h-14 w-14" small src={p.photo || teamLogos[team]} /><div className="min-w-0 flex-1"><div className="mb-1 flex gap-2"><span className="rounded-full border border-[#d1c79f]/25 px-2 py-0.5 text-[9px] text-white/55">DRAG</span><span className="text-[10px] text-white/50">{p.slot}</span>{p.pair && <span className="rounded-full bg-black/40 px-2 text-[10px] text-white/70">{p.pair}</span>}</div><div className="truncate text-[17px] font-medium">{first(p.name)}</div></div><div className="w-[92px] rounded-[18px] border border-[#d1c79f]/25 bg-black/35 px-3 py-3 text-center"><div className="text-[10px] text-white/50">HANDICAP</div><div className="text-[18px]">{p.handicap}</div></div></div></div>)}</div>
    <div className={cx("absolute bottom-[max(16px,env(safe-area-inset-bottom))] left-4 right-4 z-30 p-3", panel)}><DayButtons dayConfigs={dayConfigs} days={days} active={activeDay} setActive={setActiveDay} /></div>
  </>);
}

function Score({ setScreen, dayConfigs, players, activeDay, roster, states, setStates, scorecards, setScorecards, startMatch, teamLogos, teamNames }) {
  const day = dayConfigs[activeDay];
  const count = matchCount(players, day.format);
  const [activeMatch, setActiveMatch] = useState(startMatch || 0);
  const [selectedHole, setSelectedHole] = useState(null);
  const [cardPlayer, setCardPlayer] = useState(null);
  const [caddie, setCaddie] = useState(null);
  const [draft, setDraft] = useState({ red: 4, blue: 4, red_0: 4, red_1: 4, blue_0: 4, blue_1: 4 });
  const [teeShots, setTeeShots] = useState({});
  const stateKey = keyFor(activeDay, activeMatch);
  const teeKey = (team, hole) => `${stateKey}-${hole}-${team}`;
  const holes = states[stateKey] || blankHoles();
  const match = playersForMatch(roster, players, day.format, activeMatch);
  const result = getResult(holes);
  const displayMain = (() => {
    if (!result.leader) return result.main;
    const name = teamNames[result.leader === "red" ? "Red" : "Blue"];
    return result.main.replace(result.leader.toUpperCase(), name.toUpperCase());
  })();
  const current = holesByTee[1][day.tee];

  const playerKey = (team, p) => `${team}-${p.rosterIndex}-${p.name}`;
  const grossFor = (team, p, hole) => scorecards[playerKey(team, p)]?.[hole] ?? null;
  const saveHole = () => {
    if (!selectedHole) return;
    const redScore = Number(draft.red ?? selectedHole.par);
    const blueScore = Number(draft.blue ?? selectedHole.par);
    const redNet = redScore - shots(Math.max(0, Number(match.red[0]?.handicap || 0) - Number(match.blue[0]?.handicap || 0)), selectedHole.si);
    const blueNet = blueScore - shots(Math.max(0, Number(match.blue[0]?.handicap || 0) - Number(match.red[0]?.handicap || 0)), selectedHole.si);
    const status = redNet < blueNet ? "red" : blueNet < redNet ? "blue" : "as";
    setStates((s) => ({ ...s, [stateKey]: holes.map((h) => h.hole === selectedHole.hole ? { ...h, status } : h) }));
    setScorecards((s) => {
      const next = { ...s };
      match.red.forEach((p) => { const k = playerKey("red", p); next[k] = { ...(next[k] || {}), [selectedHole.hole]: redScore }; });
      match.blue.forEach((p) => { const k = playerKey("blue", p); next[k] = { ...(next[k] || {}), [selectedHole.hole]: blueScore }; });
      return next;
    });
    setSelectedHole(null);
  };

  const playerCard = (p, team) => Array.from({ length: 18 }, (_, i) => {
    const h = holesByTee[i + 1][day.tee];
    const gross = grossFor(team, p, h.hole);
    const shotCount = shots(Number(p.handicap || 0), h.si);
    const net = gross == null ? null : Math.max(1, Number(gross) - shotCount);
    return { ...h, gross, net, pts: gross == null ? null : stableford(gross, h.par, shotCount) };
  });

  const teamHandicap = (side) => {
    const total = side.reduce((sum, p) => sum + Number(p.handicap || 0), 0);
    if (/ambrose/i.test(day.format)) return Math.round(total / (side.length === 2 ? 4 : side.length === 4 ? 8 : Math.max(1, side.length * 2)));
    if (/foursomes/i.test(day.format)) return Math.round(total * 0.5);
    if (/chapman|pinehurst|greensomes/i.test(day.format)) return Math.round(total * 0.6);
    return Math.round(total);
  };

  const holeShotDots = (detail) => {
    const allPlayers = [...match.red, ...match.blue];
    if (allPlayers.length < 2) return { red: false, blue: false };

    if (/ambrose|foursomes|chapman|pinehurst|greensomes/i.test(day.format)) {
      const redHcp = teamHandicap(match.red);
      const blueHcp = teamHandicap(match.blue);
      const low = Math.min(redHcp, blueHcp);
      return {
        red: shots(Math.max(0, redHcp - low), detail.si) > 0,
        blue: shots(Math.max(0, blueHcp - low), detail.si) > 0,
      };
    }

    const lowMarker = Math.min(...allPlayers.map((p) => Number(p.handicap || 0)));
    return {
      red: match.red.some((p) => shots(Math.max(0, Number(p.handicap || 0) - lowMarker), detail.si) > 0),
      blue: match.blue.some((p) => shots(Math.max(0, Number(p.handicap || 0) - lowMarker), detail.si) > 0),
    };
  };

  const Hole = ({ h }) => {
    const detail = holesByTee[h.hole][day.tee];
    const status = h.status;
    const tone = status === "red" ? "from-[#7c2430]/95 to-[#47151d]/95 border-[#b54854]/40" : status === "blue" ? "from-[#415aaf]/95 to-[#29386c]/95 border-[#627dd7]/40" : status === "as" ? "from-[#5c5c5c]/95 to-[#2d2d2d]/95 border-white/15" : "from-black/50 to-black/30 border-white/5";
    const shotDot = holeShotDots(detail);
    const both = shotDot.red && shotDot.blue;
    const single = shotDot.red || shotDot.blue;

    return <button onClick={() => { setSelectedHole(detail); setDraft({ red: detail.par, blue: detail.par }); }} className={cx("relative h-[86px] rounded-[18px] border bg-gradient-to-b px-2 py-1 text-center", tone)}>
      <div className="absolute left-0 right-0 top-1 flex justify-center">
        {both ? (
          <div className="flex gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#ff6d6d] shadow-[0_0_7px_rgba(255,109,109,0.9)]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#67a6ff] shadow-[0_0_7px_rgba(103,166,255,0.9)]" />
          </div>
        ) : single ? (
          <span className={cx("h-1.5 w-1.5 rounded-full shadow-[0_0_7px_rgba(255,255,255,0.6)]", shotDot.red ? "bg-[#ff6d6d]" : "bg-[#67a6ff]")} />
        ) : null}
      </div>
      <div className="flex h-5 items-center justify-center">
        {status === "red" || status === "blue" ? (
          <Logo
            team={status}
            size="h-5 w-5"
            small
            src={teamLogos[status === "red" ? "Red" : "Blue"]}
            bare={Boolean(teamLogos[status === "red" ? "Red" : "Blue"])}
          />
        ) : status === "as" ? <span className="text-[9px]">AS</span> : null}
      </div>
      <div className="mt-0.5 text-[13px] font-medium">{h.hole}</div>
      <div className="mt-1 text-[9px] text-white/50">SI {detail.si}</div>
    </button>;
  };

  return (<>
    <div className="relative flex-1 overflow-y-auto pb-[220px]">
      <div className={cx("mt-6 rounded-[26px] border border-white/15 p-4 backdrop-blur-xl", result.leader === "red" ? "bg-gradient-to-b from-[#7c2430]/80 to-[#47151d]/80" : result.leader === "blue" ? "bg-gradient-to-b from-[#415aaf]/80 to-[#29386c]/80" : "bg-gradient-to-b from-[#5c5c5c]/70 to-[#2d2d2d]/70")}>
        <div className="mb-1 flex items-center justify-between text-[11px] font-semibold tracking-[0.22em] text-white/60"><div>{day.label.toUpperCase()} • ST MICHAELS • {day.tee.toUpperCase()}</div><button onClick={() => setScreen("home")} className="text-sm font-semibold tracking-normal text-white/85">Back</button></div>
        <div className="mb-2 text-center text-[11px] font-extrabold tracking-[0.32em] text-white/80">{day.format.toUpperCase()}</div>
        <div className="grid grid-cols-[minmax(0,1fr)_44px_minmax(0,1fr)] items-start gap-3">
          <TeamPlayers team="red" players={match.red} setCardPlayer={setCardPlayer} teamLogos={teamLogos} teamNames={teamNames} />
          <div className="flex h-[70px] items-center justify-center text-2xl font-bold text-white/75">VS</div>
          <TeamPlayers team="blue" players={match.blue} setCardPlayer={setCardPlayer} teamLogos={teamLogos} teamNames={teamNames} />
        </div>
        <div className="mt-1 text-center"><div className="text-[20px] font-extrabold tracking-[0.08em]">{displayMain}</div><div className="mt-0.5 text-[10px] tracking-[0.16em] text-white/55">{result.sub}</div></div>
      </div>

      <div className="relative mt-4 rounded-[26px] border border-white/10 bg-black/45 p-4 backdrop-blur-xl">
        <div className="mb-4 flex items-center justify-between"><div><div className="text-[10px] tracking-[0.22em] text-white/60">HOLE TRACKER</div><div className="text-[14px] font-bold tracking-[0.16em]">Hole {current.hole} • SI {current.si} • {current.metres}m</div></div><button onClick={() => setCaddie(current)} className="rounded-full border border-[#d1c79f]/25 bg-black/40 px-2 py-1 text-xs">Caddie</button></div>
        <div className="grid grid-cols-6 gap-2.5">{holes.map((h) => <Hole key={h.hole} h={h} />)}</div>

        {caddie && <Overlay><div className="mb-4 flex justify-between"><div><div className="text-[11px] tracking-[0.28em] text-white/60">CADDIE</div><div className="mt-2 text-[18px] font-bold">Hole {caddie.hole}</div><div className="mt-1 text-[11px] text-white/50">PAR {caddie.par} • {caddie.metres}M • SI {caddie.si}</div></div><Close onClick={() => setCaddie(null)} /></div><div className="rounded-[22px] border border-[#d1c79f]/20 bg-black/50 p-3 text-[13px] leading-6 text-white/90">Position first. Pick the sensible side, avoid the short-sided miss, and attack only when the angle and number are both right.</div></Overlay>}

        {cardPlayer && <Overlay tall><div className="mb-4 flex justify-between"><div><div className="text-[11px] tracking-[0.28em] text-[#d1c79f]/70">PLAYER SCORECARD</div><div className="mt-2 text-[18px] font-bold">{cardPlayer.p.name}</div><div className="mt-1 text-[11px] text-[#d1c79f]/65">{day.course} • {day.tee} TEE</div></div><Close onClick={() => setCardPlayer(null)} /></div><div className="grid grid-cols-6 gap-2 overflow-y-auto">{playerCard(cardPlayer.p, cardPlayer.team).map((h) => <div key={h.hole} className="rounded-[14px] border border-white/10 bg-black/45 p-2 text-center"><div className="text-[9px] text-white/45">HOLE</div><div className="text-[15px] font-bold">{h.hole}</div><div className="mt-1 text-[9px] text-white/45">PAR {h.par}</div><div className="mt-2 text-[18px] font-black text-[#d1c79f]">{h.gross == null ? "-" : h.gross}</div><div className="mt-1 text-[9px] text-white/55">{h.pts == null ? "" : `${h.pts} pts`}</div></div>)}</div></Overlay>}

        {selectedHole && <Overlay compact><div className="mb-3 flex justify-between"><div><div className="text-[11px] tracking-[0.28em] text-white/60">SCORE HOLE</div><div className="mt-2 text-[14px] font-bold tracking-[0.16em]">Hole {selectedHole.hole} • Par {selectedHole.par} • SI {selectedHole.si}</div></div><button onClick={saveHole} className="rounded-full border border-[#d1c79f]/40 bg-[#d1c79f]/15 px-4 py-2 text-sm font-semibold text-[#efe6bf]">Save</button></div><div className="grid grid-cols-2 gap-3"><div><ScoreBox team="red" players={match.red} score={draft.red} setScore={(v) => setDraft((d) => ({ ...d, red: v }))} par={selectedHole.par} />{match.red.length > 1 && <TeeShotPicker team="red" players={match.red} value={teeShots[teeKey("red", selectedHole.hole)] || ""} onChange={(name) => setTeeShots((t) => ({ ...t, [teeKey("red", selectedHole.hole)]: name }))} />}</div><div><ScoreBox team="blue" players={match.blue} score={draft.blue} setScore={(v) => setDraft((d) => ({ ...d, blue: v }))} par={selectedHole.par} />{match.blue.length > 1 && <TeeShotPicker team="blue" players={match.blue} value={teeShots[teeKey("blue", selectedHole.hole)] || ""} onChange={(name) => setTeeShots((t) => ({ ...t, [teeKey("blue", selectedHole.hole)]: name }))} />}</div></div></Overlay>}
      </div>
    </div>
    <div className={cx("absolute bottom-[max(16px,env(safe-area-inset-bottom))] left-4 right-4 z-30 p-3", panel)}><div className="mb-2 text-[9px] tracking-[0.22em] text-white/60">MATCHES</div><MatchButtons count={count} active={activeMatch} setActive={setActiveMatch} /></div>
  </>);
}

function TeamPlayers({ team, players, setCardPlayer, teamLogos }) {
  const fallbackLogo = teamLogos?.[team === "red" ? "Red" : "Blue"] || "";
  const logoSize = players.length > 1 ? "h-[50px] w-[50px]" : "h-[64px] w-[64px]";
  const letterSize = players.length > 1 ? "text-[26px]" : "text-[34px]";
  return (
    <div className="flex items-start justify-center gap-2 text-center">
      {players.map((p, i) => (
        <div key={`${p.name}-${i}`} className="flex w-[64px] flex-col items-center">
          <button onClick={() => setCardPlayer({ team, p })} className="flex h-[64px] items-center justify-center">
            <Logo team={team} size={logoSize} src={p.photo || fallbackLogo} letterClass={letterSize} />
          </button>
          <div className="mt-1 w-full truncate text-[11px] leading-tight text-white">{first(p.name)}</div>
        </div>
      ))}
    </div>
  );
}

function ScoreBox({ team, players, score, setScore, par }) {
  const namesText = players.map((p) => first(p.name)).join(" & ") || TEAM[team].title;
  return (
    <div className="w-full h-[128px] rounded-[20px] border border-[#d1c79f]/20 bg-black/55 backdrop-blur-xl overflow-hidden flex flex-col">
      <div className={cx("border-b px-3 py-1.5 text-center text-[11px] font-semibold tracking-[0.14em]", team === "red" ? "bg-[#6f2a33] text-[#f1dada]" : "bg-[#3f56a0] text-[#d6e1ff]")}>
        <span className="block truncate">{namesText}</span>
      </div>
      <div className="relative flex-1 min-h-0">
        <button onClick={() => setScore(Math.max(0, score - 1))} className="absolute left-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/65 text-white">−</button>
        <div className="flex h-full items-center justify-center text-[52px] font-extrabold leading-none">{score === par + 4 ? "P" : score}</div>
        <button onClick={() => setScore(Math.min(par + 4, score + 1))} className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/65 text-white">+</button>
      </div>
      <div className={cx("shrink-0 px-3 py-1.5 text-center text-[10px] font-semibold tracking-[0.18em]", team === "red" ? "bg-[#6f2a33] text-[#f1dada]" : "bg-[#3f56a0] text-[#d6e1ff]")}>{stableford(score, par, 0)} POINTS</div>
    </div>
  );
}

function TeeShotPicker({ team, players, value, onChange }) {
  return (
    <div className="mt-3 rounded-[16px] border border-[#d1c79f]/20 bg-black/35 p-2">
      <div className="mb-2 text-center text-[9px] font-semibold tracking-[0.18em] text-white/50">TEE SHOT USED</div>
      <div className="grid grid-cols-2 gap-1.5">
        {players.map((p) => (
          <button
            key={`${team}-${p.name}`}
            type="button"
            onClick={() => onChange(p.name)}
            className={cx(
              "rounded-full border px-2 py-1.5 text-[10px] font-semibold transition",
              value === p.name
                ? team === "red" ? "border-[#ff8b95]/40 bg-[#6f2a33] text-[#f1dada]" : "border-[#7fa2ff]/40 bg-[#3f56a0] text-[#d6e1ff]"
                : "border-white/10 bg-black/25 text-white/65"
            )}
          >
            {first(p.name)}
          </button>
        ))}
      </div>
    </div>
  );
}

function Overlay({ children, tall = false, compact = false }) {
  return <div className={cx("absolute inset-0 z-30", tall && "-top-[160px] bottom-[-55px]")}><div className={cx("h-full rounded-[26px] border border-[#d1c79f]/25 bg-black/90 backdrop-blur-xl shadow-2xl flex flex-col", compact ? "p-3" : "p-4")}>{children}</div></div>;
}

function Close({ onClick }) {
  return <button onClick={onClick} className="rounded-full border border-[#d1c79f]/40 bg-[#d1c79f]/15 px-3 py-1.5 text-xs font-semibold text-[#efe6bf]">Close</button>;
}

function Admin({ setScreen, players, setPlayers, days, setDays, dayConfigs, setDayConfigs, roster, setRoster, dayLocks, setDayLocks, teamLogos, setTeamLogos, teamNames, setTeamNames }) {
  const [adminMode, setAdminMode] = useState("event");
  const [editingTeam, setEditingTeam] = useState("Red");
  const readImageFile = (file, callback) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => callback(String(reader.result || ""));
    reader.readAsDataURL(file);
  };
  const setDay = (i, field, value) => {
    if (dayLocks[i]) return;
    setDayConfigs((ds) => ds.map((d, idx) => idx === i ? { ...d, [field]: value } : d));
  };
  const changePlayers = (count) => {
    setPlayers(count);
    setDayConfigs((ds) => ds.map((d) => validFormats(count).includes(d.format) ? d : { ...d, format: validFormats(count)[0] }));
  };
  const updatePlayer = (team, index, field, value) => {
    setRoster((current) => ({
      ...current,
      [team]: rosterMeta(current[team].map((p, i) => i === index ? { ...p, [field]: value } : p)),
    }));
  };
  const shownPlayers = roster[editingTeam].slice(0, players);

  return (<>
    <div className="flex items-center justify-between pt-2">
      <div className="flex gap-2">
        <Button active={adminMode === "event"} onClick={() => setAdminMode("event")} className="px-3 py-2 text-xs">Event</Button>
        <Button active={adminMode === "players"} onClick={() => setAdminMode("players")} className="px-3 py-2 text-xs">Players</Button>
      </div>
      <button onClick={() => setScreen("home")} className="rounded-full border border-white/15 bg-black/40 px-4 py-2 text-xs font-semibold">Back</button>
    </div>

    {adminMode === "event" ? (
      <>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <AdminPicker title="PLAYERS / TEAM" options={playerOptions} value={players} setValue={changePlayers} />
          <AdminPicker title="COMP DAYS" options={dayOptions} value={days} setValue={setDays} />
        </div>
        <div className="mt-3 flex-1 space-y-3 overflow-y-auto pb-3">
          {dayConfigs.slice(0, days).map((day, i) => {
            const locked = Boolean(dayLocks[i]);
            return (
              <div key={day.label} className={cx("rounded-[22px] border p-3 backdrop-blur-xl", locked ? "border-[#d1c79f]/35 bg-black/55" : "border-white/15 bg-black/40")}>
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold tracking-[0.18em] text-white/80">{day.label.toUpperCase()}</div>
                    <div className="mt-1 text-[10px] text-white/45">{locked ? "SETUP LOCKED" : "SETUP OPEN"}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDayLocks((locks) => ({ ...locks, [i]: !locks[i] }))}
                    className={cx("flex items-center gap-2 rounded-full border px-2 py-1.5 text-[10px] font-semibold", locked ? "border-[#d1c79f]/45 bg-[#d1c79f]/20 text-[#efe6bf]" : "border-white/15 bg-black/35 text-white/70")}
                  >
                    <span>{locked ? "LOCKED" : "OPEN"}</span>
                    <span className={cx("flex h-5 w-9 rounded-full p-0.5", locked ? "justify-end bg-[#d1c79f]/55" : "justify-start bg-white/15")}>
                      <span className="h-4 w-4 rounded-full bg-white" />
                    </span>
                  </button>
                </div>
                <div className={cx(locked && "pointer-events-none opacity-45")}>
                  <div className="mb-3 flex items-center gap-2"><div className="text-[9px] text-white/50">1ST TEE TIME</div><Select value={day.teeTime} onChange={(v) => setDay(i, "teeTime", v)} options={times} darkMode /></div>
                  <div className="grid grid-cols-3 gap-2"><div className="col-span-2"><Label>COURSE</Label><Select value={day.course} onChange={(v) => setDay(i, "course", v)} options={["St Michaels"]} /></div><div><Label>TEE</Label><Select value={day.tee} onChange={(v) => setDay(i, "tee", v)} options={tees} /></div></div>
                  <div className="mt-3"><Label>GAME FORMAT</Label><Select value={day.format} onChange={(v) => setDay(i, "format", v)} options={validFormats(players)} /><div className="mt-2 text-[10px] text-white/45">Only formats valid for the selected team size are shown.</div></div>
                </div>
              </div>
            );
          })}
        </div>
      </>
    ) : (
      <div className="mt-3 flex-1 overflow-y-auto pb-3">
        <div className="mb-4 rounded-[20px] border border-[#d1c79f]/25 bg-black/40 p-3">
          <div className="mb-2 text-[10px] tracking-[0.18em] text-white/50">TEAM SETUP</div>
          <div className="flex items-center gap-3">
            <label className="cursor-pointer">
              <Logo team={editingTeam === "Red" ? "red" : "blue"} size="h-16 w-16" src={teamLogos[editingTeam]} />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => readImageFile(e.target.files?.[0], (value) => setTeamLogos((t) => ({ ...t, [editingTeam]: value })))}
              />
            </label>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] tracking-[0.18em] text-white/45">TEAM NAME</div>
              <input
                className="mt-1 w-full bg-transparent text-[18px] font-semibold text-white outline-none"
                value={teamNames[editingTeam]}
                onChange={(e) => setTeamNames((names) => ({ ...names, [editingTeam]: e.target.value }))}
              />
              <div className="mt-1 text-[11px] leading-4 text-white/45">Tap logo to change image.</div>
            </div>
          </div>
        </div>
        <div className="mb-3 grid grid-cols-2 gap-2">
          <Button active={editingTeam === "Red"} onClick={() => setEditingTeam("Red")}>Team Red</Button>
          <Button active={editingTeam === "Blue"} onClick={() => setEditingTeam("Blue")}>Team Blue</Button>
        </div>
        <div className="mb-3 rounded-[18px] border border-[#d1c79f]/25 bg-black/35 p-3 text-[11px] leading-5 text-white/60">
          Tap a team logo or player image to replace it. Player images override the team logo on roster and match screens.
        </div>
        <div className="space-y-3">
          {shownPlayers.map((p, i) => {
            const teamKey = editingTeam === "Red" ? "red" : "blue";
            return (
              <div key={`${editingTeam}-${i}`} className="rounded-[22px] border border-white/15 bg-black/40 p-3 backdrop-blur-xl">
                <div className="mb-3 flex items-center gap-3">
                  <label className="relative cursor-pointer">
                    <Logo team={teamKey} size="h-14 w-14" small src={p.photo || teamLogos[editingTeam]} />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => readImageFile(e.target.files?.[0], (value) => updatePlayer(editingTeam, i, "photo", value))}
                    />
                  </label>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] tracking-[0.18em] text-white/45">{p.slot}</div>
                    <div className="mt-1 flex items-center gap-2">
                      <input
                        className="flex-1 bg-transparent text-[16px] font-semibold text-white outline-none"
                        value={p.name}
                        onChange={(e) => updatePlayer(editingTeam, i, "name", e.target.value)}
                      />
                      <input
                        className="w-[60px] rounded-lg border border-[#d1c79f]/25 bg-black/45 px-2 py-1 text-center text-sm text-white outline-none"
                        value={p.handicap}
                        onChange={(e) => updatePlayer(editingTeam, i, "handicap", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    )}
  </>);
}

function AdminPicker({ title, options, value, setValue }) {
  return <div className="rounded-[18px] border border-[#d1c79f]/25 bg-black/40 p-3"><div className="mb-2 text-[9px] tracking-[0.16em] text-white/50">{title}</div><div className="grid grid-cols-4 gap-1.5">{options.map((o) => <Button key={o} active={o === value} onClick={() => setValue(o)} className="rounded-lg py-2">{o}</Button>)}</div></div>;
}

function Label({ children }) {
  return <div className="mb-1.5 text-[9px] tracking-[0.14em] text-white/50">{children}</div>;
}

export default function App() {
  const [screen, setScreen] = useState("home");
  const [players, setPlayers] = useState(1);
  const [days, setDays] = useState(1);
  const [dayConfigs, setDayConfigs] = useState(Array.from({ length: 4 }, (_, i) => ({ label: `Day ${i + 1}`, teeTime: i < 2 ? "8:00" : "8:30", course: "St Michaels", tee: "Blue", format: "Singles Match Play" })));
  const [roster, setRoster] = useState(makeRoster);
  const [activeDay, setActiveDay] = useState(0);
  const [selectedMatch, setSelectedMatch] = useState(0);
  const [states, setStates] = useState({});
  const [scorecards, setScorecards] = useState({});
  const [dayLocks, setDayLocks] = useState({});
  const [teamLogos, setTeamLogos] = useState({ Red: "", Blue: "" });
  const [teamNames, setTeamNames] = useState({ Red: "Team Red", Blue: "Team Blue" });
  const totals = useMemo(() => homeTotals(dayConfigs, days, players, states), [dayConfigs, days, players, states]);
  const bg = screen === "rosterP" ? TEAM.red.bg : screen === "rosterB" ? TEAM.blue.bg : "from-[#092018] via-[#101010] to-black";
  const bgImage = BACKGROUND_IMAGES[screen] || BACKGROUND_IMAGES.home;

  const openMatch = (i) => { setSelectedMatch(i); setScreen("score"); };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white">
      <div className={cx("relative h-[780px] w-[390px] overflow-hidden rounded-3xl bg-gradient-to-b", bg)}>
        {bgImage && <img src={bgImage} alt="" className="absolute inset-0 h-full w-full object-cover object-center" />}
        <div className="absolute inset-0 bg-black/15" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(209,199,159,0.25),transparent_32%)]" />

        <div className="relative z-10 flex h-full flex-col p-4 pt-[max(16px,env(safe-area-inset-top))] pb-[max(16px,env(safe-area-inset-bottom))]">
          {screen === "home" && <Home setScreen={setScreen} dayConfigs={dayConfigs} days={days} players={players} activeDay={activeDay} setActiveDay={setActiveDay} totals={totals} openMatch={openMatch} teamLogos={teamLogos} teamNames={teamNames} />}
          {screen === "score" && <Score setScreen={setScreen} dayConfigs={dayConfigs} players={players} activeDay={activeDay} roster={roster} states={states} setStates={setStates} scorecards={scorecards} setScorecards={setScorecards} startMatch={selectedMatch} teamLogos={teamLogos} teamNames={teamNames} />}
          {screen === "rosterP" && <Roster team="Red" setScreen={setScreen} roster={roster} setRoster={setRoster} players={players} dayConfigs={dayConfigs} days={days} activeDay={activeDay} setActiveDay={setActiveDay} teamLogos={teamLogos} teamNames={teamNames} />}
          {screen === "rosterB" && <Roster team="Blue" setScreen={setScreen} roster={roster} setRoster={setRoster} players={players} dayConfigs={dayConfigs} days={days} activeDay={activeDay} setActiveDay={setActiveDay} teamLogos={teamLogos} teamNames={teamNames} />}
          {screen === "admin" && <Admin setScreen={setScreen} players={players} setPlayers={setPlayers} days={days} setDays={setDays} dayConfigs={dayConfigs} setDayConfigs={setDayConfigs} roster={roster} setRoster={setRoster} dayLocks={dayLocks} setDayLocks={setDayLocks} teamLogos={teamLogos} setTeamLogos={setTeamLogos} teamNames={teamNames} setTeamNames={setTeamNames} />}
          {screen === "home" && <button onClick={() => setScreen("admin")} className="absolute left-4 top-4"><AdminIcon /></button>}
        </div>
      </div>
    </div>
  );
}
