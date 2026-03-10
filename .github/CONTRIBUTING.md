# Contributing to Dua Finder

First off — **JazakAllahu Khayran** for taking the time to contribute! 🌙

Every contribution, no matter how small, helps make this tool more useful for the Ummah. This document outlines how to get involved.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Ways to Contribute](#ways-to-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Commit Message Convention](#commit-message-convention)
- [Style Guide](#style-guide)

---

## Code of Conduct

This project follows a simple principle: **be kind and respectful**. We welcome contributors of all backgrounds and skill levels. Harassment, discrimination, or disrespectful behaviour will not be tolerated.

---

## Ways to Contribute

You don't have to write code to contribute:

- 🐛 **Report bugs** — [open an issue](https://github.com/your-username/dua/issues)
- 💡 **Suggest features** — share your ideas in [Discussions](https://github.com/your-username/dua/discussions)
- 🌍 **Translate** — help localise the UI (Urdu, Arabic, French, Bengali…)
- 📖 **Improve docs** — fix typos, clarify instructions, add examples
- 🎨 **Design** — improve the UI/UX or create better icons
- 🧪 **Write tests** — help increase test coverage
- 💻 **Write code** — pick up an open issue or implement a new feature

---

## Development Setup

```bash
# Fork the repo, then clone your fork
git clone https://github.com/<your-username>/dua.git
cd dua

# Install dependencies (requires pnpm)
pnpm install

# Copy and fill in environment variables
cp .env.example .env.local

# Start the dev server
pnpm dev
```

### Useful commands

| Command | Description |
|---|---|
| `pnpm dev` | Start development server at `localhost:3000` |
| `pnpm build` | Production build |
| `pnpm lint` | Run ESLint |
| `pnpm lint --fix` | Auto-fix lint issues |

---

## Pull Request Process

1. **Branch** off `main`: `git checkout -b feat/my-feature` or `fix/bug-description`
2. **Make your changes** — keep the scope focused and the diff small
3. **Lint** your code: `pnpm lint`
4. **Test** manually in the browser, including mobile viewport
5. **Commit** with a clear message (see below)
6. **Push** and open a PR against `main`
7. Fill in the PR template — describe *what* you changed and *why*
8. Wait for review — be open to feedback; we're all here to learn

> **Note:** PRs that break the build or introduce lint errors will not be merged until fixed.

---

## Commit Message Convention

We loosely follow [Conventional Commits](https://www.conventionalcommits.org):

```
<type>: <short description>

[optional body]
```

| Type | When to use |
|---|---|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation only changes |
| `style` | Formatting, no logic change |
| `refactor` | Code change that is neither a fix nor a feature |
| `perf` | Performance improvement |
| `chore` | Build process, dependency updates |

**Examples:**
```
feat: add Urdu translation support
fix: correct audio cache key collision on duplicate duas
docs: add environment variable table to README
```

---

## Style Guide

- **TypeScript** — strict mode is on; avoid `any`
- **Components** — one component per file, named exports preferred for pages
- **CSS** — Tailwind utility classes only; avoid inline styles
- **Accessibility** — add `aria-label` / `aria-describedby` where elements lack visible text
- **File naming** — PascalCase for components (`DuaCard.tsx`), camelCase for utilities (`audioCache.ts`)
- **Imports** — use the `@/` alias for `src/` paths

---

## Questions?

Open a [Discussion](https://github.com/your-username/dua/discussions) or [issue](https://github.com/your-username/dua/issues) — we're happy to help!
