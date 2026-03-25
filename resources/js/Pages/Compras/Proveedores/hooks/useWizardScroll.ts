import { useEffect, useRef, useState } from "react";

export function useWizardScroll(deps: any[] = []) {
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const [footerShadow, setFooterShadow] = useState(false);

  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;

    const onScroll = () => setFooterShadow(el.scrollTop > 8);
    onScroll();

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    el.scrollTop = 0;
    setFooterShadow(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { bodyRef, footerShadow };
}