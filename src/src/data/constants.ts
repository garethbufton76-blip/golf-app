export const STORAGE_KEY = "dual-in-the-dunes-v1";

export const playerOptions = [1, 2, 4, 6, 8, 10, 12];
export const dayOptions = [1, 2, 3, 4];

export const formats = [
  "Singles Match Play",
  "2-Ball Better Ball",
  "4 Player Stableford",
  "Foursomes",
  "2-Ball Ambrose",
  "Stableford",
  "Par / Bogey",
  "Chapman (Pinehurst)",
  "Greensomes",
];

export const minPlayers: Record<string, number> = {
  "Singles Match Play": 1,
  Stableford: 1,
  "Par / Bogey": 1,
  "2-Ball Better Ball": 2,
  "2-Ball Ambrose": 2,
  Foursomes: 2,
  "Chapman (Pinehurst)": 2,
  Greensomes: 2,
  "4 Player Stableford": 4,
};

export const times = ["7:00", "7:30", "8:00", "8:30", "9:00", "9:30", "10:00"];
export const tees = ["Blue", "White", "Gold", "Red"];

export const TEAM = {
  red: {
    label: "R",
    title: "Team Red",
    grad: "from-[#9e2535] via-[#6f1725] to-[#2b080f]",
    bg: "from-[#381018] via-[#101010] to-black",
  },
  blue: {
    label: "B",
    title: "Team Blue",
    grad: "from-[#244fb4] via-[#132a70] to-[#07102c]",
    bg: "from-[#10224e] via-[#101010] to-black",
  },
};

export const BACKGROUND_IMAGES = {
  home: "https://i.ibb.co/B5MCPFwV/hf-20260406-212338-4e6f71fe-a63d-4837-9341-31237b0552c3.png",
  rosterP: "",
  rosterB: "",
  score: "",
  admin: "",
};
