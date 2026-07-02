# Kairos — Retention Marketing Agency Website

Ready-to-launch static site. No frameworks, no build step, no hosting fees — plain HTML/CSS/JS with self-hosted fonts.

## Pages

| File | Page |
|---|---|
| `index.html` | Home — hero, KPI strip, stack marquee, services, AI analytics, results, process, quotes, CTA |
| `case-studies.html` | Case studies index — 8 linked cards |
| `case-studies/*.html` | 8 standalone case study pages (own URL + SEO meta each) |
| `about.html` | About — founder (Mazz), principles, stack |
| `book.html` | Booking page — Calendly slot, lead form, FAQ |

## Launch checklist (plug and play)

Everything to swap is marked with `★ SWAP` comments in the code. Search the project for `★ SWAP` and `YOUR-DOMAIN` — that's the complete list:

1. **Domain** — buy at Namecheap/Cloudflare, then find-and-replace `YOUR-DOMAIN.com` in:
   `index.html`, `case-studies.html`, `book.html`, `js/main.js`, `robots.txt`, `sitemap.xml`
2. **Calendly** — make a free account at calendly.com, then in `book.html` replace the
   `.calendly-slot` placeholder div with the embed snippet in the `★ SWAP — CALENDLY` comment right above it.
3. **Lead form** — get a free access key at [web3forms.com](https://web3forms.com) (30 seconds, just an email),
   paste it into the `access_key` hidden input in `book.html`. Submissions then arrive in your inbox.
   Until then the form politely points people to your email.
4. **Email** — replace `hello@YOUR-DOMAIN.com` (footers + book page + `js/main.js`).
5. **Social links** — footer `href="#"` placeholders on every page.
6. **Founder photo** — drop your photo into `assets/` and swap the placeholder img in
   `about.html` (marked `★ SWAP — PHOTO`).
6. **Case study numbers** — currently realistic industry-benchmark placeholders.
   Swap in your real client data as you land accounts (all charts/dashboards are HTML/SVG — edit text, not images).

## Free hosting (pick one)

- **Cloudflare Pages**: dash.cloudflare.com → Workers & Pages → connect this repo → done. Free SSL + CDN.
- **GitHub Pages**: repo Settings → Pages → deploy from branch. Point your domain via CNAME.

## Notes

- Fonts are self-hosted in `fonts/` (Archivo, Archivo Black, IBM Plex Mono) — no Google Fonts request, faster and private.
- All charts, dashboards, icons and diagrams are hand-built SVG/CSS — nothing stock, everything editable as text.
- Animations respect `prefers-reduced-motion`.
- SEO: per-page meta + Open Graph, JSON-LD (Organization, FAQPage), `sitemap.xml`, `robots.txt`.
