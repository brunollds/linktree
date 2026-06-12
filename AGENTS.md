# Repository Guidelines

## Project Structure & Module Organization

The runnable application lives at the repository root. Run project commands from this directory.

- `src/main.tsx` bootstraps the React application.
- `src/App.tsx` defines the page composition.
- `src/components/` contains the page sections and interactive feature components.
- `src/components/fluid/` contains the WebGL background and shader code.
- `public/images/` stores static images referenced with root-relative URLs such as `/images/avatar.jpg`.
- `backup_alternativo_codex/app/` preserves the independent Codex prototype for visual and architectural comparison; do not mix its dependencies or source files into the main app unintentionally.
- Root-level Markdown files contain project notes and review material.

Do not commit generated `dist/` output or `node_modules/`.

## Build, Test, and Development Commands

From the repository root:

- `npm install` installs the locked dependencies.
- `npm run dev` starts the Vite development server with hot reload.
- `npm run build` runs TypeScript project checks and creates the production bundle in `dist/`.
- `npm run lint` checks TypeScript and React code with ESLint.
- `npm run preview` serves the production build locally for final verification.

Before submitting changes, run `npm run lint` and `npm run build`.

## Coding Style & Naming Conventions

Use TypeScript and React functional components. Follow the existing style: 2-space indentation, semicolons, single-quoted imports and strings, and trailing commas in multiline objects or argument lists. Name components and their files in PascalCase (`CouponSection.tsx`), hooks with a `use-` or `use` prefix, and utilities in camelCase. Keep feature-specific logic near its component and place broadly reusable UI primitives under `src/components/ui/`.

Prefer Tailwind utility classes for layout and visual styling. Use inline styles only for dynamic values or effects that are awkward to express with utilities. ESLint configuration is defined in `eslint.config.js`.

## Testing Guidelines

No automated test framework is currently configured. Treat successful lint and production builds as the minimum quality gate. Manually verify affected interactions in `npm run dev`, including mobile layouts, links, sharing, animations, and browser console errors. If tests are introduced, place them beside the source as `*.test.ts` or `*.test.tsx` and add the corresponding `npm test` script.

## Commit & Pull Request Guidelines

Git history is not available in this workspace. Use short, imperative commit subjects with an optional Conventional Commit prefix, for example `fix: preserve coupon card spacing`. Keep commits focused.

Pull requests should explain the user-visible change, list validation performed, and link any related issue. Include before/after screenshots or a short recording for layout, animation, or responsive-design changes.
