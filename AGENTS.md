# Repository Guidelines

## Project Structure & Module Organization

The runnable application lives at the repository root. Run project commands from this directory.

- `src/main.tsx` bootstraps the React application.
- `src/App.tsx` defines the page composition: the orange top band (`Header`, `CouponSection`) followed by the page body (`MainLinks`, `PromoFeed`, `YouTubeSection`, `SocialLinks`, `MediaKit`, `Footer`).
- `src/components/` contains the page sections and shared UI such as `CouponSheet` (dialog shell) and `CarouselArrows`.
- `src/styles/` holds the stylesheets, one file per page region (see Styling below). `src/index.css` only imports them.
- `src/lib/` contains framework-free helpers and hooks: `analytics.ts`, `clipboard.ts`, `useCarousel.ts`.
- `src/data/site.ts` centralizes official links and shared types; `src/services/dicasOffers.ts` reads and normalizes the live offers feed.
- `scripts/sync-youtube.mjs` generates `public/data/youtube.json` during `npm run dev` and `npm run build`.
- `public/images/` stores static images referenced with root-relative URLs such as `/images/avatar-small.jpg`.
- `backup_alternativo_codex/app/` preserves the independent Codex prototype for visual and architectural comparison; do not mix its dependencies or source files into the main app unintentionally.
- Root-level Markdown files contain project notes and review material.

Do not commit generated `dist/` output or `node_modules/`.

## Build, Test, and Development Commands

From the repository root:

- `npm install` installs the locked dependencies.
- `npm run dev` starts the Vite development server with hot reload.
- `npm run build` runs TypeScript project checks and creates the production bundle in `dist/`.
- `npm run lint` checks TypeScript and React code with ESLint.
- `npm run preview` serves the production build locally for final verification. Add `-- --host` to open it on a phone on the same network.

Before submitting changes, run `npm run lint` and `npm run build`.

## Coding Style & Naming Conventions

Use TypeScript and React functional components. Follow the existing style: 2-space indentation, semicolons, single-quoted imports and strings, and trailing commas in multiline objects or argument lists. Name components and their files in PascalCase (`CouponSection.tsx`), hooks with a `use` prefix (`useCarousel`), and utilities in camelCase. Keep feature-specific logic and data near its component; move code to `src/lib/` once two components share it. ESLint configuration is defined in `eslint.config.js`.

## Styling

Styles are plain CSS with semantic class names, organized by page region:

- `src/styles/base.css`: design tokens (CSS custom properties), body defaults, the `.page-column` layout and the global reduced-motion rule.
- `src/styles/top.css`: the orange band, profile header and coupon tickets.
- `src/styles/sheet.css`: the coupon dialogs (`CouponSheet`).
- `src/styles/body.css`: WhatsApp and main links, offer and video carousels.
- `src/styles/closing.css`: social links, media kit and footer.

`src/index.css` imports Tailwind's base, components and utilities around these files; keep that order. Tailwind is used for its reset and a few utilities (`sr-only`, minor spacing in `App.tsx`); prefer a class in the matching region file over utility chains. Use inline styles only for values computed at runtime. Use the tokens (`--laranja`, `--marinho`, `--marinho-suave`, `--papel`, `--nevoa`, `--gema`, `--folha`, `--font-display`, `--font-hand`) instead of raw hex values; literal colors are reserved for hover shades and third-party brand colors such as the Magalu blue.

Design decisions to preserve:

- Coupons come first, and as much of the page as possible should fit the first phone screen (375×812) without scrolling. Prefer compact rows over spacious cards.
- Bricolage Grotesque for all text (condensed widths for codes and prices); Caveat only for short handwritten notes.
- Text on orange is navy, never white (contrast). Keep body text at 13px or larger.
- Motion is limited to the ticket entrance, the copy stamp, the periodic breathing loop in `App.tsx` and the media kit count-up. Every animation must be skipped under `prefers-reduced-motion`.

## Testing Guidelines

No automated test framework is currently configured. Treat successful lint and production builds as the minimum quality gate. Manually verify affected interactions in `npm run preview` at 320, 360 and 375px widths, including links, coupon copy, dialogs (focus and Esc), carousels, animations and browser console errors. Some embedded browsers report reduced motion, which hides every animation; confirm motion on a real phone. If tests are introduced, place them beside the source as `*.test.ts` or `*.test.tsx` and add the corresponding `npm test` script.

## Deployment

`.github/workflows/sync-youtube-deploy.yml` syncs YouTube videos, builds and deploys `dist/` to Hostinger on Tuesdays, Thursdays and Saturdays, and on manual runs (`gh workflow run sync-youtube-deploy.yml --ref main`). Changes reach production only after they are on `main` and the workflow runs. See `docs/AUTOMACAO-YOUTUBE.md` for secrets and the inactivity safeguard.

## Commit & Pull Request Guidelines

Use short, imperative commit subjects with a Conventional Commit prefix, for example `fix: preserve coupon card spacing`. Keep commits focused.

Pull requests should explain the user-visible change, list validation performed, and link any related issue. Include before/after screenshots or a short recording for layout, animation, or responsive-design changes.
