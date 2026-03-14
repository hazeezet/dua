<div align="center">

# 🌙 Dua Generator

**An AI-powered Islamic supplication generator - every moment you need to reach Allah.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38BDF8?logo=tailwindcss)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](.github/CONTRIBUTING.md)

</div>

---

## ✨ What is Dua Finder?

Dua Finder is a free, open-source Progressive Web App (PWA) that helps Muslims find authentic Islamic supplications (duas) tailored to their specific needs. Just describe your situation in plain language - the app uses AI to surface relevant duas with Arabic text, transliteration, translation, source reference, and audio recitation.

Built with love for the last 10 nights of Ramadan, it works offline, installs on any device, and is completely free.

---

## 🚀 Features

- 🔍 **Natural-language search** - describe your need; get relevant duas instantly
- ⚡ **Real-time streaming** - results stream in as the AI generates them (SSE)
- 🕌 **Full Arabic text** with transliteration and English translation
- 📖 **Source references** - every dua cites its Qur'anic verse or hadith
- 🔊 **Audio recitation** - listen to each dua with a single tap
- 🔖 **Bookmarks** - save duas with optional personal notes, persisted locally
- 📚 **Dua Guides** - curated articles on the etiquette and virtues of supplication
- 🌙 **Ramadan Night Tracker** - live Hijri calendar with a last-10-nights progress grid
- 📲 **Progressive Web App** - installable on iOS & Android, works fully offline
- 📋 **Copy & Share** - share any dua in one tap via the native share sheet
- 🌐 **Offline-first** - service worker caches assets; saved audio persists across sessions

---

## 🖥️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org) (App Router) |
| UI Library | [React 19](https://react.dev) |
| Language | [TypeScript 5](https://www.typescriptlang.org) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com) |
| Data Fetching | [TanStack Query v5](https://tanstack.com/query) |
| Icons | [Lucide React](https://lucide.dev) |
| Package Manager | [pnpm](https://pnpm.io) |
| Backend | Rust · AWS Lambda ([dua-backend](https://github.com/hazeezet/dua-backend)) |

---

## 🏁 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) ≥ 20
- [pnpm](https://pnpm.io) ≥ 9

```bash
npm install -g pnpm
```

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/your-username/dua.git
cd dua

# 2. Install dependencies
pnpm install

# 3. (Optional) connect the backend
cp .env.example .env.local
# Fill in DUA_API_URL and AUDIO_API_URL — or leave blank for mock mode

# 4. Start the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> **No backend? No problem.** If `DUA_API_URL` is not set, the app automatically
> switches to **mock mode**: `/api/dua/generate` streams from the 20 built-in duas
> in `src/lib/mockData.ts`, so you can explore the full UI without any backend.

### Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DUA_API_URL` | No | Base URL of the Rust/Lambda dua-backend API. Omit to use mock mode. |
| `AUDIO_API_URL` | No | Base URL of the audio generation API. Omit to disable audio in dev. |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Home / search page
│   ├── layout.tsx            # Root layout & metadata
│   ├── providers.tsx         # React Query & context providers
│   ├── guides/               # Dua Guides listing & detail pages
│   ├── saved/                # Bookmarked duas page
│   └── api/                  # Next.js API routes (proxy / Hijri date)
├── components/
│   ├── DuaCard.tsx           # Individual dua display card
│   ├── AudioPlayer.tsx       # Audio playback with caching
│   ├── BookmarkPanel.tsx     # Sliding bookmark drawer
│   ├── NightTracker.tsx      # Ramadan last-10-nights tracker
│   ├── SearchBar.tsx         # Search input
│   ├── SuggestedChips.tsx    # Quick-search suggestion chips
│   ├── Sidebar.tsx           # Navigation sidebar
│   └── Header.tsx            # Top navigation bar
└── lib/
    ├── types.ts              # Shared TypeScript interfaces
    ├── api.ts                # API client helpers
    ├── sseParser.ts          # Server-Sent Events streaming parser
    ├── audioCache.ts         # IndexedDB audio blob cache
    ├── BookmarkContext.tsx   # Bookmark state & localStorage persistence
    ├── hijriDate.ts          # Hijri date calculation
    └── useOnlineStatus.ts    # Network status hook
```

---

## 🤝 Contributing

Contributions are what make open-source projects special. All contributions are welcome - from bug fixes and new duas to UI improvements and translations.

### How to contribute

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feat/your-feature`
3. **Commit** your changes: `git commit -m "feat: add amazing feature"`
4. **Push** to your branch: `git push origin feat/your-feature`
5. **Open a Pull Request** - describe what you changed and why

### Guidelines

- Follow the existing code style (ESLint + TypeScript strict mode)
- Keep components small and focused
- Prefer accessibility - add `aria-*` attributes where relevant
- If you add a new route or component, update this README
- Commit messages loosely follow [Conventional Commits](https://www.conventionalcommits.org)
See [.github/CONTRIBUTING.md](.github/CONTRIBUTING.md) for the full contributor guide.
### Ideas for contributions

- 🌍 Add more language translations (Urdu, Arabic, French, etc.)
- 🎨 New themes / dark-mode refinements
- 🗂️ Additional dua categories and guides
- ♿ Accessibility improvements
- 🧪 Unit & integration tests
- 📱 Better mobile UX / gestures

### Reporting bugs

Please [open an issue](https://github.com/your-username/dua/issues) with:
- A clear title and description
- Steps to reproduce
- Expected vs actual behaviour
- Screenshots if applicable

---

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

You are free to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of this software. Attribution is appreciated but not required.

---

## 🙏 Acknowledgements

- The Muslim Ummah - may Allah accept our duas in the blessed nights
- [Gemini](https://deepmind.google/technologies/gemini/) - AI model powering the supplication search
- [Aladhan API](https://aladhan.com/prayer-times-api) - Hijri date calculation
- [Amiri Font](https://www.amirifont.org/) - Beautiful Arabic typeface
- All open-source libraries listed in [`package.json`](package.json)

---

<div align="center">
<sub>Made with ❤️ for the Ummah · <a href="LICENSE">MIT License</a> · Contributions welcome</sub>
</div>
