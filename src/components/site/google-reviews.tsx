import {
  googleReviewListingUrl,
  googleReviews,
  googleWriteReviewUrl,
  reviewAverage,
} from "@/lib/reviews";
import { ReviewCard, Stars } from "@/components/site/review-card";
import { ShowMoreReviews } from "@/components/site/show-more-reviews";

const INITIAL_VISIBLE = 6;

export function GoogleReviewsSection() {
  const visibleReviews = googleReviews.slice(0, INITIAL_VISIBLE);
  const remainingReviews = googleReviews.slice(INITIAL_VISIBLE);
  return (
    <section className="bg-white py-12">
      <div className="mx-auto w-full max-w-7xl px-4 lg:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black">What Our Customers Say</h2>
            <p className="mt-2 text-sm text-[#2e3d5f]">
              Real reviews from real journeys — rated {reviewAverage} on Google.
            </p>
          </div>

          <a
            href={googleReviewListingUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 border border-[#c9d4f4] bg-[#f4f6fb] px-4 py-3 transition hover:border-[#f2c230]"
          >
            <span className="text-3xl font-black leading-none text-[#0f1d3a]">
              {reviewAverage.toFixed(1)}
            </span>
            <span>
              <Stars count={Math.round(reviewAverage)} />
              <span className="mt-1 block text-xs font-semibold text-[#6b7a99]">
                Google Reviews
              </span>
            </span>
          </a>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {visibleReviews.map((review) => (
            <ReviewCard key={review.author} review={review} />
          ))}
        </div>

        <ShowMoreReviews reviews={remainingReviews} />

        <div className="mt-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <p className="text-sm text-[#2e3d5f]">
            Enjoyed your journey? Your feedback helps other travellers choose
            Quick Taxi.
          </p>
          <a
            href={googleWriteReviewUrl}
            target="_blank"
            rel="noreferrer"
            className="bg-[#f2c230] px-5 py-3 text-sm font-black text-[#0f1d3a] transition hover:bg-[#ffd95d]"
          >
            Leave us a review on Google ⭐
          </a>
        </div>
      </div>
    </section>
  );
}