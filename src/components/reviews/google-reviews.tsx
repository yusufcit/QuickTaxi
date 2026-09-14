"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface GoogleReview {
  author_name: string;
  rating: number;
  text: string;
  time: number;
  profile_photo_url?: string;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`h-4 w-4 ${
            i < rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-300 text-gray-300"
          }`}
          viewBox="0 0 20 20"
        >
          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
        </svg>
      ))}
    </div>
  );
}

export function GoogleReviews() {
  const [reviews, setReviews] = useState<GoogleReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch("/api/reviews/google");
        if (!response.ok) throw new Error("Failed to fetch reviews");
        const data = await response.json();
        setReviews(data.reviews || []);
        setAverageRating(data.rating || 0);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error loading reviews");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4 border border-[#c9d4f4] bg-white p-6">
        <div className="h-24 animate-pulse bg-gray-200 rounded" />
      </div>
    );
  }

  if (error || reviews.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      <div className="border border-[#c9d4f4] bg-white p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-[#0f1d3a]">Customer Reviews</h2>
            <p className="mt-2 text-sm text-[#2e3d5f]">What our customers say about Quick Taxi</p>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-2">
              <StarRating rating={Math.round(averageRating)} />
              <span className="text-lg font-bold text-[#0f1d3a]">{averageRating.toFixed(1)}</span>
            </div>
            <p className="text-xs text-[#2e3d5f]">Based on Google reviews</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reviews.slice(0, 6).map((review, idx) => (
            <div key={idx} className="border border-[#edf1fd] rounded-lg p-4 bg-[#f9fafb]">
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {review.profile_photo_url && (
                    <Image
                      src={review.profile_photo_url}
                      alt={review.author_name}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full"
                    />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-bold text-[#0f1d3a]">{review.author_name}</p>
                    <StarRating rating={review.rating} />
                  </div>
                </div>
              </div>

              <p className="line-clamp-3 text-sm text-[#2e3d5f]">{review.text}</p>

              <p className="mt-3 text-xs text-[#8899bb]">
                {new Date(review.time * 1000).toLocaleDateString("en-IE", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <a
            href="https://www.google.com/maps/search/quick+taxi+dublin"
            target="_blank"
            rel="noreferrer"
            className="inline-block bg-[#f2c230] px-6 py-2 text-sm font-black text-[#0f1d3a] hover:bg-yellow-500 transition"
          >
            View All Reviews on Google
          </a>
        </div>
      </div>
    </section>
  );
}
