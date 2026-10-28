# ✿ Aniimo Wildbook

**A pocket field journal for the world of Idyll.** A colorful, account-free Aniimo companion for discovering creature forms, building elemental teams, comparing equipment, and planning your personal collection.

**Live website:** https://aniimo-center.netlify.app/  
**Repository:** https://github.com/francisco-carreiro/aniimo-center

> Independent fan project. Not affiliated with or endorsed by Aniimo, Pawprint Studio, or FunPlus.

## ✨ What you can do

- **Aniidex:** Browse available Aniimo, forms, elements, artwork, traits, skills, base attributes, habitats, evolution references, and form-to-form differences.
- **Team paths:** Discover nine elemental compositions, alternatives, and role coverage.
- **Equipment:** Compare 15 documented held items and how their effects fit different roles.
- **Growth:** Plan awakening allocations and Star Up decisions without claiming unverified costs.
- **Team builder:** Build a four-member squad and inspect a transparent role checklist (not a damage simulator).
- **My companions:** Record owned Aniimo, levels, CP, stars, awakening stats, equipment, and notes. Export and import a portable JSON backup.

Creature-specific build recommendations are **curated rather than generated automatically**. Where an individually verified build is not available, the site labels the guidance as a role-based starting point.

## 🎨 Wildbook design (v1.4)

- New display name: **Aniimo Wildbook**. Replaces the former *ANIIMO CENTER* branding in the interface.
- Idyll-inspired palette: misty sky, mint greens, light lavender, peach, and rounded scrapbook-like panels.
- Content-first interface; visitors do not see technical data-source diagnostics or implementation details.
- Keeps the full Aniidex/form explorer, team builder, and saved collection.
- Native CSS effects only: no canvas or WebGL. Cards use lazy-loaded artwork and short hover transitions; reduced-motion settings are respected.

**Repository and Netlify project names remain `aniimo-center`** for URL/deployment continuity. You can rename them separately after checking redirect behavior.

## 🔒 Privacy and data architecture

The website is a static client-side application. No user account or server-side database is required; your collection remains in browser `localStorage`, and the app does not transmit your personal collection to the data provider.

- The previous storage key **`aniimo-center:v1`** and JSON backup format **`aniimo-center` version 1** are deliberately preserved for compatibility. Do not change them just because the site brand changed.
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
