# AccessAid — Master Context

Benefits navigator app. Helps low-income users find/apply for government assistance.

**Demo loop:** signup → onboarding → matched programs → upload doc → autofill form → chat

---

## Tech Stack

| Layer | Tech | Host |
|-------|------|------|
| Frontend | React 19 + Vite + Tailwind CSS | Vercel |
| Backend | Node.js + Express 5 (ESM) | Local / TBD |
| DB + Auth | Supabase (Postgres + Auth) | Supabase |
| Vector DB | pgvector (on Supabase) | Supabase |
| LLM + Embeddings | Qwen via OpenAI-compat SDK | Alibaba Cloud |
| OCR | Tesseract.js (client-side) | Browser |
| PDF render | pdfjs-dist (client-side) | Browser |

---

## Repo Structure

```
AccessAid/
├── backend/               Node.js API server
│   ├── index.js           Express app entrypoint — registers all routes
│   ├── .env               SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, QWEN_API_KEY, PORT
│   ├── lib/
│   │   └── supabaseAdmin.js   Supabase client using SERVICE_ROLE_KEY (bypasses RLS)
│   ├── middleware/
│   │   ├── auth.js            requireAuth — validates Bearer token via supabase.auth.getUser()
│   │   └── errorHandler.js    Global Express error handler
│   ├── routes/
│   │   ├── chat.js            POST /api/chat/message
│   │   ├── eligibility.js     POST /api/eligibility/score
│   │   ├── embed.js           POST /api/embed/all (admin — index programs)
│   │   ├── extract.js         POST /api/extract/facts, POST /api/extract/confirm
│   │   └── programs.js        GET /api/programs
│   └── services/
│       ├── cleanup.js          cleanupExpiredDocuments() — delete docs >24h old
│       ├── eligibilityEngine.js scoreEligibility(userProfile, program)
│       ├── factExtractor.js    extractFacts(ocrText, documentType)
│       ├── qwen.js             chat() + embed() — Qwen API wrappers
│       └── ragService.js       getRelevantChunks(query) — pgvector cosine search
│
├── frontend/              React SPA
│   ├── src/
│   │   ├── main.jsx           React mount point
│   │   ├── App.jsx            AuthProvider + UserProvider + RouterProvider
│   │   ├── router.jsx         All routes, AuthGuard + OnboardingGuard wrapping
│   │   ├── context/
│   │   │   ├── AuthContext.jsx    user state (undefined=loading, null=logged out, obj=authed)
│   │   │   └── UserContext.jsx    profile + facts + upsertFact()
│   │   ├── hooks/
│   │   │   ├── useAuth.js         signIn/signOut/signUp/signInWithGoogle + user
│   │   │   ├── useChat.js         sendMessage() + history state, calls /api/chat/message
│   │   │   ├── usePrograms.js     user_programs joined with programs, ordered by score
│   │   │   └── useUserFacts.js    thin wrapper around UserContext facts
│   │   ├── lib/
│   │   │   ├── auth.js            signIn/signOut/signUp/signInWithGoogle wrappers
│   │   │   ├── autofill.js        fieldMap + mapFactsToForm() — maps facts → form fields
│   │   │   ├── ocr.js             extractTextFromFile() — Tesseract + pdfjs-dist
│   │   │   └── supabase.js        Supabase client using VITE_SUPABASE_ANON_KEY
│   │   ├── pages/
│   │   │   ├── Landing.jsx                /
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx              /login
│   │   │   │   ├── Signup.jsx             /signup
│   │   │   │   └── AuthCallback.jsx       /auth/callback (OAuth redirect handler)
│   │   │   ├── onboarding/
│   │   │   │   ├── index.jsx              /onboarding — 11-step wizard
│   │   │   │   └── steps/                 FullName Age State Employment Income
│   │   │   │                              HouseholdSize Citizenship Children
│   │   │   │                              Disability Student Consent
│   │   │   ├── dashboard/
│   │   │   │   ├── index.jsx              /dashboard — main hub
│   │   │   │   ├── MatchedPrograms.jsx    strong/possible matches grid
│   │   │   │   ├── ApplicationTracker.jsx status table for acted-on programs
│   │   │   │   ├── QuickActions.jsx       Upload / Search / Ask buttons
│   │   │   │   └── SearchModal.jsx        program search + manual add
│   │   │   ├── programs/
│   │   │   │   ├── ProgramDetail.jsx      /programs/:id
│   │   │   │   └── ApplicationForm.jsx    /programs/:id/apply — form + chat panel
│   │   │   ├── documents/
│   │   │   │   └── index.jsx              /documents — upload list
│   │   │   └── settings/
│   │   │       └── index.jsx              /settings — profile view + delete facts
│   │   └── components/
│   │       ├── chat/
│   │       │   ├── ChatMessage.jsx        Single bubble (user/assistant)
│   │       │   ├── ChatPanel.jsx          Embedded panel (ApplicationForm right column)
│   │       │   └── ChatWidget.jsx         Floating modal (dashboard/other pages)
│   │       ├── documents/
│   │       │   ├── DocumentTypePicker.jsx Doc type dropdown
│   │       │   ├── DocumentUploader.jsx   Full upload → OCR → extract → review flow
│   │       │   └── ExtractionReview.jsx   Confirm/edit extracted facts before saving
│   │       ├── forms/
│   │       │   ├── FormField.jsx          Single input (blue=autofilled, yellow=required)
│   │       │   ├── FormRenderer.jsx       Sectioned form with autofill + progress bar
│   │       │   └── schemas/
│   │       │       ├── index.js           getFormSchema(programName) — lookup + generic fallback
│   │       │       ├── snap.js            SNAP form schema (3 sections, 9 fields)
│   │       │       ├── medicaid.js        Medicaid form schema
│   │       │       └── unemployment.js    Unemployment Insurance form schema
│   │       ├── layout/
│   │       │   ├── AuthGuard.jsx          Redirects to /login if not authed
│   │       │   ├── OnboardingGuard.jsx    Redirects to /onboarding if no profile
│   │       │   └── Sidebar.jsx            Persistent left nav
│   │       ├── programs/
│   │       │   └── ProgramCard.jsx        Card used in MatchedPrograms
│   │       └── ui/
│   │           Badge Button Card Input Modal ProgressBar Select Spinner Toast
│   └── .env                VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY,
│                           VITE_BACKEND_URL, VITE_GOOGLE_CLIENT_ID
│
├── supabase/
│   ├── migrations/
│   │   ├── 001_init_tables.sql    All tables (schema below)
│   │   ├── 002_rls_policies.sql   RLS policies + storage bucket
│   │   └── 003_pgvector.sql       vector extension + ivfflat index + match_embeddings()
│   └── seed.sql                   16 programs seeded with eligibility_rules JSON
│
├── docs/                  (empty — fill from this file)
└── CLAUDE.md              Project rules for Claude
```

---

## Database Schema

### `user_profile` (PK: user_id)
| Column | Type | Notes |
|--------|------|-------|
| user_id | uuid | FK → auth.users, cascade delete |
| full_name | text | |
| age | integer | |
| state | text | 2-letter abbreviation |
| employment_status | text | employed/unemployed/part-time/retired/student |
| income | text | Bucket: <15k / 15-30k / 30-50k / 50k+ |
| household_size | integer | |
| citizenship_status | text | citizen/permanent_resident/visa/undocumented/prefer_not_to_say |
| has_children | boolean | |
| children_count | integer | |
| disability_status | text | yes/no/prefer_not_to_say |
| student_status | text | yes/no |
| language_preference | text | default 'en' |
| delete_docs_after_extraction | boolean | default false |

RLS: user can only read/write own row.

### `programs` (PK: id)
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | |
| name | text | |
| category | text | food/health/utilities/financial/housing/education |
| description_en | text | |
| eligibility_rules | jsonb | Structure varies by program (see Eligibility Engine) |
| required_documents | text[] | |
| application_url | text | |
| deadline | text | |
| states_available | text[] | default '{all}' |
| is_user_added | boolean | true for manually added programs |

No RLS — public read.

### `user_programs` (PK: id, UNIQUE: user_id + program_id)
| Column | Type | Notes |
|--------|------|-------|
| user_id | uuid | FK → auth.users |
| program_id | uuid | FK → programs |
| eligibility_score | text | strong/possible/unlikely |
| status | text | matched/in_progress/submitted/approved/denied |
| missing_docs | text[] | reasons score wasn't strong |
| notes | text | LLM-generated personalized explanation |

RLS: user sees only own rows.

### `documents` (PK: id)
| Column | Type | Notes |
|--------|------|-------|
| user_id | uuid | FK → auth.users |
| document_type | text | drivers_license/passport/w2/pay_stub/etc |
| extraction_status | text | pending/completed/failed |
| fields_extracted | integer | count of non-null facts found |
| extracted_text | text | raw OCR output |
| file_url | text | Storage path — nulled out after 24h |
| file_name | text | Original filename |
| uploaded_at | timestamptz | |
| file_deleted_at | timestamptz | Set when file purged |

RLS: user sees only own rows.

### `user_facts` (PK: id, UNIQUE: user_id + field_key)
| Column | Type | Notes |
|--------|------|-------|
| user_id | uuid | FK → auth.users |
| field_key | text | e.g. full_name, income, employer_name |
| field_value | text | |
| source | text | onboarding/document_type/form/chat |
| updated_at | timestamptz | |

Conflict resolution: document beats onboarding, form/chat beats document.
RLS: user sees only own rows.

### `embeddings` (PK: id, UNIQUE: source_type + source_id)
| Column | Type | Notes |
|--------|------|-------|
| source_type | text | 'program' (only type currently) |
| source_id | uuid | programs.id |
| content_chunk | text | Program name + description + eligibility + required_docs |
| embedding | vector(1536) | Qwen text-embedding-v3 |

No RLS — public read. IVFFlat index with 100 lists for cosine search.

---


## API Routes

All routes under `/api/*`. Protected routes require `Authorization: Bearer <supabase_access_token>`.

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | /api/programs | No | List all programs |
| POST | /api/eligibility/score | Yes | Score all programs for user, upsert user_programs |
| POST | /api/chat/message | Yes | Chat message with RAG context |
| POST | /api/extract/facts | Yes | Extract facts from OCR text |
| POST | /api/extract/confirm | Yes | Save confirmed facts to user_facts |
| POST | /api/embed/all | No | Index all programs into embeddings (admin, run once) |

---

## Key Data Flows

### Onboarding → Eligibility
1. User fills 11-step wizard in `pages/onboarding/index.jsx`
2. On complete: write `user_profile` + write every field to `user_facts` (source=onboarding)
3. Call `POST /api/eligibility/score`
4. Backend `eligibilityEngine.js` scores each program → upserts `user_programs`
5. Redirect to `/dashboard`

### Document Upload → Autofill
1. `DocumentUploader.jsx`: user picks doc type + file
2. File uploaded to Supabase Storage: `documents/{user_id}/{doc_type}/{timestamp}_{filename}`
3. `documents` row inserted with status=pending
4. `ocr.js`: Tesseract.js reads file (PDF: render page 1 to canvas → Tesseract)
5. `POST /api/extract/facts` → `factExtractor.js` → Qwen extracts fields per SCHEMAS map
6. User reviews on `ExtractionReview.jsx`
7. `POST /api/extract/confirm` → upsert to `user_facts` (source=document_type)
8. File auto-deleted by `cleanup.js` after 24h

### Chat → RAG
1. `useChat.js` sends message + last 10 history to `POST /api/chat/message`
2. Backend embeds query via Qwen `text-embedding-v3`
3. `ragService.js` calls `match_embeddings()` SQL function → top 5 chunks
4. System prompt built with user profile + RAG chunks
5. Qwen `qwen-turbo` generates response
6. Background: `detectAndSaveFacts()` parses user message for new facts → upserts to `user_facts`

### Form Autofill
1. `ApplicationForm.jsx` loads program + calls `getFormSchema(programName)`
2. `FormRenderer.jsx` runs `mapFactsToForm(fields, facts)` using `fieldMap` in `autofill.js`
3. Matched fields pre-filled blue. Unmatched required fields highlighted yellow.
4. On field edit: upsert to `user_facts` via `UserContext.upsertFact()`

---

## Auth Flow

- Supabase Auth with email/password + Google OAuth
- Google OAuth callback URL: `https://prixypextuugdasthneh.supabase.co/auth/v1/callback`
- Frontend: `AuthContext.jsx` holds `user` state via `onAuthStateChange`
- `user === undefined` = loading, `null` = logged out, `{...}` = authenticated
- `AuthGuard.jsx`: redirects to `/login` if null
- `OnboardingGuard.jsx`: redirects to `/onboarding` if no `user_profile` row
- Backend auth: `middleware/auth.js` extracts Bearer token, calls `supabase.auth.getUser(token)`

---

## Eligibility Engine (`backend/services/eligibilityEngine.js`)

Income buckets mapped to midpoints: `<15k→7500`, `15-30k→22500`, `30-50k→40000`, `50k+→75000`

Rules checked (if present in program's `eligibility_rules`):
- Income threshold (annual vs monthly auto-detected by threshold > 5000)
- State availability
- Employment status array match
- Children required
- Disability required
- `eligible_categories` (age_65_plus, child_under_19, child_under_5, undergraduate, school_age_children)
- Minimum age
- Student required
- Renter requirement (auto-passes — can't determine from profile)

Score: `>= 0.8 matched/total = strong`, `>= 0.5 = possible`, else `unlikely`

LLM note generated (Qwen qwen-turbo) for strong + possible only.

**Known gaps:** Non-expansion state Medicaid, senior SNAP gross income exemption, student SNAP rules — not modeled. LLM note may catch these in text but scoring may be wrong.

---

## Programs (16 seeded)

| Program | Category | Key income threshold |
|---------|----------|---------------------|
| SNAP | food | 130% FPL monthly by household size |
| WIC | food | 185% FPL monthly, pregnancy/child<5 required |
| School Meals | food | 130-185% FPL annual, children required |
| Medicaid | health | 138% FPL annual (expansion states) |
| CHIP | health | 200% FPL annual, child<19 required |
| LIHEAP | utilities | 150% FPL annual |
| Lifeline | utilities | 135% FPL annual |
| TANF | financial | ~50% FPL monthly, children required |
| SSI | financial | age 65+ or disabled, $967/mo max |
| SSDI | financial | disabled + work history |
| Unemployment | financial | laid off, no income limit |
| Section 8 | housing | 50% AMI (varies by county) |
| Emergency Rental | housing | 80% AMI, renter required |
| Pell Grant | education | undergrad + FAFSA |
| FAFSA | education | no income limit |
| Social Security | financial | age 62+, 40 work credits |

---

## Privacy Rules (hard constraints)

- Never store full SSN — `ssn_last4` only (`factExtractor.js` strips full SSN)
- Raw documents deleted within 24h (`cleanup.js` + storage bucket is private)
- Every AI response appended with disclaimer: `"This is informational guidance only and does not constitute legal or financial advice."`
- Eligibility language: always "may qualify", never "you qualify"
- RLS enforced on: `user_profile`, `documents`, `user_programs`, `user_facts`
- `programs` + `embeddings`: public read, no RLS

---


---

## What's Cut from MVP (do NOT implement unless asked)

- Playwright scraping (programs hardcoded + seed.sql only)
- PDF autofill with pdf-lib (forms are HTML, not PDF fill)
- Gmail API / email monitoring
- ElevenLabs voice
- Translation caching / multilingual UI (i18next)
- Appeal help flow for denied applications
- Benefits.gov API integration
- Multi-language onboarding

---

## Running Locally

```bash
# Backend
cd backend
npm install
# Add SUPABASE_SERVICE_ROLE_KEY to .env
npm run dev       # runs on :3001

# Frontend
cd frontend
npm install
npm run dev       # runs on :5173

# One-time: seed programs
# Run supabase/seed.sql in Supabase SQL editor

# One-time: index embeddings (after seeding)
curl -X POST http://localhost:3001/api/embed/all
```
