# 🎨 Tldraw Canvas — Infinite Whiteboard & Diagram Studio (PWA)

[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.1-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Tldraw SDK](https://img.shields.io/badge/Tldraw_SDK-v5.4-FF8000?style=flat-square)](https://tldraw.dev/)
[![PWA Ready](https://img.shields.io/badge/PWA-Installable-10B981?style=flat-square&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

An infinite whiteboard and diagramming web application built with **React 19**, **TypeScript**, and the official **Tldraw SDK (v5)**. Features a high-density professional UI, pre-built engineering diagram templates, multi-format export/import capabilities, and a full **Progressive Web App (PWA)** offline architecture.

---

## 🌟 Key Features

- ♾️ **Infinite Canvas Whiteboard**: Boundless workspace with sub-pixel precision pan, zoom, grid alignment, and snap-to-geometry powered by `@tldraw/tldraw`.
- 🛠️ **Complete Drawing Suite**:
  - **Selection & Navigation**: Select pointer, Hand pan tool, Laser pointer, and Zoom controls.
  - **Drawing & Ink**: Freehand pen/pencil with dynamic pressure sensitivity and highlighter.
  - **Shapes**: Rectangles, Ellipses, Triangles, Diamonds, Stars, Arrows, and Lines with customizable fills, stroke styles, and color palettes.
  - **Annotation**: Rich text labels, sticky notes, and container frames.
  - **Media**: Local image and vector asset insertion.
- 📐 **Pre-built Template Library**:
  - 🔄 **Process Flowchart**: Decision trees with start/end terminals, action cards, condition diamonds, and connecting arrows.
  - 📋 **Sprint Kanban Board**: Multi-column board (To Do, In Progress, Done) pre-populated with task sticky notes.
  - ☁️ **Cloud Architecture Diagram**: Microservices layout featuring API Gateway, client tier, app services, database, and Redis cache.
  - 🧠 **Mind Map / Brainstorming**: Central strategy hub with radiating concept branches and design annotations.
  - 📱 **Mobile UI Wireframe**: Mobile device frame with header, hero banner, content cards, and action buttons.
- 💾 **Export & Import Engine**:
  - **Export as PNG**: High-resolution bitmap snapshot of selected shapes or the entire canvas.
  - **Export as SVG**: Scalable vector format ideal for documentation and presentations.
  - **Export as JSON / .tldr**: Full snapshot backup of board state and shapes.
  - **Import / Restore**: One-click file picker supporting `.tldr` and `.json` restoration.
- 📱 **Full PWA & Offline Support**:
  - **Installable**: One-click installation on Desktop (Chrome, Edge, Brave) and Mobile (Android, iOS).
  - **Offline First**: Service Worker precaches all application bundles, assets, and Google Web Fonts.
  - **Standalone Display**: Launches in a native borderless window without URL bar distractions.
  - **Status Awareness**: Real-time network detection with a discreet offline indicator banner.
- ⚡ **High-Density Engineering UI**:
  - Compact 48px header with inline project renaming and auto-save indicators.
  - Live bottom status bar tracking shape count, selection count, zoom level, and live connectivity.
  - Zen mode (full-screen drawing mode) with minimal floating telemetry.
  - Dark / Light mode toggle and full keyboard shortcut cheat sheet.

---

## 🚀 Quick Start (Local Setup)

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm** (or **pnpm** / **bun**)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/<your-username>/<your-repo-name>.git
   cd <your-repo-name>
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Build for production**:
   ```bash
   npm run build
   ```
   Generates optimized production assets in the `dist/` folder along with the generated PWA service worker and manifest.

5. **Preview production build**:
   ```bash
   npm run preview
   ```

6. **Run TypeScript linter**:
   ```bash
   npm run lint
   ```

---

## 📂 Project Structure

```
├── public/                     # Static assets & PWA manifest icons
│   ├── favicon.ico             # App favicon
│   ├── icon.svg                # Vector app logo
│   ├── apple-touch-icon.png    # iOS Safari home screen icon (180x180)
│   ├── pwa-192x192.png         # Standard Android / Chrome icon
│   ├── pwa-512x512.png         # High-resolution splash icon
│   └── pwa-maskable-512x512.png# Maskable icon (safe-zone padded)
├── scripts/
│   └── generate-icons.js       # Node.js script generating PWA icon assets via Sharp
├── src/
│   ├── components/             # Reusable UI components
│   │   ├── CanvasStats.tsx     # Floating canvas metrics pill (Zen mode)
│   │   ├── ClearConfirmModal.tsx # Safe board reset dialog with undo warning
│   │   ├── Header.tsx          # High-density header with templates, tools & export
│   │   ├── OfflineIndicator.tsx# Live offline status toast
│   │   ├── PWAInstallButton.tsx# Multi-platform PWA install prompt & guide modal
│   │   ├── ShortcutsModal.tsx  # Keyboard shortcuts reference dialog
│   │   └── Toast.tsx           # Floating feedback notification system
│   ├── hooks/                  # Custom React hooks
│   │   ├── useOnlineStatus.ts  # Browser online/offline event listener
│   │   └── usePWAInstall.ts    # beforeinstallprompt & standalone detection
│   ├── templates/
│   │   └── canvasTemplates.ts  # Pre-built board blueprints (Flowcharts, Kanban, etc.)
│   ├── App.tsx                 # Main application layout & Tldraw integration
│   ├── main.tsx                # React root & PWA Service Worker registration
│   ├── types.ts                # TypeScript interfaces & definitions
│   └── index.css               # Tailwind CSS v4 styling entry point
├── index.html                  # HTML5 entry point with PWA meta tags
├── metadata.json               # Platform configuration metadata
├── package.json                # Project dependencies & build scripts
├── tsconfig.json               # TypeScript configuration
└── vite.config.ts              # Vite configuration with Tailwind & VitePWA plugins
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | [React 19](https://react.dev/) | Declarative UI rendering & state management |
| **Language** | [TypeScript 5.8](https://www.typescriptlang.org/) | End-to-end static type safety |
| **Whiteboard Engine**| [Tldraw SDK 5.4](https://tldraw.dev/) | Infinite 2D spatial canvas, shapes, and tools |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Modern utility-first CSS design tokens |
| **Build Tool** | [Vite 6](https://vitejs.dev/) | Ultra-fast HMR and production bundle optimization |
| **Icons** | [Lucide React](https://lucide.dev/) | Clean, accessible vector icons |
| **Animations** | [Motion](https://motion.dev/) | Smooth layout transitions & modals |
| **PWA Engine** | [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) | Service worker generation, caching & Web App Manifest |
| **Asset Generation**| [Sharp](https://sharp.pixelplumbing.com/) | Automated multi-resolution PNG and maskable icon generator |

---

## 📱 Progressive Web App (PWA) Guide

This project is configured as a fully compliant **Progressive Web App**:

### How to Install

- **Desktop (Google Chrome / Microsoft Edge / Brave)**:
  1. Click the green **Install App** button in the header bar, or click the install icon located inside the browser URL address bar.
  2. Confirm the installation prompt. The app will launch in a dedicated desktop window.
- **Android (Chrome)**:
  1. Tap the **Install App** button or open the Chrome menu (⋮) and tap **Add to Home screen** / **Install app**.
- **iPhone / iPad (Safari)**:
  1. Tap the **Share** button in Safari's bottom toolbar.
  2. Scroll down and choose **Add to Home Screen**.
  3. Tap **Add** in the top-right corner.

### Offline Functionality
- All app scripts, CSS, fonts, and icons are precached locally.
- You can create, edit, draw, and structure diagrams even without an active internet connection.
- Local boards remain cached in your browser's persistent storage.

---

## ⌨️ Keyboard Shortcuts Reference

| Shortcut | Action | Description |
| :--- | :--- | :--- |
| `V` / `1` | **Select Tool** | Click or drag to select shapes |
| `H` / `2` | **Hand Tool** | Pan across the infinite canvas |
| `D` / `B` / `3` | **Draw / Pen** | Freehand sketching and writing |
| `E` / `4` | **Eraser** | Erase lines and objects |
| `R` / `5` | **Rectangle** | Draw rectangles and cards |
| `O` / `6` | **Ellipse / Circle** | Draw circles and ovals |
| `A` / `7` | **Arrow** | Draw connected arrows between shapes |
| `L` / `8` | **Line** | Draw straight lines |
| `T` / `9` | **Text** | Place rich text labels |
| `N` / `0` | **Sticky Note** | Create colored sticky notes |
| `F` | **Frame** | Create structural frame containers |
| `Space + Drag` | **Temporary Pan** | Pan the canvas while holding Spacebar |
| `⌘ / Ctrl + Z` | **Undo** | Undo last canvas operation |
| `⌘ / Ctrl + ⇧ + Z` | **Redo** | Redo previous operation |
| `⌘ / Ctrl + A` | **Select All** | Select every shape on the board |
| `⌘ / Ctrl + 0` | **Zoom to Fit** | Center and fit all shapes to screen |
| `⌘ / Ctrl + 1` | **Zoom to 100%** | Reset zoom level to 100% default |
| `Backspace / Del` | **Delete** | Remove selected shapes |

---

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to your GitHub repository.
2. Go to [Vercel](https://vercel.com/) and click **Import Project**.
3. Select your repository. Vercel will automatically detect Vite.
4. Set Build Command: `npm run build` and Output Directory: `dist`.
5. Click **Deploy**.

### Deploy to Netlify

1. Link your repository in [Netlify](https://www.netlify.com/).
2. Set Build Command to `npm run build` and Publish Directory to `dist`.
3. Click **Deploy Site**.

### Deploy with Docker / Cloud Run

A production container can serve the `dist/` directory using an Nginx or static file server:

```dockerfile
# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Serve stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is distributed under the **MIT License**. See `LICENSE` for more information.
