"use client";

import { useEffect, useRef } from "react";
import { learningPaths, lessonKey } from "@/content/learning-paths";
import { loadNews } from "@/hooks/use-news";
import { matchesInterests } from "@/lib/recommend";
import { useAppStore, useHydrated, type AppNotification } from "@/lib/store";

const NEWS_WINDOW_MS = 3 * 86_400_000;
const REMINDER_AFTER_MS = 3 * 86_400_000;

function showBrowserNotification(n: Omit<AppNotification, "read">) {
  if (typeof Notification === "undefined" || Notification.permission !== "granted") return;
  try {
    const notification = new Notification(n.title, { body: n.body, tag: n.id, icon: "/icon.svg" });
    if (n.href) notification.onclick = () => window.open(n.href, "_self");
  } catch {
    // Some browsers only allow notifications from a service worker.
  }
}

/**
 * Turns followed-topic news and learning progress into in-app (and,
 * if allowed, browser) notifications. Runs once per session.
 */
export function NotificationEngine() {
  const hydrated = useHydrated();
  const ran = useRef(false);

  useEffect(() => {
    if (!hydrated || ran.current) return;
    ran.current = true;
    const state = useAppStore.getState();
    const prefs = state.notificationPrefs;
    if (!state.profile.onboarded || !prefs.inApp) return;

    const now = Date.now();
    const pending: Omit<AppNotification, "read">[] = [];
    const newsIds: string[] = [];

    if (prefs.learningReminders) {
      const lastDone = Object.values(state.progress)
        .map((p) => new Date(p.completedAt).getTime())
        .sort((a, b) => b - a)[0];
      const inProgress = learningPaths.find((path) => {
        const done = path.lessons.filter((l) => state.progress[lessonKey(path.slug, l.slug)]).length;
        return done > 0 && done < path.lessons.length;
      });
      if (inProgress && lastDone && now - lastDone > REMINDER_AFTER_MS) {
        const next = inProgress.lessons.find((l) => !state.progress[lessonKey(inProgress.slug, l.slug)])!;
        pending.push({
          id: `rappel-${new Date(now).toISOString().slice(0, 10)}`,
          kind: "apprentissage",
          title: `Reprenez « ${inProgress.title} »`,
          body: `Prochaine leçon : ${next.title} (${next.minutes} min).`,
          href: `/apprendre/${inProgress.slug}/${next.slug}`,
          createdAt: new Date(now).toISOString(),
        });
      }
    }

    const finish = () => {
      if (pending.length === 0) return;
      useAppStore.getState().pushNotifications(pending, newsIds);
      if (prefs.browser) pending.slice(0, 2).forEach(showBrowserNotification);
    };

    if (!prefs.breakingNews) {
      finish();
      return;
    }

    loadNews()
      .then((feed) => {
        const { notifiedNewsIds, profile } = useAppStore.getState();
        const firstRun = notifiedNewsIds.length === 0;
        const fresh = feed.items.filter(
          (item) =>
            !notifiedNewsIds.includes(item.id) &&
            matchesInterests(item, profile.interests) &&
            (feed.mode === "demo" || now - new Date(item.publishedAt).getTime() < NEWS_WINDOW_MS),
        );
        // Mark everything seen so the next session only reports genuinely new items.
        newsIds.push(...feed.items.map((i) => i.id));
        for (const item of fresh.slice(0, firstRun ? 2 : 5)) {
          pending.push({
            id: `actu-${item.id}`,
            kind: "actualite",
            title: item.title,
            body: item.source.name,
            href: `/actualites/${item.id}`,
            createdAt: new Date(now).toISOString(),
          });
        }
      })
      .catch(() => undefined)
      .finally(finish);
  }, [hydrated]);

  return null;
}
