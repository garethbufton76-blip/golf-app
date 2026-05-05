export const cx = (...v: any[]) => v.filter(Boolean).join(" ");

export function Button({ active, onClick, children, className = "" }: any) {
  return (
    <button
      onClick={onClick}
      className={cx(
        "rounded-xl py-2",
        active
          ? "bg-[#d1c79f] text-black font-bold"
          : "border border-white/20 bg-black/40 text-white",
        className
      )}
    >
      {children}
    </button>
  );
}
