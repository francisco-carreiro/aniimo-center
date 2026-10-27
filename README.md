# ANIIMO CENTER ⚡

**A responsive, all-element Aniimo optimization hub — ready for Netlify or any static web host.**

- 9 sourced elemental team presets with lineups, tactics and substitutions.
- 44 curated offline starter entries, expanded at runtime with the public wiki-derived Aniimo species catalog (provider currently documents ~88 Aniimo; counts may change).
- Creature forms, attributes, skills, traits, habitats and illustration URLs loaded from the public API, including Prismana and regional/weather forms.
- In-page form comparison against Basic: element changes and base-stat deltas.
- 11 individually researched build profiles; other entries offer explicitly labeled **role templates**, not invented BIS claims.
- 15 held items with documented effects and contextual role suggestions.
- Dedicated **Upgrade roadmap** that starts with a blank selector and supports any Aniimo, role-level awakening priorities, potential breakpoints, and personal budget tracking.
- Custom squad planner with a **transparent role/ownership checklist** (not simulated DPS).
- Personal collection, levels, CP, star progression, awaken stats, held items and notes.
- Starts with **no assumed owned Aniimo or screenshot-derived profile**; add only the units you own.
- Universal home dashboard: all nine elements, featured diverse teams, and a five-step optimization guide.
- JSON export/import, saved in the device's `localStorage` with no accounts or backend.
- Desktop and phone layouts; reduced-motion styling for accessibility.
- Research source registry with publication/review dates.
- Optional weekly **read-only link-availability report** from GitHub Actions (not automatic build recommendations).

## Run locally

**No Node.js dependencies, npm, build step, account, API key, or backend are required.** The full Aniidex depends on an external public JSON API; without it, the curated starter library remains available.

Option A: Open the included `ANIIMO-CENTER-standalone.html` in a browser. The standalone version bundles JavaScript and CSS in one file (external fonts are optional). **Some browsers restrict `localStorage` for `file://` pages**, so use JSON export/import or the hosted version for reliable persistence.

Option B: Serve this folder locally to allow ES modules:

```bash
python -m http.server 8000
```

Open `http://localhost:8000` in a browser. Or, using VS Code, right-click `index.html` and choose **Open with Live Server**.

> Avoid opening `index.html` directly with `file://` because ES module imports may be blocked by browser CORS rules. Use the bundled standalone file instead.

## Deploy to Netlify

1. Create a new GitHub repository (for example `aniimo-center`).
2. Add the repository contents to the repo root and push.
3. On Netlify choose **Add new project → Import an existing project**, then select the repository.
4. Leave the build command blank. Set **Publish directory** to `.` (the project root); `netlify.toml` already supplies this.
5. Deploy. This is static hosting; there are no secrets, environment variables or databases.

**Alternative:** drag the project folder to Netlify's manual deploy UI. The `index.html` must be at the deployed root next to `assets/`.

## Updates and data integrity

- Curated strategies are in [`assets/data.js`](./assets/data.js), last researched **2026-10-27**. Live wiki-derived encyclopedia data is read-only from the public API through [`assets/live-data.js`](./assets/live-data.js); this is not an official supported gameplay API.
- Team recommendations are attributed to GameWith (updated 2026-10-14); players disagree on optimal endgame squads.
- Fulmintis remains **one ordinary build entry** alongside the rest; its individual recommendations distinguish the in-game Ferocious Fang recommendation from the theorycrafted crit-focused Heartseeker Pendant.
- The app removes the **exact unmodified v1 sample Fulmintis record** on upgrade, while preserving actual saved edits and other Aniimo in local storage. New profiles start with zero *recorded* awakening points, which means **not yet entered**, not that the game starts at zero.
- Generic role-level build templates are marked as **not individually verified**.
- Level gates and Star Up material costs vary by your game status; the roadmap asks you to verify these instead of inferring universal values from example screenshots.
- The 0–100 team planner score is intentionally only a role/ownership coverage checklist. Do **not** treat it as a DPS, matchmaking or boss-win prediction.
- Game statistics, stars, attributes and skills can change. Before spending rare materials, confirm any irreversible changes in the current game client.
- `scripts/source_watch.py` and the `.github/workflows/research-watch.yml` workflow can check whether source URLs are accessible. They **do not auto-update the build database** and do not claim change detection for gameplay data.

## Privacy

Progress is in your browser's `localStorage` under key `aniimo-center:v1`. Each device is independent. To move between phone and PC, export JSON from **My collection** on one device, then import it on the other. Back up your records before clearing website data.

Backup schema: `{ "format": "aniimo-center", "version": 1, "collection": {...} }`. Imports validate record names and clamp numeric values. Species absent from the offline starter index remain stored for restoration when the live catalog reconnects.

## Files

```text
index.html                        Static entry point
assets/style.css                  Responsive UI
assets/data.js                    Curated teams / offline Aniimo / items / sources
assets/live-data.js               Public Aniimo API adapter and cache
assets/app.js                     App features and local storage
assets/mark.svg                   Project mark
ANIIMO-CENTER-standalone.html      One-file preview / portable edition
netlify.toml                      Static deployment config
scripts/build_standalone.py       Rebuild standalone HTML
scripts/source_watch.py           Read-only reference availability report
tests/live-data.test.mjs          No-dependency API normalization tests
.github/workflows/research-watch.yml  Optional weekly source check
```

## Credits and legal

Personal independent fan project. **Not affiliated with, endorsed by, or an official database of Aniimo, Pawprint Studio, or the publisher.** No proprietary artwork is bundled. When the public API is available, images are requested from remote publisher-hosted CDN URLs (© Pawprint Studio); otherwise the app uses abstract CSS/SVG glyphs. Guide content is paraphrased and linked, not reproduced wholesale.

---

### Nota de utilização (PT-PT)

O projeto é uma aplicação estática pronta a publicar no Netlify. A coleção é guardada apenas no navegador e pode ser transferida entre dispositivos através de **Exportar/Importar JSON**. As recomendações estão associadas às respetivas fontes e podem precisar de revisão quando o jogo for atualizado. A pontuação do planeador mede apenas a composição da equipa, **não** representa uma simulação de dano.

## v1.2 — Public Aniidex integration (no accounts)

Aniimo Center is an **account-free, static fan web app**. The Aniidex requests the
[public Aniimo Tools v1 catalog](https://aniimo.ogoulart.dev/api/) directly from
visitors' browsers. The provider documents a daily refreshed collection of ~88
Aniimo species with forms, elements, roles, attributes, abilities, traits,
habitats and illustration URLs obtained from the official Aniimo Wiki.
**Counts are reported by the provider and may change;** the app displays the
actual number of records after a successful request.

- **No login, credentials, API keys, server, or database.** Netlify publishes static files.
- **Source separation:** Wiki-derived forms/stats/skills are distinct from manually
  researched builds and team suggestions. We never invent an item, awakening order,
  personality, or DPS result for an unknown species.
- **Form-aware Aniidex:** Filter by element or Prismana/multiple forms; open any
  species and select its form to see its published artwork, element(s), role(s),
  base attributes, skills, traits, habitats, evolution targets and source date.
- **Image policy:** the browser loads *remote* art linked by the public API from
  the game publisher's CDN. Art is © Pawprint Studio. No copyrighted image
  files are bundled in the repository, and images may be unavailable if their
  CDN changes its access policy.
- **Resilience:** The last successful normalized catalog may be cached locally
  for 12 hours. The static curated starter roster remains available if the API
  cannot be reached; missing official information is prominently labeled.
- **Privacy:** Collection and saved profile information stay in browser storage
  until exported or cleared. Neither this app nor the upstream public API is
  sent personal roster or progression details. Requesting the catalog and
  artwork does disclose standard network metadata to their hosts.

### Catalog refresh

The Aniidex **Refresh data** button bypasses its cached catalog. Official
species records will refresh on visiting the site approximately every 12 hours.
Editorial best-in-slot recommendations do *not* automatically update, and the
existing weekly research-link checker only checks availability, not accuracy.

The API's schema is handled defensively in `assets/live-data.js`. To run its
schema-normalization regression test:

```bash
node --test tests/live-data.test.mjs
```

### Local testing

Because the project uses ES modules, launch a static server to test `index.html`:

```bash
python -m http.server 8000
```

Alternatively open `ANIIMO-CENTER-standalone.html`. It includes the app scripts
and styles but still needs an internet connection for up-to-date catalog and
publisher-hosted art. Source API availability and CORS are external dependencies.
