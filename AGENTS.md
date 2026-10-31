# ArkLing Agent Guide

## Project conventions

ArkLing is a Vite + Svelte 5 + TypeScript application. Keep shared styling in `src/app.css`; components should contain markup and behavior, not local `<style>` blocks or inline style declarations. Use Svelte 5 runes already established in the state managers and prefer typed event handlers and explicit error handling.

## File guide

| File | Responsibility |
| --- | --- |
| `package.json` | Scripts and runtime/development dependencies. |
| `vite.config.ts` | Vite base path, Svelte plugin, and browser shims for Kuromoji dependencies. |
| `tsconfig.app.json` / `tsconfig.node.json` | TypeScript settings for application and Vite configuration code. |
| `index.html` | Browser document shell and the `#app` mount target. |
| `src/main.ts` | Application entry point; mounts `App` and imports `app.css`. |
| `src/App.svelte` | Root composition and app layout. |
| `src/app.css` | Global design tokens, all component styles, responsive rules, and animations. |
| `src/components/TopBar.svelte` | Language, learning-mode, menu, and annotation controls. |
| `src/components/MainArea.svelte` | Main page flow, top and bottom story selectors, active reading view, loading state, and navigation helpers. |
| `src/components/StorySelector.svelte` | Story category/chapter/episode selection, episode navigation, and line jumping. |
| `src/components/SideBySideView.svelte` | Target/system parallel line layout. |
| `src/components/FocusedView.svelte` | Target-line reading layout and translation reveal behavior. |
| `src/components/LineItem.svelte` | Reusable line, speaker, annotation, and interactive reveal renderer. |
| `src/lib/constants.ts` | Language metadata, translations, learning modes, and sample fallback lines. |
| `src/lib/state/learningState.svelte.ts` | Shared learning settings, loaded lines, annotation lifecycle, and reveal state. |
| `src/lib/state/storySelectorState.svelte.ts` | Story metadata, selection state, URL-compatible indexes, loading, and episode loading. |
| `src/lib/api/arknights.ts` | GitHub raw-data URLs, fetch helpers, response validation, and caches. |
| `src/lib/parser/scriptParser.ts` | Arknights script sanitization, parsing, and target/system alignment. |
| `src/lib/annotations/index.ts` | Pinyin and Japanese annotation generation, dictionary initialization, and caches. |
| `src/lib/annotations/gunzip-shim.js` | Browser-compatible gzip shim used by Kuromoji dependencies. |
| `src/types/index.ts` | Shared language, story, raw API, and script-line types. |

## External API calls

The only application data APIs are public GitHub raw-content endpoints configured in `src/lib/api/arknights.ts`. The app fetches story metadata from `gamedata/excel/story_review_table.json` and scripts from `gamedata/story/<storyTxt>.txt` for the selected language. Japanese dictionary loading uses the deployed `dict/` directory first and `cdn.jsdelivr.net` as a fallback. The stylesheet imports Google Fonts. Do not add credentials or commit secrets; preserve the existing public-source fallback behavior and surface failures through the existing status/error state.

## Development and validation

1. Run `npm install` after dependency manifest changes.
2. Use `npm run dev` for local browser work.
3. Run `npm run check` after every TypeScript/Svelte change.
4. Run `npm run build` before release-oriented changes.
5. Keep changes focused, preserve existing rendering unless the task explicitly changes UX, and update `TECHNICAL_DOCUMENT.md` when architecture or data flow changes.
6. Do not edit generated output or cache files. Do not commit `.aider.*`, local build output, credentials, or environment-specific files.
7. Prefer small reusable helpers over duplicated component logic. Keep asynchronous operations ordered or guarded against stale results, as annotation and story loading can overlap.
8. For UI changes, verify both desktop and the `768px` responsive breakpoint, including loading, error, empty, and annotation states.
9. Keep comments only where they explain parsing formats, external compatibility shims, fallback behavior, or another non-obvious constraint.
10. Preserve both `StorySelector` instances in `MainArea.svelte`. The bottom selector intentionally provides episode navigation after long reading sessions and should not be removed as duplicate markup.

## Change checklist

- Inspect related state, API, parser, and component code before editing.
- Preserve stable `ScriptLine.id` values and language fallback behavior.
- Run `npm run check`, `npm run build`, and `git diff --check`.
- Review the diff for accidental duplicate markup, obsolete comments, and changes to external URLs. Treat the two `StorySelector` instances as intentional.
