# ✿ Aniimo Wildbook

**A pocket field journal for the world of Idyll.** A colorful, account-free Aniimo companion for discovering creature forms, building form-specific teams, comparing held items, planning awakening investments, and tracking multiple personal copies of each Aniimo.

**Live website:** https://aniimo-center.netlify.app/  
**Repository:** https://github.com/francisco-carreiro/aniimo-center

> Independent fan project. Not affiliated with or endorsed by Aniimo, Pawprint Studio, or FunPlus.

## ✨ What you can do

- **Aniidex:** Browse available Aniimo, forms, elements, artwork, traits, skills, base attributes, habitats, evolution references, and form-to-form differences.
- **Team paths:** Discover nine elemental compositions, alternatives, and role coverage.
- **Equipment:** Compare 15 documented held items and how their effects fit different roles.
- **Growth:** Plan awakening allocations and Star Up decisions without claiming unverified costs.
- **Team builder (v1.5):** Choose an exact form in each slot; check role coverage, offensive typing, incoming threats, and situational suggestions. Clearly labeled as heuristics, never a DPS simulator.
- **My companions (v1.5):** Keep multiple independently editable copies of the same species and form, with level, CP, Star Up, awakening values, held items, and notes. Import legacy v1 or new v2 JSON backups.
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
node --test tests/*.test.mjs
python -m py_compile scripts/build_standalone.py scripts/source_watch.py
python scripts/build_standalone.py
```

Browser previews may need internet access for live artwork; a blocked upstream service falls back to the curated local index. Do not confuse an API outage with an empty game encyclopedia.

## 📂 Project structure

| File | Purpose |
|---|---|
| `index.html` | Browser entry point |
| `assets/style.css` | Idyll-inspired responsive theme |
| `assets/app.js` | UI, navigation, build tools, local collection |
| `assets/data.js` | Curated elemental teams, held items, offline catalog, references |
| `assets/live-data.js` | External catalog adapter and 12-hour cache |
| `assets/wildbook-core.js` | Pure collection migration, matchup matrix, team and item heuristics |
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
