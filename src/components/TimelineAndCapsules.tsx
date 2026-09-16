import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MagnifyingGlass, Heart, Trash, MusicNote, LockSimple, LockSimpleOpen, CalendarBlank, Tag } from "@phosphor-icons/react";
import { useVibes } from "../context/VibesContext";
import { MoodId } from "../types";
import { MOOD_PRESETS, getMood } from "../constants";

/* ─── Timeline ─────────────────────────────────────────────────────── */
export const TimelineView: React.FC = () => {
  const { vibes, deleteVibe, toggleFavorite, settings } = useVibes();
  const [search, setSearch] = useState("");
  const [moodFilter, setMoodFilter] = useState<MoodId | "all">("all");
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const isDark = settings.theme === "dark";

  const allTags = useMemo(() => {
    const s = new Set<string>();
    vibes.forEach((v) => v.tags.forEach((t) => s.add(t)));
    return Array.from(s).slice(0, 12);
  }, [vibes]);

  const filtered = useMemo(() => {
    return vibes
      .filter((v) => moodFilter === "all" || v.mood === moodFilter)
      .filter((v) => !tagFilter || v.tags.includes(tagFilter))
      .filter((v) => !search || v.note.toLowerCase().includes(search.toLowerCase()) || v.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [vibes, moodFilter, tagFilter, search]);

  return (
    <div className="pb-24 md:pb-8">
      {/* Search */}
      <div className="mb-4 relative">
        <MagnifyingGlass size={16} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40" />
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search vibes..."
          className="w-full pl-11 pr-4 py-3 rounded-2xl border outline-none text-sm"
          style={{ background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)", borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)", color: isDark ? "#fff" : "#1a1a2e" }} />
      </div>

      {/* Mood Filters */}
      <div className="flex gap-2 mb-3 overflow-x-auto pb-2 scrollbar-hide">
        <button onClick={() => setMoodFilter("all")}
          className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border"
          style={{ background: moodFilter === "all" ? (isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)") : "transparent", borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)", color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)" }}>
          All
        </button>
        {MOOD_PRESETS.map((m) => (
          <button key={m.id} onClick={() => setMoodFilter(moodFilter === m.id ? "all" : m.id)}
            className="shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-all"
            style={{
              background: moodFilter === m.id ? m.gradient : "transparent",
              color: moodFilter === m.id ? "#fff" : (isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)"),
              borderColor: moodFilter === m.id ? "transparent" : (isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"),
            }}>
            {m.label}
          </button>
        ))}
      </div>

      {/* Tag Pills */}
      {allTags.length > 0 && (
        <div className="flex gap-1.5 mb-5 overflow-x-auto pb-2 scrollbar-hide">
          {allTags.map((t) => (
            <button key={t} onClick={() => setTagFilter(tagFilter === t ? null : t)}
              className="shrink-0 px-2.5 py-1 rounded-full text-[10px] font-medium"
              style={{
                background: tagFilter === t ? `${getMood(settings.activeMood).color}20` : (isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"),
                color: tagFilter === t ? getMood(settings.activeMood).color : (isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)"),
              }}>
              {t}
            </button>
          ))}
        </div>
      )}

      {/* Timeline Spine */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 opacity-40">
          <p className="text-sm">No vibes match your filters.</p>
        </div>
      ) : (
        <div className="relative pl-6">
          <div className="absolute left-2 top-0 bottom-0 w-px" style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }} />
          <AnimatePresence>
            {filtered.map((v, i) => {
              const mood = getMood(v.mood);
              return (
                <motion.div key={v.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }} transition={{ delay: i * 0.03 }}
                  className="relative mb-5">
                  {/* Dot on spine */}
                  <div className="absolute -left-[21px] top-5 w-3 h-3 rounded-full border-2"
                    style={{ background: mood.color, borderColor: isDark ? "rgba(10,10,20,1)" : "rgba(255,255,255,1)", boxShadow: `0 0 8px ${mood.glow}` }} />
                  <div className="p-4 rounded-2xl border transition-all hover:scale-[1.01]"
                    style={{ background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: mood.color }}>{v.date}</span>
                      <div className="flex gap-1">
                        <button onClick={() => toggleFavorite(v.id)} className="p-1 rounded-lg">
                          <Heart size={14} weight={v.favorite ? "fill" : "regular"} style={{ color: v.favorite ? "#ef4444" : (isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.2)") }} />
                        </button>
                        <button onClick={() => deleteVibe(v.id)} className="p-1 rounded-lg opacity-30 hover:opacity-70">
                          <Trash size={14} style={{ color: isDark ? "#fff" : "#000" }} />
                        </button>
                      </div>
                    </div>
                    {v.photo && <img src={v.photo} alt="" className="w-full h-32 object-cover rounded-xl mb-3" />}
                    <p className="text-sm leading-relaxed mb-3" style={{ color: isDark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.7)" }}>
                      {v.note}
                    </p>
                    {v.music && (
                      <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-xl" style={{ background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)" }}>
                        <MusicNote size={12} style={{ color: mood.color }} />
                        <span className="text-xs" style={{ color: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)" }}>
                          {v.music.title} — {v.music.artist}
                        </span>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-1.5">
                      {v.tags.map((t) => (
                        <span key={t} className="text-[10px] px-2 py-0.5 rounded-full"
                          style={{ background: `${v.auraColor}12`, color: v.auraColor }}>{t}</span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

/* ─── Capsules ─────────────────────────────────────────────────────── */
export const CapsulesView: React.FC = () => {
  const { capsules, deleteCapsule, unlockCapsule, settings } = useVibes();
  const isDark = settings.theme === "dark";
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const getCountdown = (unlockAt: number) => {
    const diff = unlockAt - now;
    if (diff <= 0) return null;
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return { d, h, m, s };
  };

  return (
    <div className="pb-24 md:pb-8">
      <div className="flex items-center gap-2 mb-6">
        <LockSimple size={20} style={{ color: getMood(settings.activeMood).color }} />
        <h2 className="text-lg font-semibold" style={{ color: isDark ? "#fff" : "#1a1a2e" }}>Memory Capsules</h2>
      </div>

      {capsules.length === 0 ? (
        <div className="text-center py-16 opacity-40">
          <p className="text-sm">No capsules yet. Seal a memory for your future self.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {capsules.map((c) => {
            const mood = getMood(c.mood);
            const countdown = getCountdown(c.unlockAt);
            const isUnlocked = c.unlocked || !countdown;
            return (
              <motion.div key={c.id} layout className="p-5 rounded-2xl border relative overflow-hidden"
                style={{ background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}>
                {/* Glow accent */}
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 blur-3xl" style={{ background: mood.color }} />

                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {isUnlocked ? (
                      <LockSimpleOpen size={16} style={{ color: mood.color }} />
                    ) : (
                      <LockSimple size={16} style={{ color: "rgba(255,255,255,0.4)" }} />
                    )}
                    <span className="text-sm font-semibold" style={{ color: isDark ? "#fff" : "#1a1a2e" }}>
                      {c.title}
                    </span>
                  </div>
                  <button onClick={() => deleteCapsule(c.id)} className="p-1 opacity-30 hover:opacity-70">
                    <Trash size={14} style={{ color: isDark ? "#fff" : "#000" }} />
                  </button>
                </div>

                {isUnlocked ? (
                  <div>
                    <p className="text-sm leading-relaxed mb-3" style={{ color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)" }}>
                      {c.note}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {c.tags.map((t) => (
                        <span key={t} className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: `${mood.color}12`, color: mood.color }}>{t}</span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs opacity-40 mb-3 italic">This memory is sealed until {new Date(c.unlockAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
                    {/* Countdown */}
                    <div className="flex gap-3">
                      {countdown && [
                        { val: countdown.d, label: "days" },
                        { val: countdown.h, label: "hrs" },
                        { val: countdown.m, label: "min" },
                        { val: countdown.s, label: "sec" },
                      ].map(({ val, label }) => (
                        <div key={label} className="flex flex-col items-center">
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold tabular-nums"
                            style={{ background: `${mood.color}12`, color: mood.color }}>
                            {String(val).padStart(2, "0")}
                          </div>
                          <span className="text-[9px] mt-1 opacity-40 uppercase">{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {isUnlocked && !c.unlocked && (
                  <motion.button onClick={() => unlockCapsule(c.id)}
                    whileTap={{ scale: 0.95 }}
                    className="mt-4 px-4 py-2 rounded-xl text-xs font-medium text-white"
                    style={{ background: mood.gradient }}>
                    Mark as Read
                  </motion.button>
                )}
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};