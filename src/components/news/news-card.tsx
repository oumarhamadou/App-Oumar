import Link from "next/link";
import { RelativeTime } from "@/components/common/relative-time";
import { SaveButton } from "@/components/common/save-button";
import { TopicBadge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";
import type { NewsItem } from "@/lib/news/types";
import type { LibraryItem } from "@/lib/store";
import { NewsVisual } from "./news-visual";

export function newsLibraryItem(item: NewsItem): LibraryItem {
  return { key: `actualite:${item.id}`, kind: "actualite", title: item.title, href: `/actualites/${item.id}`, topics: item.topics, meta: item.source.name };
}

function Meta({ item }: { item: NewsItem }) {
  return (
    <div className="flex min-w-0 items-center gap-1.5 text-[12.5px] text-ink-3">
      <span className="truncate font-medium text-ink-2">{item.source.name}</span>
      <span aria-hidden>·</span>
      <RelativeTime iso={item.publishedAt} className="shrink-0" />
      {item.lang === "en" ? (
        <span className="ml-1 rounded border border-line px-1 text-[10.5px] font-semibold uppercase" title="Article en anglais">
          EN
        </span>
      ) : null}
    </div>
  );
}

export function NewsCard({
  item,
  variant = "card",
  className,
  showImage = true,
}: {
  item: NewsItem;
  variant?: "feature" | "card" | "row";
  className?: string;
  showImage?: boolean;
}) {
  const href = `/actualites/${item.id}`;

  if (variant === "row") {
    return (
      <article className={cn("group relative flex gap-4 py-4", className)}>
        {showImage ? <NewsVisual item={item} className="hidden h-20 w-28 shrink-0 rounded-xl sm:block" iconSize="h-5 w-5" /> : null}
        <div className="min-w-0 flex-1">
          <Meta item={item} />
          <h3 className="mt-1 text-[15px] font-semibold leading-snug tracking-tight text-ink">
            <Link href={href} className="after:absolute after:inset-0 group-hover:underline group-hover:decoration-line-strong group-hover:underline-offset-4">
              {item.title}
            </Link>
          </h3>
          {item.summary ? <p className="mt-1 line-clamp-2 text-[13.5px] leading-relaxed text-ink-2">{item.summary}</p> : null}
          <div className="relative z-10 mt-2 flex items-center justify-between gap-2">
            <div className="flex flex-wrap gap-1.5">
              {item.topics.slice(0, 2).map((t) => (
                <TopicBadge key={t} topic={t} />
              ))}
            </div>
            <SaveButton item={newsLibraryItem(item)} />
          </div>
        </div>
      </article>
    );
  }

  const feature = variant === "feature";
  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-card transition-shadow hover:shadow-pop",
        className,
      )}
    >
      <NewsVisual
        item={item}
        className={item.image ? (feature ? "h-48 sm:h-56" : "h-32") : feature ? "h-24" : "h-16"}
        iconSize={feature ? "h-8 w-8" : "h-5 w-5"}
      />
      <div className="flex flex-1 flex-col p-5">
        <Meta item={item} />
        <h3 className={cn("mt-2 font-semibold leading-snug tracking-tight text-ink", feature ? "text-[19px] sm:text-[21px]" : "text-[15.5px]")}>
          <Link href={href} className="after:absolute after:inset-0">
            {item.title}
          </Link>
        </h3>
        {item.summary ? (
          <p className={cn("mt-2 leading-relaxed text-ink-2", feature ? "line-clamp-3 text-[14.5px]" : "line-clamp-3 text-[13.5px]")}>{item.summary}</p>
        ) : null}
        {feature && item.whyItMatters ? (
          <div className="mt-4 rounded-xl bg-surface-2 px-3.5 py-3">
            <p className="text-[11.5px] font-medium uppercase tracking-wide text-ink-3">Pourquoi c&apos;est important</p>
            <p className="mt-1 line-clamp-3 text-[13px] leading-relaxed text-ink-2">{item.whyItMatters}</p>
          </div>
        ) : null}
        <div className="relative z-10 mt-auto flex items-center justify-between gap-2 pt-4">
          <div className="flex flex-wrap gap-1.5">
            {item.topics.slice(0, feature ? 3 : 1).map((t) => (
              <TopicBadge key={t} topic={t} />
            ))}
          </div>
          <SaveButton item={newsLibraryItem(item)} />
        </div>
      </div>
    </article>
  );
}
