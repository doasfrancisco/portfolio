"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type TabKey =
  | "maxilar"
  | "pulso"
  | "syntax"
  | "inmoba"
  | "damelo"
  | "doctoc";

export type YearKey = "2026" | "2025" | "2024-2023";

type TabContextValue = {
  activeTab: TabKey;
  setActiveTab: (tab: TabKey) => void;
  activeYear: YearKey;
  setActiveYear: (year: YearKey) => void;
  registerTerminalRef: (el: HTMLDivElement | null) => void;
  focusTerminal: (tab: TabKey) => void;
};

const TabContext = createContext<TabContextValue | null>(null);

export function TabProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<TabKey>("maxilar");
  const [activeYear, setActiveYear] = useState<YearKey>("2026");
  const terminalRef = useRef<HTMLDivElement | null>(null);

  const registerTerminalRef = useCallback((el: HTMLDivElement | null) => {
    terminalRef.current = el;
  }, []);

  const focusTerminal = useCallback((tab: TabKey) => {
    setActiveTab(tab);
    const el = terminalRef.current;
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return (
    <TabContext.Provider
      value={{
        activeTab,
        setActiveTab,
        activeYear,
        setActiveYear,
        registerTerminalRef,
        focusTerminal,
      }}
    >
      {children}
    </TabContext.Provider>
  );
}

export function useTab() {
  const ctx = useContext(TabContext);
  if (!ctx) throw new Error("useTab must be used within TabProvider");
  return ctx;
}
