"use client";

import { Bell, Check, ChevronDown, ChevronUp, Download, Eye, EyeOff, LayoutDashboard, Monitor, Moon, Palette, RotateCcw, Sun, Target, Trash2, Upload, User } from "lucide-react";
import { useTheme } from "next-themes";
import { useRef, useState, type ReactNode } from "react";
import { WIDGET_META } from "@/components/dashboard/widget-shell";
import { Button } from "@/components/ui/button";
import { DomainDot } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/misc";
import { useAiStatus } from "@/hooks/use-ai-status";
import { cn } from "@/lib/cn";
import { useAppStore, useHydrated, type NotificationPrefs } from "@/lib/store";
import { GOALS, GOAL_IDS, LEVELS, LEVEL_IDS, TOPICS, TOPIC_IDS } from "@/lib/taxonomy";

function Section({ id, icon, title, description, children }: { id?: string; icon: ReactNode; title: string; description?: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 rounded-2xl border border-line bg-surface p-5 shadow-card sm:p-6">
      <div className="mb-5 flex items-start gap-3">
        <span className="mt-0.5 text-ink-3">{icon}</span>
        <div>
          <h2 className="text-[16px] font-semibold tracking-tight">{title}</h2>
          {description ? <p className="mt-0.5 text-[13px] text-ink-3">{description}</p> : null}
        </div>
      </div>
      {children}
    </section>
  );
}

function Toggle({ checked, onChange, label, description, disabled }: { checked: boolean; onChange: (v: boolean) => void; label: string; description?: string; disabled?: boolean }) {
  return (
    <label className={cn("flex items-start justify-between gap-4 py-3", disabled && "opacity-50")}>
      <span>
        <span className="block text-[14px] font-medium">{label}</span>
        {description ? <span className="mt-0.5 block text-[12.5px] text-ink-3">{description}</span> : null}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn("relative mt-0.5 h-6 w-10 shrink-0 rounded-full transition-colors", checked ? "bg-accent" : "bg-surface-3")}
      >
        <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform", checked ? "translate-x-[18px]" : "translate-x-0.5")} />
      </button>
    </label>
  );
}

export function Settings() {
  const hydrated = useHydrated();
  const { theme, setTheme } = useTheme();
  const aiOnline = useAiStatus();
  const state = useAppStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [permission, setPermission] = useState<NotificationPermission | "unsupported" | null>(() =>
    typeof Notification === "undefined" ? null : Notification.permission,
  );

  if (!hydrated) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  const prefs = state.notificationPrefs;
  const setPref = (patch: Partial<NotificationPrefs>) => state.setNotificationPrefs(patch);

  const enableBrowser = async (enabled: boolean) => {
    if (!enabled) return setPref({ browser: false });
    if (typeof Notification === "undefined") {
      setPermission("unsupported");
      return;
    }
    const result = await Notification.requestPermission();
    setPermission(result);
    setPref({ browser: result === "granted" });
  };

  const sendTest = () => {
    state.pushNotifications([
      {
        id: `test-${Date.now()}`,
        kind: "systeme",
        title: "Notification de test",
        body: "Vos notifications fonctionnent. Vous serez alerté des actualités sur vos thèmes suivis.",
        href: "/actualites",
        createdAt: new Date().toISOString(),
      },
    ]);
    if (prefs.browser && typeof Notification !== "undefined" && Notification.permission === "granted") {
      new Notification("Prisme — notification de test", { body: "Les notifications du navigateur sont actives.", icon: "/icon.svg" });
    }
    setMessage("Notification envoyée : regardez la cloche en haut de l'écran.");
  };

  const exportData = () => {
    const raw = localStorage.getItem(useAppStore.persist.getOptions().name ?? "prisme") ?? "{}";
    const blob = new Blob([raw], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `prisme-donnees-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = async (file: File) => {
    try {
      const parsed = JSON.parse(await file.text()) as { state?: unknown };
      if (!parsed || typeof parsed !== "object" || !parsed.state) throw new Error("format");
      localStorage.setItem(useAppStore.persist.getOptions().name ?? "prisme", JSON.stringify(parsed));
      await useAppStore.persist.rehydrate();
      setMessage("Données importées.");
    } catch {
      setMessage("Fichier invalide : utilisez un export Prisme.");
    }
  };

  return (
    <div className="grid gap-5">
      {message ? (
        <p role="status" className="rounded-xl bg-accent-soft px-4 py-3 text-[13.5px] text-ink">
          {message}
        </p>
      ) : null}

      <Section icon={<User className="h-5 w-5" />} title="Profil" description="Votre niveau adapte les explications de l'assistant et des fiches.">
        <label htmlFor="settings-name" className="block text-[13px] font-medium text-ink-2">
          Prénom
        </label>
        <input
          id="settings-name"
          value={state.profile.name}
          onChange={(e) => state.setProfile({ name: e.target.value.slice(0, 40) })}
          className="mt-1.5 h-10 w-full max-w-sm rounded-xl border border-line-strong bg-surface px-3.5 text-[14px] outline-none focus:border-accent"
        />
        <p className="mb-2 mt-5 text-[13px] font-medium text-ink-2">Niveau</p>
        <div className="grid gap-2 sm:grid-cols-3">
          {LEVEL_IDS.map((level) => (
            <button
              key={level}
              type="button"
              aria-pressed={state.profile.level === level}
              onClick={() => state.setProfile({ level })}
              className={cn(
                "rounded-xl border px-4 py-3 text-left transition-colors",
                state.profile.level === level ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
              )}
            >
              <span className="block text-[14px] font-medium">{LEVELS[level].label}</span>
              <span className="mt-0.5 block text-[12px] text-ink-3">{LEVELS[level].description}</span>
            </button>
          ))}
        </div>
      </Section>

      <Section id="objectifs" icon={<Target className="h-5 w-5" />} title="Objectifs" description="Ils déterminent votre programme d'apprentissage et orientent l'assistant.">
        <div className="grid gap-2 sm:grid-cols-2">
          {GOAL_IDS.map((goal) => {
            const selected = state.profile.goals.includes(goal);
            return (
              <button
                key={goal}
                type="button"
                aria-pressed={selected}
                onClick={() => state.toggleGoal(goal)}
                className={cn(
                  "flex items-start gap-3 rounded-xl border px-4 py-3 text-left transition-colors",
                  selected ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
                )}
              >
                <span className={cn("mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border", selected ? "border-accent bg-accent text-accent-ink" : "border-line-strong")}>
                  {selected ? <Check className="h-3 w-3" /> : null}
                </span>
                <span>
                  <span className="block text-[14px] font-medium">{GOALS[goal].label}</span>
                  <span className="mt-0.5 block text-[12px] text-ink-3">{GOALS[goal].description}</span>
                </span>
              </button>
            );
          })}
        </div>
      </Section>

      <Section icon={<Check className="h-5 w-5" />} title="Thèmes suivis" description="Ils personnalisent votre fil, vos recommandations et vos notifications.">
        <div className="flex flex-wrap gap-2">
          {TOPIC_IDS.map((topic) => {
            const selected = state.profile.interests.includes(topic);
            return (
              <button
                key={topic}
                type="button"
                onClick={() => state.toggleInterest(topic)}
                aria-pressed={selected}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[13.5px] font-medium transition-colors",
                  selected ? "border-accent bg-accent-soft text-ink" : "border-line text-ink-2 hover:bg-surface-2",
                )}
              >
                {selected ? <Check className="h-3.5 w-3.5 text-accent-text" /> : <DomainDot domain={TOPICS[topic].domain} />}
                {TOPICS[topic].label}
              </button>
            );
          })}
        </div>
      </Section>

      <Section icon={<Palette className="h-5 w-5" />} title="Apparence">
        <div role="radiogroup" aria-label="Thème" className="grid max-w-md grid-cols-3 gap-2">
          {[
            { id: "light", label: "Clair", icon: Sun },
            { id: "dark", label: "Sombre", icon: Moon },
            { id: "system", label: "Système", icon: Monitor },
          ].map((option) => (
            <button
              key={option.id}
              type="button"
              role="radio"
              aria-checked={theme === option.id}
              onClick={() => setTheme(option.id)}
              className={cn(
                "flex flex-col items-center gap-1.5 rounded-xl border px-3 py-3 text-[13px] font-medium transition-colors",
                theme === option.id ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
              )}
            >
              <option.icon className="h-5 w-5" /> {option.label}
            </button>
          ))}
        </div>
      </Section>

      <Section id="notifications" icon={<Bell className="h-5 w-5" />} title="Notifications" description="Choisissez ce qui mérite de vous interrompre.">
        <div className="divide-y divide-line">
          <Toggle checked={prefs.inApp} onChange={(v) => setPref({ inApp: v })} label="Notifications dans l'application" description="Affichées dans la cloche, en haut de l'écran." />
          <Toggle
            checked={prefs.breakingNews}
            onChange={(v) => setPref({ breakingNews: v })}
            disabled={!prefs.inApp}
            label="Actualités de mes thèmes"
            description="Les nouvelles informations sur les thèmes que vous suivez."
          />
          <Toggle
            checked={prefs.learningReminders}
            onChange={(v) => setPref({ learningReminders: v })}
            disabled={!prefs.inApp}
            label="Rappels d'apprentissage"
            description="Un rappel quand un parcours commencé est en pause depuis plus de 3 jours."
          />
          <Toggle
            checked={prefs.browser}
            onChange={(v) => void enableBrowser(v)}
            disabled={!prefs.inApp}
            label="Notifications du navigateur"
            description={
              permission === "denied"
                ? "Bloquées par le navigateur : autorisez-les dans les réglages du site."
                : permission === "unsupported"
                  ? "Non prises en charge par ce navigateur."
                  : "Également hors de l'onglet, avec votre autorisation."
            }
          />
        </div>
        <Button variant="outline" size="sm" className="mt-4" onClick={sendTest} disabled={!prefs.inApp}>
          <Bell className="h-3.5 w-3.5" /> Envoyer une notification de test
        </Button>
      </Section>

      <Section icon={<LayoutDashboard className="h-5 w-5" />} title="Tableau de bord" description="Ordre et visibilité des widgets de la page d'accueil.">
        <ol className="divide-y divide-line">
          {state.dashboard.order.map((id, index) => {
            const hidden = state.dashboard.hidden.includes(id);
            return (
              <li key={id} className="flex items-center gap-3 py-2.5">
                <span className="w-5 text-[12px] tabular-nums text-ink-3">{index + 1}</span>
                <span className={cn("flex-1 text-[14px]", hidden ? "text-ink-3 line-through" : "font-medium")}>{WIDGET_META[id].title}</span>
                <button type="button" onClick={() => state.moveWidget(id, -1)} disabled={index === 0} aria-label={`Monter « ${WIDGET_META[id].title} »`} className="rounded-lg p-1.5 text-ink-3 hover:bg-surface-2 disabled:opacity-30">
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => state.moveWidget(id, 1)}
                  disabled={index === state.dashboard.order.length - 1}
                  aria-label={`Descendre « ${WIDGET_META[id].title} »`}
                  className="rounded-lg p-1.5 text-ink-3 hover:bg-surface-2 disabled:opacity-30"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => state.toggleWidget(id)}
                  aria-label={hidden ? `Afficher « ${WIDGET_META[id].title} »` : `Masquer « ${WIDGET_META[id].title} »`}
                  className="rounded-lg p-1.5 text-ink-3 hover:bg-surface-2 hover:text-ink"
                >
                  {hidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </li>
            );
          })}
        </ol>
        <Button variant="ghost" size="sm" className="mt-3" onClick={state.resetDashboard}>
          <RotateCcw className="h-3.5 w-3.5" /> Disposition par défaut
        </Button>
      </Section>

      <Section icon={<Download className="h-5 w-5" />} title="Mes données" description="Profil, favoris, progression et historique sont stockés uniquement dans ce navigateur.">
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={exportData}>
            <Download className="h-3.5 w-3.5" /> Exporter (JSON)
          </Button>
          <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
            <Upload className="h-3.5 w-3.5" /> Importer
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void importData(file);
              e.target.value = "";
            }}
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (window.confirm("Réinitialiser toute la progression des parcours et des quiz ?")) state.resetProgress();
            }}
          >
            <RotateCcw className="h-3.5 w-3.5" /> Réinitialiser la progression
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-critical-text"
            onClick={() => {
              if (window.confirm("Effacer toutes vos données (profil, favoris, listes, progression, historique) ? Cette action est définitive.")) state.resetAll();
            }}
          >
            <Trash2 className="h-3.5 w-3.5" /> Tout effacer
          </Button>
        </div>
        <p className="mt-4 text-[12.5px] text-ink-3">
          Assistant IA : {aiOnline === null ? "vérification…" : aiOnline ? "connecté (Claude)" : "mode hors ligne (aucune clé API configurée sur le serveur)"}.
        </p>
      </Section>
    </div>
  );
}
