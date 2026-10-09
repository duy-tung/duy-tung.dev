import { company, displayLegalName } from "@/config/company";

type JsonLd = Record<string, unknown>;

/** Drop keys whose value is undefined or an empty array, so JSON-LD never carries placeholders. */
function compact<T extends JsonLd>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([, v]) => v !== undefined && !(Array.isArray(v) && v.length === 0),
    ),
  ) as T;
}

const orgId = `${company.url}/#organization`;

export function organizationJsonLd(): JsonLd {
  const { location } = company;
  return compact({
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": orgId,
    name: displayLegalName,
    alternateName: company.legalName ? company.name : undefined,
    url: `${company.url}/`,
    logo: `${company.url}/favicon-512.png`,
    email: company.email,
    foundingDate: company.foundingDate,
    identifier: company.uen
      ? { "@type": "PropertyValue", propertyID: "UEN", value: company.uen }
      : undefined,
    address: compact({
      "@type": "PostalAddress",
      streetAddress: location.streetAddress,
      postalCode: location.postalCode,
      addressLocality: location.city,
      addressCountry: location.countryCode,
    }),
    founder: compact({
      "@type": "Person",
      name: company.founder.name,
      jobTitle: company.founder.role,
      sameAs: company.founder.links.map((l) => l.url),
    }),
    sameAs: company.sameAs,
  });
}

export function blogPostingJsonLd(post: {
  title: string;
  description?: string;
  url: string;
  pubDate: Date;
  updatedDate?: Date;
  image?: string;
}): JsonLd {
  return compact({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    url: post.url,
    mainEntityOfPage: post.url,
    image: post.image,
    datePublished: post.pubDate.toISOString(),
    dateModified: (post.updatedDate ?? post.pubDate).toISOString(),
    author: {
      "@type": "Person",
      name: company.founder.name,
      url: company.founder.links[0]?.url,
    },
    publisher: { "@id": orgId },
  });
}
