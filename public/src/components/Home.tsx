import { Button } from "./ui";

export default function Home({ setScreen }: any) {
  return (
    <div className="min-h-[100svh] bg-black p-6 text-white flex flex-col justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-black tracking-[0.12em]">
          MATCH CENTRE
        </h1>
        <p className="mt-3 text-sm text-white/50">
          Live scoring experience
        </p>
      </div>

      <div className="mt-12">
        <Button
          active
          onClick={() => setScreen("score")}
          className="w-full py-4 text-base rounded-2xl"
        >
          Start Match
        </Button>
      </div>
    </div>
  );
}
