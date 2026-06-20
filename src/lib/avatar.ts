const HUES = [168, 199, 262, 330, 38, 140, 215, 290] as const;

const hueFor = (name: string): number => {
  const sum = [...(name || "?")].reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return HUES[sum % HUES.length];
};

export const initials = (name: string): string =>
  name
    .trim()
    .split(/\s+/)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase() || "?";

export const avatarGradient = (name: string): string => {
  const h = hueFor(name);
  return `linear-gradient(140deg, hsl(${h} 80% 70%), hsl(${h + 30} 80% 58%))`;
};
