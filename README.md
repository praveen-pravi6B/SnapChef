# SnapChef 🍳📸

[![Live on Vercel](https://img.shields.io/badge/Vercel-Live-black?style=for-the-badge&logo=vercel)](https://snap-chef-khaki.vercel.app/)
[![Live on Render](https://img.shields.io/badge/Render-Live-black?style=for-the-badge&logo=render)](https://snapchef-5wbq.onrender.com)

<p align center>
  <img src="src/assets/logo.png" alt="SnapChef Logo" width="150"/>
</p>

### Turn your ingredients into delicious meals instantly with AI-powered recipe discovery.

**SnapChef** is your smart kitchen assistant that helps you reduce food waste and cook creative meals with what you already have. Simply snap a photo of your fridge or pantry, and let our AI handle the rest.

---

## ✨ Features

*   📸 **Snap & Scan**: Point your camera at ingredients to identify them automatically.
*   📝 **Smart Pantry**: Manually add or verify your ingredient list.
*   📍 **Location-Based Recipes**: Discover local and traditional dishes based on your current coordinates.
*   🍳 **Recipe Match**: Get instant recipe suggestions based *only* on the ingredients you have.
*   ✅ **Availability Check**: See clearly which ingredients you have (✅) and which you need to buy (❌) for any recipe.
*   👩‍🍳 **Step-by-Step Guides**: Detailed cooking instructions for every dish.
*   🧪 **Comprehensive Testing**: Unit tests for core logic and End-to-End tests for critical user flows.
*   🚀 **CI/CD Pipeline**: Automated linting and testing via GitHub Actions.

## 🛠️ Technology Stack

*   **Framework**: [Ionic](https://ionicframework.com/) + [Vue.js](https://vuejs.org/) (Capacitor)
*   **AI Engine**: [Google Gemini API](https://ai.google.dev/) (Visual & Text analysis)
*   **Testing**: [Vitest](https://vitest.dev/) (Unit), [Cypress](https://www.cypress.io/) (E2E)
*   **CI/CD**: GitHub Actions
*   **Styling**: Vanilla CSS / Ionic Utilities
*   **Platforms**: Web, Android, iOS

## 🚀 Getting Started

### Prerequisites

*   Node.js (LTS recommended)
*   npm

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/praveen-pravi6B/SnapChef.git
    cd SnapChef
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment**
    Create a `.env` file in the root directory and add your Gemini API Key:
    ```
    VITE_GEMINI_API_KEY=your_api_key_here
    ```

4.  **Run on Web**
    ```bash
    npm run dev
    ```

## 🧪 Testing

### Unit Tests
Run unit tests for core logic and services:
```bash
npm run test:unit
```

### E2E Tests
Run end-to-end tests using Cypress:
```bash
npm run test:e2e
```

## 📜 Available Scripts

| Script | Description |
| :--- | :--- |
| `npm run dev` | Starts the development server |
| `npm run build` | Builds the application for production |
| `npm run lint` | Lints the codebase using ESLint |
| `npm run test:unit` | Runs unit tests using Vitest |
| `npm run test:e2e` | Runs E2E tests using Cypress |
| `npm run preview` | Previews the production build locally |

## 📱 Mobile Development

1.  **Run on Android (requires Android Studio)**
    ```bash
    npm run build
    npx cap sync
    npx cap open android
    ```

2.  **Run on iOS (requires macOS & Xcode)**
    ```bash
    npm run build
    npx cap sync
    npx cap open ios
    ```

## 📱 Deployment

*   **Web**: Auto-deploys via Vercel and Render linked to this repo.
*   **Android**: Distributed via Firebase App Distribution.
*   **iOS**: TestFlight.

---

Made with ❤️ by [Praveen](https://github.com/praveen-pravi6B) using **Ionic** and **Gemini AI**.
Licensed under [MIT](LICENSE).
