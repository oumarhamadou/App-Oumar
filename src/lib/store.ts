"use client";

import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Level, Topic } from "@/lib/taxonomy";

export type ItemKind = "actualite" | "concept" | "lecon" | "cas" | "outil";

export interface LibraryItem {
  /** Unique key, e.g. "concept:inflation" or "actualite:abc123". */
  key: string;
  kind: ItemKind;
  title: string;
  href: string;
  topics?: Topic[];
  /** Optional subtitle (source, path name…). */
  meta?: string;
}

export interface SavedItem extends LibraryItem {
  savedAt: string;
}

export interface HistoryEntry extends LibraryItem {
  at: string;
}

export interface ReadingList {
  id: string;
  name: string;
  itemKeys: string[];
  createdAt: string;
}

export interface LessonProgress {
  completedAt: string;
  score?: number;
  total?: number;
}

export interface QuizResult {
  score: number;
  total: number;
  at: string;
}

export interface NotificationPrefs {
  inApp: boolean;
  browser: boolean;
  breakingNews: boolean;
  learningReminders: boolean;
}

export interface AppNotification {
  id: string;
  kind: "actualite" | "apprentissage" | "systeme";
  title: string;
  body: string;
  href?: string;
  createdAt: string;
  read: boolean;
}

export type WidgetId = "une" | "marches" | "macro" | "progression" | "recommandations" | "ia" | "concept" | "lecture";

export const ALL_WIDGETS: WidgetId[] = ["une", "marches", "macro", "progression", "recommandations", "ia", "concept", "lecture"];

export interface NewsExplanation {
  summary: string;
  whyItMatters: string;
  keyPoints: string[];
  concepts: string[];
  generatedAt: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: { title: string; url: string }[];
  error?: boolean;
}

export interface Profile {
  name: string;
  level: Level;
  interests: Topic[];
  onboarded: boolean;
}

interface AppState {
  profile: Profile;
  saved: SavedItem[];
  lists: ReadingList[];
  history: HistoryEntry[];
  progress: Record<string, LessonProgress>;
  quizzes: Record<string, QuizResult>;
  notificationPrefs: NotificationPrefs;
  notifications: AppNotification[];
  /** Ids of news items already turned into notifications. */
  notifiedNewsIds: string[];
  dashboard: { order: WidgetId[]; hidden: WidgetId[] };
  explanations: Record<string, NewsExplanation>;
  chat: ChatMessage[];

  setProfile: (patch: Partial<Profile>) => void;
  toggleInterest: (topic: Topic) => void;

  toggleSaved: (item: LibraryItem) => void;
  createList: (name: string) => string;
  renameList: (id: string, name: string) => void;
  deleteList: (id: string) => void;
  toggleInList: (listId: string, item: LibraryItem) => void;

  recordVisit: (item: LibraryItem) => void;
  clearHistory: () => void;

  completeLesson: (key: string, score?: number, total?: number) => void;
  saveQuiz: (key: string, score: number, total: number) => void;
  resetProgress: () => void;

  setNotificationPrefs: (patch: Partial<NotificationPrefs>) => void;
  pushNotifications: (items: Omit<AppNotification, "read">[], newsIds?: string[]) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;

  moveWidget: (id: WidgetId, direction: -1 | 1) => void;
  toggleWidget: (id: WidgetId) => void;
  resetDashboard: () => void;

  cacheExplanation: (newsId: string, explanation: NewsExplanation) => void;

  setChat: (messages: ChatMessage[]) => void;
  clearChat: () => void;

  resetAll: () => void;
}

const MAX_HISTORY = 60;
const MAX_NOTIFICATIONS = 40;
const MAX_EXPLANATIONS = 40;
const MAX_CHAT = 40;

const initialData = {
  profile: { name: "", level: "debutant" as Level, interests: [] as Topic[], onboarded: false },
  saved: [] as SavedItem[],
  lists: [] as ReadingList[],
  history: [] as HistoryEntry[],
  progress: {} as Record<string, LessonProgress>,
  quizzes: {} as Record<string, QuizResult>,
  notificationPrefs: {
    inApp: true,
    browser: false,
    breakingNews: true,
    learningReminders: true,
  },
  notifications: [] as AppNotification[],
  notifiedNewsIds: [] as string[],
  dashboard: { order: [...ALL_WIDGETS], hidden: [] as WidgetId[] },
  explanations: {} as Record<string, NewsExplanation>,
  chat: [] as ChatMessage[],
};

function newId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function strip(item: LibraryItem): LibraryItem {
  const { key, kind, title, href, topics, meta } = item;
  return { key, kind, title, href, topics, meta };
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      ...initialData,

      setProfile: (patch) => set((s) => ({ profile: { ...s.profile, ...patch } })),
      toggleInterest: (topic) =>
        set((s) => ({
          profile: {
            ...s.profile,
            interests: s.profile.interests.includes(topic)
              ? s.profile.interests.filter((t) => t !== topic)
              : [...s.profile.interests, topic],
          },
        })),

      toggleSaved: (item) =>
        set((s) => {
          const exists = s.saved.some((x) => x.key === item.key);
          if (exists) {
            return {
              saved: s.saved.filter((x) => x.key !== item.key),
              lists: s.lists.map((l) => ({ ...l, itemKeys: l.itemKeys.filter((k) => k !== item.key) })),
            };
          }
          return { saved: [{ ...strip(item), savedAt: new Date().toISOString() }, ...s.saved] };
        }),
      createList: (name) => {
        const id = newId("liste");
        set((s) => ({ lists: [...s.lists, { id, name: name.trim() || "Nouvelle liste", itemKeys: [], createdAt: new Date().toISOString() }] }));
        return id;
      },
      renameList: (id, name) =>
        set((s) => ({ lists: s.lists.map((l) => (l.id === id ? { ...l, name: name.trim() || l.name } : l)) })),
      deleteList: (id) => set((s) => ({ lists: s.lists.filter((l) => l.id !== id) })),
      toggleInList: (listId, item) =>
        set((s) => {
          const list = s.lists.find((l) => l.id === listId);
          if (!list) return {};
          const inList = list.itemKeys.includes(item.key);
          const saved = s.saved.some((x) => x.key === item.key)
            ? s.saved
            : [{ ...strip(item), savedAt: new Date().toISOString() }, ...s.saved];
          return {
            saved,
            lists: s.lists.map((l) =>
              l.id === listId
                ? { ...l, itemKeys: inList ? l.itemKeys.filter((k) => k !== item.key) : [...l.itemKeys, item.key] }
                : l,
            ),
          };
        }),

      recordVisit: (item) =>
        set((s) => ({
          history: [{ ...strip(item), at: new Date().toISOString() }, ...s.history.filter((h) => h.key !== item.key)].slice(
            0,
            MAX_HISTORY,
          ),
        })),
      clearHistory: () => set({ history: [] }),

      completeLesson: (key, score, total) =>
        set((s) => ({ progress: { ...s.progress, [key]: { completedAt: new Date().toISOString(), score, total } } })),
      saveQuiz: (key, score, total) =>
        set((s) => ({ quizzes: { ...s.quizzes, [key]: { score, total, at: new Date().toISOString() } } })),
      resetProgress: () => set({ progress: {}, quizzes: {} }),

      setNotificationPrefs: (patch) => set((s) => ({ notificationPrefs: { ...s.notificationPrefs, ...patch } })),
      pushNotifications: (items, newsIds = []) =>
        set((s) => {
          const existing = new Set(s.notifications.map((n) => n.id));
          const fresh = items.filter((n) => !existing.has(n.id)).map((n) => ({ ...n, read: false }));
          return {
            notifications: [...fresh, ...s.notifications].slice(0, MAX_NOTIFICATIONS),
            notifiedNewsIds: [...new Set([...newsIds, ...s.notifiedNewsIds])].slice(0, 200),
          };
        }),
      markNotificationRead: (id) =>
        set((s) => ({ notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)) })),
      markAllNotificationsRead: () => set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
      clearNotifications: () => set({ notifications: [] }),

      moveWidget: (id, direction) =>
        set((s) => {
          const order = [...s.dashboard.order];
          const index = order.indexOf(id);
          const target = index + direction;
          if (index < 0 || target < 0 || target >= order.length) return {};
          [order[index], order[target]] = [order[target], order[index]];
          return { dashboard: { ...s.dashboard, order } };
        }),
      toggleWidget: (id) =>
        set((s) => ({
          dashboard: {
            ...s.dashboard,
            hidden: s.dashboard.hidden.includes(id) ? s.dashboard.hidden.filter((w) => w !== id) : [...s.dashboard.hidden, id],
          },
        })),
      resetDashboard: () => set({ dashboard: { order: [...ALL_WIDGETS], hidden: [] } }),

      cacheExplanation: (newsId, explanation) =>
        set((s) => {
          const entries = Object.entries({ ...s.explanations, [newsId]: explanation })
            .sort((a, b) => b[1].generatedAt.localeCompare(a[1].generatedAt))
            .slice(0, MAX_EXPLANATIONS);
          return { explanations: Object.fromEntries(entries) };
        }),

      setChat: (messages) => set({ chat: messages.slice(-MAX_CHAT) }),
      clearChat: () => set({ chat: [] }),

      resetAll: () => set({ ...initialData, dashboard: { order: [...ALL_WIDGETS], hidden: [] } }),
    }),
    {
      name: "prisme",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: (state) => ({
        profile: state.profile,
        saved: state.saved,
        lists: state.lists,
        history: state.history,
        progress: state.progress,
        quizzes: state.quizzes,
        notificationPrefs: state.notificationPrefs,
        notifications: state.notifications,
        notifiedNewsIds: state.notifiedNewsIds,
        dashboard: state.dashboard,
        explanations: state.explanations,
        chat: state.chat,
      }),
      merge: (persisted, current) => {
        const data = (persisted ?? {}) as Partial<AppState>;
        const dashboard = data.dashboard ?? current.dashboard;
        // Keep widgets added in later versions visible in the saved order.
        const order = [...dashboard.order.filter((w) => ALL_WIDGETS.includes(w)), ...ALL_WIDGETS.filter((w) => !dashboard.order.includes(w))];
        return {
          ...current,
          ...data,
          profile: { ...current.profile, ...data.profile },
          notificationPrefs: { ...current.notificationPrefs, ...data.notificationPrefs },
          dashboard: { order, hidden: dashboard.hidden ?? [] },
        };
      },
    },
  ),
);

function subscribeHydration(callback: () => void): () => void {
  const unsubFinish = useAppStore.persist.onFinishHydration(callback);
  const unsubStart = useAppStore.persist.onHydrate(callback);
  return () => {
    unsubFinish();
    unsubStart();
  };
}

/** True once persisted data has been loaded from localStorage (always false on the server). */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribeHydration,
    () => useAppStore.persist.hasHydrated(),
    () => false,
  );
}
