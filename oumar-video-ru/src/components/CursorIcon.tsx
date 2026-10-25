// macOS-style pointer. The tip sits at (5px, 4px) of the box.
export const CursorIcon: React.FC = () => (
  <svg
    width={46}
    height={66}
    viewBox="0 0 28 40"
    style={{
      overflow: "visible",
      filter: "drop-shadow(0 6px 10px rgba(0,0,0,0.28))",
    }}
  >
    <path
      d="M3 2.5 L3 31 L10 24.6 L14.6 35.4 L19.6 33.2 L15.1 22.6 L24.6 22.6 Z"
      fill="#111111"
      stroke="#FFFFFF"
      strokeWidth={2.4}
      strokeLinejoin="round"
    />
  </svg>
);
