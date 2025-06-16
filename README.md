  ![Homepage](https://cytd5kmgz6.ufs.sh/f/aIroXtB9CoHUQjQF1sv1N097MgFkwydKY3rmbRif5EsltJ6Q)

# XTask

**XTask** is a developer-focused platform that uses AI-powered bots to help you write, schedule, and publish tweets effortlessly. Built on a Turbo Repo architecture with Next.js on the frontend and an Express backend.

## Table of Contents

- [Features](#features)
- [Screenshots](#screenshots)
- [Installation](#installation)
- [License](#license)

## Features

- **AI-Powered Tweet Composer:** Automatically generate engaging tweets with tailored AI personalities.
- **Multiple AI Bots:** Choose from bots like Harkirt Singh, Striver Aka Raj, Code With Harry, and EzSnippet to match your dev vibe.
- **Turbo Repo Architecture:** Efficient monorepo structure for streamlined development across frontend (Next.js) and backend (Express).
- **Scheduling & Publishing:** Easily schedule tweets for timely posting.
- **Developer-Centric Design:** Built with features and UX enhancements that resonate with developers.

## Screenshots

Here are some sample screenshots to showcase the UI:

- **Tweetly Brain:**  
  ![Brain](https://cytd5kmgz6.ufs.sh/f/aIroXtB9CoHUexNiNtFGZ8ejuvhlPcoHR2rBdUbzs9iMw4Kg)
- **Bots:**  
  ![Bots](https://cytd5kmgz6.ufs.sh/f/aIroXtB9CoHUZpbJCmEc47LUgHpo5GeIyu2XbMa1RxwZqdEi)
- **Chats:**  
  ![Chats](https://cytd5kmgz6.ufs.sh/f/aIroXtB9CoHUDyZNS7eoKceE4txni7wkXlqFapgHb6GCu9vA)
- **Publish:**  
  ![Publish](https://cytd5kmgz6.ufs.sh/f/aIroXtB9CoHURjglvcSNVjtTDCBbn20Khu9IUcSZM3LXzOiR)
- **Schedule:**  
  ![Schedule](https://cytd5kmgz6.ufs.sh/f/aIroXtB9CoHUx5Vls9DFuHyEDPQ4rWRs12eht5xmb0VcYBqk)


## Installation

XTask now runs as a combined application on a single port for easier deployment.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [pnpm](https://pnpm.io/) package manager
- [MongoDB](https://www.mongodb.com/) database

### Quick Start

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/lord-dubious/x-webui.git
   cd x-webui
   ```

2. **Install Dependencies:**
   ```bash
   pnpm install
   ```

3. **Setup Environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Generate Database Schema:**
   ```bash
   pnpm run db:generate
   ```

5. **Build the Application:**
   ```bash
   pnpm run build:combined
   ```

6. **Start the Application:**
   ```bash
   pnpm run start
   ```

7. **Access the Application:**
   - **Combined App:** http://localhost:4000 (Web App + API)
   - **Marketing Website:** http://localhost:3001 (separate)

### Development Mode

For development with hot reloading:
```bash
pnpm run dev:combined
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## License

XTask is licensed under the **MIT License**.

