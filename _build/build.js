#!/usr/bin/env node
/*
 * StephaniLuna.com page builder.
 *
 * Each file in _build/pages/*.html starts with a JSON header comment:
 *   <!--{ "title": "...", "description": "...", "path": "/about/", "nav": "about" }-->
 * followed by the page's <main> content. This script wraps it in the shared
 * layout (head, SEO tags, header, footer) and writes the result to the site
 * root, e.g. /about/index.html. It also regenerates sitemap.xml.
 *
 * Usage:  node _build/build.js
 *
 * Folders starting with "_" are not published by GitHub Pages (Jekyll), so
 * this builder and its sources stay out of the public site.
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const PAGES = path.join(__dirname, "pages");
const SITE = "https://stephaniluna.com";
const EMAIL = "luna@stephaniluna.com";
const LINKEDIN = "https://www.linkedin.com/in/stephani-luna/";
const ASSET_VERSION = "2.0.0";

const NAV = [
  { id: "about", href: "/about/", label: "About" },
  { id: "bulk-liquid", href: "/bulk-liquid/", label: "Bulk Liquid" },
  { id: "markets", href: "/markets/", label: "Markets" },
  { id: "insights", href: "/insights/", label: "Insights" },
];

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const mark = `<svg class="brand__mark" viewBox="0 0 40 40" aria-hidden="true">
        <rect width="40" height="40" rx="10" fill="#0f7b80"/>
        <path d="M20 8c-4.8 6.4-8 11-8 15a8 8 0 0 0 16 0c0-4-3.2-8.6-8-15Z" fill="none" stroke="#fff" stroke-width="2.2" stroke-linejoin="round"/>
        <path d="M14.6 24.6c1.2 2.4 3.2 3.6 5.4 3.6" fill="none" stroke="#9fe0e2" stroke-width="2.2" stroke-linecap="round"/>
      </svg>`;

function header(active) {
  const links = NAV.map(
    (n) => `<a href="${n.href}"${n.id === active ? ' aria-current="page"' : ""}>${n.label}</a>`
  ).join("\n        ");
  return `<a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header">
    <div class="wrap">
      <a class="brand" href="/" aria-label="Stephani Luna, home">
        ${mark}
        <span><span class="brand__name">Stephani Luna</span><span class="brand__role">International Logistics</span></span>
      </a>
      <button class="nav-toggle" type="button" aria-controls="site-nav" aria-expanded="false" aria-label="Open menu">
        <svg class="icon-open" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
        <svg class="icon-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>
      </button>
      <nav class="nav" id="site-nav" aria-label="Main">
        ${links}
        <a class="nav__cta" href="/contact/"${active === "contact" ? ' aria-current="page"' : ""}>Get in touch</a>
      </nav>
    </div>
  </header>`;
}

const footer = `<footer class="site-footer">
    <div class="wrap">
      <div class="footer-grid">
        <div class="footer-brand">
          <a class="brand" href="/" aria-label="Stephani Luna, home">
            ${mark}
            <span><span class="brand__name">Stephani Luna</span><span class="brand__role">International Logistics</span></span>
          </a>
          <p>Account Executive in international logistics, focused on bulk liquids, Latin America and global trade lanes. Based in Houston. English &amp; Español.</p>
        </div>
        <div>
          <h4>Explore</h4>
          <ul>
            <li><a href="/about/">About &amp; career</a></li>
            <li><a href="/bulk-liquid/">Bulk liquid logistics</a></li>
            <li><a href="/markets/">Markets</a></li>
            <li><a href="/insights/">Insights</a></li>
            <li><a href="/resume/">Resume</a></li>
          </ul>
        </div>
        <div>
          <h4>Connect</h4>
          <ul>
            <li><a href="mailto:${EMAIL}">${EMAIL}</a></li>
            <li><a href="${LINKEDIN}" target="_blank" rel="noopener">LinkedIn</a></li>
            <li><a href="/contact/">Contact page</a></li>
          </ul>
        </div>
      </div>
      <div class="footer-base">
        <span>&copy; <span data-year>2026</span> Stephani Luna. Personal website. Views are my own.</span>
        <span>Houston, Texas</span>
      </div>
    </div>
  </footer>`;

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Stephani Luna",
  url: SITE + "/",
  email: "mailto:" + EMAIL,
  jobTitle: "Account Executive, International Logistics",
  worksFor: { "@type": "Organization", name: "OEC Group" },
  knowsLanguage: ["English", "Spanish"],
  knowsAbout: [
    "International logistics", "Bulk liquid logistics", "Flexitanks", "ISO tanks",
    "IBCs", "Ocean freight", "Air freight", "Multimodal transportation",
    "Business development", "Account management", "Latin America trade",
  ],
  alumniOf: [
    { "@type": "CollegeOrUniversity", name: "University of Houston-Downtown" },
    { "@type": "CollegeOrUniversity", name: "University of Houston" },
  ],
  address: { "@type": "PostalAddress", addressLocality: "Houston", addressRegion: "TX", addressCountry: "US" },
  sameAs: [LINKEDIN],
};

function layout(meta, body, source) {
  const url = SITE + meta.path;
  const fullTitle = meta.path === "/" ? meta.title : `${meta.title} | Stephani Luna`;
  const ogType = meta.type === "article" ? "article" : meta.path === "/" ? "profile" : "website";
  const schema = meta.schema === "person" || meta.path === "/"
    ? `\n  <script type="application/ld+json">${JSON.stringify(personSchema)}</script>`
    : meta.type === "article"
      ? `\n  <script type="application/ld+json">${JSON.stringify({
          "@context": "https://schema.org", "@type": "Article", headline: meta.title,
          description: meta.description, author: { "@type": "Person", name: "Stephani Luna", url: SITE + "/" },
          datePublished: meta.date, mainEntityOfPage: url,
        })}</script>`
      : "";
  const robots = meta.noindex ? `\n  <meta name="robots" content="noindex">` : "";
  return `<!doctype html>
<!-- Generated by _build/build.js from _build/pages/${source}. Edit the source, then run: node _build/build.js -->
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(fullTitle)}</title>
  <meta name="description" content="${esc(meta.description)}">${robots}
  ${meta.noindex ? "" : `<link rel="canonical" href="${url}">`}
  <meta name="author" content="Stephani Luna">
  <meta name="theme-color" content="#0b1a2b">
  <meta property="og:type" content="${ogType}">
  <meta property="og:site_name" content="Stephani Luna">
  <meta property="og:title" content="${esc(meta.ogTitle || fullTitle)}">
  <meta property="og:description" content="${esc(meta.description)}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${SITE}/assets/img/og-image.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Stephani Luna, international logistics: bulk liquids, Latin America and global trade lanes">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml">
  <link rel="icon" href="/favicon.ico" sizes="32x32">
  <link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..700;1,9..144,400..600&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap">
  <link rel="stylesheet" href="/assets/css/site.css?v=${ASSET_VERSION}">${meta.extraHead ? "\n  " + meta.extraHead : ""}${schema}
</head>
<body${meta.bodyClass ? ` class="${meta.bodyClass}"` : ""}>
  ${header(meta.nav)}

  <main id="main">
${body.trim()}
  </main>

  ${footer}

  <script src="/assets/js/site.js?v=${ASSET_VERSION}" defer></script>
</body>
</html>
`;
}

function parse(file) {
  const raw = fs.readFileSync(path.join(PAGES, file), "utf8");
  const m = raw.match(/^<!--(\{[\s\S]*?\})-->\s*/);
  if (!m) throw new Error(`${file}: missing JSON header comment`);
  const meta = JSON.parse(m[1]);
  for (const k of ["title", "description", "path"]) {
    if (!meta[k]) throw new Error(`${file}: header missing "${k}"`);
  }
  return { meta, body: raw.slice(m[0].length) };
}

function outFile(p) {
  if (p.endsWith(".html")) return path.join(ROOT, p);
  return path.join(ROOT, p, "index.html");
}

const files = fs.readdirSync(PAGES).filter((f) => f.endsWith(".html")).sort();
const sitemap = [];
for (const file of files) {
  const { meta, body } = parse(file);
  const out = outFile(meta.path);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, layout(meta, body, file));
  if (!meta.noindex) sitemap.push({ loc: SITE + meta.path, priority: meta.path === "/" ? "1.0" : meta.type === "article" ? "0.6" : "0.8" });
  console.log("built", path.relative(ROOT, out));
}

const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(
  path.join(ROOT, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemap.map((u) => `  <url><loc>${u.loc}</loc><lastmod>${today}</lastmod><priority>${u.priority}</priority></url>`).join("\n")}
</urlset>
`
);
console.log(`built sitemap.xml (${sitemap.length} urls)`);
