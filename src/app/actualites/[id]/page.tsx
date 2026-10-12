import { ArrowLeft, ArrowRight, ExternalLink, Info, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { SaveButton } from "@/components/common/save-button";
import { TrackVisit } from "@/components/common/track-visit";
import { AiExplain } from "@/components/news/ai-explain";
import { NewsCard, newsLibraryItem } from "@/components/news/news-card";
import { NewsVisual } from "@/components/news/news-visual";
import { DomainDot, TopicBadge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/misc";
import { ButtonLink } from "@/components/ui/button";
import { getConcept } from "@/content/concepts";
import { formatDateTime } from "@/lib/format";
import { getNews, getNewsItem } from "@/lib/news";
import { genericContext } from "@/lib/news/context";

type Params = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  const { items } = await getNews();
  return items.slice(0, 24).map((item) => ({ id: item.id }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const item = await getNewsItem(id);
  return item ? { title: item.title, description: item.summary || undefined } : { title: "Actualité introuvable" };
}

export default function NewsDetailPage({ params }: Params) {
  return (
    <Suspense fallback={<DetailSkeleton />}>
      <NewsDetail params={params} />
    </Suspense>
  );
}

function DetailSkeleton() {
  return (
    <div className="mx-auto max-w-3xl space-y-4" aria-busy="true">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-2/3" />
      <Skeleton className="mt-6 h-32 w-full" />
    </div>
  );
}

async function NewsDetail({ params }: Params) {
  const { id } = await params;
  const item = await getNewsItem(id);
  if (!item) notFound();

  const context = genericContext(item.topics);
  const conceptSlugs = item.relatedConcepts?.length ? item.relatedConcepts : context.concepts;
  const related = conceptSlugs.map(getConcept).filter((c) => c !== undefined);
  const { items } = await getNews();
  const more = items.filter((other) => other.id !== item.id && other.topics.some((t) => item.topics.includes(t))).slice(0, 3);
  const question = `Explique-moi cette actualité et ses conséquences : « ${item.title} » (${item.source.name})`;

  return (
    <article className="mx-auto max-w-3xl">
      <TrackVisit item={newsLibraryItem(item)} />
      <Link href="/actualites" className="mb-6 inline-flex items-center gap-1.5 text-[13px] font-medium text-ink-3 hover:text-ink">
        <ArrowLeft className="h-4 w-4" /> Actualités
      </Link>

      <div className="flex flex-wrap items-center gap-1.5">
        {item.topics.map((t) => (
          <TopicBadge key={t} topic={t} />
        ))}
        {item.isDemo ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-warning/50 bg-warning/10 px-2 py-0.5 text-[11.5px] font-medium text-ink">
            <Info className="h-3 w-3" /> Exemple éditorial
          </span>
        ) : null}
      </div>
      <h1 className="mt-4 text-[26px] font-semibold leading-tight tracking-[-0.02em] sm:text-[34px]">{item.title}</h1>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-b border-line pb-5">
        <p className="text-[13.5px] text-ink-3">
          <a href={item.source.url} target="_blank" rel="noopener noreferrer" className="font-medium text-ink-2 hover:underline">
            {item.source.name}
          </a>{" "}
          · {formatDateTime(item.publishedAt)}
          {item.lang === "en" ? " · article en anglais" : ""}
        </p>
        <SaveButton item={newsLibraryItem(item)} label />
      </div>

      {item.image ? <NewsVisual item={item} className="mt-6 h-56 rounded-2xl sm:h-72" /> : null}

      <div className="mt-6">
        <h2 className="text-[12px] font-medium uppercase tracking-wide text-ink-3">Résumé</h2>
        <p className="mt-2 text-[17px] leading-relaxed text-ink">
          {item.summary || "La source ne fournit pas d'extrait pour cet article. Consultez l'article original ou demandez une explication à l'IA."}
        </p>
      </div>

      {item.keyPoints?.length ? (
        <ul className="mt-6 space-y-2">
          {item.keyPoints.map((p) => (
            <li key={p} className="flex gap-2.5 text-[14.5px] leading-relaxed text-ink-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
              {p}
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-8">
        {item.whyItMatters ? (
          <section className="rounded-2xl border border-line bg-surface p-5 shadow-card sm:p-6">
            <h2 className="text-[15px] font-semibold">Pourquoi c&apos;est important</h2>
            <p className="mt-2 text-[14.5px] leading-relaxed text-ink-2">{item.whyItMatters}</p>
          </section>
        ) : (
          <AiExplain item={item} genericWhy={context.whyItMatters} />
        )}
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <ButtonLink href={item.url} external variant="outline">
          Lire l&apos;article original <ExternalLink className="h-4 w-4" />
        </ButtonLink>
        <ButtonLink href={`/assistant?q=${encodeURIComponent(question)}`}>
          <Sparkles className="h-4 w-4" /> Poser une question à l&apos;assistant
        </ButtonLink>
      </div>

      {related.length > 0 ? (
        <section className="mt-12">
          <h2 className="text-lg font-semibold tracking-tight">Les notions pour comprendre</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {related.map((concept) => (
              <Link key={concept.slug} href={`/savoir/${concept.slug}`} className="group rounded-2xl border border-line bg-surface p-4 shadow-card transition-shadow hover:shadow-pop">
                <span className="flex items-center gap-2 text-[14.5px] font-semibold">
                  <DomainDot domain={concept.domain} /> {concept.title}
                </span>
                <span className="mt-1.5 line-clamp-3 block text-[13px] leading-relaxed text-ink-2">{concept.tagline}</span>
                <span className="mt-3 inline-flex items-center gap-1 text-[12.5px] font-medium text-accent-text group-hover:underline">
                  Ouvrir la fiche <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {more.length > 0 ? (
        <section className="mt-12">
          <h2 className="text-lg font-semibold tracking-tight">Sur le même thème</h2>
          <div className="mt-2 divide-y divide-line">
            {more.map((other) => (
              <NewsCard key={other.id} item={other} variant="row" />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}
