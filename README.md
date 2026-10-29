# AICTE Integrated Complaint & Overlap Tracking Portal (SIH 2026 — PS 264)

> **PROPOSED SIH 2026 PROTOTYPE — AICTE PROBLEM STATEMENT 264**  
> *Research, demonstration, and evaluation prototype. Not an officially deployed Government of India or AICTE public service.*

---

## 🏛️ Executive Summary & Problem Addressed

The **All India Council for Technical Education (AICTE)** oversees thousands of approved technical colleges, engineering institutes, polytechnics, management schools, and pharmacy institutions across India. Grievances and regulatory filings are handled across multiple independent administrative divisions:
1. **Regulation Bureau (RB)**: Faculty cadre ratios, 7th CPC salary compliance, unapproved courses, intake caps.
2. **Public Grievance Redressal Cell (PGRC)**: Student admissions, fee extortion, withholding of marksheet certificates, ragging, hostel harassment.
3. **Legal Cell**: High Court writ petitions, judicial stay orders, formal affidavits.
4. **Approval Bureau**: Annual Extension of Approval (EoA), land and infrastructure inspections.
5. **Regional Directorates**: Field verification and state-level investigations across North, South, East, West, and Central regions.

### The Problem (Siloed Inquiries & Duplicate Overhead)
When an aggrieved student lodges a complaint with PGRC regarding illegal fee retention, and a faculty association simultaneously files an RB petition concerning cadre shortage against the *same institution*, both bureaus traditionally initiate parallel, uncoordinated inquiries. This leads to duplicate inspections, contradictory findings, legal vulnerability, and administrative delays.

### The Solution (PS 264 Centralized Case Intelligence)
This solution provides an **Integrated Cross-Bureau Intelligence Platform** that:
- Centralizes all institution-related complaints across AICTE divisions.
- Deploys a **genuine, multi-signal overlap detection engine** to identify parallel proceedings in real time.
- **Strictly disambiguates** a common institution from genuinely overlapping allegations to prevent false-positive case mergers.
- Creates **Shared Cross-Bureau Coordination Records** with designated Lead Bureaus, joint directives, and harmonized timelines.
- Enforces statutory SLA deadline tracking, automatic overdue escalation, and consequential action audit logging.
- Offers a classic **Government of India administrative visual theme** and **complete trilingual support** in English (`en-IN`), Hindi (`hi-IN`), and Marathi (`mr-IN`).

---

## 🔬 Genuine Overlap Detection Engine

Unlike mock systems that return hardcoded random percentages, this implementation runs a deterministic, explainable algorithm comparing active database records.

### Mathematical Formulation
For any complaint pair $(C_A, C_B)$ targeting an institution:

$$\text{Composite Score} = (w_{\text{inst}} \cdot S_{\text{inst}}) + (w_{\text{cat}} \cdot S_{\text{cat}}) + (w_{\text{sem}} \cdot S_{\text{sem}}) + (w_{\text{time}} \cdot S_{\text{time}})$$

Where:
1. **Institution Identity ($S_{\text{inst}}$)**:
   - Evaluated against verified permanent AICTE identifiers (`AICTE-1-4527891234`).
   - If $S_{\text{inst}} = 0$, composite score is strictly $0$ (no cross-institution false collisions).
2. **Category Taxonomy Correlation ($S_{\text{cat}}$)**:
   - Distance matrix computed across AICTE regulatory categories.
3. **NLP Semantic Text Overlap ($S_{\text{sem}}$)**:
   - Text tokenization, domain stopword filtration, and word normalization.
   - **TF-IDF Cosine Similarity** + **Bigram & Trigram Jaccard Index** on core grievance narrative:
     $$S_{\text{sem}} = 0.75 \cdot \text{Cosine}_{\text{TF-IDF}} + 0.25 \cdot \text{Jaccard}_{\text{N-Gram}}$$
4. **Timeline Proximity Decay ($S_{\text{time}}$)**:
   - Exponential proximity decay reflecting academic term cycles:
     $$S_{\text{time}} = \max\left(0, 1 - \frac{\Delta \text{days}}{180}\right)$$

### False-Positive Protection (Common Institution Disambiguation)
If two complaints target the same college but involve unrelated subjects (e.g. Fee Refund vs Faculty Arrears), the engine categorizes the pair as `COMMON_INSTITUTION_DISTINCT` and caps the similarity score below **$0.38$**. This guarantees that high grievance density at a large university does not trigger false automatic merges.

### Ground-Truth Benchmark Results
Evaluated against 8 labelled test pairs covering true duplicates, parallel cross-bureau filings, distinct claims on common colleges, and cross-institution negatives:
- **Precision**: **100.0%** (Zero false-positive mergers)
- **Recall**: **80.0%**
- **F1-Score**: **88.9%**
- **False-Positive Rate**: **0.0%**

---

## 🌐 Complete Trilingual Support (`en-IN`, `hi-IN`, `mr-IN`)

The entire portal is localized using `i18next` with **100% key parity** across all 141 translation tokens:
- **English (`en-IN`)**: Administrative Indian English.
- **Hindi (`hi-IN`)**: राजभाषा हिन्दी (Rajbhasha Hindi) with formal administrative terminology.
- **Marathi (`mr-IN`)**: राज्यभाषा मराठी (State Language Marathi) with standard Devanagari typography (`Noto Sans Devanagari`).

Language switching takes effect immediately without page reload and persists across sessions in `localStorage`.

---

## 🎨 Administrative Visual Theme

Designed to meet the Government of India (GoI) Guidelines for Indian Government Websites (GIGW):
- **Primary Navy**: `#1B365D` (Institutional Authority)
- **Background**: `#F4F6F9` (Clean Administrative Off-White)
- **Borders & Dividers**: `#DCE2E6` / `#E2E8F0`
- **Saffron Accent**: `#D9531E` (Restrained National Accent)
- **Tricolor Ribbon Bar**: Saffron (`#FF9933`), White (`#FFFFFF`), Green (`#138808`)
- **Typography**: Inter & Noto Sans Devanagari
- **WCAG AA Compliance**: High contrast ratios on all text and status badges.

---

## 📂 System Architecture & Directory Structure

```
SIH264/
├── prisma/
│   ├── schema.prisma           # SQLite schema for zero-config local development
│   ├── schema.postgresql.prisma# PostgreSQL schema for production deployment
│   └── dev.db                  # Pre-seeded relational database (15 users, 50 colleges, 220 cases)
├── server/
│   ├── index.js                # Express REST API & 60s background SLA watchdog
│   ├── seed.js                 # Realistic seed generator
│   ├── middleware/
│   │   └── auth.js             # JWT authentication & RBAC authorization
│   ├── services/
│   │   └── overlapEngine.js    # Genuine multi-signal overlap detection & benchmark evaluator
│   └── routes/
│       ├── auth.js             # Officer authentication (/login, /me)
│       ├── complaints.js       # Centralized complaint repository & CSV export
│       ├── institutions.js     # 360° institution profile & compliance history
│       ├── overlaps.js         # Overlap review, scan trigger, benchmark evaluation
│       ├── coordination.js     # Shared cross-bureau mandates & directive actions
│       ├── reports.js          # Statutory summary, bureau, region, ageing metrics
│       ├── network.js          # Graph nodes & edges for Case Relationship Network
│       ├── notifications.js    # Live officer notification feed
│       └── auditLogs.js        # Statutory consequential action audit trail
├── src/
│   ├── components/layout/      # Header, Sidebar, Layout, Tricolor bar
│   ├── context/AuthContext.jsx # JWT session context & demo role switching
│   ├── i18n/                   # en.json, hi.json, mr.json with 100% key parity
│   ├── pages/
│   │   ├── Login.jsx           # Administrative sign-in with 1-click demo accounts
│   │   ├── Dashboard.jsx       # Real-time KPIs, charts, overlap alert banner
│   │   ├── Complaints.jsx      # Grievance list, multi-filter, search, register modal
│   │   ├── ComplaintDetail.jsx # Case particulars, status transition, inter-bureau transfer
│   │   ├── Institutions.jsx    # Accredited colleges directory
│   │   ├── InstitutionProfile.jsx # 360° profile with consolidated grievances & overlaps
│   │   ├── Overlaps.jsx        # Overlap review center, explainability signals, benchmark modal
│   │   ├── OverlapDetail.jsx   # Side-by-side comparison & shared directive dispatcher
│   │   ├── Coordination.jsx    # Cross-bureau mandates & inter-bureau timeline
│   │   ├── CaseNetwork.jsx     # Interactive Case Relationship Intelligence Graph
│   │   ├── Reports.jsx         # Statutory Bureau, Regional, Ageing & Trend reports
│   │   └── AuditLogs.jsx       # Consequential action audit log trail
│   ├── services/api.js         # Unified Axios/Fetch API client with auth headers
│   └── index.css               # Official administrative design tokens & styles
└── test/
    └── system.test.js          # Automated verification test suite (37 tests)
```

---

## 🚀 Quickstart & Setup Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 1. Install Dependencies
```bash
npm install
```

### 2. Verify Database & Seed Data
The project includes a pre-seeded SQLite database (`prisma/dev.db`). To re-seed fresh data:
```bash
npm run seed
```

### 3. Run Automated System Test Suite
Verify that all 37 unit and integration tests pass (Authentication, RBAC, Overlap Engine, False-Positive Prevention, Benchmark Accuracy, Multilingual Parity, Statutory Reports):
```bash
npm test
```

### 4. Start the Application
Start the backend Express server and the Vite dev server:

**Terminal 1 (Backend Server on Port 5001):**
```bash
npm run server
```

**Terminal 2 (Frontend Client on Port 5173):**
```bash
npm run dev
```

Open your browser at `http://localhost:5173`.

---

## 🔑 Demo Officer Accounts

You can sign in using any of the pre-configured officer accounts, or click the **One-Click Demo Credentials** pills on the login page:

| Role | Officer Name | Department | Email | Password |
|---|---|---|---|---|
| **ADMIN** | Dr. Rajesh Kumar | HQ Administration | `admin@aicte.gov.in` | `admin123` |
| **BUREAU_HEAD** | Ms. Priya Sharma | Regulation Bureau (RB) | `priya@aicte.gov.in` | `admin123` |
| **BUREAU_HEAD** | Mr. Anil Verma | Public Grievance (PGRC) | `anil@aicte.gov.in` | `admin123` |
| **BUREAU_HEAD** | Dr. Sunita Rao | Legal Cell | `sunita@aicte.gov.in` | `admin123` |
| **OFFICER** | Mr. Vikram Singh | Regulation Bureau (RB) | `vikram@aicte.gov.in` | `admin123` |
| **OFFICER** | Mr. Arjun Patel | Public Grievance (PGRC) | `arjun@aicte.gov.in` | `admin123` |
| **VIEWER** | Dr. Meena Joshi | Public Oversight | `meena@aicte.gov.in` | `admin123` |

---

## 🛡️ Production PostgreSQL Deployment

To deploy on a production PostgreSQL database:
1. Update `DATABASE_URL` in `.env`:
   ```bash
   DATABASE_URL="postgresql://username:password@localhost:5432/aicte_db?schema=public"
   ```
2. Replace `prisma/schema.prisma` with `prisma/schema.postgresql.prisma`:
   ```bash
   cp prisma/schema.postgresql.prisma prisma/schema.prisma
   npx prisma generate
   npx prisma db push
   npm run seed
   ```

---

## 📄 License & Attribution
Developed for **Smart India Hackathon 2026 — Problem Statement 264 (AICTE)**.  
All sample institutions, complainant narratives, and officer accounts are synthetic records created for research and prototype demonstration purposes.
