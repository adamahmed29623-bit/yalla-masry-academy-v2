import { Smile, Mic, Crown, Medal, type LucideIcon } from 'lucide-react';

// Enum to define unique badge names
export const enum BadgeName {
  FirstLogin = 'first_login',
  MarketDialogue = 'market_dialogue',
  PerfectPronunciation = 'perfect_pronunciation',
}

// Interface for badge information
export interface BadgeInfo {
  name: string;
  description: string;
  icon: LucideIcon;
  color: string;
}

// A record mapping badge names to their detailed information
export const BADGE_DEFINITIONS: Record<BadgeName, BadgeInfo> = {
  [BadgeName.FirstLogin]: {
    name: 'تذكرة الدخول الملكية',
    description: 'مُنحت عند دخول المملكة لأول مرة. أهلاً بكِ!',
    icon: Crown,
    color: '#FFD700', // Gold
  },
  [BadgeName.MarketDialogue]: {
    name: 'خبيرة حوارات السوق',
    description: 'مُنحت لإتقان تحدي الحوار في السوق بنجاح.',
    icon: Smile,
    color: '#34D399', // Emerald
  },
  [BadgeName.PerfectPronunciation]: {
    name: 'صوت حتشبسوت',
    description: 'مُنحت لتحقيق نطق مثالي في تحدي قوة حتشبسوت.',
    icon: Mic,
    color: '#60A5FA', // Blue
  },
};

/**
 * Retrieves badge information by its name (enum value).
 * @param name The name of the badge (from the Badge enum).
 * @returns The BadgeInfo object or null if not found.
 */
export function getBadgeByName(name: string): BadgeInfo | null {
  return BADGE_DEFINITIONS[name as BadgeName] || null;
}
