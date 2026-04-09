<div align="center">

  <img src="https://img.shields.io/badge/OXYRA-FITNESS%20AI-FF6B35?style=for-the-badge&labelColor=0D0D0D" alt="Oxyra" height="40"/>

  <br/>
  <br/>

  <p><strong>Next-generation fitness platform that merges intelligent workout management,<br/>AI-powered biometric body analysis and complete nutrition tracking.</strong></p>

  <br/>

  <!-- CI/CD & Deployment -->
  <img src="https://img.shields.io/github/actions/workflow/status/Cyod75/Oxyra/deploy.yml?branch=main&label=CI%2FCD%20Pipeline&style=for-the-badge&logo=githubactions&logoColor=white&color=2ea44f" alt="CI/CD Pipeline"/>
  <img src="https://img.shields.io/badge/Status-Live%20%26%20Deployed-brightgreen?style=for-the-badge&logo=statuspage&logoColor=white" alt="Status"/>
  <img src="https://img.shields.io/badge/Hosted%20On-VPS-6E40C9?style=for-the-badge&logo=linux&logoColor=white" alt="VPS"/>

  <br/>

  <!-- Frontend Stack -->
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React"/>
  <img src="https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"/>
  <img src="https://img.shields.io/badge/JavaScript-ES2024-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript"/>

  <br/>

  <!-- Backend Stack -->
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/REST-API-FF6B35?style=for-the-badge&logo=api&logoColor=white" alt="REST API"/>
  <img src="https://img.shields.io/badge/MySQL-MariaDB-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL"/>

  <br/>

  <!-- Features badges -->
  <img src="https://img.shields.io/badge/Barcode-Scanner-00B4D8?style=for-the-badge&logo=qrcode&logoColor=white" alt="Barcode Scanner"/>
  <img src="https://img.shields.io/badge/Nutrition-Tracker-43AA8B?style=for-the-badge&logo=leaflet&logoColor=white" alt="Nutrition Tracker"/>
  <img src="https://img.shields.io/badge/AI-Body%20Analysis-FF6B35?style=for-the-badge&logo=openai&logoColor=white" alt="AI Body Analysis"/>

  <br/>

  <!-- Repo metadata -->
  <img src="https://img.shields.io/github/last-commit/Cyod75/Oxyra?style=for-the-badge&logo=git&logoColor=white&label=Last%20Commit" alt="Last Commit"/>
  <img src="https://img.shields.io/github/repo-size/Cyod75/Oxyra?style=for-the-badge&logo=github&logoColor=white" alt="Repo Size"/>
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" alt="License"/>

  <br/><br/>

  <a href="https://jordi.informaticamajada.es/"><strong>🌐 View Live Demo »</strong></a>

  <br/>

</div>

---

## 📖 About Oxyra

**Oxyra** is a next-generation fitness application that redefines how users interact with their training routines, measure their physical progress and manage their nutrition — all in one place. Unlike traditional fitness apps that tackle these pillars separately, Oxyra integrates them into a single intelligent feedback loop built on three core systems:

- A **fluid drag-and-drop interface** for real-time workout management
- An **AI-powered computer vision engine** that segments the body and assigns quantitative values to individual muscle groups
- A **complete nutrition tracking system** with daily meal logging, water intake monitoring and instant product analysis via barcode scanner

The result is a continuous cycle: **Scan → Plan → Execute → Eat → Re-evaluate**, where every dimension of your fitness — training, body composition and nutrition — is tracked, connected and visible.

> *"From manual logging to biometric intelligence — Oxyra turns your body into a data source."*

---

## ✨ Core Features

### 🔀 Dynamic Workout Management (Drag & Drop)
A frictionless interface that lets users build, organize, and reorder their training routines on the fly. If a machine is taken at the gym, simply drag that exercise to a different slot — no rigid structure, full adaptability in real time.

### 🤖 Biometric Muscle Mapping (AI Engine)
The defining feature of Oxyra. The computer vision system analyzes a photo of the user, segments the body into individual muscle groups, and assigns each a **quantitative Muscle Value** that encapsulates:

| Dimension | Description |
|-----------|-------------|
| 📈 **Development / Hypertrophy** | Growth score based on visual analysis over time |
| 😴 **Fatigue / Recovery** | Cross-referenced with training history to flag muscles needing rest |
| 🎮 **Gamification (XP)** | Experience points and levels per muscle group — progress you can see |

### 🥗 Nutrition & Hydration Tracking
A complete daily nutrition diary, similar to MyFitnessPal, fully integrated into the Oxyra ecosystem:

- **Daily meal log** — register every meal broken down by macronutrients (calories, protein, carbs, fat)
- **Water intake tracker** — monitor daily hydration with a simple and visual interface
- **Barcode scanner** — scan any food product's barcode to instantly retrieve its nutritional information and add it to your daily log

> Nutrition data feeds back into the AI engine, giving the system a complete picture of the user's recovery and energy state — not just what was trained, but what was consumed.

### 🔄 The Complete Feedback Loop

```
[Body Scan] ──→ [AI assigns Muscle Values] ──→ [User builds smart routine]
     ↑                      ↑                              │
     │              [Nutrition & hydration]                │
     │                 cross-reference                     ▼
     └────────────── [Re-scan to measure progress] ←── [Execution]
```

---

## 🏗️ Architecture

Oxyra follows a decoupled architecture separating concerns across three layers, fully deployed on a private VPS:

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                         │
│                  React 18 + Vite (Frontend)                     │
│    Drag-and-Drop UI · AI Scan · Nutrition Log · Barcode Scan    │
└────────────────────────┬────────────────────────────────────────┘
                         │  HTTPS REST API
┌────────────────────────▼────────────────────────────────────────┐
│                    BACKEND (VPS)                                 │
│                Node.js + Express REST API                        │
│     Authentication · Business Logic · AI Bridge · Food API      │
│                https://jordi.informaticamajada.es/api/           │
└────────────────────────┬────────────────────────────────────────┘
                         │  SQL Queries
┌────────────────────────▼────────────────────────────────────────┐
│                    DATABASE (VPS)                                │
│                    MySQL / MariaDB                               │
│  Users · Routines · Muscle Values · Meals · Nutrition · Water   │
└─────────────────────────────────────────────────────────────────┘
```

> **Note:** The backend and database are deployed on a private VPS and are not available for local execution. The frontend connects automatically to the production API.

---

## 🛠️ Tech Stack

| Layer | Technology | Role |
|-------|-----------|------|
| **Frontend** | React 18 + Vite | SPA, UI, drag-and-drop, barcode scanner |
| **Backend** | Node.js + Express | REST API, auth, business logic |
| **Database** | MySQL / MariaDB | Persistent data storage |
| **AI / Vision** | Computer Vision Engine | Body segmentation & muscle analysis |
| **Nutrition** | Barcode API integration | Product lookup via barcode scan |
| **Infrastructure** | Private VPS | Hosting backend + database |
| **CI/CD** | GitHub Actions | Automated build & deployment pipeline |

---

## 🚀 CI/CD Pipeline

Oxyra uses a **semi-automated deployment pipeline** powered by GitHub Actions. Every push to `main` triggers the workflow automatically:

```
Push to main
     │
     ▼
┌─────────────┐     ┌─────────────┐     ┌──────────────────────┐
│   Checkout  │────▶│    Build    │────▶│  Deploy to VPS (SSH) │
│    Code     │     │  (npm run   │     │  via GitHub Secrets  │
│             │     │   build)    │     │                      │
└─────────────┘     └─────────────┘     └──────────────────────┘
                                                   │
                                                   ▼
                                         ✅ Production Live
```

The workflow definition lives at `.github/workflows/deploy.yml`.

---

## 🖥️ Running the Frontend Locally

> ⚠️ The backend and database run exclusively on the production VPS and **cannot be run locally**. However, the frontend can be cloned and started locally — it will connect automatically to the live API.

**Prerequisites:** Node.js ≥ 18

```bash
# 1. Clone the repository
git clone https://github.com/Cyod75/Oxyra.git
cd Oxyra/frontend

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will be available at `http://localhost:5173` and will connect to the production API at `https://jordi.informaticamajada.es/api/`.

> Some features may require a valid user account registered on the platform.

---

## 👤 Author

<div align="center">

**Jordi M. Monteiro A.**

[![GitHub](https://img.shields.io/badge/GitHub-Cyod75-181717?style=for-the-badge&logo=github)](https://github.com/Cyod75)

</div>

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <sub>Built with by Jordi M. Monteiro A. · Oxyra © 2026</sub>
</div>
