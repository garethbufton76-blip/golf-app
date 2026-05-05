import React, { useState } from "react";
import Home from "./components/Home";
import Score from "./components/Score";

export default function App() {
  const [screen, setScreen] = useState("home");
  const [players] = useState(2);

  return (
    <div className="min-h-screen bg-black text-white">
      {screen === "home" && (
        <Home players={players} setScreen={setScreen} />
      )}

      {screen === "score" && <Score />}
    </div>
  );
}
