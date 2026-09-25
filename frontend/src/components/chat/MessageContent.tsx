import { Fragment } from "react";
import { cn } from "@/lib/utils";

/**
 * A small, purpose-built markdown renderer for AI replies — not a full
 * CommonMark engine, just the subset the model actually emits: `---` rules,
 * `####` sub-headings, `*italic*` and `code` spans. Anything else
 * falls through as plain text.
 */

// Ordered: `**bold**` must be tried before `*italic*`, or the italic branch
// eats the first asterisk of a bold run. Underscore variants are absent on
// purpose — `_` shows up inside URLs and identifiers far more often than it
// means emphasis, and matching it there does more damage than it fixes.
const INLINE_RE = /(\*\*[^*]+\*\*|\*[^*\n]+\*|`[^`\n]+`|https?:\/\/[^\s)]+)/g;

function inline(text: string, keyPrefix: string): React.ReactNode[] {
  const parts = text.split(INLINE_RE);
  return parts.map((part, i) => {
    const k = `${keyPrefix}-${i}`;
    if (!part) return <Fragment key={k} />;

    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={k} className="font-semibold text-ink">
          {inline(part.slice(2, -2), k)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      return (
        <code
          key={k}
          // font-mono, not .mono: this is the one place in the product that wants real
          // character cells. .mono is a data-mark style set in Inter.
          className="font-mono text-[0.9em] px-1.5 py-0.5 rounded-sm bg-[var(--muted)] text-ink"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    if (/^https?:\/\//.test(part)) {
      return (
        <a
          key={k}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          // A bare URL from the model can be far wider than a phone screen.
          // Without an explicit break it forces the whole message column to
          // scroll sideways, which drags the entire chat layout with it.
          className="text-accent underline decoration-[var(--gold-hairline)] underline-offset-[3px] hover:decoration-gold-400 transition-colors break-all"
        >
          {part}
        </a>
      );
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return (
        <em key={k} className="italic">
          {inline(part.slice(1, -1), k)}
        </em>
      );
    }
    return <Fragment key={k}>{part}</Fragment>;
  });
}

export function MessageContent({ text }: { text: string }) {
  const lines = text.split("\n");
  const blocks: React.ReactNode[] = [];
  let bulletBuffer: string[] = [];
  let numberBuffer: { num: string; text: string }[] = [];

  function flushBullets(key: string) {
    if (!bulletBuffer.length) return;
    blocks.push(
      <ul key={key} className="my-3 space-y-2 list-none">
        {bulletBuffer.map((item, i) => (
          <li key={i} className="flex gap-3">
            {/* An en-rule in the margin rather than a bullet glyph — the same
                hairline vocabulary the rest of the page is set in. */}
            <span aria-hidden className="shrink-0 select-none text-accent leading-[1.7]">—</span>
            <span>{inline(item, `${key}-li-${i}`)}</span>
          </li>
        ))}
      </ul>
    );
    bulletBuffer = [];
  }

  function flushNumbers(key: string) {
    if (!numberBuffer.length) return;
    blocks.push(
      // The marker is a tabular numeral in the margin, not a filled chip: an
      // itinerary's day numbers line up in a column the way a printed list does, and a
      // run of coloured circles down a long reply would be the loudest thing in it.
      <ol key={key} className="my-3 space-y-3 list-none">
        {numberBuffer.map((item, i) => (
          <li key={i} className="flex gap-3.5">
            <span className="index-num shrink-0 w-5 text-right text-accent leading-[1.9]">
              {item.num}
            </span>
            <span>{inline(item.text, `${key}-li-${i}`)}</span>
          </li>
        ))}
      </ol>
    );
    numberBuffer = [];
  }

  function flushAll(key: string) {
    flushBullets(`${key}-list`);
    flushNumbers(`${key}-nums`);
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trimEnd();
    const key = `b${i}`;

    const bullet = /^[•\-*]\s+(.*)/.exec(line);
    const numbered = /^(\d+)[.)]\s+(.*)/.exec(line);
    // 2–6 hashes, so `#### ` and deeper headings are matched here rather than
    // falling through to the paragraph branch.
    const heading = /^(#{1,6})\s+(.*)/.exec(line);
    const rule = /^\s*(?:-{3,}|\*{3,}|_{3,})\s*$/.test(line);

    if (rule) {
      flushAll(key);
      // The product's section break everywhere else is a hairline, so a
      // model's `---` becomes one rather than three literal dashes.
      blocks.push(<hr key={key} className="my-6 border-0 h-px bg-[var(--border)]" />);
      continue;
    }

    if (bullet) {
      flushNumbers(`${key}-nums`);
      bulletBuffer.push(bullet[1]);
      continue;
    }
    if (numbered) {
      flushBullets(`${key}-list`);
      numberBuffer.push({ num: numbered[1], text: numbered[2] });
      continue;
    }

    flushAll(key);

    if (heading) {
      const level = heading[1].length;
      const content = heading[2];
      blocks.push(
        // A heading inside a reply is set the way a heading is set anywhere
        // else in the product: Fraunces for the section, tracked caps for the
        // sub-head beneath it. Anything deeper than h3 keeps the sub-head
        // treatment rather than inventing a fourth size.
        <p
          key={key}
          className={cn(
            level <= 2
              ? "font-display text-[19px] leading-tight text-ink mt-6 mb-2 first:mt-0"
              // Deliberately NOT the .kicker class. Its 11px suits a field label but is too
              // small for a heading inside a long reply ("Day 1 – Old Town" has to be
              // scannable on a phone). It also can't simply be overridden: .kicker is declared
              // after @tailwind utilities, so it beats a text-[12.5px] utility on the same
              // element. Spelling the treatment out here keeps it local and predictable.
              : "text-[12.5px] font-medium uppercase tracking-[0.09em] text-accent mt-5 mb-2",
          )}
        >
          {inline(content, key)}
        </p>
      );
    } else if (line === "") {
      blocks.push(<div key={key} className="h-2" />);
    } else {
      blocks.push(
        <p key={key} className="leading-relaxed">
          {inline(line, key)}
        </p>
      );
    }
  }

  flushBullets("tail-list");
  flushNumbers("tail-nums");

  return <>{blocks}</>;
}
