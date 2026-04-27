/**
 * locationPages.js
 * Central source of truth for all location-based landing page combinations.
 * Used by the frontend (sitemap page, internal links) and mirrored in sitemapXml backend function.
 *
 * URL pattern: /:businessSlug/:stateSlug/:citySlug
 * Example: /hair-salon/tennessee/nashville
 */

// Top 50 US cities by population / commercial relevance
export const TOP_CITIES = [
  { city: "New York",      state: "New York",       citySlug: "new-york",        stateSlug: "new-york" },
  { city: "Los Angeles",   state: "California",     citySlug: "los-angeles",     stateSlug: "california" },
  { city: "Chicago",       state: "Illinois",       citySlug: "chicago",         stateSlug: "illinois" },
  { city: "Houston",       state: "Texas",          citySlug: "houston",         stateSlug: "texas" },
  { city: "Phoenix",       state: "Arizona",        citySlug: "phoenix",         stateSlug: "arizona" },
  { city: "Philadelphia",  state: "Pennsylvania",   citySlug: "philadelphia",    stateSlug: "pennsylvania" },
  { city: "San Antonio",   state: "Texas",          citySlug: "san-antonio",     stateSlug: "texas" },
  { city: "San Diego",     state: "California",     citySlug: "san-diego",       stateSlug: "california" },
  { city: "Dallas",        state: "Texas",          citySlug: "dallas",          stateSlug: "texas" },
  { city: "Jacksonville",  state: "Florida",        citySlug: "jacksonville",    stateSlug: "florida" },
  { city: "Austin",        state: "Texas",          citySlug: "austin",          stateSlug: "texas" },
  { city: "Fort Worth",    state: "Texas",          citySlug: "fort-worth",      stateSlug: "texas" },
  { city: "Columbus",      state: "Ohio",           citySlug: "columbus",        stateSlug: "ohio" },
  { city: "Charlotte",     state: "North Carolina", citySlug: "charlotte",       stateSlug: "north-carolina" },
  { city: "Indianapolis",  state: "Indiana",        citySlug: "indianapolis",    stateSlug: "indiana" },
  { city: "San Francisco", state: "California",     citySlug: "san-francisco",   stateSlug: "california" },
  { city: "Seattle",       state: "Washington",     citySlug: "seattle",         stateSlug: "washington" },
  { city: "Denver",        state: "Colorado",       citySlug: "denver",          stateSlug: "colorado" },
  { city: "Nashville",     state: "Tennessee",      citySlug: "nashville",       stateSlug: "tennessee" },
  { city: "Oklahoma City", state: "Oklahoma",       citySlug: "oklahoma-city",   stateSlug: "oklahoma" },
  { city: "El Paso",       state: "Texas",          citySlug: "el-paso",         stateSlug: "texas" },
  { city: "Washington",    state: "DC",             citySlug: "washington",      stateSlug: "dc" },
  { city: "Las Vegas",     state: "Nevada",         citySlug: "las-vegas",       stateSlug: "nevada" },
  { city: "Louisville",    state: "Kentucky",       citySlug: "louisville",      stateSlug: "kentucky" },
  { city: "Memphis",       state: "Tennessee",      citySlug: "memphis",         stateSlug: "tennessee" },
  { city: "Portland",      state: "Oregon",         citySlug: "portland",        stateSlug: "oregon" },
  { city: "Baltimore",     state: "Maryland",       citySlug: "baltimore",       stateSlug: "maryland" },
  { city: "Milwaukee",     state: "Wisconsin",      citySlug: "milwaukee",       stateSlug: "wisconsin" },
  { city: "Albuquerque",   state: "New Mexico",     citySlug: "albuquerque",     stateSlug: "new-mexico" },
  { city: "Tucson",        state: "Arizona",        citySlug: "tucson",          stateSlug: "arizona" },
  { city: "Fresno",        state: "California",     citySlug: "fresno",          stateSlug: "california" },
  { city: "Sacramento",    state: "California",     citySlug: "sacramento",      stateSlug: "california" },
  { city: "Atlanta",       state: "Georgia",        citySlug: "atlanta",         stateSlug: "georgia" },
  { city: "Kansas City",   state: "Missouri",       citySlug: "kansas-city",     stateSlug: "missouri" },
  { city: "Mesa",          state: "Arizona",        citySlug: "mesa",            stateSlug: "arizona" },
  { city: "Omaha",         state: "Nebraska",       citySlug: "omaha",           stateSlug: "nebraska" },
  { city: "Raleigh",       state: "North Carolina", citySlug: "raleigh",         stateSlug: "north-carolina" },
  { city: "Cleveland",     state: "Ohio",           citySlug: "cleveland",       stateSlug: "ohio" },
  { city: "Virginia Beach",state: "Virginia",       citySlug: "virginia-beach",  stateSlug: "virginia" },
  { city: "Long Beach",    state: "California",     citySlug: "long-beach",      stateSlug: "california" },
  { city: "Colorado Springs", state: "Colorado",   citySlug: "colorado-springs",stateSlug: "colorado" },
  { city: "Miami",         state: "Florida",        citySlug: "miami",           stateSlug: "florida" },
  { city: "Tampa",         state: "Florida",        citySlug: "tampa",           stateSlug: "florida" },
  { city: "Orlando",       state: "Florida",        citySlug: "orlando",         stateSlug: "florida" },
  { city: "Minneapolis",   state: "Minnesota",      citySlug: "minneapolis",     stateSlug: "minnesota" },
  { city: "Pittsburgh",    state: "Pennsylvania",   citySlug: "pittsburgh",      stateSlug: "pennsylvania" },
  { city: "St. Louis",     state: "Missouri",       citySlug: "st-louis",        stateSlug: "missouri" },
  { city: "Knoxville",     state: "Tennessee",      citySlug: "knoxville",       stateSlug: "tennessee" },
  { city: "Chattanooga",   state: "Tennessee",      citySlug: "chattanooga",     stateSlug: "tennessee" },
  { city: "Birmingham",    state: "Alabama",        citySlug: "birmingham",      stateSlug: "alabama" },
];

// All business type slugs that have a GenericBusinessLanding config
export const BUSINESS_SLUGS = [
  // Retail
  "clothing-boutique", "shoe-store", "jewelry-store", "specialty-food-store",
  "furniture-store", "electronics-store", "sporting-goods-store", "pet-store",
  "florist", "thrift-store", "pop-up-retail",
  // Personal Services
  "hair-salon", "barber-shop", "nail-salon", "spa", "massage-therapy",
  "tanning-salon", "tattoo-shop", "beauty-clinic", "med-spa", "personal-trainer",
  "yoga-studio", "fitness-gym", "dance-studio", "coaching-business",
  // Healthcare
  "dental-office", "chiropractor", "physical-therapy", "urgent-care",
  "private-medical", "mental-health-clinic", "veterinary-clinic",
  "home-healthcare", "medical-lab",
  // Home Services
  "hvac-company", "plumbing-services", "electrical-contractor", "roofing-company",
  "landscaping", "pest-control", "residential-cleaning", "commercial-cleaning",
  "restoration-company", "handyman-services", "pool-maintenance",
  "security-installer", "moving-company", "appliance-repair", "dry-cleaners",
  // Professional Services
  "law-firm", "accounting-firm", "bookkeeping-services", "marketing-agency",
  "consulting-firm", "it-services", "web-design-agency", "software-developer",
  "architecture-firm", "engineering-firm", "staffing-agency",
  "translation-services", "pr-firm",
];

/**
 * Returns all location landing page URL paths.
 * E.g. "/hair-salon/tennessee/nashville"
 */
export function getAllLocationPaths() {
  const paths = [];
  for (const slug of BUSINESS_SLUGS) {
    for (const loc of TOP_CITIES) {
      paths.push(`/${slug}/${loc.stateSlug}/${loc.citySlug}`);
    }
  }
  return paths;
}