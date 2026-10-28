# Aniimo Wildbook v2.0 — Field-ready release

Release scope: offline-first application shell, installable web app, lighter static asset delivery, keyboard accessibility, and automated quality checks. No account system, backend, telemetry or changes to the personal collection JSON format.

## New

- Installable web manifest and first-party PNG icons (including safe-area maskable artwork).
- Versioned service worker precaches the application shell and bundled fallback catalog. Navigations can open offline after the initial successful installation.
- Subtle Install button, offline indicator and explicit **Update now** prompt when a new version is waiting.
- Proper dialog focus handling (initial focus, Tab wrap, Escape close, restored focus), skip-to-content link, route-heading focus and live status announcements.
- Source/production stylesheet separation, with deterministic `scripts/optimize_css.py` output. Retains the editable source and existing Wildbook look.
- `quality.yml` runs the existing game-data tests and new PWA tests on pull requests and main-branch pushes.
- HTTP caching adjusted to allow reliable revalidation after deployments; deployed updates require user approval before reloading a controlled tab.

## Offline limitations

- The fallback encyclopedia, forms already cached in localStorage, collection, battle journal and Explorer history are available without a connection.
- The external live catalog and remote creature images **cannot be guaranteed offline**. First open the site online so the service worker can install. Offline mode doesn't make external images downloadable or licensed for redistribution.
- The single-file portable HTML works without a service worker or manifest.

## Compatibility

The user records remain under `aniimo-wildbook:v2`, the battle journal under `aniimo-wildbook:battles:v1`, and Explorer progress under `aniimo-wildbook:explorer:v1`. Legacy collection key `aniimo-center:v1` is retained for rollback. No automatic clearing or rewriting of personal data.

## Post-deployment verification

1. On HTTPS Netlify, open DevTools → Application → Manifest and verify icons/name/display mode.
2. Open Application → Service Workers and confirm `service-worker.js` is active; check Cache Storage contains `wildbook-v2.0.0-shell`.
3. Reload once online, check offline mode, then use every page and open a saved collection (remote artwork may disappear).
4. Restore network access; verify catalog refresh and update notice on a future deployment.
5. Test *Add to Home Screen* on Android, and manually choose that option from Safari Share on iOS.
