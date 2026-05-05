import React, { useState } from "react";
import Home from "../components/Home";
import Score from "../components/Score";

export default function App() {
  const [screen, setScreen] = useState<"home" | "score">("home");

  return (
    <div style={{
      minHeight: "100vh",
      background: "#050505",
      color: "white"
    }}>
      {screen === "home" && <Home setScreen={setScreen} />}
      {screen === "score" && <Score setScreen={setScreen} />}
    </div>
  );
}
