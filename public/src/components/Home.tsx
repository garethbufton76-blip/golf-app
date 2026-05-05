import { Button } from "./ui";

export default function Home({ setScreen }: any) {
  return (
    <div className="min-h-[100svh] bg-black p-4 text-white">
      <div className="flex justify-center pt-8">
        <img
          src="https://i.ibb.co/23Rs55J9/DUEL-LOGO.png"
          alt="DUEL"
          className="h-24 object-contain"
        />
      </div>

      <div className="mt-16 text-center">
        <div className="text-[11px] tracking-[0.28em] text-white/50">
          DUAL IN THE DUNES
        </div>

        <h1 className="mt-3 text-3xl font-black tracking-[0.12em]">
          MATCH CENTRE
        </h1>

        <p className="mx-auto mt-3 max-w-[300px] text-sm text-white/50">
          Live golf scoring, match play tracking and hole-by-hole progress.
        </p>
      </div>

      <div className="mt-16">
        <Button
          active
          onClick={() => setScreen("score")}
          className="w-full rounded-2xl py-4 text-base"
        >
          Start Match
        </Button>
      </div>
    </div>
  );
}
