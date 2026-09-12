# DEADSTOCK LIVE LAB 🧵✨

> **"DESIGN WITH WHAT EXISTS."**  
> *A real-time, material-constrained co-design atelier turning surplus textile deadstock into 100% traceable circular fashion capsules using Google Gemini Multimodal AI and Vonage Video WebRTC.*

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-3.6%20Flash-4285F4?style=flat-square&logo=google)](https://ai.google.dev/)
[![Vonage Video](https://img.shields.io/badge/Vonage%20Video-WebRTC-black?style=flat-square&logo=vonage)](https://developer.vonage.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL%2017-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)

---

## 📖 Overview

Every year, over 92 million tons of textiles are discarded, while ateliers and warehouses store millions of meters of premium "deadstock" remnants that never get used because designing around irregular, limited-yardage inventory is notoriously difficult.

**Deadstock Live Lab** turns physical scarcity into creative fuel:
1. **Physical Material Scan:** Point your camera at real fabric remnants. **Google Gemini 3.6 Flash** authenticates the weave, dominant color, weight class, and estimated usable yardage into an authoritative inventory.
2. **Inviolable Constraints:** Hard rules strictly forbid ungrounded virgin textiles, restrict capsule looks to available yardage, and mandate verified stock.
3. **Manufacturable Capsule Generation:** Gemini synthesizes complete looks where every single panel, collar, facing, and sleeve is explicitly linked to an identified surplus lot.
4. **Signature Material Trace:** Hovering or clicking any garment region renders an animated SVG particle trace path connecting the digital garment back to the physical fabric roll.
5. **Live Video Co-Design & Causal Disruption:** In a creative war room powered by **Vonage Video WebRTC**, designers collaborate live. If a fabric is quarantined (e.g. yardage shortage), causal dependencies propagate in real-time: affected looks turn amber, while untouched designs remain locked. Designers can then perform targeted zone re-synthesis without re-generating the entire collection.
6. **Manufacturing Tech Pack:** Generates an exportable engineering dossier and lookbook detailing panel allocation, 100% traceability, and signed decision audit trails in **Supabase PostgreSQL 17**.

---

## 🎨 Visual North Star & UI Motion

Built according to an award-winning editorial fashion-tech design language:
* **Palette:** Ink/Night (`#080A18`), Deep Blue (`#10184A`), Royal Cobalt (`#263CFF`), Electric Blue (`#4D74FF`), Fluorescent Yellow (`#F2FF55`), Warm White (`#F7F7EE`), and Paper (`#F1F0E8`).
* **Micro-interactions:** Custom magnetic cursor with contextual labels (`INSPECT`, `TRACE`, `JOIN`), industrial corner notches, scanline reticles, and 1.04x zoom hover states.
* **Storytelling:** Interactive 5-Beat narrative story (*First we look → Then we understand → Then we restrict → Then we design → Then humans decide*).

---

## 🏗️ Architecture

```
Physical Remnants (Denim, Silk, Twill, Corduroy)
                   │
                   ▼
┌─────────────────────────────────────────────────────────┐
│              Google Gemini 3.6 Flash                    │
│     Multimodal Vision & Pattern Zone Decomposition      │
└──────────────────────────┬──────────────────────────────┘
                           │ Structured JSON Specs
                           ▼
┌─────────────────────────────────────────────────────────┐
│             Deterministic Constraint Engine             │
│        Zero-Virgin Checks & 2D Pattern Allocation       │
└──────────────────────────┬──────────────────────────────┘
                           │
             ┌─────────────┴─────────────┐
             ▼                           ▼
┌─────────────────────────┐ ┌─────────────────────────┐
│   Vonage Video WebRTC   │ │  Supabase PostgreSQL 17  │
│  Real-Time War Room     │ │   Authoritative Ledger    │
│  Live Video & Audio     │ │   & Decision Audit Trail  │
└─────────────────────────┘ └─────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites
* Node.js 18+
* A Google Gemini API Key
* A Vonage Video API Application ID & Private Key
* A Supabase PostgreSQL database URL

### 1. Clone & Install
```bash
git clone https://github.com/PuttaSathvik16/Deadstock-GDG.git
cd Deadstock-GDG
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and fill in your keys:
```bash
cp .env.example .env
```

```env
DATABASE_URL="postgresql://postgres.[REF]:[PASS]@[HOST]:5432/postgres"
GEMINI_API_KEY="your-gemini-api-key"
VONAGE_APPLICATION_ID="your-vonage-app-id"
VONAGE_PRIVATE_KEY_PATH="./private.key"
PORT=3000
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Run Verification Tests
```bash
node scripts/verify-all.mjs
```

---

## 👥 Lead Upcycler & Team
* **Lead Upcycler:** Sathvik (Atelier Lead)
* **Atelier Collaboration:** Elena (Technical Patternist), Mara (Textile Curator)

---

## 📄 License
MIT License. Built for the Google Developer Groups (GDG) Hackathon.
