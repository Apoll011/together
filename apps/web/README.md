# Together - Main Website

The central hub for the **Together** project. This website serves as the public face of the ecosystem, presenting the vision, the family of apps, and providing a centralized dashboard for users.

## 🎯 Purpose

This application fulfills three main roles within the ecosystem:

1.  **Project Showcase:** A high-quality, visual presentation of the "Together" family of apps (Preserve, Learn, Work, etc.), acting as the primary landing page for the project.
2.  **Central Dashboard:** A unified entry point where users can manage their accounts, view global statistics, and access specific app data without needing the mobile app.
3.  **Onboarding:** The primary gateway for new users to join the community and understand the mission.

## 🛠 Tech Stack

-   **Framework:** Next.js
-   **Styling:** Tailwind CSS
-   **Context:** Part of the Together Turborepo Monorepo

## 🚀 How to Run

Since this project is part of a monorepo, you can run it specifically using the package manager filter command from the root directory.

```bash
# 1. Install dependencies (from the root of the monorepo)
pnpm install

# 2. Run only the Main Website
pnpm dev --filter web