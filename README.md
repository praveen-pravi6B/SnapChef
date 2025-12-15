# SnapChef 🍳📸

<p align="center">
  <img src="src/assets/logo.png" alt="SnapChef Logo" width="150"/>
</p>

### Turn your ingredients into delicious meals instantly with AI-powered recipe discovery.

**SnapChef** is your smart kitchen assistant that helps you reduce food waste and cook creative meals with what you already have. Simply snap a photo of your fridge or pantry, and let our AI handle the rest.

---

## ✨ Features

*   📸 **Snap & Scan**: Point your camera at ingredients to identify them automatically.
*   📝 **Smart Pantry**: Manually add or verify your ingredient list.
*   🍳 **Recipe Match**: Get instant recipe suggestions based *only* on the ingredients you have.
*   ✅ **Availability Check**: See clearly which ingredients you have (✅) and which you need to buy (❌) for any recipe.
*   👩‍🍳 **Step-by-Step Guides**: Detailed cooking instructions for every dish.

## 🛠️ Technology Stack

*   **Framework**: Ionic + Vue.js (Capacitor)
*   **AI Engine**: Google Gemini API (Visual & Text analysis)
*   **Styling**: Vanilla CSS / Ionic Utilities
*   **Platforms**: Web, Android, iOS

## 🚀 Getting Started

### Prerequisites

*   Node.js (LTS recommended)
*   npm

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/snap-chef.git
    cd snap-chef
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

5.  **Run on Android (requires Android Studio)**
    ```bash
    npm run build
    npx cap sync
    npx cap open android
    ```

6.  **Run on iOS (requires macOS & Xcode)**
    ```bash
    npm run build
    npx cap sync
    npx cap open ios
    ```

## 📱 Deployment

*   **Web**: Auto-deploys via Render (Static Site) linked to this repo.
*   **Android**: Distributed via Firebase App Distribution.
*   **iOS**: TestFlight.

---

Made with ❤️ by [Praveen] using **Ionic** and **Gemini AI**.
