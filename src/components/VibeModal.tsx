import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Camera, MusicNote, Tag, LockSimple, Heart } from "@phosphor-icons/react";
import { useVibes } from "../context/VibesContext";
import { MoodId, Vibe, Capsule } from "../types";
import { MOOD_PRESETS, getMood, genId } from "../constants";

interface VibeModalProps {
  open: boolean;
  onClose: () => void;
}

export const VibeModal: React.FC<VibeModalProps> = ({ open, onClose }) => {
  const { addVibe, addCapsule, settings, setActiveMood } = useVibes();
  const [mode, setMode] = useState<"vibe" | "capsule">("vibe");
  const [mood, setMood] = useState<MoodId>("cosmic");
  const [note, setNote] = useState("");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [photo, setPhoto] = useState<string | undefined>();
  const [musicTitle, setMusicTitle] = useState("");
  const [musicArtist, setMusicArtist] = useState("");
  const [auraColor, setAuraColor] = useState("#6366f1");
  const [unlockDate, setUnlockDate] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPhoto(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const addTag = () => {
    const t = tagInput.trim().replace(/^#/, "");
    if (t && !tags.includes(`#${t}`)) setTags((prev) => [...prev, `#${t}`]);
    setTagInput("");
  };

  const handleSubmit = () => {
    if (!note.trim()) return;
    if (mode === "vibe") {
      const vibe: Omit<Vibe, "id" | "createdAt"> = {
        date: new Date().toISOString().slice(0, 10),
        mood, note: note.trim(), photo, tags, auraColor, favorite: false,
        music: musicTitle ? { title: musicTitle, artist: musicArtist } : undefined,
      };
      addVibe(vibe);
    } else {
      const capsule: Omit<Capsule, "id" | "createdAt" | "lockedAt" | "unlocked"> = {
        title: title || "Untitled Capsule",
        note: note.trim(), mood, photo, tags,
        unlockAt: unlockDate ? new Date(unlockDate).getTime() : Date.now() + 86400000 * 30,
      };
      addCapsule(capsule);
    }
    setActiveMood(mood);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setNote(""); setTitle(""); setTags([]); setPhoto(undefined);
    setMusicTitle(""); setMusicArtist(""); setUnlockDate(""); setMode("vibe");
  };

  const isDark = settings.theme === "dark";
  const inputBg = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)";
  const inputBorder = isDark ? "border-white/10" : "border-black/10";
  const textColor = isDark ? "text-white" : "text-gray-900";
  const mutedColor = isDark ? "text-white/50" : "text-gray-500";

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center"
          style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
          onClick={onClose}>
          <motion.div initial={{ y: 100, opacity: 0, scale: 0.95 }} animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 100, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl p-6 border border-white/10"
            style={{ background: isDark ? "rgba(15,15,30,0.97)" : "rgba(255,255,255,0.98)", boxShadow: `0 24px 80px ${getMood(mood).glow}30` }}>
            
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-semibold ${textColor}`}>
                {mode === "vibe" ? "Create a Vibe" : "Seal a Capsule"}
              </h2>
              <button onClick={onClose} className={`p-2 rounded-xl ${mutedColor} hover:bg-white/5`}>
                <X size={20} />
              </button>
            </div>

            {/* Mode Toggle */}
            <div className="flex gap-2 mb-6 p-1 rounded-xl" style={{ background: inputBg }}>
              {(["vibe", "capsule"] as const).map((m) => (
                <button key={m} onClick={() => setMode(m)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${mode === m ? "text-white" : mutedColor}`}
                  style={mode === m ? { background: getMood(mood).gradient } : {}}>
                  {m === "vibe" ? "Vibe" : "Capsule"}
                </button>
              ))}
            </div>

            {/* Mood Picker */}
            <div className="mb-5">
              <label className={`text-xs font-medium uppercase tracking-wider ${mutedColor} mb-2 block`}>Mood</label>
              <div className="flex flex-wrap gap-2">
                {MOOD_PRESETS.map((m) => (
                  <button key={m.id} onClick={() => { setMood(m.id); setAuraColor(m.color); }}
                    className="px-3 py-1.5 rounded-full text-xs font-medium transition-all border"
                    style={{
                      background: mood === m.id ? m.gradient : "transparent",
                      color: mood === m.id ? "#fff" : (isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)"),
                      borderColor: mood === m.id ? "transparent" : (isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"),
                      boxShadow: mood === m.id ? `0 4px 16px ${m.glow}` : "none",
                    }}>
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Title (capsule only) */}
            {mode === "capsule" && (
              <div className="mb-4">
                <label className={`text-xs font-medium uppercase tracking-wider ${mutedColor} mb-2 block`}>Title</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)}
                  placeholder="Name this capsule..."
                  className={`w-full px-4 py-3 rounded-xl border ${inputBorder} ${textColor} outline-none focus:ring-2`}
                  style={{ background: inputBg }} />
              </div>
            )}

            {/* Note */}
            <div className="mb-4">
              <label className={`text-xs font-medium uppercase tracking-wider ${mutedColor} mb-2 block`}>
                {mode === "capsule" ? "Message to future you" : "What is this vibe?"}
              </label>
              <textarea value={note} onChange={(e) => setNote(e.target.value)}
                placeholder={mode === "capsule" ? "Write something your future self needs to hear..." : "Capture the moment, the feeling, the detail..."}
                rows={4}
                className={`w-full px-4 py-3 rounded-xl border ${inputBorder} ${textColor} outline-none resize-none focus:ring-2`}
                style={{ background: inputBg }} />
            </div>

            {/* Photo */}
            <div className="mb-4">
              <label className={`text-xs font-medium uppercase tracking-wider ${mutedColor} mb-2 block`}>Photo</label>
              <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
              {photo ? (
                <div className="relative rounded-xl overflow-hidden">
                  <img src={photo} alt="" className="w-full h-40 object-cover" />
                  <button onClick={() => setPhoto(undefined)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white">
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <button onClick={() => fileRef.current?.click()}
                  className={`w-full py-6 rounded-xl border-2 border-dashed flex flex-col items-center gap-2 ${inputBorder} ${mutedColor} hover:border-current transition-colors`}>
                  <Camera size={24} />
                  <span className="text-xs">Tap to add a photo</span>
                </button>
              )}
            </div>

            {/* Music */}
            {mode === "vibe" && (
              <div className="mb-4">
                <label className={`text-xs font-medium uppercase tracking-wider ${mutedColor} mb-2 flex items-center gap-1.5`}>
                  <MusicNote size={12} /> Soundtrack
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input value={musicTitle} onChange={(e) => setMusicTitle(e.target.value)}
                    placeholder="Song title"
                    className={`px-3 py-2.5 rounded-xl border ${inputBorder} ${textColor} text-sm outline-none`}
                    style={{ background: inputBg }} />
                  <input value={musicArtist} onChange={(e) => setMusicArtist(e.target.value)}
                    placeholder="Artist"
                    className={`px-3 py-2.5 rounded-xl border ${inputBorder} ${textColor} text-sm outline-none`}
                    style={{ background: inputBg }} />
                </div>
              </div>
            )}

            {/* Unlock Date (capsule) */}
            {mode === "capsule" && (
              <div className="mb-4">
                <label className={`text-xs font-medium uppercase tracking-wider ${mutedColor} mb-2 flex items-center gap-1.5`}>
                  <LockSimple size={12} /> Unlock Date
                </label>
                <input type="date" value={unlockDate} onChange={(e) => setUnlockDate(e.target.value)}
                  min={new Date(Date.now() + 86400000).toISOString().slice(0, 10)}
                  className={`w-full px-4 py-3 rounded-xl border ${inputBorder} ${textColor} outline-none`}
                  style={{ background: inputBg }} />
              </div>
            )}

            {/* Tags */}
            <div className="mb-6">
              <label className={`text-xs font-medium uppercase tracking-wider ${mutedColor} mb-2 flex items-center gap-1.5`}>
                <Tag size={12} /> Tags
              </label>
              <div className="flex gap-2 mb-2">
                <input value={tagInput} onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addTag()}
                  placeholder="Add a tag..."
                  className={`flex-1 px-3 py-2 rounded-xl border ${inputBorder} ${textColor} text-sm outline-none`}
                  style={{ background: inputBg }} />
                <button onClick={addTag} className="px-3 py-2 rounded-xl text-sm font-medium"
                  style={{ background: inputBg, color: getMood(mood).color }}>Add</button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((t) => (
                    <span key={t} className="px-2.5 py-1 rounded-full text-xs font-medium"
                      style={{ background: `${getMood(mood).color}15`, color: getMood(mood).color }}>
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Aura Color */}
            <div className="mb-6">
              <label className={`text-xs font-medium uppercase tracking-wider ${mutedColor} mb-2 block`}>Aura Color</label>
              <div className="flex items-center gap-3">
                <input type="color" value={auraColor} onChange={(e) => setAuraColor(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer border-0" />
                <span className={`text-sm ${mutedColor}`}>{auraColor}</span>
              </div>
            </div>

            {/* Submit */}
            <motion.button onClick={handleSubmit}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-2xl text-white font-semibold text-sm flex items-center justify-center gap-2"
              style={{ background: getMood(mood).gradient, boxShadow: `0 8px 32px ${getMood(mood).glow}` }}>
              {mode === "capsule" ? <LockSimple size={16} weight="fill" /> : <Heart size={16} weight="fill" />}
              {mode === "capsule" ? "Seal Capsule" : "Save Vibe"}
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
