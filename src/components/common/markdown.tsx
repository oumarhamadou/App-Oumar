import Link from "next/link";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/cn";

const components: Components = {
  a({ href = "", children }) {
    if (href.startsWith("/")) return <Link href={href}>{children}</Link>;
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  },
};

/** Renders trusted or model-generated Markdown; raw HTML is never interpreted. */
export function Markdown({ children, className }: { children: string; className?: string }) {
  return (
    <div className={cn("prose-app", className)}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components} skipHtml>
        {children}
      </ReactMarkdown>
    </div>
  );
}
