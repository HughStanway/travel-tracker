# Travel Tracker ✈️

A modern, lightweight, stateless frontend web application that takes markdown travel itineraries and transforms them into an interactive travel companion website.

Built with **Vite + React + TypeScript + Tailwind CSS**, served via an ultra-lightweight **Nginx** container in a single Docker image, and configured for automated build and rollout via the **Brewery** platform.

---

## 🌟 Key Features

- **100% Stateless & Fast**: Zero backend or database required. Entire site is compiled directly into static assets served via Nginx Alpine (~25MB total image size).
- **Dynamic Build Pipeline**: Automatically discovers and compiles all itineraries from the `itinery/` directory during Docker build.
- **Multi-File Travel Plans**: Supports multiple `.md` files per trip (e.g. `activities.md`, `dining.md`, `tips.md`) with tabbed sub-document navigation.
- **Interactive Checklists**: Check off places as you visit them. Progress and check states persist across sessions in `localStorage`.
- **One-Click Google Maps Integration**: Quick-launch button for every spot to directly view directions, photos, and reviews on Google Maps.
- **Dual View Modes**:
  - **Interactive Cards**: Clean cards with checklist toggling, quick search, area filters, and copy actions.
  - **Markdown Document View**: Beautiful typography reader mode for the full guide.
- **Instant Search & Area Filtering**: Filter spots by neighborhood/section and search by name or description in real-time.
- **Print / PDF Friendly**: Clean `@media print` layout to print or save your travel itinerary offline before your flight.
- **Dark Mode Support**: Seamless toggle between light and dark themes with system preference detection.

---

## 📂 Itinerary Directory Structure (`itinery/`)

Travel plans are located in the `itinery/` directory. Each plan can be a folder containing one or more `.md` files:

```text
itinery/
├── new-york/
│   ├── new-york.md        # Activities and landmarks
│   └── dining-and-tips.md # Food spots and transit tips (multi-file support)
└── tokyo/
    └── tokyo-itinerary.md # Tokyo exploration
```

### Markdown Formatting Syntax

The parser intelligently handles:
- **H1 Header (`# Title`)**: Sets the document or section title.
- **H2/H3 Section Headers (`## Neighborhood`)**: Groups places into sections/pages.
- **Bullet Points (`- Spot Name: Description`)**: Creates an interactive travel spot card with one-click Maps search.
  - Example: `- One World Trade Center: Landmark skyscraper near 9/11 memorial.`
- **Checklist items (`- [ ] Spot Name`)**: Standard markdown checklists also supported.

---

## 🚀 Brewery Deployment (`build.yaml` & `deployment.yaml`)

This project is configured out of the box for Brewery:

- **`build.yaml`**: Instructs Brewery's build engine to run the build and publish the container image to `registry:5000/travel-tracker:<version>`.
- **`deployment.yaml`**: Defines the deployment stack (`travel-tracker`), mapping port `8085:80` with automated health checks.

```bash
# Brewery Build Specification
metadata:
  name: "travel-tracker"
build:
  image: "node:20-alpine"
artifacts:
  - name: "travel-tracker"
    type: "docker-image"
    pattern: "Dockerfile"
```

---

## 🛠️ Local Development & Manual Build

### Running Locally
```bash
# Install dependencies
npm install

# Run dev server with hot reload
npm run dev
```

### Building the Single Docker Image
```bash
# Build the container
docker build -t travel-tracker:latest .

# Run container locally
docker run -d -p 8085:80 --name travel-tracker travel-tracker:latest

# Open in browser: http://localhost:8085/
```
