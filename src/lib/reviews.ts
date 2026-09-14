// ---------------------------------------------------------------
// Google review data for the homepage "What Our Customers Say" section.
//
// Google no longer offers a free API for pulling live reviews onto
// third-party sites, so these cards are static. They are real reviews
// copied from the Quick Taxi Google Business Profile.
// To keep them accurate, refresh them occasionally and update
// `reviewAverage` (and add/remove entries) to match your profile.
// ---------------------------------------------------------------

export const GOOGLE_PLACE_ID = "ChIJ0cExuV49ukURzVDv0J9hJHo";

/** Direct "write a review" link for the Google Business Profile. */
export const googleWriteReviewUrl = `https://search.google.com/local/writereview?placeid=${GOOGLE_PLACE_ID}`;

/** Search link to the live Google listing (used by the rating summary). */
export const googleReviewListingUrl =
  "https://www.google.com/search?q=quicktaxi.ie+reviews";

/** Overall rating shown next to the section heading. */
export const reviewAverage = 5;

export type GoogleReview = {
  author: string;
  /** Relative date as shown on Google, e.g. "2 months ago". */
  date: string;
  /** 1–5 stars; Google reviews are almost always 5. */
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
};

// Real reviews from the Quick Taxi Google Business Profile, newest first.
export const googleReviews: GoogleReview[] = [
  {
    author: "Majella O Donnell",
    date: "a day ago",
    rating: 5,
    text: "Mohamed was very efficient and friendly. Would definitely recommend him. He has a van which was very handy as we had a lot of luggage.",
  },
  {
    author: "Matthew Hanrahan",
    date: "3 days ago",
    rating: 5,
    text: "Excellent service. On time and easy to book.",
  },
  {
    author: "Andrew Ellison",
    date: "3 days ago",
    rating: 5,
    text: "Friendly and reliable; very accommodating for an early morning pickup.",
  },
  {
    author: "Heather Hostetter",
    date: "a week ago",
    rating: 5,
    text: "Great cab ride - fast, helpful and friendly!",
  },
  {
    author: "Rachel McLean",
    date: "a week ago",
    rating: 5,
    text: "Great driver",
  },
  {
    author: "Charlotte Garotta",
    date: "a week ago",
    rating: 5,
    text: "Perfect",
  },
  {
    author: "Janie Keoghan",
    date: "2 weeks ago",
    rating: 5,
    text: "Very reliable, the driver was punctual and the car was clean. They knew the best route and got me to my destination quickly and safely. Friendly service too! Would highly recommend.",
  },
  {
    author: "Susan Lane",
    date: "2 weeks ago",
    rating: 5,
    text: "A superb service provided. Safe & reliable",
  },
  {
    author: "Louise O'Connor",
    date: "2 weeks ago",
    rating: 5,
    text: "Very helpful with our luggage",
  },
  {
    author: "John Smith",
    date: "2 weeks ago",
    rating: 5,
    text: "Mr Furkan was an excellent driver and also pointed out landmarks for us to see along the way",
  },
  {
    author: "Hailey Clare",
    date: "2 weeks ago",
    rating: 5,
    text: "Very reliable good service. Arrived on time & made sure we arrived safely at our destination, highly recommended",
  },
  {
    author: "Lorraine Doyle",
    date: "2 weeks ago",
    rating: 5,
    text: "Reliable professional driver, very clean taxi, very affordable. Would highly recommend!",
  },
  {
    author: "Barbara Doyle",
    date: "2 weeks ago",
    rating: 5,
    text: "Affordable, reliable and friendly. I highly recommend.",
  },
  {
    author: "Shannon Mcdonagh",
    date: "2 weeks ago",
    rating: 5,
    text: "Very reliable & trustworthy person, great prices!",
  },
  {
    author: "Nicola Campbell",
    date: "2 weeks ago",
    rating: 5,
    text: "Very professional and reliable driver. He arrived on time, was courteous and friendly, and provided a safe and comfortable journey. Excellent service - highly recommended!",
  },
  {
    author: "A P",
    date: "2 weeks ago",
    rating: 5,
    text: "Reliable, affordable and very quick response to bookings. I've since switched from other taxi apps and have exclusively used this for my recent commutes to the airport.",
  },
  {
    author: "Mandy Shepherd",
    date: "3 weeks ago",
    rating: 5,
    text: "MD was very helpful and on time for my very early pick up to the airport. I had two journeys with him and he was very pleasant and easy to chat to. I would thoroughly recommend using him.",
  },
  {
    author: "sultana chaudriy",
    date: "3 weeks ago",
    rating: 5,
    text: "Excellent taxi service! Furkan was extremely friendly, professional and polite. Communication was excellent, making the whole journey smooth and stress-free for me and my family. The price was very competitive and the service was reliable.",
  },
];