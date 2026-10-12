"use client";

import { ArrowRight, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DomainDot } from "@/components/ui/badge";
import { cn } from "@/lib/cn";
import { SITE } from "@/lib/site";
import { useAppStore, useHydrated } from "@/lib/store";
import { LEVELS, LEVEL_IDS, TOPICS, TOPIC_IDS } from "@/lib/taxonomy";
import { LogoMark } from "./logo";

/** First-visit setup: level and interests drive the whole personalization. */
export function Onboarding() {
  const hydrated = useHydrated();
  const onboarded = useAppStore((s) => s.profile.onboarded);
  if (!hydrated || onboarded) return null;
  return <OnboardingDialog />;
}

function OnboardingDialog() {
  const profile = useAppStore((s) => s.profile);
  const setProfile = useAppStore((s) => s.setProfile);
  const toggleInterest = useAppStore((s) => s.toggleInterest);
  const [step, setStep] = useState(0);

  const finish = () => setProfile({ onboarded: true });

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-labelledby="onboarding-title">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[3px]" />
      <div className="animate-rise relative max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-3xl border border-line bg-surface p-6 shadow-pop sm:rounded-3xl sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <LogoMark className="h-8 w-8" />
          <div className="flex gap-1.5" aria-label={`Étape ${step + 1} sur 2`}>
            {[0, 1].map((i) => (
              <span key={i} className={cn("h-1.5 w-6 rounded-full", i <= step ? "bg-accent" : "bg-surface-3")} />
            ))}
          </div>
        </div>

        {step === 0 ? (
          <>
            <h2 id="onboarding-title" className="text-[22px] font-semibold tracking-tight">
              Bienvenue sur {SITE.name}
            </h2>
            <p className="mt-2 text-[14.5px] leading-relaxed text-ink-2">
              L&apos;IA, l&apos;économie et la finance, expliquées simplement. Deux questions pour adapter les explications et les actualités à vos besoins.
            </p>
            <label className="mt-6 block text-[13px] font-medium text-ink-2" htmlFor="onboarding-name">
              Votre prénom <span className="font-normal text-ink-3">(facultatif)</span>
            </label>
            <input
              id="onboarding-name"
              value={profile.name}
              onChange={(e) => setProfile({ name: e.target.value.slice(0, 40) })}
              placeholder="Ex. : Aïcha"
              className="mt-1.5 h-11 w-full rounded-xl border border-line-strong bg-surface px-3.5 text-[15px] outline-none focus:border-accent"
            />
            <fieldset className="mt-6">
              <legend className="text-[13px] font-medium text-ink-2">Votre niveau actuel</legend>
              <div className="mt-2 grid gap-2">
                {LEVEL_IDS.map((level) => {
                  const selected = profile.level === level;
                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setProfile({ level })}
                      aria-pressed={selected}
                      className={cn(
                        "flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors",
                        selected ? "border-accent bg-accent-soft" : "border-line hover:bg-surface-2",
                      )}
                    >
                      <span className={cn("flex h-5 w-5 shrink-0 items-center justify-center rounded-full border", selected ? "border-accent bg-accent text-accent-ink" : "border-line-strong")}>
                        {selected ? <Check className="h-3 w-3" /> : null}
                      </span>
                      <span>
                        <span className="block text-[14px] font-medium">{LEVELS[level].label}</span>
                        <span className="block text-[12.5px] text-ink-3">{LEVELS[level].description}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>
            <div className="mt-7 flex items-center justify-between">
              <button type="button" onClick={finish} className="text-[13px] text-ink-3 hover:text-ink">
                Passer
              </button>
              <Button onClick={() => setStep(1)}>
                Continuer <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </>
        ) : (
          <>
            <h2 id="onboarding-title" className="text-[22px] font-semibold tracking-tight">
              Quels sujets vous intéressent ?
            </h2>
            <p className="mt-2 text-[14.5px] leading-relaxed text-ink-2">
              Votre fil d&apos;actualité, vos recommandations et vos notifications s&apos;appuieront sur ces thèmes. Modifiable à tout moment.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {TOPIC_IDS.map((topic) => {
                const selected = profile.interests.includes(topic);
                return (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => toggleInterest(topic)}
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
            <div className="mt-7 flex items-center justify-between">
              <button type="button" onClick={() => setStep(0)} className="text-[13px] text-ink-3 hover:text-ink">
                Retour
              </button>
              <Button onClick={finish}>
                {profile.interests.length === 0 ? "Tout suivre" : "Commencer"} <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
