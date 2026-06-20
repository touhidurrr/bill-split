import { useEffect, useRef, useState } from "react";

/** Returns [active, trigger]; `active` stays true for `ms` after each trigger. */
export function useFlash(ms = 800): [boolean, () => void] {
  const [active, setActive] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => () => clearTimeout(timer.current ?? undefined), []);

  const trigger = () => {
    setActive(true);
    clearTimeout(timer.current ?? undefined);
    timer.current = setTimeout(() => setActive(false), ms);
  };

  return [active, trigger];
}
