# Macros — Frontend Client

A modern, high-precision metabolic calculation, macronutrient planning, and weight trajectory forecasting single-page application built with React 19, TypeScript, and Vite.

Live Application: [macros.ramendev.io](https://macros.ramendev.io)

---

## Overview

The **Macros** client is designed to deliver an instant, frictionless metabolic modeling experience. It offers real-time calculations without requiring registration, while allowing users to seamlessly transition guest calculations directly into a persistent member profile.

Built with a focus on performance, visual polish, and responsive ergonomics across mobile, tablet, and desktop viewports.

---

## Key Features

- **Live TDEE & BMR Engine**: Computes Basal Metabolic Rate and Total Daily Energy Expenditure in real time as values are entered.
- **Dual Formula Support**:
  - *Mifflin-St Jeor*: Validated baseline formula utilizing age, biological sex, height, and weight.
  - *Katch-McArdle*: Automatically calibrated when body fat percentage or lean body mass is provided.
- **US Navy Body Fat Tape Helper**: Integrated circumference measurement calculator (neck, waist, and hips) to estimate body fat percentage directly in the UI.
- **9-Preset Macronutrient Matrix**: Interactive goal presets for **Cutting (-20%)**, **Maintenance**, and **Bulking (+12%)**, each with **Balanced**, **High-Carb**, and **High-Fat** macro distributions.
- **Weight Trajectory Forecasting**: Visual 4, 8, and 12-week projection milestones alongside an estimated arrival date calculator for target goal weights.
- **Bi-Directional Unit Support**: Seamless toggle between Imperial (`lbs`, `ft/in`) and Metric (`kg`, `cm`) units with automatic conversion.
- **Guest-to-User State Preservation**: Guest inputs and selected targets are retained and automatically carried into the account setup flow upon registration.
- **Dual-Theme Design System**: Clean Light Mode and Nordic Forest Obsidian Dark Mode powered by a lightweight CSS custom property token system.

---

## Tech Stack

- **Framework**: React 19
- **Language**: TypeScript (Strict Mode)
- **Tooling & Bundler**: Vite
- **Styling**: Vanilla CSS Design System (Custom properties, responsive clamp scaling, zero utility library bloat)
- **Icons**: Lucide React
- **HTTP Client**: Native Fetch API with structured API services

---

## Architecture & Project Structure

```
client/
├── public/              # Static assets and icons
├── src/
│   ├── components/      # Modular UI components
│   │   ├── AuthModal.tsx             # Login & Registration modal
│   │   ├── Dashboard.tsx             # Member dashboard & saved targets
│   │   ├── FooterDisclaimer.tsx      # Medical disclaimer & documentation
│   │   ├── LiveTDEECalculator.tsx    # Guest precision metabolic calculator
│   │   ├── Navbar.tsx                # Navigation, theme toggle, and unit switcher
│   │   ├── OnboardingModal.tsx       # Profile setup wizard
│   │   ├── ProfileStatsModal.tsx     # Member metric updates
│   │   ├── TDEECalculatorView.tsx    # Dashboard calculation view
│   │   └── WeightForecastCard.tsx    # Trajectory & milestone projections
│   ├── context/         # React context providers (AuthContext)
│   ├── services/        # API communication layer (Auth, Profile)
│   ├── types/           # Core TypeScript type definitions & interfaces
│   ├── utils/           # Math engines (tdeeCalculator, units, validation)
│   ├── App.tsx          # Application root & view controller
│   ├── index.css        # Global design tokens, typography, and theme vars
│   └── main.tsx         # React DOM entry point
├── index.html           # HTML template
├── tsconfig.json        # TypeScript configuration
└── vite.config.ts       # Vite build configuration
```

---

## Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm** or **yarn**

### Installation

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

5. Preview production build locally:
   ```bash
   npm run preview
   ```

---

## Environment Variables

For local development against a standalone backend API server, configure `.env` in the client directory if necessary:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```
