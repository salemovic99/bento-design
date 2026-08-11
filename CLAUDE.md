@AGENTS.md

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Frontend / UI Design

Always use the **ui-ux-pro-max** plugin skills for any frontend or UI design work — do not design UI ad-hoc. Invoke the relevant skill before building or styling any interface:

- `ui-ux-pro-max:ui-ux-pro-max` — general UI/UX design intelligence (styles, palettes, font pairings, UX guidelines)
- `ui-ux-pro-max:design` — logos, brand identity, design systems, banners, icons, slides, social graphics
- `ui-ux-pro-max:ui-styling` — shadcn/ui + Tailwind components, themes, responsive layouts
- `ui-ux-pro-max:design-system` — design tokens and component specifications
- `ui-ux-pro-max:banner-design` / `ui-ux-pro-max:slides` / `ui-ux-pro-max:brand` — specialized tasks


### Do NOT touch other services
- NEVER stop, restart, merge with, or interfere with any service, container, or process outside this project.
- NEVER modify configuration files, databases, or resources belonging to other projects on this machine.
- This project is fully isolated — keep it that way.

### Do NOT use occupied ports
- Before exposing any port, always check which ports are already in use (`ss -tlnp`).
- NEVER bind to a port that is already occupied by another service.

## Workflow

- **Do NOT run this app.** Never start, serve, or launch it.
- **After each change:** build the project, then create a commit with a short commit message.


## Always Do After Writing Code
- **For any frontend task**, run typecheck and lint before considering the task done, and fix any issues they report:
  - Typecheck: `cd frontend && npx tsc --noEmit`
  - Lint: `cd frontend && npm run lint`
- **Provide a commit message** after finishing a task. Keep it short and only print it as text — do NOT run git, commit, stage, or take any other action.
