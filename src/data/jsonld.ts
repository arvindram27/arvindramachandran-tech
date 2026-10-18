// Structured data (schema.org JSON-LD) for the site.
//
// Ground rules it obeys (SEO-AEO brief §0):
//   - never fabricate: every value traces to src/data/site.ts, which is the visible page copy
//   - no phone number, no private contact data
//   - one stable @id per entity, referenced everywhere, so facts cannot diverge
//   - structured data must describe something a visitor can actually see on the page
//
// The homepage gets Person + WebSite + SoftwareSourceCode. MED lives on a fragment of this
// single page (there is no dedicated /projects/med/ route by the owner's decision), so its
// SoftwareSourceCode is emitted here; the MED copy it references is rendered on this page.

import { site } from "./site";

export const SITE_URL = "https://arvindramachandran.tech/";
export const PERSON_ID = `${SITE_URL}#person`;
export const WEBSITE_ID = `${SITE_URL}#website`;
export const MED_ID = `${SITE_URL}#med`;

// Every entry is visible on the page: the role/H1, the MED case study, the projects,
// the skills list, and the About copy.
const KNOWS_ABOUT = [
  "Data engineering",
  "Databricks",
  "Apache Airflow",
  "Apache Kafka",
  "LangGraph",
  "Multi-agent systems",
  "Walk-forward backtesting",
];

const person = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": PERSON_ID,
  name: site.name,
  url: SITE_URL,
  jobTitle: "Data Engineer",
  // Mirrors the hero lede and the MED summary, both rendered above.
  description:
    "Data engineer in Chennai building MED, a multi-agent financial intelligence system that measures Price Adjustment Latency.",
  knowsAbout: KNOWS_ABOUT,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Chennai",
    addressRegion: "Tamil Nadu",
    addressCountry: "IN",
  },
  // Rendered in the Journey timeline ("B.Tech, Mechanical Engineering from Saveetha Engineering College").
  alumniOf: {
    "@type": "EducationalOrganization",
    name: "Saveetha Engineering College",
  },
  sameAs: [site.links.github, site.links.linkedin],
  // TODO(owner): add "image" once a headshot exists. No image tag is emitted until then,
  // because pointing it at a file that does not exist would be a fabricated URL.
};

const website = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  name: site.name,
  url: SITE_URL,
  inLanguage: "en",
  publisher: { "@id": PERSON_ID },
};

const med = {
  "@context": "https://schema.org",
  "@type": "SoftwareSourceCode",
  "@id": MED_ID,
  name: "MED: Market Efficiency Detector",
  // First MED paragraph, verbatim from the rendered copy.
  description: site.med.description[0],
  codeRepository: site.med.repoUrl,
  programmingLanguage: "Python",
  author: { "@id": PERSON_ID },
};

/** JSON-LD for the homepage, in render order. */
export const homeJsonLd = [person, website, med];
