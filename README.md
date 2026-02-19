
# FRYVERSE 🍟

FRYVERSE is a playful React + GSAP web experience where users explore fry “personalities” and build a custom fry box (cut, seasoning, sauce) with smooth animations, Lottie visuals, and a mini-game that can unlock discounts.

## Features
- Interactive fry menu + detail pages (origin story, specs, pairings)
- “Build a Box” flow (cut → seasoning → sauce)
- Smooth transitions and micro-interactions (GSAP)
- Lottie hero animation
- “Play & Save” mini-game (Catch the Fries) to earn a discount (demo logic)

## Tech Stack
- React
- Vite
- Tailwind CSS
- GSAP
- Lottie (JSON)

## Getting Started

### 1) Install
```bash
npm install
````

### 2) Run locally

```bash
npm run dev
```

### 3) Build

```bash
npm run build
```

### 4) Preview production build

```bash
npm run preview
```

## Project Structure (high level)

* `src/pages/` – routes (Menu, Build a Box, Fry Detail, Sauces, etc.)
* `src/components/` – reusable UI components
* `src/components/minigame/` – Catch the Fries modal/game
* `src/assets/` – images + Lottie JSON
* `src/data/` – fry/sauce data

## Notes

* Discount/coupon logic is frontend-only for demo purposes.
* The mini-game appears after completing all 3 build steps.

## License

Personal project — feel free to fork and remix.

```
::contentReference[oaicite:0]{index=0}
```
