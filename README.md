# DEADSTOCK LIVE LAB 🧵⚡

> **"DESIGN WITH WHAT EXISTS."**  
> *A material-grounded AI co-design studio turning physical factory textile waste into 100% manufacturable circular fashion capsules using Google Gemini Multimodal Vision, Vonage Video WebRTC, and Supabase PostgreSQL 17.*

---

[![Live Deployment](https://img.shields.io/badge/Live%20App-deadstock--gdg.vercel.app-F2FF55?style=for-the-badge&logo=vercel&logoColor=black)](https://deadstock-gdg.vercel.app/)
[![Next.js 16](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-3.6%20Flash-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev/)
[![Vonage Video](https://img.shields.io/badge/Vonage-WebRTC%20Video-000000?style=for-the-badge&logo=vonage)](https://developer.vonage.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL%2017-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

---

## 🌐 Live Application & Demo

| Resource | Link | Description |
| :--- | :--- | :--- |
| 🚀 **Live Vercel Deployment** | **[https://deadstock-gdg.vercel.app/](https://deadstock-gdg.vercel.app/)** | Live interactive studio atelier deployed in production on Vercel |
| 📹 **Demo Walkthrough Video** | **[Watch on Google Drive](https://drive.google.com/file/d/1CRZcogLTAsdPIcFGwI8dchBToL9Inblo/view?usp=drive_link)** | Full product walkthrough & live co-design demonstration |

[![Deadstock Live Lab Demo Video](docs/images/01-landing-manifesto.png)](https://deadstock-gdg.vercel.app/)

> 🚀 **[Launch Live Studio: https://deadstock-gdg.vercel.app/](https://deadstock-gdg.vercel.app/)**  
> 📹 **[Watch Video Walkthrough: Google Drive](https://drive.google.com/file/d/1CRZcogLTAsdPIcFGwI8dchBToL9Inblo/view?usp=drive_link)**


---

## 📸 Visual Showcase & Tour

### 01. Landing & 5-Beat Transformation Manifesto
*The landing experience communicates the core philosophy: The AI does not dream up new fibers. Every panel, collar, facing, and hem is cut from observed atelier yardage.*

![01. Landing & 5-Beat Manifesto](docs/images/01-landing-manifesto.png)

---

### 02. Atelier Real-Time Dossier & Live Disruption Demo
*Central control center displaying verified deadstock inventory counts, active constraints, yardage utility metrics (75%), and the signature real-time causal disruption simulator (`PURGE SATIN LIVE`).*

![02. Atelier Real-Time Dossier](docs/images/02-atelier-overview-dossier.png)

---

### 03. Live Studio War Room (Vonage Video WebRTC)
*Real-time co-design video conference between **Sathvik (Atelier Lead)**, **Elena (Technical Patternist)**, and **Marcus (Auditor)**. Features 1-click decision capture (`[ + CAPTURE DECISION ]`) and interactive fabric quarantine controls.*

![03. Live Studio War Room](docs/images/03-live-studio-webrtc.png)

---

### 04. Constrained Capsule Generation & Material Provenance Trace
*Capsule Reel synthesizing manufacturable garments. Hovering over garment zones illuminates exact physical fabric roll bindings (`MAT-001 Selvedge Denim`, `MAT-007 Charcoal Rib`, `MAT-006 Brass Zips`) with cutting-table waste accounting.*

![04. Capsule Generation & Provenance Trace](docs/images/04-capsule-generation-trace.png)

---

### 05. Manufactured Capsule Collection Gallery
*Complete 3-look editorial capsule showcasing 100% deadstock allocation, feasibility checks, cut waste estimations (~12-14%), and zero-virgin-fabric compliance.*

![05. Collection Gallery Looks](docs/images/05-collection-gallery-looks.png)

---

## 💡 The Core Problem: The 92-Million-Ton Textile Dilemma

Every year, the global fashion industry discards **over 92 million tons of textiles**, while ateliers and mills store millions of meters of premium "deadstock" remnants. These rolls sit unused because designing around irregular, limited-yardage inventory has historically been slow, risky, and manually painful.

Traditional generative AI models make this worse: they hallucinate impossible garments and assume infinite rolls of virgin fabric. 

**Deadstock Live Lab flips the paradigm:**
- The AI is **strictly forbidden** from imagining new fabrics.
- Every seam, lapel, collar, and sleeve must cite a physical lot ID from observed atelier inventory.
- When materials run out or get damaged, causal graph propagation recalculates cutting layouts instantly without scrapping the entire collection.

---

## ⚡ Key Technical Innovations

### 1. Gemini Multimodal Live Textile Vision
Point a camera at leftover fabric rolls or offcuts. **Google Gemini 3.6 Flash** inspects the live visual cues:
- Detects weave pattern (e.g. 3x1 twill, duck canvas, duchesse satin, ribbed knit).
- Infers tactile properties: stretch guess, opacity, and weight class (e.g. `Heavyweight ~13.5 oz / 450 GSM`).
- Extracts dominant colors and hex swatches.
- Computes estimated usable yardage and confidence scores into structured JSON.

### 2. Deterministic Server-Side Constraint Engine
Acts as an inviolable gatekeeper between the generative AI and manufacturing reality:
- **Zero-Virgin Fabric Mandate (HARD):** Ensures 0% ungrounded or synthetic dream fabrics.
- **Yardage Conservation (HARD):** Allocates panel square-meterage strictly within observed bounds.
- **Textile Weight Matching (SOFT):** Enforces tailoring rules (e.g., prevents fragile organza for heavy trousers without structural backing).

### 3. Real-Time Causal Chain Disruption ("Purge Satin Live")
Clicking **"Purge Satin Live"** simulates a real cutting-table disruption (e.g., Elena notices the Burgundy Satin has edge fraying and only 0.9m remains):
1. Burgundy Satin (`MAT-004`) is instantly quarantined in **Supabase PostgreSQL 17**.
2. The dependency graph identifies affected looks (Look 02 turns amber / invalidated).
3. Untouched garments (Look 01 & Look 03) remain locked.
4. With one click (`[ APPLY TO LOOK ]`), the constraint solver substitutes the missing material with approved Mulberry Raw Silk (`MAT-002`) and re-balances seam allowances.

### 4. Collaborative Live Studio (Vonage Video WebRTC)
- Live encrypted WebRTC video streaming between distributed atelier teams.
- Lead designer **Sathvik** coordinates with remote patternists and auditors.
- Live audio discussion dialogue feed allows capturing spoken consensus directly into the Supabase decision audit trail with a single click.

### 5. Gemini Token Cost Optimization & Sliding-Window Rate Limiting
- **Prompt Token Compression:** Serializes material inventory into compact, token-dense tabular entries instead of bloated formatted JSON, saving **~68% of prompt tokens**.
- **Runaway Prevention:** Strictly enforced `maxOutputTokens: 1800` and `temperature: 0.25`.
- **Live Cost Auditor:** Real-time token usage and cost accounting ($0.0001 USD per collection) displayed on screen.
- **Zero-Token Local Solver:** Targeted look regenerations utilize deterministic constraint algebra, saving 100% of LLM token costs.
- **Sliding-Window Rate Limiting:** In-memory sliding-window rate limiters with automatic cleanup protect all 8 API endpoints against abuse, returning standardized `429 Too Many Requests` responses with `Retry-After` headers.

---

## 📐 System Architecture

```
                  ┌─────────────────────────────────────┐
                  │   Physical Remnants & Deadstock     │
                  │  (Denim Rolls, Silk Scraps, Trims)  │
                  └──────────────────┬──────────────────┘
                                     │ Live Camera Stream
                                     ▼
                  ┌─────────────────────────────────────┐
                  │       Google Gemini 3.6 Flash       │
                  │   Multimodal Live Vision Analysis   │
                  │  & Constrained Capsule Synthesis    │
                  └──────────────────┬──────────────────┘
                                     │ Structured JSON Specs
                                     ▼
                  ┌─────────────────────────────────────┐
                  │   Deterministic Constraint Engine   │
                  │    Algebraic Yardage Feasibility    │
                  │    & Causal Dependency Topology     │
                  └──────────────────┬──────────────────┘
                                     │
                    ┌────────────────┴────────────────┐
                    ▼                                 ▼
┌───────────────────────────────────────┐ ┌───────────────────────────────────────┐
│          Vonage Video WebRTC          │ │        Supabase PostgreSQL 17        │
│   Low-Latency Studio War Room Stream  │ │    Authoritative Inventory Ledger,    │
│    Audio & Screen Communication       │ │     Concepts & Audit Decision Log     │
└───────────────────────────────────────┘ └───────────────────────────────────────┘
```

---

## 🛡️ Service Rate Limits & API Specifications

| Endpoint | Method | Rate Limit | Primary Service | Description |
| :--- | :---: | :---: | :---: | :--- |
| `/api/generate` | `POST` | 12 req/min | Gemini 3.6 Flash | Synthesizes constrained collection with token compression |
| `/api/scan` | `POST` | 15 req/min | Gemini Multimodal | Live camera fabric & textile property detection |
| `/api/regenerate`| `POST` | 20 req/min | Constraint Engine | Targeted zero-token zone substitution after fabric mutation |
| `/api/credentials`| `GET` | 25 req/min | Vonage Video API | Generates authenticated WebRTC session & client tokens |
| `/api/materials` | `GET/POST/PATCH` | 60 req/min | Supabase PG-17 | Material inventory CRUD & quarantine states |
| `/api/decisions` | `GET/POST` | 60 req/min | Supabase PG-17 | Live studio decision audit trail logging |
| `/api/concepts` | `GET/POST` | 60 req/min | Supabase PG-17 | Garment concept look storage & panel maps |
| `/api/labs` | `GET/POST` | 60 req/min | Supabase PG-17 | Atelier project workspace configuration |

*All endpoints return standard rate limit headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, and `X-RateLimit-Reset`.*

---

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (React 19, Turbopack, App Router)
- **AI Models:** Google Gemini 3.6 Flash (`@google/genai`)
- **Video & Real-Time:** Vonage Video WebRTC SDK (`@vonage/server-sdk`)
- **Database:** Supabase PostgreSQL 17 via pooled connection (`pg`)
- **Styling & Motion:** Tailwind CSS 3.4, Framer Motion 13, Lucide React
- **Typography:** JetBrains Mono (Technical/Data) & Syne / Inter (Editorial Titles)

---

## 🚀 Getting Started

### Prerequisites
- **Node.js:** v18.18+ or v20+
- **Google Gemini API Key:** [Google AI Studio](https://aistudio.google.com/)
- **Vonage Video API:** [Vonage Developer Dashboard](https://developer.vonage.com/) (Application ID & Private Key)
- **Supabase Account:** PostgreSQL 17 connection string

### 1. Clone & Install
```bash
git clone https://github.com/PuttaSathvik16/Deadstock-Live-Lab-GDG-Hackathon.git
cd Deadstock-Live-Lab-GDG-Hackathon
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
```env
# Supabase PostgreSQL 17 Pooler Connection
DATABASE_URL="postgresql://postgres.[REF]:[PASSWORD]@aws-0-us-east-2.pooler.supabase.com:5432/postgres?sslmode=require"

# Google Gemini API Key
GEMINI_API_KEY="your-gemini-api-key"

# Vonage Video API Credentials
VONAGE_APPLICATION_ID="your-vonage-application-id"
VONAGE_PRIVATE_KEY_PATH="./private.key"

# Next.js Server Port
PORT=3000
```

> **Note:** Place your Vonage private key file as `private.key` in the project root.

### 3. Initialize the Database Schema
Execute the automatic schema bootstrap to build the Supabase PostgreSQL tables:
```bash
node scripts/setup-supabase-schema.mjs
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Verify All Systems
Run the end-to-end verification suite testing Supabase connectivity, Gemini token generation, rate limiters, and Vonage credentials:
```bash
node scripts/verify-all.mjs
```

---

## 🚀 Live Production Deployments

- **Primary Vercel Production:** [https://deadstock-gdg.vercel.app/](https://deadstock-gdg.vercel.app/)
- **Live Local Tunnel:** `https://washbowl-haiku-county.ngrok-free.dev`

---

## ⌨️ Atelier Keyboard Shortcuts

- <kbd>⌘</kbd> + <kbd>K</kbd> / <kbd>Ctrl</kbd> + <kbd>K</kbd> — Open Global Atelier Command Palette
- <kbd>Esc</kbd> — Dismiss modals / command menu
- Interactive tooltips on all fabric swatches, zone maps, and audit badges

---

## 👥 Atelier Team & Acknowledgments

- **Lead Upcycler & Architecture:** **Sathvik** (Lead Designer & Engineer)
- **Atelier Personas:** Elena Ramos (Technical Patternist), Marcus Vance (Sustainability Auditor)
- Built for the **Google Developer Groups (GDG) Hackathon**.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
