export const VerifiedBadge: React.FC<{ size?: number }> = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path
      d="M12 1.5l2.6 1.9 3.2-.2 1 3 2.7 1.8-.9 3.1.9 3.1-2.7 1.8-1 3-3.2-.2L12 22.5l-2.6-1.9-3.2.2-1-3-2.7-1.8.9-3.1-.9-3.1 2.7-1.8 1-3 3.2.2z"
      fill="#0A84FF"
    />
    <path
      d="M7.6 12.2l3 3 5.8-6.1"
      fill="none"
      stroke="#fff"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const CheckIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = "#fff",
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path
      d="M5 12.5l4.5 4.5L19 7.5"
      fill="none"
      stroke={color}
      strokeWidth={2.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const PlayIcon: React.FC<{ size?: number }> = ({ size = 34 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M8 5.5v13l10.5-6.5z" fill="#fff" />
  </svg>
);

export const PersonGlyph: React.FC<{ size: number }> = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 40 40">
    <circle cx="20" cy="15" r="7.5" fill="#fff" />
    <path d="M6.5 35c1.8-7.2 7-11 13.5-11s11.7 3.8 13.5 11z" fill="#fff" />
  </svg>
);

export const Sparkle: React.FC<{ size: number; color: string }> = ({
  size,
  color,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path
      d="M12 0c.9 6.4 5.6 11.1 12 12-6.4.9-11.1 5.6-12 12-.9-6.4-5.6-11.1-12-12C6.4 11.1 11.1 6.4 12 0z"
      fill={color}
    />
  </svg>
);
