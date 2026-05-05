import React from "react";
import { Button } from "./ui";

export default function Home({ players, setScreen }: any) {
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">DUEL</h1>

      <div className="mt-4">
        <Button onClick={() => setScreen("score")}>
          Start Match ({players}v{players})
        </Button>
      </div>
    </div>
  );
}
