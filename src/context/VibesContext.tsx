import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Vibe, Capsule, Reflection, AppSettings, VibesState, MoodId, Tab } from "../types";
import { SEED_VIBES, SEED_CAPSULES, SEED_REFLECTIONS, DEFAULT_SETTINGS, genId } from "../constants";

interface VibesContextType extends VibesState {
  activeTab: Tab;
  setActiveTab: (t: Tab) => void;
  addVibe: (v: Omit<Vibe, "id" | "createdAt">) => void;
  updateVibe: (id: string, patch: Partial<Vibe>) => void;
  deleteVibe: (id: string) => void;
  toggleFavorite: (id: string) => void;
  addCapsule: (c: Omit<Capsule, "id" | "createdAt" | "lockedAt" | "unlocked">) => void;
  deleteCapsule: (id: string) => void;
  unlockCapsule: (id: string) => void;
  addReflection: (r: Omit<Reflection, "id" | "createdAt">) => void;
  setTheme: (t: "dark" | "light") => void;
  setActiveMood: (m: MoodId) => void;
  setOnboarded: (v: boolean) => void;
  loadDemo: () => void;
  clearAll: () => void;
  exportData: () => string;
  importData: (json: string) => boolean;
  moodCounts: Record<MoodId, number>;
}

const VibesContext = createContext<VibesContextType | null>(null);

const STORAGE_KEY = "svibes_data_v1";

function loadState(): VibesState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        vibes: parsed.vibes ?? [],
        capsules: parsed.capsules ?? [],
        reflections: parsed.reflections ?? [],
        settings: { ...DEFAULT_SETTINGS, ...(parsed.settings ?? {}) },
      };
    }
  } catch { /* ignore */ }
  return { vibes: [], capsules: [], reflections: [], settings: DEFAULT_SETTINGS };
}

function saveState(state: VibesState) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* ignore */ }
}

export const VibesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initial = loadState();
  const [vibes, setVibes] = useState<Vibe[]>(initial.vibes);
  const [capsules, setCapsules] = useState<Capsule[]>(initial.capsules);
  const [reflections, setReflections] = useState<Reflection[]>(initial.reflections);
  const [settings, setSettings] = useState<AppSettings>(initial.settings);
  const [activeTab, setActiveTab] = useState<Tab>("home");

  useEffect(() => {
    saveState({ vibes, capsules, reflections, settings });
  }, [vibes, capsules, reflections, settings]);

  // Apply theme class to document
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [settings.theme]);

  const addVibe = useCallback((v: Omit<Vibe, "id" | "createdAt">) => {
    setVibes((prev) => [{ ...v, id: genId(), createdAt: Date.now() }, ...prev]);
  }, []);

  const updateVibe = useCallback((id: string, patch: Partial<Vibe>) => {
    setVibes((prev) => prev.map((v) => (v.id === id ? { ...v, ...patch } : v)));
  }, []);

  const deleteVibe = useCallback((id: string) => {
    setVibes((prev) => prev.filter((v) => v.id !== id));
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setVibes((prev) => prev.map((v) => (v.id === id ? { ...v, favorite: !v.favorite } : v)));
  }, []);

  const addCapsule = useCallback((c: Omit<Capsule, "id" | "createdAt" | "lockedAt" | "unlocked">) => {
    const now = Date.now();
    setCapsules((prev) => [
      { ...c, id: genId(), createdAt: now, lockedAt: now, unlocked: false },
      ...prev,
    ]);
  }, []);

  const deleteCapsule = useCallback((id: string) => {
    setCapsules((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const unlockCapsule = useCallback((id: string) => {
    setCapsules((prev) => prev.map((c) => (c.id === id ? { ...c, unlocked: true } : c)));
  }, []);

  const addReflection = useCallback((r: Omit<Reflection, "id" | "createdAt">) => {
    const today = new Date().toISOString().slice(0, 10);
    setReflections((prev) => [
      { ...r, id: genId(), createdAt: Date.now() },
      ...prev,
    ]);
    setSettings((prev) => {
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      const newStreak =
        prev.lastReflectionDate === yesterday ? prev.streak + 1 : 1;
      return { ...prev, streak: newStreak, lastReflectionDate: today };
    });
  }, []);

  const setTheme = useCallback((t: "dark" | "light") => {
    setSettings((prev) => ({ ...prev, theme: t }));
  }, []);

  const setActiveMood = useCallback((m: MoodId) => {
    setSettings((prev) => ({ ...prev, activeMood: m }));
  }, []);

  const setOnboarded = useCallback((v: boolean) => {
    setSettings((prev) => ({ ...prev, onboarded: v }));
  }, []);

  const loadDemo = useCallback(() => {
    setVibes(SEED_VIBES);
    setCapsules(SEED_CAPSULES);
    setReflections(SEED_REFLECTIONS);
    setSettings((prev) => ({ ...prev, onboarded: true, streak: 2 }));
  }, []);

  const clearAll = useCallback(() => {
    setVibes([]);
    setCapsules([]);
    setReflections([]);
    setSettings((prev) => ({ ...prev, onboarded: true, streak: 0, activeMood: "cosmic" }));
  }, []);

  const exportData = useCallback((): string => {
    return JSON.stringify({ vibes, capsules, reflections, settings }, null, 2);
  }, [vibes, capsules, reflections, settings]);

  const importData = useCallback((json: string): boolean => {
    try {
      const parsed = JSON.parse(json);
      if (Array.isArray(parsed.vibes)) setVibes(parsed.vibes);
      if (Array.isArray(parsed.capsules)) setCapsules(parsed.capsules);
      if (Array.isArray(parsed.reflections)) setReflections(parsed.reflections);
      if (parsed.settings) setSettings((prev) => ({ ...prev, ...parsed.settings }));
      return true;
    } catch { return false; }
  }, []);

  const moodCounts = React.useMemo(() => {
    const counts: Record<MoodId, number> = {
      cosmic: 0, serene: 0, radiant: 0, dreamy: 0,
      electric: 0, melancholy: 0, grounded: 0,
    };
    vibes.forEach((v) => { counts[v.mood] = (counts[v.mood] ?? 0) + 1; });
    return counts;
  }, [vibes]);

  return (
    <VibesContext.Provider
      value={{
        vibes, capsules, reflections, settings,
        activeTab, setActiveTab,
        addVibe, updateVibe, deleteVibe, toggleFavorite,
        addCapsule, deleteCapsule, unlockCapsule,
        addReflection, setTheme, setActiveMood, setOnboarded,
        loadDemo, clearAll, exportData, importData, moodCounts,
      }}
    >
      {children}
    </VibesContext.Provider>
  );
};

export const useVibes = (): VibesContextType => {
  const ctx = useContext(VibesContext);
  if (!ctx) throw new Error("useVibes must be used within VibesProvider");
  return ctx;
};
