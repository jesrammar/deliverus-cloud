<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&amp;color=0:0A192F,50:1363DF,100:49BEB7&amp;height=190&amp;section=header&amp;text=DeliverUS%20Cloud&amp;fontColor=FFFFFF&amp;fontSize=48&amp;fontAlignY=39&amp;desc=Mobile%20delivery%20platform%20%7C%20Cloud%20engineering%20project&amp;descAlignY=62&amp;descSize=17" width="100%" alt="DeliverUS Cloud — mobile delivery platform and cloud engineering project" />
  <p>
    <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-Backend-339933?style=for-the-badge&amp;logo=nodedotjs&amp;logoColor=white" alt="Node.js" /></a>
    <a href="https://expressjs.com/"><img src="https://img.shields.io/badge/Express-REST%20API-111111?style=for-the-badge&amp;logo=express&amp;logoColor=white" alt="Express" /></a>
    <a href="https://reactnative.dev/"><img src="https://img.shields.io/badge/React%20Native-Mobile-61DAFB?style=for-the-badge&amp;logo=react&amp;logoColor=111111" alt="React Native" /></a>
    <a href="https://sequelize.org/"><img src="https://img.shields.io/badge/Sequelize-ORM-52B0E7?style=for-the-badge&amp;logo=sequelize&amp;logoColor=white" alt="Sequelize" /></a>
    <a href="https://mariadb.org/"><img src="https://img.shields.io/badge/MariaDB-Database-003545?style=for-the-badge&amp;logo=mariadb&amp;logoColor=white" alt="MariaDB" /></a>
    <a href="https://aws.amazon.com/"><img src="https://img.shields.io/badge/AWS-Deployment%20planned-FF9900?style=for-the-badge&amp;logo=amazonwebservices&amp;logoColor=232F3E" alt="AWS deployment planned" /></a>
  </p>
  <p><strong>A personal engineering project based on the DeliverUS university application.</strong></p>
  <p>Building a mobile-first delivery system while learning production-oriented deployment, cloud infrastructure and CI/CD.</p>
  <p>
    <a href="#architecture">Architecture</a> ·
    <a href="#tech-stack">Tech stack</a> ·
    <a href="#roadmap">Roadmap</a> ·
    <a href="#getting-started">Getting started</a>
  </p>
</div>

---

## Overview

**DeliverUS Cloud** is my independently developed version of the DeliverUS university project, focused on two complementary areas:

- **Application development:** a REST API for a delivery platform, backed by a relational database and consumed by a React Native mobile client.
- **Cloud engineering:** progressively deploying, securing, observing and automating that backend on Amazon Web Services.

This repository documents the implementation journey and the engineering decisions behind it. Cloud deployment is a **work in progress**, not a finished production system.

## Architecture

```mermaid
flowchart TD
    Client[React Native mobile app] -->|HTTPS / REST| Proxy[Reverse proxy / TLS — planned]
    Proxy --> API[Node.js + Express API on Amazon EC2 — planned]
    API --> ORM[Sequelize ORM]
    ORM --> DB[(MariaDB / MySQL)]
    GitHub[GitHub repository] --> Actions[GitHub Actions — planned]
    Actions -.->|CI/CD deployment| API
    AWSIAM[AWS IAM role — planned] -.->|Temporary credentials| API
```

> **Architecture note:** The mobile app runs on a device or emulator, not on EC2. EC2 is intended to host the Node.js/Express backend. The diagram shows the **target deployment architecture**; individual components will be introduced incrementally.

## Tech stack

| Layer | Technologies |
| --- | --- |
| Mobile client | React Native, JavaScript |
| Backend API | Node.js, Express |
| Data access | Sequelize ORM |
| Database | MariaDB / MySQL |
| Authentication | JWT-based authentication |
| Version control | Git, GitHub |
| Cloud target | Amazon EC2, IAM, Security Groups |
| Automation target | GitHub Actions |

## Functional scope

The DeliverUS domain includes:

- Restaurant and product catalogues.
- Owners and customers with different application roles.
- Order-related flows and relational data models.
- Backend endpoints consumed by the mobile client.

> Functionality and completeness will be documented as this independent version evolves. This section describes the project domain, not a claim that every feature is production-ready.

## Roadmap

- [ ] **01 — Repository:** import and review the authorized project source; remove credentials and environment-specific settings.
- [ ] **02 — Local baseline:** document setup and verify the Express API, database migrations and tests.
- [ ] **03 — First EC2 instance:** provision a small, eligible AWS instance and configure network access safely.
- [ ] **04 — API deployment:** run the backend as a managed service behind a reverse proxy.
- [ ] **05 — Database:** configure the development database and execute migrations and seeds.
- [ ] **06 — Security:** restrict Security Groups, apply IAM least privilege and enable HTTPS.
- [ ] **07 — CI/CD:** automate checks and controlled deployments with GitHub Actions.
- [ ] **08 — Observability:** document logs, health checks and cloud cost monitoring.

## Getting started

The exact commands will be published after the project structure and scripts have been verified.

1. Clone the repository.
2. Install the backend and mobile dependencies in their respective project folders.
3. Create local environment files from documented examples (**never commit real secrets**).
4. Start MariaDB/MySQL and run the project's Sequelize migrations and seeders.
5. Run the Express API locally and connect the React Native app to its API URL.

**Important:** Do not assume the backend is publicly deployed yet. The AWS endpoint and reproducible setup instructions will be added after the first validated deployment.

## Engineering priorities

- **Security by default:** no secrets in Git; IAM least privilege; minimal exposed ports.
- **Reproducibility:** documented setup, database migrations and repeatable deployments.
- **Reliability:** validation, error handling and service health checks.
- **Cost awareness:** monitor AWS Free Plan usage, credits and resource lifecycle.
- **Clear documentation:** record architecture decisions and implementation progress.

## Project background

This is a **personal portfolio and learning project** derived from an academic exercise. It is not an official commercial DeliverUS service or an Everlasting Art production deployment.

---

<div align="center">
  <p><strong>Designed, developed and documented as a hands-on software and cloud engineering project.</strong></p>
  <img src="https://capsule-render.vercel.app/api?type=waving&amp;color=0:49BEB7,50:1363DF,100:0A192F&amp;height=85&amp;section=footer" width="100%" alt="Decorative footer" />
</div>
