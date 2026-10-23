import type { FaqItem } from "@/lib/content";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface FaqListProps {
  items: FaqItem[];
  className?: string;
}

/** Native <details> accordion — accessible and functional without JavaScript. */
export function FaqList({ items, className }: FaqListProps) {
  return (
    <div className={cn("border-t border-border", className)}>
      {items.map((item) => (
        <details key={item.question} className="group border-b border-border">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 font-serif text-xl text-foreground [&::-webkit-details-marker]:hidden">
            {item.question}
            <span className="shrink-0 font-sans text-lg leading-none text-muted-foreground transition-transform duration-300 group-open:rotate-45">
              <Plus className="size-4" strokeWidth={1.5} />
            </span>
          </summary>
          <p className="max-w-2xl pb-7 text-[0.9rem] leading-relaxed text-muted-foreground">
            {item.answer}
          </p>
        </details>
      ))}
    </div>
  );
}
