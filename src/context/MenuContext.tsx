"use client";

import { ParsedMenu } from "@/types/menu";
import { createContext, useContext, useMemo, useState } from "react";

type MenuState = {
  menu: ParsedMenu | null;
  setMenu: (m: ParsedMenu | null) => void;
  clearMenu: () => void;
};

const MenuContext = createContext<MenuState | null>(null);

export function MenuProvider({ children }: { children: React.ReactNode }) {
  const [menu, setMenu] = useState<ParsedMenu | null>(null);

  const value = useMemo<MenuState>(
    () => ({
      menu,
      setMenu,
      clearMenu: () => setMenu(null),
    }),
    [menu]
  );

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

export function useMenu(): MenuState {
  const ctx = useContext(MenuContext);
  if (!ctx) throw new Error("useMenu must be used within <MenuProvider>");
  return ctx;
}
