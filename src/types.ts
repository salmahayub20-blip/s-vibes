export type MoodId =
  | "cosmic"
  | "serene"
  | "radiant"
  | "dreamy"
  | "electric"
  | "melancholy"
  | "grounded";

export interface MoodPreset {
  id: MoodId;
  label: string;
  color: string;
  gradient: string;
  glow: string;
  bgDark: string;
  bgLight: string;
}

export interface VibeMusic {
  title: string;
  artist: string;
  moodTag?: string;
}

export interface Vibe {
  id: string;
  date: string;
  mood: MoodId;
  note: string;
  photo?: string;
  music?: VibeMusic;
  tags: string[];
  auraColor: string;
  favorite: boolean;
  createdAt: number;
}

export interface Capsule {
  id: string;
  title: string;
  note: string;
  mood: MoodId;
  photo?: string;
  tags: string[];
  lockedAt: number;
  unlockAt: number;
  unlocked: boolean;
  createdAt: number;
}

export interface Reflection {
  id: string;
  date: string;
  prompt: string;
  answer: string;
  mood?: MoodId;
  createdAt: number;
}

export interface AppSettings {
  theme: "dark" | "light";
  onboarded: boolean;
  activeMood: MoodId;
  streak: number;
  lastReflectionDate?: string;
}

export type Tab =
  | "home"
  | "timeline"
  | "galaxy"
  | "capsules"
  | "reflections"
  | "profile"
  | "settings";

export interface VibesState {
  vibes: Vibe[];
  capsules: Capsule[];
  reflections: Reflection[];
  settings: AppSettings;
}
