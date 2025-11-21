# Podcast Explorer – DJSPP Portfolio Piece

A single-page **Podcast Explorer** application built with **React + Vite** for the DJSPP portfolio. It allows you to browse podcasts from the public API, view seasons and episodes, play audio via a global player, manage favourite episodes, and explore recommended shows.

The app is designed to be deployed as a **client-side SPA** (e.g. on Vercel) with proper routing fallbacks and rich social media previews.

---

## Features

- **Podcast browsing**
  - Fetches podcasts from `https://podcast-api.netlify.app`.
  - Search by title, filter by genre, and sort by date or title.
  - Responsive grid layout with pagination.

- **Show detail view**
  - See full podcast details, cover image, description, and metadata.
  - Browse seasons and episodes, including episode descriptions.
  - Back button to return to the previous page.

- **Global audio player**
  - Persistent bottom audio player shared across the app.
  - Play/pause episodes from show pages or from Favourites.
  - Track information (show image, title, episode) displayed in the player.

- **Favourites**
  - Heart icon on each episode to **add/remove** from favourites.
  - Favourites are **persisted in `localStorage`**.
  - Dedicated **Favourites page**:
    - Grouped by show with counts.
    - Sorting (Newest/Oldest added, Title A–Z/Z–A).
    - Filter by show or view "All Shows".
    - Per-episode play button that uses the global audio player.
    - Back link to the home page.

- **Recommended Shows carousel**
  - Horizontal carousel on the Home page.
  - Shows a selection of **recently updated** podcasts as "Recommended".
  - Uses the same `PodcastCard` design as the main grid.

- **Theme toggle (light/dark)**
  - Theme toggle button in the header.
  - Theme stored in context and persisted via `localStorage`.
  - Uses CSS variables for theme-aware colours.

- **Accessibility & UX details**
  - Clear visual hierarchy on Favourites and Home.
  - Heart icons are consistently red in all themes.
  - Back navigation and clear empty states.

---

## Tech Stack

- **Framework**: React 19 + React Router DOM 7
- **Build tool**: Vite 7
- **Styling**: CSS Modules with theme-aware CSS variables
- **State management**: React Context API
  - `PodcastContext` – podcast data, filters, pagination
  - `AudioPlayerContext` – global audio player state & controls
  - `FavouritesContext` – favourites list & persistence
  - `ThemeContext` – light/dark theme
- **Tooling**: ESLint 9

---

## Getting Started

### Prerequisites

- Node.js **18+** (or current LTS)
- npm (comes with Node)

### Install dependencies

```bash
npm install
```

### Run the app in development

```bash
npm run dev
```

Then open the URL Vite prints in the console (typically `http://localhost:5173`).

### Lint the code

```bash
npm run lint
```

### Build for production

```bash
npm run build
```

### Preview the production build locally

```bash
npm run preview
```

This serves the built app so you can test routing and behaviour before deploying.

---

## Project Structure (High Level)

```text
src/
  api/
    fetchPata.js           # Fetch podcasts from the API
  components/
    Filters/               # SearchBar, SortSelect, GenreFilter
    Podcasts/
      PodcastCard.jsx
      PodcastGrid.jsx
      PodcastDetail.jsx
      RecommendedCarousel.jsx
    UI/
      Header.jsx
      GlobalAudioPlayer.jsx
      GenreTags.jsx
  context/
    PodcastContext.jsx
    AudioPlayerContext.jsx
    FavouritesContext.jsx
    ThemeContext.jsx
  pages/
    Home.jsx
    ShowDetail.jsx
    Favourites.jsx
  utils/
    formatDate.js
  data.js                  # Static genre metadata

index.html                 # App shell & social meta tags
vite.config.js             # Vite configuration
vercel.json                # SPA routing config for Vercel
```

---

## Core Features in More Detail

### Home Page

- Search, genre filter, and sort controls across the top.
- `PodcastGrid` renders a paginated list of podcasts from `PodcastContext`.
- `Pagination` handles page changes.
- `RecommendedCarousel` shows a horizontal list of recently updated shows.

### Show Detail Page

- `PodcastDetail` displays:
  - Podcast cover, title, description, and metadata (genres, last updated, totals).
  - Season selector with season image and description.
  - Episode list cards with description.
- Per-episode actions:
  - **Play/Pause** – uses `AudioPlayerContext` and updates the global audio player.
  - **Favourite** – heart toggle integrated with `FavouritesContext`.
- A Back button navigates to the previous page.

### Global Audio Player

- `AudioPlayerContext` exposes `playEpisode`, `pause`, `resume`, and track state.
- `GlobalAudioPlayer` is rendered once in `App.jsx`, below the routed pages.
- Remains visible and active across navigation.

### Favourites

- `FavouritesContext` stores favourite episodes with rich metadata:
  - Show/season/episode identifiers
  - Title, description, image, audio URL
  - Timestamp when the favourite was added
- Favourites are persisted to `localStorage` so they survive reloads.

#### Favourites Page

- Accessible via the heart icon in the header.
- Groups favourites by show and displays:
  - Show name and number of saved episodes
  - For each episode: cover image, title, season/episode numbers, description, added date
  - Heart button to remove from favourites
  - Play/Pause button wired to the global audio player
- Includes:
  - Sort dropdown (Newest/Oldest added, Title A–Z/Z–A)
  - Show filter dropdown (All shows or a specific show)
  - Back link to the home page.

### Theme Toggle

- `ThemeContext` tracks `light`/`dark` theme and persists it via `localStorage`.
- Toggle button in the header switches theme.
- Global CSS variables in `index.css` define colours per theme.

---

## Deployment to Vercel

This project is designed to be deployed as a **static Vite SPA** on Vercel.

### 1. Ensure SPA routing is configured

The root contains a `vercel.json` that configures a **catch‑all rewrite** to `index.html`:

- Every route (e.g. `/show/1`, `/favourites`, etc.) is served `index.html`.
- React Router then takes over and renders the correct page client-side.

This prevents Vercel from showing a 404/fallback page when you refresh a dynamic route.

### 2. Connect the repo and deploy

1. Push your code to a Git provider (GitHub, GitLab, Bitbucket).
2. In the Vercel dashboard, **Import Project** and select this repo.
3. Framework preset: **Vite** (should be auto-detected).
4. Build command: `npm run build` (default for Vite).
5. Output directory: `dist` (default for Vite).
6. Deploy.

After deployment, test:

- Visit `/` – app should load.
- Navigate to a show detail (e.g. `/show/1`), then refresh the page.
  - You should still see the show detail, not a Vercel 404.
- Try `/favourites` and other routes similarly.

### 3. Social media preview metadata

The file `index.html` includes **Open Graph** and **Twitter Card** meta tags so links to your site display a rich preview.

Update these values to match your deployment:

- `og:url` – set to your deployed URL, e.g. `https://robitiii-robkan-25122-pto2502-a-a1-delta.vercel.app/`.
- `og:image` / `twitter:image` – set to an absolute URL of a social preview image.
- `description` fields – adjust wording if desired.

You can validate your meta tags using tools like **metatags.io** or each platform’s own debugger.

---

## Development Notes

- Uses modern React and React Router DOM.
- CSS Modules keep styles local to each component/page.
- Core state is centralized in small, focused contexts to keep prop‑drilling minimal.
- `localStorage` is used only for non-sensitive persistence (theme, favourites).
