# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is
Benefits navigator app. Helps low-income users find/apply for government assistance.
Demo loop: signup → onboarding → matched programs → upload doc → autofill form → chat.

## Tech stack
- Frontend: React 19 + Vite + Tailwind CSS, hosted Vercel
- Backend: Node.js + Express 5 (ESM), hosted TBD
- DB + Auth: Supabase (Postgres + Auth + pgvector for RAG)
- LLM + Embeddings: Qwen via OpenAI-compat SDK (`qwen-turbo` chat, `text-embedding-v3` 1536-dim)
- OCR: Tesseract.js + pdfjs-dist (client-side)

## Commands

```bash
# Backend (port 3001)
cd backend && npm install
npm run dev        # node --watch index.js

# Frontend (port 5173)
cd frontend && npm install
npm run dev        # vite
npm run build      # vite build
npm run lint       # eslint .

# One-time setup
# 1. Run supabase/seed.sql in Supabase SQL editor
# 2. Index embeddings after seeding:
curl -X POST http://localhost:3001/api/embed/all
```

No test suite currently exists.

## Architecture

### Request flow
Frontend (Supabase anon key) → Supabase Auth → Backend (Bearer token validated in `middleware/auth.js` via `supabase.auth.getUser()`) → supabaseAdmin (service role, bypasses RLS)

### Auth state machine (`AuthContext.jsx`)
`undefined` = loading, `null` = logged out, `{...}` = authenticated.
Route guards: `AuthGuard` redirects to `/login` if null; `OnboardingGuard` redirects to `/onboarding` if no `user_profile` row.

### Data stores
- `user_profile` — one row per user, written at onboarding completion
- `user_facts` — key-value facts (field_key + field_value) from onboarding/docs/chat/form edits. Conflict resolution: document beats onboarding, form/chat beats document.
- `user_programs` — eligibility scores + status per program per user
- `documents` — upload metadata; file_url nulled after 24h by `cleanup.js`
- `programs` + `embeddings` — public read, no RLS

### Key data flows

**Onboarding → Eligibility:**
11-step wizard (`pages/onboarding/index.jsx`) → write `user_profile` + all fields to `user_facts` (source=onboarding) → `POST /api/eligibility/score` → `eligibilityEngine.js` scores 16 programs → upserts `user_programs` → redirect `/dashboard`

**Document Upload → Autofill:**
`DocumentUploader.jsx` → Supabase Storage upload → `ocr.js` (Tesseract, PDF via pdfjs-dist page-1-to-canvas) → `POST /api/extract/facts` → `factExtractor.js` (Qwen) → `ExtractionReview.jsx` user confirms → `POST /api/extract/confirm` → upsert `user_facts`

**Chat → RAG:**
`useChat.js` sends message + last 10 history → `POST /api/chat/message` → embed query (Qwen) → `ragService.js` calls `match_embeddings()` (pgvector cosine, top 5) → system prompt with user profile + RAG chunks → Qwen generates response. Background: `detectAndSaveFacts()` extracts new facts from user messages.

**Form Autofill:**
`ApplicationForm.jsx` → `getFormSchema(programName)` → `FormRenderer.jsx` runs `mapFactsToForm(fields, facts)` via `autofill.js` fieldMap → blue = autofilled, yellow = required+missing. Field edits → `UserContext.upsertFact()`.

### Eligibility engine (`backend/services/eligibilityEngine.js`)
Income buckets mapped to midpoints: `<15k→7500`, `15-30k→22500`, `30-50k→40000`, `50k+→75000`.
Score: `>=0.8 matched/total = strong`, `>=0.5 = possible`, else `unlikely`.
Known gaps: non-expansion state Medicaid, senior SNAP gross income exemption, student SNAP rules — not modeled.

### Form schemas (`frontend/src/components/forms/schemas/`)
`getFormSchema(programName)` returns sections+fields for snap, medicaid, unemployment, or generic fallback.

## Environment variables

**Backend (`backend/.env`):**
```
SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, QWEN_API_KEY, PORT=3001
```

**Frontend (`frontend/.env`):**
```
VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_BACKEND_URL, VITE_GOOGLE_CLIENT_ID
```

## Key rules
- Never store full SSN — last 4 only (`factExtractor.js` strips full SSN before saving)
- Raw documents deleted within 24h of upload (`cleanup.js` + private storage bucket)
- Every AI response appends: "This is informational guidance only, not legal or financial advice."
- Eligibility language: always "may qualify", never "you qualify"
- RLS enforced on: `user_profile`, `documents`, `user_programs`, `user_facts`
- `programs` + `embeddings`: public read, no RLS

## What's cut from MVP
Do NOT implement unless asked: Playwright scraping

## Behavioral guidelines

**Think before coding.** State assumptions. Ask when unclear. Present tradeoffs.

**Simplicity first.** Minimum code. No speculative features, abstractions, or configurability.

**Surgical changes.** Touch only what the task requires. Match existing style. Remove only imports/vars that YOUR changes made unused.

**Goal-driven.** Define verifiable success criteria before starting. For multi-step tasks, state a brief plan with verification steps.
