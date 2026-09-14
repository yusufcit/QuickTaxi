import { NextRequest, NextResponse } from "next/server";

const GOOGLE_PLACE_ID = process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID || "";
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY || "";

export async function GET(request: NextRequest) {
  if (!GOOGLE_PLACE_ID || !GOOGLE_MAPS_API_KEY) {
    return NextResponse.json(
      { error: "Google API credentials not configured" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${GOOGLE_PLACE_ID}&key=${GOOGLE_MAPS_API_KEY}&fields=reviews,rating`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch from Google Places API");
    }

    const data = await response.json();

    if (data.status !== "OK") {
      throw new Error(`Google API error: ${data.status}`);
    }

    return NextResponse.json({
      reviews: data.result.reviews || [],
      rating: data.result.rating || 0,
    });
  } catch (error) {
    console.error("Google Reviews API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}
