import React from "react";
import { useParams } from "react-router-dom";
import GenericBusinessLanding from "../components/landing/GenericBusinessLanding";

// Formats "new-york" -> "New York"
function formatLocation(str) {
  if (!str) return "";
  return str
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function LocationLanding() {
  const { businessSlug, state, city } = useParams();

  const cityName = formatLocation(city);
  const stateName = formatLocation(state);
  const location = cityName && stateName ? `${cityName}, ${stateName}` : stateName || cityName || null;

  return (
    <GenericBusinessLanding
      slug={businessSlug}
      location={location}
      city={cityName}
      state={stateName}
    />
  );
}