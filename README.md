# Together Project

> **One Ecosystem. Limitless Growth.**
> A suite of interconnected applications fostering community, learning, preservation, and collaboration.

![Status](https://img.shields.io/badge/Status-Development-blue)
![Stack](https://img.shields.io/badge/Stack-Turborepo_|_NestJS_|_React_Native-black)
![License](https://img.shields.io/badge/License-MIT-green)

## About The Project

**Together** is a modular monolith project designed to solve modern challenges through community collaboration. It consists of a handfull of applications sharing a single identity and data layer.

## Tech Stack

-   **Monorepo:** Turborepo + pnpm
-   **Backend:** NestJS (Node.js) + GraphQL (Code-First)
-   **Database:** PostgreSQL + PostGIS (via Docker)
-   **ORM:** Prisma
-   **Web:** Next.js (App Router) + Tailwind CSS
-   **Mobile:** React Native (Expo Managed Workflow)
-   **Auth:** Authentik (Self-Hosted OIDC)
-   **Maps:** OpenStreetMap / react-native-maps

## Getting Started

### Prerequisites
-   Node.js (LTS)
-   pnpm (`npm install -g pnpm`)
-   Docker & Docker Compose (for DB and Auth)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/together.git
    cd together
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

### Running the Project

To run **all** apps (Backend + Web + Mobile) in parallel:
```bash
pnpm dev
```

To run a **specific** app (e.g., just the website):
```bash
pnpm dev --filter web-main
```

## Contribution

This is currently a solo-developer project, but the architecture is designed for scale.
1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.
```