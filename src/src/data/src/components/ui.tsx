import React from "react";

export const cx = (...v: any[]) => v.filter(Boolean).join(" ");

export function Button({ active, onClick, children, className = "" }: any) {
  return (
    <button
      onClick={onClick}
      className={cx(
        "rounded-xl py-2 text-sm",
        active
          ? "bg-gradient-to-b from-[#efe6bf] via-[#d1c79f] to-[#b7ab7d] text-black font-semibold"
          : "border border-[#d1c79f]/25 bg-black/40 text-white/90",
        className
      )}
    >
      {children}
    </button>
  );
}
