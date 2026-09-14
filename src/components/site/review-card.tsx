import { Star } from "lucide-react";
import type { GoogleReview } from "@/lib/reviews";

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function Stars({ count, className }: { count: number; className?: string }) {
  return (
    <span
      className={`flex items-center gap-0.5 ${className ?? ""}`}
      role="img"
      aria-label={`Rated ${count} out of 5 stars`}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          fill={i < count ? "currentColor" : "none"}
          className={`h-4 w-4 ${i < count ? "text-[#f2c230]" : "text-[#c9d4f4]"}`}
        />
      ))}
    </span>
  );
}

export function ReviewCard({ review }: { review: GoogleReview }) {
  return (
    <article className="flex flex-col border border-[#c9d4f4] bg-white p-5">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#f2c230] text-sm font-black text-[#0f1d3a]">
          {getInitials(review.author)}
        </span>
        <div>
          <p className="text-sm font-bold">{review.author}</p>
          <p className="text-xs text-[#6b7a99]">{review.date}</p>
        </div>
      </div>

      <Stars count={review.rating} className="mt-3" />

      <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-[#2e3d5f]">
        &ldquo;{review.text}&rdquo;
      </blockquote>

      <p className="mt-4 border-t border-[#e6ebfa] pt-3 text-xs font-semibold text-[#6b7a99]">
        Posted on Google
      </p>
    </article>
  );
}