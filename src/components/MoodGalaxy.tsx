import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkle } from "@phosphor-icons/react";
import { useVibes } from "../context/VibesContext";
import { MoodId, Vibe } from "../types";
import { MOOD_PRESETS, getMood } from "../constants";

interface Planet {
  id: MoodId;
  x: number;
  y: number;
  radius: number;
  count: number;
  color: string;
  glow: string;
  gradient: string;
  label: string;
}

export const MoodGalaxy: React.FC = () => {
  const { moodCounts, vibes, settings } = useVibes();
  const [selectedMood, setSelectedMood] = useState<MoodId | null>(null);
  const isDark = settings.theme === "dark";

  const maxCount = Math.max(...Object.values(moodCounts), 1);

  const planets: Planet[] = useMemo(() => {
    const cx = 50, cy = 50;
    return MOOD_PRESETS.map((m, i) => {
      const count = moodCounts[m.id] ?? 0;
      const angle = (i / MOOD_PRESETS.length) * Math.PI * 2 - Math.PI / 2;
      const dist = 28 + (i % 2) * 8;
      const radius = 6 + (count / maxCount) * 14;
      return {
        id: m.id,
        x: cx + Math.cos(angle) * dist,
        y: cy + Math.sin(angle) * dist,
        radius,
        count,
        color: m.color,
        glow: m.glow,
        gradient: m.gradient,
        label: m.label,
      };
    });
  }, [moodCounts, maxCount]);

  const filteredVibes = selectedMood ? vibes.filter((v) => v.mood === selectedMood) : [];

  return (
    <div className="relative w-full h-full min-h-[500px] flex flex-col items-center justify-center overflow-hidden">
      {/* Stars background */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 60 }).map((_, i) => (
          <motion.div key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              left: `${(i * 17) % 100}%`, top: `${(i * 23) % 100}%`,
              background: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.15)",
            }}
            animate={{ opacity: [0.2, 0.8, 0.2], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 2 + (i % 3), repeat: Infinity, delay: i * 0.1 }}
          />
        ))}
      </div>

      {/* Galaxy Canvas */}
      <div className="relative w-full max-w-md aspect-square">
        {/* Orbit rings */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="28" fill="none" stroke={isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)"} strokeWidth="0.3" />
          <circle cx="50" cy="50" r="36" fill="none" stroke={isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"} strokeWidth="0.2" />
          {/* Center star */}
          <motion.circle cx="50" cy="50" r="3"
            fill={getMood(settings.activeMood).color}
            animate={{ r: [2.5, 3.5, 2.5], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </svg>

        {/* Planets */}
        {planets.map((p, i) => (
          <motion.button key={p.id}
            onClick={() => setSelectedMood(selectedMood === p.id ? null : p.id)}
            className="absolute flex flex-col items-center gap-1 -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
            animate={{
              y: [0, -4, 0],
              scale: selectedMood === p.id ? 1.15 : 1,
            }}
            transition={{ y: { duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut" }, scale: { duration: 0.3 } }}
            whileHover={{ scale: 1.2 }}
          >
            <div className="rounded-full flex items-center justify-center"
              style={{
                width: `${p.radius * 3.5}px`, height: `${p.radius * 3.5}px`,
                background: p.gradient,
                boxShadow: `0 0 ${p.radius * 4}px ${p.glow}, inset 0 0 ${p.radius}px rgba(255,255,255,0.2)`,
              }}>
              <span className="text-white text-xs font-bold">{p.count}</span>
            </div>
            <span className="text-[10px] font-medium tracking-wide"
              style={{ color: isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)" }}>
              {p.label}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-2 justify-center px-4">
        {MOOD_PRESETS.map((m) => (
          <span key={m.id} className="flex items-center gap-1 text-[10px]"
            style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>
            <span className="w-2 h-2 rounded-full" style={{ background: m.color }} />
            {m.label}
          </span>
        ))}
      </div>

      {/* Mood Detail Sheet */}
      <AnimatePresence>
        {selectedMood && (
          <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-50 max-h-[60vh] overflow-y-auto rounded-t-3xl p-6 border-t border-white/10"
            style={{ background: isDark ? "rgba(10,10,25,0.97)" : "rgba(255,255,255,0.98)", backdropFilter: "blur(20px)" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2"
                style={{ color: getMood(selectedMood).color }}>
                <Sparkle size={18} weight="fill" />
                {getMood(selectedMood).label} Vibes ({filteredVibes.length})
              </h3>
              <button onClick={() => setSelectedMood(null)}
                className="p-2 rounded-xl" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)" }}>
                <X size={20} />
              </button>
            </div>
            {filteredVibes.length === 0 ? (
              <p className="text-sm opacity-50 py-8 text-center">No vibes for this mood yet.</p>
            ) : (
              <div className="space-y-3">
                {filteredVibes.map((v) => (
                  <div key={v.id} className="p-4 rounded-2xl border"
                    style={{ background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}>
                    <p className="text-sm leading-relaxed" style={{ color: isDark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.7)" }}>
                      {v.note.slice(0, 120)}{v.note.length > 120 ? "..." : ""}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] opacity-40">{v.date}</span>
                      {v.tags.slice(0, 2).map((t) => (
                        <span key={t} className="text-[10px] px-2 py-0.5 rounded-full"
                          style={{ background: `${v.auraColor}15`, color: v.auraColor }}>{t}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
