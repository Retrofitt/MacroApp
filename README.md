# Macros: Precision TDEE & Metabolic Calculator

A responsive, full-stack web application designed for accurate metabolic calculation, Total Daily Energy Expenditure (TDEE) modeling, macronutrient distribution planning, and weight trajectory forecasting.

Live Application: [https://macros.ramendev.io](https://macros.ramendev.io)

---

## Overview

Macros provides real-time metabolic and caloric calculations without requiring an account. Users can instantly calculate their Basal Metabolic Rate (BMR) and maintenance calories using validated scientific equations, explore calibrated macronutrient distributions, and estimate target completion timelines based on caloric deficit or surplus goals.

Authenticated users have access to persistent profile storage and customized dashboard features.

---

## Tech Stack

### Frontend
- Framework: React 19
- Language: TypeScript (Strict mode)
- Bundler: Vite
- Styling: Custom Vanilla CSS Design System (Custom Properties, Light and Dark themes)
- Icons: Lucide React

### Backend
- Runtime: Node.js (ES Modules)
- Framework: Express
- Language: TypeScript
- Validation: Zod schema validation
- Authentication: JSON Web Tokens (JWT) with HTTP-only cookies and bcryptjs password hashing

### Infrastructure & Deployment
- Hosting: Vercel (Decoupled client SPA and serverless API)
- Domain: macros.ramendev.io

---

## Project Roadmap

### Phase 1: Core Metabolic Engine (Current Release)
- Real-time guest TDEE calculator with live updates on input changes.
- Mifflin-St Jeor metabolic baseline calculation.
- Katch-McArdle formula activation when body fat percentage or lean body mass is provided.
- US Navy circumference method helper (neck, waist, hip measurements) for estimating body fat percentage.
- 9-preset macronutrient breakdown matrix (Cutting, Maintenance, Bulking across Balanced, High-Carb, and High-Fat ratios).
- Weight trajectory and milestone forecasting (4-week, 8-week, and 12-week projections).
- Target goal weight timeline arrival estimator.
- Responsive mobile-first interface optimized for viewports from 375px to 4K displays.
- Dual-theme system (Light mode and Nordic Forest Obsidian dark mode) with local storage persistence.
- JWT authentication system with guest-to-user state preservation during onboarding.
- Member dashboard with saved profile statistics.

### Phase 2: Daily Macro & Nutrition Tracking
- Daily meal and food item logging.
- Real-time progress bars for calories, protein, carbohydrates, and fats.
- Custom macro target adjustments.
- Meal template creation and recurring food management.

### Phase 3: Barcode Scanning & Food Database
- Packaging barcode scanner integration using device camera.
- Verified nutritional database integration for rapid item lookup.
- Custom food and recipe creation with automatic macro breakdown.

### Phase 4: Progress Analytics & Weight Tracking
- Daily and weekly weigh-in logging with moving averages.
- Actual weight progress versus forecasted trajectory comparison charts.
- Dynamic calorie recommendation adjustments based on real-world weight trends (adaptive metabolic rate tracking).

### Phase 5+: Continuous Platform Expansion
- TBD (Continuous development based on performance benchmarks and user feedback).

---

## Local Development Setup

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Retrofitt/MacroApp.git
   cd MacroApp
   ```

2. Install backend dependencies:
   ```bash
   cd server
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd ../client
   npm install
   ```

4. Configure environment variables in `server/.env`:
   ```env
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=your_development_secret_key
   JWT_EXPIRES_IN=7d
   CLIENT_URL=http://localhost:5173
   ```

5. Run development servers:

   In the server directory:
   ```bash
   npm run dev
   ```

   In the client directory:
   ```bash
   npm run dev
   ```

6. Open `http://localhost:5173` in your browser.

---

## Disclaimer

The metabolic, nutritional, and macronutrient calculations provided by this application are for athletic, educational, and informational purposes only. They do not constitute medical advice or clinical dietary prescriptions. Users should consult a qualified physician or registered dietitian before undertaking any significant nutritional deficit or exercise program.

---

## License & Attribution

MIT License. Designed and engineered by [Rafael Mendoza](https://portfolio.ramendev.io).
