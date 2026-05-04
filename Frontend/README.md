# Prish Infotech Website Frontend

A modern website for Prish Infotech built with React, Vite, Tailwind CSS, and 3D/animation-enhanced components.

## Project Overview

This frontend powers the Prish Infotech site with:

- React 19 and Vite for fast development and optimized production bundles
- Tailwind CSS for responsive styling
- React Router for page navigation
- GSAP, Framer Motion, and Lenis for smooth animations and scroll interactions
- Three.js and @react-three/fiber for 3D visuals and immersive sections

## Key Features

- Animated landing page sections and interactive hero experience
- Authentication flow with register, login, and callback pages
- Cohort and course detail pages for AI, Data Science, and Full Stack programs
- Custom components for pricing, certification, syllabus, testimonials, CTA, and FAQ content
- Responsive design for desktop and mobile
- Modular feature folder structure for easier updates

## Folder Structure

- `src/main.jsx` — application entry point
- `src/app/App.jsx` — main app wrapper
- `src/app/AppRouter.jsx` — site routing and page layout
- `src/Features/Home/Pages/HomePage.jsx` — homepage content
- `src/Features/dashboard/components` — landing and dashboard UI components
- `src/Features/Courses` — course pages, cohort details, and course components
- `src/Features/auth/pages/Register.jsx` — registration page
- `src/Features/auth/pages/Login.jsx` — login page
- `src/Features/auth/pages/RequestCallback.jsx` — auth callback page

## Setup

Install dependencies:

```bash
cd Frontend
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Linting

Run ESLint across the frontend source:

```bash
npm run lint
```

## Notes

- The site is configured with Vite and Tailwind CSS via `vite.config.js`.
- Add new pages by updating `src/app/AppRouter.jsx` and placing components under `src/Features`.
- Use the existing `Features` folders for modular page and component organization.
