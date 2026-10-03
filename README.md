# StephaniLuna.com

Personal professional website for Stephani Luna — international logistics, bulk liquids, Latin America and global trade lanes.

Static HTML/CSS/JS, hosted on GitHub Pages with the custom domain in `CNAME`. No framework, no dependencies.

## Structure

| Path | What it is |
| --- | --- |
| `_build/pages/*.html` | **Page sources.** Edit these. Each starts with a JSON header (title, description, path). |
| `_build/build.js` | Wraps each source in the shared layout (head/SEO, header, footer) and writes the public pages + `sitemap.xml`. |
| `_build/og.html`, `_build/icon.html` | Sources for the social preview image and app icons. |
| `assets/css/site.css` | All styles. Design tokens are at the top (`:root`). |
| `assets/js/site.js` | Mobile menu, scroll reveal, copy-email, print. Site works without it. |
| `assets/img/` | Illustrations (SVG), favicon, social image. |
| `index.html`, `about/`, `bulk-liquid/`, … | **Generated** — don't edit by hand; changes are overwritten on the next build. |

Folders starting with `_` are not published by GitHub Pages.

## Editing

```bash
node _build/build.js          # rebuild pages after editing _build/pages/*
python -m http.server 8080    # preview at http://127.0.0.1:8080
```

To add an article, copy one of `_build/pages/insight-*.html`, change the header (`path`, `title`, `description`, `date`), write the content, add a card to `_build/pages/insights.html`, and rebuild.

## Regenerating images and the resume PDF (Windows, headless Edge)

With the preview server running:

```bash
EDGE="/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
"$EDGE" --headless=new --hide-scrollbars --window-size=1200,630 --screenshot="assets/img/og-image.png" http://127.0.0.1:8080/_build/og.html
"$EDGE" --headless=new --no-pdf-header-footer --print-to-pdf="assets/Stephani-Luna-Resume.pdf" http://127.0.0.1:8080/resume/
```

## Private material

`reference/` holds internal source material (e.g. the master resume with phone number). It is git-ignored and must never be committed or linked from the site.
