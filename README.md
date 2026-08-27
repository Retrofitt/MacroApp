# ⚡ MacroApp - Precision Metabolic Engine & TDEE Calculator

A modern, mobile-first full-stack TypeScript web application engineered for precision metabolic calculations, athletic Total Daily Energy Expenditure (TDEE) modeling, 9-variety macro blueprinting, and real-time weight trajectory forecasting.

![MacroApp Banner](https://img.shields.io/badge/Release-Phase%201%20Production-10b981?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=for-the-badge&logo=typescript)
![React](https://img.shields.io/badge/React-19.x-61dafb?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-8.x-646cff?style=for-the-badge&logo=vite)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)

---

## 🌟 Core Features (Phase 1)

### 1. 🧮 Zero-Latency Guest Metabolic Engine
- **Instant Reactive Calculations**: No account required to access live TDEE and macro modeling.
- **Mifflin-St Jeor Formula**: Gold-standard metabolic baseline for the general population.
- **Katch-McArdle Formula**: Athlete-grade precision utilizing **Lean Body Mass (LBM)** when Body Fat % is provided.
- **US Navy Tape Measure Helper**: Embedded tool to accurately estimate body fat % from Neck, Waist, and Hip circumferences.

### 2. 🥗 9 Calibrated Macro Presets
- **3 Caloric Trajectories**:
  - **Cutting ($-20\%$)**: Preserves lean mass in an optimized deficit.
  - **Maintenance ($0\%$)**: Caloric equilibrium with full activity multiplier.
  - **Bulking ($+12\%$)**: Lean surplus designed for muscle hypertrophy with minimal adiposity.
- **3 Diet Variations per Goal**:
  - ⭐ **Optimal / Balanced**: Balanced distribution of energy substrates.
  - ⚡ **High-Carb / Low-Fat**: Athletic performance and glycolytic pump.
  - 🥑 **High-Fat / Low-Carb**: Enhanced satiety and keto-friendly energy.

### 3. 📈 Weight Change & Timeline Forecast
- **Scientific Caloric Model**: Based on the physiological $3,500\text{ kcal} \approx 1\text{ lb}$ ($7,700\text{ kcal} \approx 1\text{ kg}$) tissue benchmark.
- **Milestone Forecast Cards**: Real-time 4-week, 8-week, and 12-week weight projections.
- **Target Goal Weight Estimator**: Computes required weeks and exact estimated arrival date to reach any target weight.

### 4. 📱 Mobile-First Responsive Architecture
- Smooth, zero-horizontal-overflow layout engineered for viewports from compact iPhones (375px) to tablets (768px) and desktop monitors (1280px+).
- Touch-friendly button sizes ($40\text{px}+$ touch targets) and auto-zoom prevention on iOS mobile browsers.

### 5. 🌓 Dual-Theme System (Light & Dark)
- Seamless 1-click theme switching between **Clean Slate Light Mode** and **Sleek Emerald Dark Mode**.
- Persisted to browser storage (`localStorage`).

### 6. 🔐 Seamless Authentication & Guest State Handover
- JWT-authenticated secure user sessions.
- Guest metrics automatically pre-fill the onboarding wizard upon registration.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Vanilla CSS Design System with CSS Custom Properties, Lucide Icons.
- **Backend**: Node.js, Express, TypeScript, JWT (JSON Web Tokens), bcryptjs password hashing, In-Memory/Database persistence.
- **Architecture**: Mobile-first, modular component hierarchy, atomic design tokens.

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Retrofitt/MacroApp.git
   cd MacroApp
   ```

2. **Install dependencies**:
   ```bash
   # Install server dependencies
   cd server && npm install

   # Install client dependencies
   cd ../client && npm install
   ```

3. **Start the Development Servers**:
   ```bash
   # In terminal 1 (Server):
   cd server && npm run dev

   # In terminal 2 (Client):
   cd client && npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`.

---

## ⚖️ Disclaimer

*MacroApp calculations and macro presets are intended solely for athletic, educational, and informational purposes. They do not constitute medical or clinical advice. Consult a physician or registered dietitian before beginning any significant caloric deficit or fitness protocol.*

---

## 📄 License
MIT License. Built by [Retrofitt](https://github.com/Retrofitt).
