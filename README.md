# ANIIMO CENTER ⚡

**A responsive, all-element Aniimo optimization hub — ready for Netlify or any static web host.**

- 9 sourced elemental team presets with lineups, tactics and substitutions.
- 44 Aniimo from featured team rosters (this is a **starter subset**, not the whole game roster).
- 11 improved individual build profiles; remaining entries offer explicitly labeled **role templates**, not invented BIS claims.
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

**No Node.js, npm, build step, or external API is required.**

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

- The dataset is in [`assets/data.js`](./assets/data.js). **Snapshot reviewed 2026-10-27**; it is not a live gameplay API or an exhaustive encyclopedia.
- Team recommendations are attributed to GameWith (updated 2026-10-14); players disagree on optimal endgame squads.
- Fulmintis remains **one ordinary build entry** alongside the rest; its individual recommendations distinguish the in-game Ferocious Fang recommendation from the theorycrafted crit-focused Heartseeker Pendant.
- The app removes the **exact unmodified v1 sample Fulmintis record** on upgrade, while preserving actual saved edits and other Aniimo in local storage.
- Generic role-level build templates are marked as **not individually verified**.
- The 0–100 team planner score is intentionally only a role/ownership coverage checklist. Do **not** treat it as a DPS, matchmaking or boss-win prediction.
- Game statistics, stars, attributes and skills can change. Before spending rare materials, confirm any irreversible changes in the current game client.
- `scripts/source_watch.py` and the `.github/workflows/research-watch.yml` workflow can check whether source URLs are accessible. They **do not auto-update the build database** and do not claim change detection for gameplay data.

## Privacy

Progress is in your browser's `localStorage` under key `aniimo-center:v1`. Each device is independent. To move between phone and PC, export JSON from **My collection** on one device, then import it on the other. Back up your records before clearing website data.

Backup schema: `{ "format": "aniimo-center", "version": 1, "collection": {...} }`. Imports whitelist known Aniimo and clamp numeric values.

## Files

```text
index.html                        Static entry point
assets/style.css                  Responsive UI
assets/data.js                    Curated teams / Aniimo / held items / sources
assets/app.js                     App features and local storage
assets/mark.svg                   Project mark
ANIIMO-CENTER-standalone.html      One-file preview / portable edition
netlify.toml                      Static deployment config
scripts/build_standalone.py       Rebuild standalone HTML
scripts/source_watch.py           Read-only reference availability report
.github/workflows/research-watch.yml  Optional weekly source check
```

## Credits and legal

Personal independent fan project. **Not affiliated with, endorsed by, or an official database of Aniimo, Pawprint Studio, or the publisher.** No proprietary artwork is bundled. Creature illustrations in this version are abstract, generated with CSS/SVG glyphs rather than copied assets. Guide content is paraphrased and linked, not reproduced wholesale.

---

### Nota de utilização (PT-PT)

O projeto é uma aplicação estática pronta a publicar no Netlify. A coleção é guardada apenas no navegador e pode ser transferida entre dispositivos através de **Exportar/Importar JSON**. As recomendações estão associadas às respetivas fontes e podem precisar de revisão quando o jogo for atualizado. A pontuação do planeador mede apenas a composição da equipa, **não** representa uma simulação de dano.
