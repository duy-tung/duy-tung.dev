/**
 * Single source of truth for every company fact shown on the site.
 *
 * RULE: only put verified, real information here. Anything left `undefined`
 * (or as an empty array) renders as a clearly marked TODO placeholder on the
 * page and is omitted from structured data. Never fill a gap with invented
 * copy, testimonials, logos, user counts, revenue, team members or press.
 *
 * Run `pnpm check:site` after a build to list every TODO still rendered.
 */

export type ProductStatus = "beta" | "live" | "waitlist";

export interface Step {
  title: string;
  description: string;
}

export interface Feature {
  title: string;
  description: string;
}

export interface Company {
  /** Brand name used across the UI. */
  name: string;
  /** Registered legal name. Only set once the entity actually exists. */
  legalName?: string;
  /** ACRA Unique Entity Number. */
  uen?: string;
  /** ISO 8601 date (YYYY-MM or YYYY-MM-DD) of incorporation. */
  foundingDate?: string;
  industry: string;
  funding?: string;
  url: string;
  email?: string;
  location: {
    city: string;
    country: string;
    /** ISO 3166-1 alpha-2 code, used in JSON-LD. */
    countryCode: string;
    /** Full street address, only if it should be public. */
    streetAddress?: string;
    postalCode?: string;
  };
  /** One-line pitch shown in the hero and used as the default meta description. */
  pitch?: string;
  /** The problem the company solves. */
  problem?: string;
  /** Who has that problem. */
  audience?: string;
  /** Longer company story for /about. */
  story?: string;
  product: {
    name?: string;
    status?: ProductStatus;
    /** Where "Try it" / "Join the waitlist" points. */
    url?: string;
    summary?: string;
    /** Longer description for /product. */
    details?: string;
    steps: Step[];
    features: Feature[];
    /** Paths under /public, e.g. "/screenshots/dashboard.png". */
    screenshots: { src: string; alt: string }[];
  };
  claude: {
    /** Which Claude model(s) the product uses, e.g. as listed in Anthropic's docs. */
    models: string[];
    /** Claude API features used (tool use, prompt caching, …). */
    apiFeatures: string[];
    /** What Claude powers inside the product. */
    powers?: string;
  };
  founder: {
    name: string;
    role: string;
    bio: string;
    links: { label: string; url: string }[];
  };
  /** Official company profiles (company LinkedIn page, GitHub org, …). */
  sameAs: string[];
}

export const company: Company = {
  name: "Rungwise",
  // TODO: set to "Rungwise Pte. Ltd." only after ACRA incorporation is complete.
  // Using "Pte. Ltd." before the company is registered is misleading.
  legalName: undefined,
  // TODO: ACRA UEN, once issued.
  uen: undefined,
  // TODO: actual ACRA registration month, e.g. "2026-10". Do not guess.
  foundingDate: undefined,
  industry: "Fintech",
  funding: "Bootstrapped",
  url: "https://duy-tung.dev",
  // TODO: company contact email (e.g. hello@duy-tung.dev). Must be a real, monitored inbox.
  email: undefined,
  location: {
    city: "Singapore",
    country: "Singapore",
    countryCode: "SG",
    // TODO: registered office address, if it should be public.
    streetAddress: undefined,
    postalCode: undefined,
  },
  // TODO: one-line pitch.
  pitch: undefined,
  // TODO: the problem we solve.
  problem: undefined,
  // TODO: who we solve it for.
  audience: undefined,
  // TODO: company story (why Rungwise exists, how it started).
  story: undefined,
  product: {
    // TODO: product name.
    name: undefined,
    // TODO: "beta" | "live" | "waitlist".
    status: undefined,
    // TODO: product / waitlist link.
    url: undefined,
    // TODO: one-paragraph product summary.
    summary: undefined,
    // TODO: longer product description for /product.
    details: undefined,
    // TODO: 3–4 real steps describing how the product works.
    steps: [],
    // TODO: real key features only — no roadmap items presented as shipped.
    features: [],
    // TODO: add real screenshots under public/screenshots/ and list them here.
    screenshots: [],
  },
  claude: {
    // TODO: Claude model(s) actually used in production.
    models: [],
    // TODO: Claude API features actually used (e.g. tool use, prompt caching).
    apiFeatures: [],
    // TODO: what Claude powers in the product.
    powers: undefined,
  },
  founder: {
    name: "Duy Tung",
    role: "Founder & CEO",
    // Adapted from the bio previously on the personal homepage.
    // TODO: expand with relevant background, if desired.
    bio: "Software engineer working mostly with Go and backend systems. Writes about the things learned and problems solved along the way on the blog.",
    links: [
      { label: "LinkedIn", url: "https://www.linkedin.com/in/duy-tung" },
      { label: "GitHub", url: "https://github.com/duy-tung" },
    ],
  },
  // TODO: company LinkedIn page / GitHub org once they exist. The links above
  // are the founder's personal profiles, so they live under `founder`.
  sameAs: [],
};

/** Name to show where the legal entity matters (copyright, JSON-LD). */
export const displayLegalName = company.legalName ?? company.name;

/** Factual fallback description used until a pitch is written. */
export const defaultDescription =
  company.pitch ??
  `${company.name} is a ${company.industry.toLowerCase()} startup based in ${company.location.city}.`;

export const nav = [
  { label: "Product", href: "/product/" },
  { label: "About", href: "/about/" },
  { label: "Blog", href: "/blog/" },
  { label: "Contact", href: "/contact/" },
];

const linkedin = company.founder.links.find((l) => l.label === "LinkedIn")?.url;
const github = company.founder.links.find((l) => l.label === "GitHub")?.url;

export const social = { linkedin, github };

/** "Singapore" rather than "Singapore, Singapore" for city-states. */
export const locationLabel =
  company.location.city === company.location.country
    ? company.location.country
    : `${company.location.city}, ${company.location.country}`;
