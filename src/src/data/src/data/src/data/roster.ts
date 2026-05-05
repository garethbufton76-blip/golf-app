const names = [
  ["Gareth Bufton", "4.0"],
  ["Mark McLeod", "7.0"],
  ["Nick Gerard", "10.0"],
  ["Jimmy Neale", "13.0"],
  ["Hayden Abercrombie", "16.0"],
  ["Areef Vohra", "19.0"],
  ["Player 7", "21.0"],
  ["Player 8", "23.0"],
  ["Player 9", "25.0"],
  ["Player 10", "27.0"],
  ["Player 11", "29.0"],
  ["Player 12", "31.0"],
];

export function rosterMeta(list: any[]) {
  return list.map((p, i) => ({
    ...p,
    slot: `SLOT ${i + 1}`,
    pair: i === 0 ? "CAPTAIN" : (i + 1) % 2 === 0 ? `PAIR ${Math.floor((i + 1) / 2)}` : "",
  }));
}

export function makeRoster() {
  const makePlayer = ([name, handicap]: string[]) => ({ name, handicap, photo: "" });

  return {
    Red: rosterMeta(names.map(makePlayer)),
    Blue: rosterMeta([["Hayden Abercrombie", "4.0"], ...names.slice(1)].map(makePlayer)),
  };
}
