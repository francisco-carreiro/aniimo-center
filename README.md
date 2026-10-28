# ✿ Aniimo Wildbook

**A pocket field journal for the world of Idyll.** A colorful, account-free Aniimo companion for discovering creature forms, building form-specific teams, comparing held items, planning awakening investments, and tracking multiple personal copies of each Aniimo and recording journeys across Idyll’s habitats.

**Live website:** https://aniimo-center.netlify.app/  
**Repository:** https://github.com/francisco-carreiro/aniimo-center

> Independent fan project. Not affiliated with or endorsed by Aniimo, Pawprint Studio, or FunPlus.

## 🌟 v2.0 — Field-ready PWA (28 October 2026)

Wildbook now supports **installation to the home screen** and can open saved application pages offline after its first successful online visit. The service worker caches only local static code and a fallback encyclopedia. It never stores personal collection records, third-party images, or data-provider responses in Cache Storage. Existing localStorage collection, battle and Explorer keys are unchanged.

The Install action appears in the header on supported browsers; otherwise the browser menu may offer **Add to Home Screen**. Users receive a nonintrusive update notice when a new service worker is waiting, instead of an unexpected session reload. When offline, the app uses its curated fallback and any previously cached catalog data; **complete creature artwork and new updates still require connectivity**.

Accessiblity improvements include a skip-to-content link, keyboard-operable dialogs with a focus trap and Escape support, focus returned after closing, and live status announcements. The source stylesheet is retained for editing, while the deployment uses a reproducible compact stylesheet. A GitHub Actions quality gate runs regression tests and checks generated files on pull requests and main.

**Build commands:**

```bash
python scripts/optimize_css.py
python scripts/build_standalone.py
node --test tests/*.test.mjs
```

**Production verification:** Service workers require HTTPS or an allowed localhost origin, and cannot be end-to-end tested through a browser harness that blocks localhost. After Netlify deployment, follow [v2.0 release notes](RELEASE-NOTES-v2.0.md) to confirm installation, offline navigation, and update activation. This is a static PWA—not a full offline mirror of third-party media.

## ✨ What you can do

- **Aniidex:** Browse available Aniimo, forms, elements, artwork, traits, skills, base attributes, habitats, evolution references, and form-to-form differences.
- **Explorer (v1.8):** Browse named habitats and form-specific regional records; mark regions visited, log seen/caught forms, build a personal wishlist and write private travel notes and jump between region guides and documented local bosses.
- **Team paths:** Discover nine elemental compositions, alternatives, and role coverage.
- **Equipment:** Compare 15 documented held items and how their effects fit different roles.
- **Growth:** Plan awakening allocations and Star Up decisions without claiming unverified costs.
- **Team builder (v1.5):** Choose an exact form in each slot; check role coverage, offensive typing, incoming threats, and situational suggestions. Clearly labeled as heuristics, never a DPS simulator.
- **My companions (v1.5):** Keep multiple independently editable copies of the same species and form, with level, CP, Star Up, awakening values, held items, and notes. Import legacy v1 or new v2 JSON backups; v1.8 exports also include optional Explorer progress.
- **Element matchups (v1.5):** Compare nine attacking elements against one or two defending elements, with a transparent effectiveness table.
- **Build Workshop (v1.6):** Select a species and form, inspect documented abilities and base stats, review form-applicable build notes, get role-based held-item candidates, and track actual investments.
- **Growth (v1.6):** Follow a particular saved copy rather than applying a species-level upgrade template to every form.

Creature-specific build recommendations are **curated rather than generated automatically**. Where an individually verified build is not available, the site labels the guidance as a role-based starting point.

## 🚀 Pathfinder + Build Workshop (v1.5–v1.6)

This combined release upgrades the existing static Wildbook in place; the GitHub repository and public Netlify address are unchanged.

**Saved data migration:** The old browser key `aniimo-center:v1` is *read but not overwritten*. On the first v1.6 load, the app converts each saved species profile to a distinct `instances[]` entry in `aniimo-wildbook:v2` and thereafter saves to the v2 key. The old snapshot stays available for rollback. A v1 backup imports into the new format, and v2 exports preserve multiple copies. Importing a backup replaces the local collection only after confirmation; export your current data first.

**Form awareness:** A form may change its element pair, role, skills and base stats. Team selectors and matchups now use form-specific catalog data when available. If a form's data is missing or temporarily offline, a saved form label is retained, with its form-specific attributes explicitly marked as unverified.

**Matchup assumptions:** The elemental multiplier matrix was transcribed from [AniimoVerse's 2026-08-10 type chart](https://www.aniimoverse.com/type-chart). Attack rows are directional (×1.6 super effective, ×1 neutral, ×0.625 resisted). For dual defenders, community guidance multiplies both multipliers. Other guides differ on some edge cases; verify live gameplay before treating the matrix as authoritative. `assets/wildbook-core.js` contains the centrally editable matrix and pure calculations.

**Heuristic recommendations:** The squad assistant scores gaps in role coverage, elemental target effectiveness and resistance to common threats; the item shortlist uses documented main stats, effect descriptions and curated builds where genuinely applicable. Neither estimates actual ability damage, timing, proc rates, encounter mechanics, best-in-slot rankings or combat win probability.

**Performance / maintainability:** Additional logic lives in one tested dependency-free pure module; images remain lazy-loaded, reduced-motion preferences remain supported, and distant roster cards can defer rendering. A future release should consolidate the legacy stylesheet before adding new heavy visual effects.

## 🎨 Wildbook design (v1.4)

- New display name: **Aniimo Wildbook**. Replaces the former *ANIIMO CENTER* branding in the interface.
- Idyll-inspired palette: misty sky, mint greens, light lavender, peach, and rounded scrapbook-like panels.
- Content-first interface; visitors do not see technical data-source diagnostics or implementation details.
- Keeps the full Aniidex/form explorer, team builder, and saved collection.
- Native CSS effects only: no canvas or WebGL. Cards use lazy-loaded artwork and short hover transitions; reduced-motion settings are respected.

**Repository and Netlify project names remain `aniimo-center`** for URL/deployment continuity. You can rename them separately after checking redirect behavior.

## 🔒 Privacy and data architecture

The website is a static client-side application. No user account or server-side database is required; your collection remains in browser `localStorage`, and the app does not transmit your personal collection to the data provider.

- Legacy **`aniimo-center:v1`** localStorage and `aniimo-center` v1 JSON backups are accepted on migration. New data is stored under **`aniimo-wildbook:v2`**, exported as `aniimo-wildbook` v2. Do not delete the legacy key automatically.
- The full catalog loads from an independent third-party data service in `assets/live-data.js` and caches successful responses for 12 hours; a smaller curated library remains available offline.
- This is **not a secret API**: because the site is public and frontend-only, network requests and JavaScript source are inspectable in browser developer tools. Hiding technical labels from visitors does not create security or secrecy.
- Do **not** put API keys, passwords, paid-service secrets or private endpoints into this repository or browser code.

## 🛠️ Setup

No Node build, account, paid service, or backend required.

```bash
python -m http.server 8000
```

Open `http://localhost:8000/`. To host on Netlify, connect the repository to Netlify, leave the build command empty, and publish directory `.`; `netlify.toml` contains the relevant settings.

The portable **`ANIIMO-WILDBOOK.html`** edition bundles JavaScript and CSS into one file. The former `ANIIMO-CENTER-standalone.html` filename is retained as a small redirect for existing links. Use the portable edition when serving ES modules is not an option.

## 🧪 Local validation

```bash
node --check assets/app.js
node --check assets/live-data.js
node --check assets/wildbook-core.js
node --check assets/explorer-core.js
node --test tests/*.test.mjs
python scripts/optimize_css.py
python -m py_compile scripts/build_standalone.py scripts/source_watch.py
python scripts/build_standalone.py
```

Browser previews may need internet access for live artwork; a blocked upstream service falls back to the curated local index. Do not confuse an API outage with an empty game encyclopedia.

## 📂 Project structure

| File | Purpose |
|---|---|
| `index.html` | Browser entry point |
| `assets/style.css` | Editable Idyll-inspired responsive theme |
| `assets/style.min.css` | Generated production stylesheet |
| `service-worker.js` / `manifest.webmanifest` | PWA application shell and install metadata |
| `.github/workflows/quality.yml` | Automated regression gate |
| `assets/app.js` | UI, navigation, build tools, local collection |
| `assets/data.js` | Curated elemental teams, held items, offline catalog, references |
| `assets/live-data.js` | External catalog adapter and 12-hour cache |
| `assets/wildbook-core.js` | Pure collection migration, matchup matrix, team and item heuristics |
| `assets/explorer-core.js` | Offline habitat starter index, form-specific region join, safe local exploration journal and itinerary helpers |
| `assets/mark.svg` | Custom Wildbook mark |
| `scripts/build_standalone.py` | Build portable HTML |
| `scripts/source_watch.py` | Read-only source availability check |
| `tests/` | Data and branding tests |
| `netlify.toml` | Static hosting and headers |
| `ANIIMO-WILDBOOK.html` | One-file portable edition |

## Sources and rights (maintainers)

The game and artwork are owned by their respective creators. The website displays game information for reference as an **unofficial fan project**. Source data is independently provided by the public [Aniimo Tools catalog](https://aniimo.ogoulart.dev/api/), whose documentation describes a wiki-derived collection. This is not a developer-endorsed API. Artwork may be served by the original publisher's CDN; no artwork is bundled in the repository.

Build and team references include [GameWith](https://gamewith.ai/aniimo/en), [Aniimo Guide](https://aniimoguide.com/), and other credited research listed in `assets/data.js`. These sources can disagree. Revisit recommendations when the game changes, and respect each provider's copyright, attribution, and usage terms. Optional scheduled GitHub Actions checks only test whether reference links respond; they do **not** establish build correctness or synchronize strategy automatically.

---

**Nota (PT-PT):** O Wildbook não exige conta nem subscrição. A coleção fica guardada no navegador e pode ser transferida com exportação/importação JSON. Os dados de referência e as recomendações não substituem a verificação dentro do jogo.

## 🌿 v1.7 — Battle Companion (28 October 2026)

- **World Boss Journal:** 17 Alpha and 3 Omega encounter entries, with region, types, reliable access notes and personal status (not started / attempted / cleared), plus up to 350 characters of personal notes per encounter.
- **Boss Rush:** Seven separate challenge entries, tracked independently from the world-map Alphas. The seven are community-documented Level 60 encounters; live challenge balance and rewards may vary.
- **Matchup and party preparation:** Select an encounter to view a transparent 9-element matchup ranking, optional collection-only counters and a suggested four-member squad. Team drafts prioritize documented role coverage and elemental attack types. They **do not** simulate actual damage, predict success, or model encounter-specific modifiers.
- **Expanded build library:** Seventeen additional editorial Basic-form skill/held-item profiles (28 total with the prior 11), with confidence labels and no false best-in-slot claims. Form-specific alternate variants continue to receive role-oriented suggestions when a unique guide is not available.
- **Private encounter journal:** Encounter progress is stored under `aniimo-wildbook:battles:v1`; your companion records remain under `aniimo-wildbook:v2`. No accounts or telemetry. New v2 JSON exports include optional `encounters`; older v1/v2 exports still import. Importing an older backup without an `encounters` field does not erase existing boss progress.
- **Fallback:** When external Aniimo form data is unavailable, the encounter registry still works offline. Unknown form typing is *not* represented as a known counter.

### Research sources used for v1.7

The application uses a documented **20 world-boss** model (17 Alpha + 3 Omega). Other databases count 21 individual records when the Young/Elderly Omega Sherro variants are modeled separately. These are **not** silently added as unverified fourth Omega world bosses.

- [Aniimo.Guide — In-game text boss directory](https://aniimo.guide/en/world/bosses) (reviewed 2026-09-17).
- [Aniimo.run — World boss index](https://aniimo.run/database/bosses) (consulted 2026-10-28).
- [Aniilog — Seven Boss Rush encounters](https://aniilog.gg/bosses/) (data from 2026-09-23).
- [Aniimo.Guide — Alpha Geoclaw mechanics](https://aniimo.guide/en/world/bosses/alpha-geoclaw).
- [Daily Aniimo — community boss counters](https://dailyaniimo.com/guides/boss-tier-list) (updated 2026-10-13).
- [AllThingsHow — editorial loadouts](https://allthings.how/aniimo-builds-best-skills-held-items-and-stat-priorities-for-every-aniimo/) (2026-09-25).

The catalog's existing independent provider is described in the earlier **Sources and rights (maintainers)** section. Visitor-facing screens do not expose provider status or raw implementation details. These sources may contain stale or conflicting entries; inspect current in-game facts before spending rare resources.

### New tests

```bash
node --test tests/*.test.mjs
python scripts/build_standalone.py
```

The Battle Companion has unit tests for encounter count, separate Rush entries, dual-element calculations, copy-aware counters, journal sanitation, JSON backup compatibility, and incomplete-offline fallbacks.


## 🌱 v1.8 — Explorer (28 October 2026)

The Explorer adds a regional field journal without inventing map coordinates or spawn conditions:

- **Habitat directory:** 14 named starter regions; additional region names appear automatically when the catalog provides them. The offline version contains a **small and incomplete set of starter leads**, visually labeled as such, sourced from community habitat listings. It does not claim a complete offline encounter distribution.
- **Form-level records:** Live directory entries join each species **and particular form** to the habitat names provided for that form; Basic and Prismana/alternate forms are not collapsed. A region can have multiple records for one species.
- **Personal journal:** Mark a region as visited; record seen/caught forms; maintain a wishlist; add 350-character field notes. The wishlist groups outstanding targets by region — it is **not** a shortest-path planner.
- **Existing collection:** An owned copy counts as caught in regional summaries, but does **not** automatically mark it as having been caught in that particular region. A species found in multiple regions contributes to each region's checklist; the Wildbook-wide "Forms discovered" summary counts each form only once.
- **Browser persistence:** New key `aniimo-wildbook:explorer:v1`. The older v2 state and the legacy v1 key are left untouched. JSON backups retain format `aniimo-wildbook` version 2 with an additional optional `exploration` object; old backups without this property do not erase current Explorer progress. No server/database/login needed.
- **Boundaries:** Habitat directories are not coordinate maps; season, weather, time of day, precise spawn spots, discovery requirements and future game releases must be confirmed in-game. If the catalog cannot load, Wildbook uses the limited starter list instead of claiming the full distribution is available.

Maintainer research: [Aniimo map region guide](https://aniim.org/map/), [community habitat directory](https://aniimomap.org/), [how the in-game distribution works](https://aniimo.guide/en/guides/find-any-aniimo), and the existing public wiki-derived catalog. These resources differ in total region counts because of expansion timing and map coverage; the app follows named habitats supplied with actual form records. Dates/patch information should be reviewed when new areas release.

To validate the explorer in isolation: `node --test tests/explorer.test.mjs`. This release adds seven deterministic tests over the previous 21 automated tests.
