AGENTS.md — chioshotel.gr / Voulamandis House

Project context

This repository contains the production website for Voulamandis House:

- Framework: Next.js
- Hosting: Vercel
- Main branch: "main"
- Development environment: Windows, Visual Studio Code, PowerShell
- Production website: "chioshotel.gr"
- Supported languages: "en", "el", "de", "fr", "it", "es", "tr"

Voulamandis House is a rooms and apartments rental business in Chios. It must not be described as a hotel, except where the word is used carefully as a generic search term without misleading users.

---

Mandatory first step

Before editing any file:

1. Read this entire "AGENTS.md".
2. Inspect "git status".
3. Read all files directly related to the requested task.
4. Read existing project documentation relevant to the task.
5. For CSS or Tailwind work, always read:

docs/css-tailwind-migration-state.json

Treat that file as the source of truth for the Tailwind migration status.

Do not begin editing before understanding the current implementation.

---

General safety rules

- Make the smallest possible change.
- Do not change unrelated files.
- Do not perform broad refactoring unless explicitly requested.
- Do not reformat entire files unnecessarily.
- Do not rename files, components, variables, routes, CSS classes, or folders unless explicitly requested.
- Do not install or remove packages unless explicitly requested.
- Do not change dependencies casually.
- Do not change environment variables.
- Do not expose secrets, API keys, tokens, or private configuration.
- Do not commit, push, merge, deploy, or modify Git history unless explicitly requested.
- Never run destructive Git commands without explicit approval.
- Never use "git reset --hard", "git clean -fd", force push, or delete uncommitted work.
- Never overwrite working code only to simplify implementation.
- Preserve all existing functionality unless the user specifically requests otherwise.

---

Required work process

For every task:

1. Explain briefly what you found.
2. State exactly which files need to change.
3. Describe the intended change before editing.
4. Modify only the necessary files.
5. Show a clear summary of the diff.
6. Run the relevant validation commands.
7. Report errors honestly.
8. Stop after completing the requested task.

Do not continue automatically into related improvements.

Do not make additional “helpful” changes unless explicitly requested.

---

Build and validation

After every meaningful code or styling change, run:

npm.cmd run build

Where relevant, also run:

npm.cmd run lint

If the project has a separate type-check command, run it as well.

If the build fails:

- Stop immediately.
- Do not make unrelated experimental changes.
- Report the exact error.
- Identify the likely cause.
- Propose the smallest correction.

Do not claim that a change is complete if the build has not passed.

---

Visual validation

A successful build does not prove that the design is correct.

For visible UI changes:

1. Run the development server when appropriate.
2. Tell the user exactly which page and viewport should be checked.
3. Do not delete old CSS until visual confirmation has been completed.
4. Check desktop and mobile behavior.
5. Check hover, focus, active, and responsive states.
6. Check that text remains readable in all supported languages.

Do not claim visual equivalence unless it has been reviewed.

---

Tailwind CSS migration rules

Tailwind migration must be gradual and conservative.

Mandatory rules

- Work on only one isolated page at a time.
- Work on only one small section at a time.
- Never migrate multiple landing pages in one task.
- Never begin with the homepage, header, footer, booking engine, or shared global components unless explicitly requested.
- Do not change CSS import order without a specific, documented reason.
- Keep:

@import "tailwindcss";

in the required position.

- Keep "overrides.css" near the end of the import order because it intentionally wins the cascade.
- Do not remove scoped CSS before the Tailwind replacement passes build and visual review.
- Do not replace working custom design with generic Tailwind or shadcn defaults.
- Preserve the warm, premium visual identity of Voulamandis House.
- Preserve spacing, typography, breakpoints, shadows, borders, animations, and interaction states unless a redesign is explicitly requested.
- Do not invent new design patterns during migration.
- Do not introduce Tailwind classes into unrelated components.
- Do not migrate global styles merely because they look unused.

Required Tailwind migration workflow

For each migrated section:

1. Read the component.
2. Read its related CSS file.
3. Identify every selector used by the target section.
4. Identify responsive rules and cascade dependencies.
5. Convert only the selected section.
6. Keep the old CSS temporarily.
7. Run:

npm.cmd run build

8. Run the site locally.
9. Request visual review.
10. Confirm that the old selectors are no longer used.
11. Remove only CSS proven to be unused.
12. Run the build again.
13. Update:

docs/css-tailwind-migration-state.json

14. Stop. Do not migrate another section automatically.

---

CSS rules

- Do not delete CSS based only on a text search.
- Check dynamic class names, conditional classes, template strings, shared components, and translated routes.
- Do not move CSS blocks casually.
- Do not merge CSS files unless explicitly requested.
- Preserve the existing cascade.
- Preserve media-query behavior.
- Preserve mobile-specific overrides.
- Avoid excessive use of "!important".
- If "!important" is already needed because of legacy cascade behavior, document why.
- Do not introduce duplicate styles.
- Do not create large unreadable Tailwind class strings when a reusable constant or component would be clearer.
- Do not create abstractions prematurely.

---

Next.js rules

- Preserve the existing App Router structure.
- Do not convert server components to client components unless required.
- Do not add ""use client"" casually.
- Avoid increasing client-side JavaScript.
- Preserve metadata, canonical URLs, hreflang, sitemap, robots, structured data, and localization behavior.
- Do not change route paths unless explicitly requested.
- Do not change image behavior without checking performance and layout.
- Prefer "next/image" where appropriate, but do not rewrite working image components without a clear benefit.
- Do not suppress TypeScript errors.
- Do not use "ignoreBuildErrors".
- Do not disable ESLint rules merely to pass the build.
- Do not modify "next-env.d.ts" manually.

Generated ".next" files are not source files and must not be committed.

---

Multilingual rules

The website supports:

en
el
de
fr
it
es
tr

For any content, routing, metadata, component, or SEO change:

- Check all seven languages.
- Do not assume that a change in one language automatically applies correctly to all languages.
- Preserve translations.
- Do not translate text automatically unless explicitly requested.
- Do not replace localized text with English placeholders.
- Check longer translated strings for layout overflow.
- Preserve language-specific canonical and hreflang behavior.

Greek spelling and terminology must be preserved carefully.

When referring to the Chios region “Κάμπος”, use the correct Greek spelling:

Κάμπος

Do not change it to an incorrect spelling.

---

SEO rules

For SEO-related work, check:

- title
- meta description
- canonical URL
- hreflang
- Open Graph
- Twitter metadata
- robots directives
- sitemap inclusion
- structured data
- internal links
- headings
- image alt text
- localized metadata

Do not describe Voulamandis House as a hotel.

Acceptable wording includes:

- rooms and apartments
- accommodation
- guest accommodation
- rental rooms
- apartments in Chios
- rooms in Kampos, Chios

The word “hotel” may only be used carefully as a supporting search phrase where it does not falsely describe the business.

Do not keyword-stuff content or metadata.

---

Accessibility rules

For UI changes, preserve or improve:

- semantic HTML
- keyboard navigation
- focus visibility
- form labels
- button names
- link purpose
- image alt text
- color contrast
- heading order
- ARIA usage
- reduced-motion behavior

Do not add ARIA attributes when native semantic HTML already provides the correct behavior.

---

Performance rules

Avoid changes that increase:

- JavaScript bundle size
- unused CSS
- client components
- hydration work
- third-party scripts
- layout shift
- image payload
- font payload
- duplicate dependencies

Do not install a UI library for a single simple component.

Before adding a dependency, explain:

1. Why it is needed.
2. Its impact on bundle size.
3. Why the same result cannot be achieved with the existing stack.

---

shadcn/ui rules

Use shadcn/ui only when it provides a clear benefit.

- Do not convert the entire interface to shadcn/ui.
- Do not make the website look like a generic SaaS template.
- Preserve the Voulamandis House design language.
- Prefer custom components where the design is unique.
- Avoid adding unnecessary components or dependencies.

Possible custom components may include:

VhButton
VhCard
VhSection
VhBadge
VhRoomCard
VhInfoPanel
VhAccordion
VhBookingCTA

Create them only when there is genuine reuse.

---

Audit mode

When the user asks for an audit:

- Do not change files unless explicitly requested.
- Inspect first.
- Produce a report grouped into:
  - Critical
  - Important
  - Recommended
  - Optional
- For every finding include:
  - file
  - location
  - problem
  - impact
  - recommended fix
  - risk level
- Separate verified findings from assumptions.
- Do not exaggerate.
- Do not claim a problem exists without evidence.
- Do not fix findings automatically unless explicitly requested.

---

Commands and PowerShell

The user works in Windows PowerShell.

Prefer commands compatible with PowerShell.

Use:

npm.cmd
npx.cmd

when this avoids PowerShell execution-policy issues.

Commands must be:

- copy-paste ready
- non-destructive
- clearly ordered
- limited to the current task

Do not provide Bash-only commands unless explicitly requested.

---

Git rules

Before editing, inspect:

git status --short

After editing, show:

git diff --stat
git diff --name-only

Do not commit automatically.

Do not include unrelated modified files in a proposed commit.

Do not modify or discard existing uncommitted work.

If the working tree is not clean, explain which changes already existed before proceeding.

---

Final response requirements

After completing a task, report:

1. What changed.
2. Which files changed.
3. Which checks ran.
4. Whether the build passed.
5. Any remaining risk.
6. The exact next safe step.

Never say a task is fully complete when validation or visual review is still pending.
