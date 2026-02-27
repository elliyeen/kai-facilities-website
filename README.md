# KAI — The Operating System for Cities and Enterprise

**[Live Site →](https://elliyeen.github.io/kai-dart/)**

**Author:** [Abdullah@elliyeen.com](mailto:Abdullah@elliyeen.com)

KAI unifies data, operations, and intelligence into a single platform — turning complexity into clarity, at any scale. Built initially for DART (Dallas Area Rapid Transit), KAI is purpose-built to handle the real-world demands of large-scale infrastructure, including the 300%+ ridership surge expected during FIFA World Cup 2026.

---

## Platform

KAI is built on three layers — the **Kai Fabric**:

| Layer | Description |
|---|---|
| **Data Fabric** | Connects every data source across stations, vehicles, and systems into a unified real-time picture |
| **Operations Intelligence** | Predictive AI forecasts maintenance needs 4 hours ahead with 94.2% accuracy |
| **Workflow Automation** | AI-driven task routing and rapid-response team deployment in under 5 minutes |

---

## Tech Stack

- [Next.js 15](https://nextjs.org) (App Router, Turbopack)
- React 19 + TypeScript
- Tailwind CSS v4
- Docker + CI/CD (GitHub Actions → GitHub Pages)

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

---

## Pages

| Route | Description |
|---|---|
| `/` | Home — hero, stats, platform overview |
| `/platform` | The Kai Fabric — three-layer architecture deep-dive |
| `/world-cup-2026` | FIFA 2026 countdown, Dallas match schedule, readiness tracker |
| `/contact` | Contact / demo request form |

---

## Key Stats

| Metric | Value |
|---|---|
| DART Stations | 73 |
| Inspection Points / Station | 247 |
| Total Inspection Points | 18,031 |
| Light Rail Vehicles | 163 |
| Match Day Ridership Surge | +286% |
| AI Forecast Accuracy | 94.2% |
| Incident Response Time | < 30 seconds |
| Dallas FIFA 2026 Matches | 9 (Group → Semi-Final) |

---

## Infrastructure

- **Docker**: 3-stage Dockerfile, docker-compose for local dev
- **CI/CD**: GitHub Actions — lint/build on PR, deploy to GitHub Pages on push to `main`
- **Live URL**: https://elliyeen.github.io/kai-dart/

---

© 2026 KAI. The Operating System for Cities and Enterprise.
