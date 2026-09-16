import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkle, Heart, Flame, CalendarBlank, LockSimple, ArrowRight, Sun, Moon, Download, Trash, Check, BookOpen, Tag, MusicNote } from "@phosphor-icons/react";
import { VibesProvider, useVibes } from "./context/VibesContext";
import { Navigation } from "./components/Navigation";
import { VibeModal } from "./components/VibeModal";
import { MoodGalaxy } from "./components/MoodGalaxy";
import { TimelineView, CapsulesView } from "./components/TimelineAndCapsules";
import { getMood, MOOD_PRESETS, DAILY_PROMPTS } from "./constants";
import { Tab } from "./types";

/* ─── Aurora Background ────────────────────────────────────────────── */
const AuroraBg: React.FC = () => {
  const { settings } = useVibes();
  const mood = getMood(settings.activeMood);
  const isDark = settings.theme === "dark";
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden transition-all duration-[2000ms]"
      style={{ background: isDark ? "#08080f" : "#f5f3ff" }}>
      <motion.div className="absolute w-[600px] h-[600px] rounded-full blur-[120px] opacity-20"
        style={{ background: mood.color, top: "-10%", left: "-10%" }}
        animate={{ x: [0, 40, 0], y: [0, 30, 0] }} transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="absolute w-[500px] h-[500px] rounded-full blur-[100px] opacity-15"
        style={{ background: MOOD_PRESETS[(MOOD_PRESETS.indexOf(mood) + 2) % 7].color, bottom: "10%", right: "-5%" }}
        animate={{ x: [0, -30, 0], y: [0, -20, 0] }} transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }} />
      <div className="absolute inset-0" style={{ background: isDark ? mood.bgDark : mood.bgLight }} />
    </div>
  );
};

/* ─── Home View ────────────────────────────────────────────────────── */
const HomeView: React.FC<{ onAddVibe: () => void }> = ({ onAddVibe }) => {
  const { vibes, capsules, reflections, settings, setActiveTab } = useVibes();
  const mood = getMood(settings.activeMood);
  const isDark = settings.theme === "dark";
  const tc = isDark ? "#f0f0f5" : "#1a1a2e";
  const mc = isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)";
  const recent = vibes.slice(0, 3);
  const greeting = new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="pb-28 md:pb-8">
      {/* Hero */}
      <div className="mb-8">
        <p className="text-sm mb-1" style={{ color: mc }}>{greeting}</p>
        <h1 className="text-3xl font-bold tracking-tight mb-2" style={{ color: tc }}>
          What is your <span style={{ color: mood.color }}>vibe</span> today?
        </h1>
        <p className="text-sm" style={{ color: mc }}>
          {settings.streak > 0 ? `${settings.streak} day streak — keep reflecting.` : "Start your first reflection today."}
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <motion.button onClick={onAddVibe} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          className="col-span-2 p-5 rounded-2xl text-left relative overflow-hidden border"
          style={{ background: mood.gradient, borderColor: "transparent", boxShadow: `0 8px 40px ${mood.glow}40` }}>
          <Sparkle size={20} weight="fill" className="text-white mb-2" />
          <p className="text-white font-semibold text-sm">Capture a Vibe</p>
          <p className="text-white/70 text-xs mt-0.5">Mood, note, photo, music, tags</p>
        </motion.button>

        <div className="p-4 rounded-2xl border" style={{ background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}>
          <Flame size={18} style={{ color: "#f59e0b" }} className="mb-2" />
          <p className="text-2xl font-bold" style={{ color: tc }}>{settings.streak}</p>
          <p className="text-[10px] uppercase tracking-wider" style={{ color: mc }}>Day Streak</p>
        </div>
        <div className="p-4 rounded-2xl border" style={{ background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}>
          <Heart size={18} style={{ color: "#ef4444" }} className="mb-2" />
          <p className="text-2xl font-bold" style={{ color: tc }}>{vibes.length}</p>
          <p className="text-[10px] uppercase tracking-wider" style={{ color: mc }}>Total Vibes</p>
        </div>
        <div className="p-4 rounded-2xl border" style={{ background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}>
          <LockSimple size={18} style={{ color: "#8b5cf6" }} className="mb-2" />
          <p className="text-2xl font-bold" style={{ color: tc }}>{capsules.length}</p>
          <p className="text-[10px] uppercase tracking-wider" style={{ color: mc }}>Capsules</p>
        </div>
        <div className="p-4 rounded-2xl border" style={{ background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}>
          <BookOpen size={18} style={{ color: "#14b8a6" }} className="mb-2" />
          <p className="text-2xl font-bold" style={{ color: tc }}>{reflections.length}</p>
          <p className="text-[10px] uppercase tracking-wider" style={{ color: mc }}>Reflections</p>
        </div>
      </div>

      {/* Recent Vibes */}
      {recent.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold" style={{ color: tc }}>Recent Vibes</h3>
            <button onClick={() => setActiveTab("timeline")} className="text-xs flex items-center gap-1" style={{ color: mood.color }}>
              View all <ArrowRight size={12} />
            </button>
          </div>
          <div className="space-y-3">
            {recent.map((v) => {
              const vm = getMood(v.mood);
              return (
                <div key={v.id} className="p-4 rounded-2xl border" style={{ background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: vm.color }} />
                    <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: vm.color }}>{vm.label}</span>
                    <span className="text-[10px] ml-auto" style={{ color: mc }}>{v.date}</span>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: isDark ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.65)" }}>
                    {v.note.slice(0, 140)}{v.note.length > 140 ? "..." : ""}
                  </p>
                  {v.music && (
                    <div className="flex items-center gap-1.5 mt-2">
                      <MusicNote size={10} style={{ color: vm.color }} />
                      <span className="text-[10px]" style={{ color: mc }}>{v.music.title}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── Reflections View ─────────────────────────────────────────────── */
const ReflectionsView: React.FC = () => {
  const { reflections, addReflection, settings } = useVibes();
  const [answer, setAnswer] = useState("");
  const [promptIdx, setPromptIdx] = useState(() => Math.floor(Math.random() * DAILY_PROMPTS.length));
  const [saved, setSaved] = useState(false);
  const isDark = settings.theme === "dark";
  const mood = getMood(settings.activeMood);
  const prompt = DAILY_PROMPTS[promptIdx];

  const handleSave = () => {
    if (!answer.trim()) return;
    addReflection({ date: new Date().toISOString().slice(0, 10), prompt, answer: answer.trim(), mood: settings.activeMood });
    setAnswer(""); setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="pb-24 md:pb-8">
      <h2 className="text-lg font-semibold mb-6" style={{ color: isDark ? "#fff" : "#1a1a2e" }}>Daily Reflection</h2>
      <div className="p-5 rounded-2xl border mb-6" style={{ background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}>
        <p className="text-sm font-medium italic mb-4" style={{ color: mood.color }}>"{prompt}"</p>
        <textarea value={answer} onChange={(e) => setAnswer(e.target.value)}
          placeholder="Write your reflection..." rows={4}
          className="w-full px-4 py-3 rounded-xl border outline-none text-sm resize-none"
          style={{ background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)", borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)", color: isDark ? "#fff" : "#1a1a2e" }} />
        <div className="flex gap-2 mt-3">
          <button onClick={() => setPromptIdx((promptIdx + 1) % DAILY_PROMPTS.length)}
            className="px-4 py-2 rounded-xl text-xs font-medium border"
            style={{ borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)", color: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)" }}>
            Shuffle Prompt
          </button>
          <motion.button onClick={handleSave} whileTap={{ scale: 0.95 }}
            className="px-4 py-2 rounded-xl text-xs font-medium text-white flex items-center gap-1.5"
            style={{ background: saved ? "#10b981" : mood.gradient }}>
            {saved ? <><Check size={12} /> Saved</> : "Save Reflection"}
          </motion.button>
        </div>
      </div>
      <h3 className="text-sm font-semibold mb-3" style={{ color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)" }}>Past Reflections</h3>
      {reflections.length === 0 ? (
        <p className="text-sm opacity-40">No reflections yet.</p>
      ) : (
        <div className="space-y-3">
          {reflections.map((r) => (
            <div key={r.id} className="p-4 rounded-2xl border" style={{ background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.015)", borderColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" }}>
              <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: getMood(r.mood ?? "cosmic").color }}>{r.date}</p>
              <p className="text-xs italic opacity-50 mb-1">"{r.prompt}"</p>
              <p className="text-sm" style={{ color: isDark ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.65)" }}>{r.answer}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ─── Profile View ─────────────────────────────────────────────────── */
const ProfileView: React.FC = () => {
  const { vibes, moodCounts, settings } = useVibes();
  const isDark = settings.theme === "dark";
  const favs = vibes.filter((v) => v.favorite);
  const topMood = useMemo(() => {
    let best: { id: import("./types").MoodId; count: number } = { id: "cosmic", count: 0 };
    (Object.keys(moodCounts) as Array<keyof typeof moodCounts>).forEach((k) => {
      if (moodCounts[k] > best.count) best = { id: k, count: moodCounts[k] };
    });
    return getMood(best.id);
  }, [moodCounts]);

  return (
    <div className="pb-24 md:pb-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{ background: topMood.gradient, boxShadow: `0 8px 24px ${topMood.glow}` }}>
          <span className="text-white text-xl font-bold">S</span>
        </div>
        <div>
          <h2 className="text-xl font-bold" style={{ color: isDark ? "#fff" : "#1a1a2e" }}>Your Sanctuary</h2>
          <p className="text-sm" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>
            Dominant mood: <span style={{ color: topMood.color }}>{topMood.label}</span>
          </p>
        </div>
      </div>

      {/* Mood Breakdown */}
      <div className="mb-8">
        <h3 className="text-sm font-semibold mb-3" style={{ color: isDark ? "#fff" : "#1a1a2e" }}>Mood Distribution</h3>
        <div className="space-y-2">
          {MOOD_PRESETS.map((m) => {
            const count = moodCounts[m.id] ?? 0;
            const pct = vibes.length ? Math.round((count / vibes.length) * 100) : 0;
            return (
              <div key={m.id} className="flex items-center gap-3">
                <span className="text-[10px] w-16 shrink-0" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>{m.label}</span>
                <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" }}>
                  <motion.div className="h-full rounded-full" style={{ background: m.gradient }}
                    initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, ease: "easeOut" }} />
                </div>
                <span className="text-[10px] w-8 text-right" style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Favorites */}
      {favs.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold mb-3" style={{ color: isDark ? "#fff" : "#1a1a2e" }}>Favourite Vibes</h3>
          <div className="space-y-3">
            {favs.map((v) => (
              <div key={v.id} className="p-4 rounded-2xl border" style={{ background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.015)", borderColor: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <Heart size={12} weight="fill" style={{ color: "#ef4444" }} />
                  <span className="text-[10px]" style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>{v.date}</span>
                </div>
                <p className="text-sm" style={{ color: isDark ? "rgba(255,255,255,0.75)" : "rgba(0,0,0,0.65)" }}>{v.note.slice(0, 100)}...</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── Settings View ────────────────────────────────────────────────── */
const SettingsView: React.FC = () => {
  const { settings, setTheme, loadDemo, clearAll, exportData, importData } = useVibes();
  const [importVal, setImportVal] = useState("");
  const [msg, setMsg] = useState("");
  const isDark = settings.theme === "dark";
  const mood = getMood(settings.activeMood);

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "svibes-backup.json"; a.click();
    URL.revokeObjectURL(url);
    setMsg("Exported!"); setTimeout(() => setMsg(""), 2000);
  };

  const handleImport = () => {
    if (importData(importVal)) { setMsg("Imported!"); } else { setMsg("Invalid JSON"); }
    setImportVal(""); setTimeout(() => setMsg(""), 2000);
  };

  return (
    <div className="pb-24 md:pb-8 space-y-6">
      <h2 className="text-lg font-semibold" style={{ color: isDark ? "#fff" : "#1a1a2e" }}>Settings</h2>

      {/* Theme */}
      <div className="p-5 rounded-2xl border" style={{ background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}>
        <p className="text-sm font-medium mb-3" style={{ color: isDark ? "#fff" : "#1a1a2e" }}>Appearance</p>
        <div className="flex gap-2">
          {(["dark", "light"] as const).map((t) => (
            <button key={t} onClick={() => setTheme(t)}
              className="flex-1 py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 border transition-all"
              style={{
                background: settings.theme === t ? `${mood.color}15` : "transparent",
                borderColor: settings.theme === t ? mood.color : (isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"),
                color: settings.theme === t ? mood.color : (isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)"),
              }}>
              {t === "dark" ? <Moon size={14} /> : <Sun size={14} />} {t === "dark" ? "Dark" : "Light"}
            </button>
          ))}
        </div>
      </div>

      {/* Data */}
      <div className="p-5 rounded-2xl border" style={{ background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}>
        <p className="text-sm font-medium mb-3" style={{ color: isDark ? "#fff" : "#1a1a2e" }}>Data</p>
        <div className="space-y-2">
          <button onClick={handleExport} className="w-full py-3 rounded-xl text-sm font-medium flex items-center gap-2 px-4"
            style={{ background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)", color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)" }}>
            <Download size={16} /> Export as JSON
          </button>
          <textarea value={importVal} onChange={(e) => setImportVal(e.target.value)}
            placeholder="Paste JSON backup..." rows={3}
            className="w-full px-4 py-3 rounded-xl border text-sm outline-none resize-none"
            style={{ background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)", borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)", color: isDark ? "#fff" : "#1a1a2e" }} />
          <button onClick={handleImport} className="w-full py-3 rounded-xl text-sm font-medium"
            style={{ background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)", color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)" }}>
            Import JSON
          </button>
          <button onClick={loadDemo} className="w-full py-3 rounded-xl text-sm font-medium"
            style={{ background: `${mood.color}12`, color: mood.color }}>
            Load Demo Data
          </button>
          <button onClick={clearAll} className="w-full py-3 rounded-xl text-sm font-medium flex items-center gap-2 px-4"
            style={{ background: "rgba(239,68,68,0.08)", color: "#ef4444" }}>
            <Trash size={14} /> Clear All Data
          </button>
        </div>
        {msg && <p className="text-xs mt-2 font-medium" style={{ color: mood.color }}>{msg}</p>}
      </div>
    </div>
  );
};

/* ─── Onboarding ───────────────────────────────────────────────────── */
const Onboarding: React.FC = () => {
  const { setOnboarded, loadDemo, settings } = useVibes();
  const isDark = settings.theme === "dark";
  const mood = getMood("cosmic");

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-6"
      style={{ background: isDark ? "rgba(5,5,15,0.98)" : "rgba(250,248,255,0.98)" }}>
      <div className="max-w-sm w-full text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}
          className="w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center"
          style={{ background: mood.gradient, boxShadow: `0 16px 48px ${mood.glow}` }}>
          <Sparkle size={32} weight="fill" className="text-white" />
        </motion.div>
        <h1 className="text-2xl font-bold mb-2" style={{ color: isDark ? "#fff" : "#1a1a2e" }}>S.Vibes</h1>
        <p className="text-sm mb-8 leading-relaxed" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>
          Your private digital sanctuary. Capture moods, seal memories, and watch your inner universe unfold.
        </p>
        <div className="space-y-3">
          <motion.button onClick={() => setOnboarded(true)} whileTap={{ scale: 0.97 }}
            className="w-full py-4 rounded-2xl text-white font-semibold text-sm"
            style={{ background: mood.gradient, boxShadow: `0 8px 32px ${mood.glow}` }}>
            Enter Your Sanctuary
          </motion.button>
          <button onClick={() => { loadDemo(); }}
            className="w-full py-3 rounded-2xl text-sm font-medium border"
            style={{ borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)", color: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)" }}>
            Load Demo Vibes
          </button>
        </div>
      </div>
    </motion.div>
  );
};

/* ─── Page Router ──────────────────────────────────────────────────── */
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

const PageRouter: React.FC<{ onAddVibe: () => void }> = ({ onAddVibe }) => {
  const { activeTab } = useVibes();
  return (
    <AnimatePresence mode="wait">
      <motion.div key={activeTab} variants={pageVariants} initial="initial" animate="animate" exit="exit"
        transition={{ duration: 0.3, ease: "easeOut" }}>
        {activeTab === "home" && <HomeView onAddVibe={onAddVibe} />}
        {activeTab === "timeline" && <TimelineView />}
        {activeTab === "galaxy" && <MoodGalaxy />}
        {activeTab === "capsules" && <CapsulesView />}
        {activeTab === "reflections" && <ReflectionsView />}
        {activeTab === "profile" && <ProfileView />}
        {activeTab === "settings" && <SettingsView />}
      </motion.div>
    </AnimatePresence>
  );
};

/* ─── Shell ────────────────────────────────────────────────────────── */
const Shell: React.FC = () => {
  const { settings } = useVibes();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <AuroraBg />
      <Navigation onAddVibe={() => setModalOpen(true)} />
      <main className="md:ml-64 px-5 pt-8 md:pt-10 max-w-3xl">
        <PageRouter onAddVibe={() => setModalOpen(true)} />
      </main>
      <VibeModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <AnimatePresence>
        {!settings.onboarded && <Onboarding />}
      </AnimatePresence>
    </div>
  );
};

/* ─── App ──────────────────────────────────────────────────────────── */
const App: React.FC = () => (
  <VibesProvider>
    <Shell />
  </VibesProvider>
);

export default App;