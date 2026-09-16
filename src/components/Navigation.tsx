import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { House, CalendarBlank, Sparkle, LockSimple, BookOpen, User, Gear, Plus, Sun, Moon } from "@phosphor-icons/react";
import { useVibes } from "../context/VibesContext";
import { Tab } from "../types";
import { getMood } from "../constants";

const NAV_ITEMS: { tab: Tab; label: string; icon: React.ElementType }[] = [
  { tab: "home", label: "Home", icon: House },
  { tab: "timeline", label: "Timeline", icon: CalendarBlank },
  { tab: "galaxy", label: "Galaxy", icon: Sparkle },
  { tab: "capsules", label: "Capsules", icon: LockSimple },
  { tab: "reflections", label: "Reflect", icon: BookOpen },
  { tab: "profile", label: "Profile", icon: User },
  { tab: "settings", label: "Settings", icon: Gear },
];

export const Navigation: React.FC<{ onAddVibe: () => void }> = ({ onAddVibe }) => {
  const { activeTab, setActiveTab, settings, setTheme } = useVibes();
  const mood = getMood(settings.activeMood);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 z-40 flex-col justify-between p-5 border-r border-white/5"
        style={{ background: settings.theme === "dark" ? "rgba(10,10,20,0.85)" : "rgba(245,243,255,0.9)", backdropFilter: "blur(24px)" }}>
        <div>
          <div className="flex items-center gap-2 mb-10 px-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: mood.gradient, boxShadow: `0 0 20px ${mood.glow}` }}>
              <Sparkle size={16} weight="fill" className="text-white" />
            </div>
            <span className="text-lg font-semibold tracking-tight"
              style={{ color: settings.theme === "dark" ? "#f0f0f5" : "#1a1a2e" }}>
              S.Vibes
            </span>
          </div>
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.tab;
              return (
                <button key={item.tab} onClick={() => setActiveTab(item.tab)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative overflow-hidden"
                  style={{
                    color: active ? mood.color : (settings.theme === "dark" ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)"),
                    background: active ? `${mood.color}12` : "transparent",
                  }}>
                  {active && (
                    <motion.div layoutId="sidebar-active" className="absolute inset-0 rounded-xl"
                      style={{ background: `${mood.color}08` }}
                      transition={{ type: "spring", stiffness: 350, damping: 30 }} />
                  )}
                  <Icon size={18} weight={active ? "fill" : "regular"} className="relative z-10" />
                  <span className="relative z-10">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setTheme(settings.theme === "dark" ? "light" : "dark")}
            className="p-2.5 rounded-xl transition-colors"
            style={{ background: settings.theme === "dark" ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)", color: settings.theme === "dark" ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)" }}>
            {settings.theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <span className="text-xs opacity-40">v1.0</span>
        </div>
      </aside>

      {/* Mobile Bottom Dock */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-3 pb-3 pt-2"
        style={{ background: `linear-gradient(to top, ${settings.theme === "dark" ? "rgba(10,10,20,0.95)" : "rgba(245,243,255,0.95)"}, transparent)` }}>
        <div className="flex items-center justify-around rounded-2xl px-2 py-2 border border-white/5"
          style={{ background: settings.theme === "dark" ? "rgba(20,20,40,0.8)" : "rgba(255,255,255,0.85)", backdropFilter: "blur(20px)", boxShadow: `0 -4px 30px ${mood.glow}20` }}>
          {NAV_ITEMS.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.tab;
            return (
              <button key={item.tab} onClick={() => setActiveTab(item.tab)}
                className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all"
                style={{ color: active ? mood.color : (settings.theme === "dark" ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)") }}>
                <Icon size={20} weight={active ? "fill" : "regular"} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Floating + Button */}
      <motion.button onClick={onAddVibe}
        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
        className="fixed z-50 w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg"
        style={{
          bottom: "calc(env(safe-area-inset-bottom, 0px) + 88px)", right: "20px",
          background: mood.gradient, boxShadow: `0 8px 32px ${mood.glow}`,
        }}>
        <Plus size={24} weight="bold" />
      </motion.button>
    </>
  );
};
