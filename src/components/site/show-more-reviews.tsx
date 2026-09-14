"use client";

import { useState } from "react";
import type { GoogleReview } from "@/lib/reviews";
import { ReviewCard } from "@/components/site/review-card";

export function ShowMoreReviews({ reviews }: { reviews: GoogleReview[] }) {
  const [expanded, setExpanded] = useState(false);

  if (reviews.length === 0) return null;

  return (
    <>
      <div
        id="more-reviews"
        aria-hidden={!expanded}
        className={
          expanded
            ? "mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3"
            : "hidden"
        }
      >
        {reviews.map((review) => (
          <ReviewCard key={review.author} review={review} />
        ))}
      </div>

      <div className="mt-8 text-center">
        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          aria-expanded={expanded}
          aria-controls="more-reviews"
          className="border border-[#0f1d3a] bg-transparent px-5 py-3 text-sm font-black text-[#0f1d3a] transition hover:bg-[#0f1d3a] hover:text-white"
        >
          {expanded ? "Show fewer reviews" : "Show more reviews"}
        </button>
      </div>
    </>
  );
}