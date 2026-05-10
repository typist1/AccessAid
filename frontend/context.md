# Frontend Context

React 19 + Vite + Tailwind CSS SPA.

**Start:** `npm run dev` (runs on :5173)  
**Build:** `npm run build` → `dist/`  
**Deploy:** Vercel

---

## File Map

```
frontend/src/
├── main.jsx              React mount point. Renders <App /> into #root.
├── App.jsx               Root: AuthProvider → UserProvider → RouterProvider
├── router.jsx            All routes with AuthGuard + OnboardingGuard wrapping
│
├── context/
│   ├── AuthContext.jsx   Global auth state. user=undefined(loading)/null(out)/obj(in)
│   └── UserContext.jsx   Global profile + facts. upsertFact(), fetchProfile(), fetchFacts()
│
├── hooks/
│   ├── useAuth.js        { user, signIn, signOut, signUp, signInWithGoogle }
│   ├── useChat.js        { history, loading, sendMessage } — calls /api/chat/message
│   ├── usePrograms.js    { programs, loading, refetch } — user_programs joined with programs
│   └── useUserFacts.js   Thin re-export of UserContext facts + upsertFact
│
├── lib/
│   ├── supabase.js       Supabase client (anon key). Used for all client-side DB/auth calls.
│   ├── auth.js           signIn/signOut/signUp/signInWithGoogle wrappers
│   ├── autofill.js       fieldMap + mapFactsToForm() — maps user_facts to form field values
│   └── ocr.js            extractTextFromFile(file, onProgress) — Tesseract + pdfjs-dist
│
├── pages/
│   ├── Landing.jsx                 / — marketing page, CTA to signup
│   ├── auth/
│   │   ├── Login.jsx               /login
│   │   ├── Signup.jsx              /signup
│   │   └── AuthCallback.jsx        /auth/callback — handles Google OAuth redirect
│   ├── onboarding/
│   │   ├── index.jsx               /onboarding — wizard controller
│   │   └── steps/                  11 step components (see below)
│   ├── dashboard/
│   │   ├── index.jsx               /dashboard — assembles sections
│   │   ├── MatchedPrograms.jsx     strong + possible program cards
│   │   ├── ApplicationTracker.jsx  table of acted-on programs (not just 'matched')
│   │   ├── QuickActions.jsx        Upload / Search / Ask buttons
│   │   └── SearchModal.jsx         program search + manual add flow
│   ├── programs/
│   │   ├── ProgramDetail.jsx       /programs/:id
│   │   └── ApplicationForm.jsx     /programs/:id/apply
│   ├── documents/
│   │   └── index.jsx               /documents
│   └── settings/
│       └── index.jsx               /settings
│
└── components/
    ├── chat/
    │   ├── ChatMessage.jsx     Single message bubble
    │   ├── ChatPanel.jsx       Embedded chat (right column of ApplicationForm)
    │   └── ChatWidget.jsx      Floating modal chat (dashboard, other pages)
    ├── documents/
    │   ├── DocumentTypePicker.jsx  Dropdown to select doc type before upload
    │   ├── DocumentUploader.jsx    Full upload → OCR → extract → review state machine
    │   └── ExtractionReview.jsx   Shows extracted facts, user confirms or edits
    ├── forms/
    │   ├── FormField.jsx          Input with blue(autofilled) / yellow(required-empty) states
    │   ├── FormRenderer.jsx       Sectioned form, runs autofill on mount, section navigation
    │   └── schemas/
    │       ├── index.js           getFormSchema(programName) — name-based lookup + generic fallback
    │       ├── snap.js            3 sections: Personal Info, Household & Income, Citizenship
    │       ├── medicaid.js        Medicaid application schema
    │       └── unemployment.js    Unemployment Insurance schema
    ├── layout/
    │   ├── AuthGuard.jsx          Redirects to /login if user null
    │   ├── OnboardingGuard.jsx    Redirects to /onboarding if profile null
    │   └── Sidebar.jsx            Persistent left nav (logo, Dashboard, Documents, Settings, Chat)
    ├── programs/
    │   └── ProgramCard.jsx        Card with score badge, notes, Learn More + Start Application
    └── ui/
        Badge Button Card Input Modal ProgressBar Select Spinner Toast
```

---

## Routing

All protected routes wrapped in `AuthGuard`. Post-onboarding routes also wrapped in `OnboardingGuard`.

| Path | Auth | Onboarding | Component |
|------|------|------------|-----------|
| / | No | No | Landing |
| /login | No | No | Login |
| /signup | No | No | Signup |
| /auth/callback | No | No | AuthCallback |
| /onboarding | Yes | No | Onboarding |
| /dashboard | Yes | Yes | Dashboard |
| /programs/:id | Yes | Yes | ProgramDetail |
| /programs/:id/apply | Yes | Yes | ApplicationForm |
| /documents | Yes | Yes | Documents |
| /settings | Yes | Yes | Settings |

**Guard logic:**
- `AuthGuard`: if user=undefined → show spinner. if user=null → Navigate to /login.
- `OnboardingGuard`: if profile=null → Navigate to /onboarding. if profile=undefined → spinner.

---

## Context / State

### AuthContext (`src/context/AuthContext.jsx`)
Provider: `<AuthProvider>`  
Hook: `useAuthContext()`

```js
{ user }  // undefined=loading, null=logged-out, {...}=authed Supabase user object
```

Calls `supabase.auth.getSession()` on mount + subscribes to `onAuthStateChange`.

### UserContext (`src/context/UserContext.jsx`)
Provider: `<UserProvider>` (inside AuthProvider)  
Hook: `useUserContext()`

```js
{
  profile,      // user_profile row or null (null triggers OnboardingGuard)
  facts,        // user_facts rows []
  fetchProfile, // refetch profile from DB
  fetchFacts,   // refetch facts from DB
  upsertFact,   // (fieldKey, fieldValue, source?) → upsert to user_facts + update local state
}
```

Fetches profile + facts when user changes. Clears both on logout.

---

## Hooks

### `useAuth` → `src/hooks/useAuth.js`
Re-exports `{ user }` from AuthContext + auth functions from `lib/auth.js`.

### `useChat` → `src/hooks/useChat.js`
```js
const { history, loading, sendMessage } = useChat(programContext?)
```
- `history`: `[{role, content}]` array managed in state
- `sendMessage(message)`: appends user message, POSTs to backend, appends assistant response
- Sends last 10 history items + current message on each request
- Gets session token from `supabase.auth.getSession()`

### `usePrograms` → `src/hooks/usePrograms.js`
```js
const { programs, loading, refetch } = usePrograms()
```
Joins `user_programs` with `programs` (name, category, application_url, deadline, description_en, required_documents). Ordered by eligibility_score DESC.

### `useUserFacts` → `src/hooks/useUserFacts.js`
Thin wrapper: `{ facts, upsertFact, fetchFacts }` from UserContext.

---

## Onboarding Flow (`pages/onboarding/index.jsx`)

11 steps in order:
1. `FullName` → full_name
2. `Age` → age
3. `State` → state (dropdown, all 50)
4. `Employment` → employment_status (employed/unemployed/part-time/retired/student)
5. `Income` → income (<15k / 15-30k / 30-50k / 50k+)
6. `HouseholdSize` → household_size
7. `Citizenship` → citizenship_status
8. `Children` → has_children (yes/no) + children_count
9. `Disability` → disability_status (yes/no/prefer_not_to_say)
10. `Student` → student_status
11. `Consent` → required checkbox

Answers accumulate in local `answers` state. On completion:
1. Write `user_profile` row (upsert on user_id)
2. Write each field to `user_facts` with source='onboarding'
3. POST `/api/eligibility/score` (with Bearer token)
4. `fetchProfile()` to update UserContext
5. Navigate to /dashboard

---

## Autofill System (`lib/autofill.js`)

`fieldMap`: maps form field labels (lowercase) → user_facts field_key  
`mapFactsToForm(fields, facts)`: for each form field, check fieldMap[label] or fall back to field.id, return `{ field_id: value }` for matched facts.

Key mappings:
```
'full name', 'name'           → full_name
'date of birth', 'dob'        → date_of_birth
'address', 'home address'     → address
'annual income', 'income'     → income
'monthly income'              → monthly_income
'household size'              → household_size
'employer', 'employer name'   → employer_name
'social security', 'ssn'      → ssn_last4
'monthly rent', 'rent'        → monthly_rent
```

`FormRenderer.jsx` runs this on mount when facts are loaded. Tags autofilled field ids in a Set. `FormField.jsx` checks the Set to show blue background + "Auto-filled" label.

---

## Document Upload Flow (`components/documents/DocumentUploader.jsx`)

Stage machine: `pick → uploading → ocr → extracting → review → done`

1. **pick**: User selects doc type (DocumentTypePicker) + file (max 10MB, PDF/JPG/PNG)
2. **uploading**: Upload file to Storage at `{user_id}/{docType}/{timestamp}_{filename}`. Insert `documents` row with status=pending.
3. **ocr**: `extractTextFromFile(file, onProgress)` from `lib/ocr.js`
   - Image files: Tesseract.js `recognize(file, 'eng')`
   - PDFs: pdfjs-dist renders page 1 to canvas → Tesseract on canvas dataURL
4. **extracting**: POST `/api/extract/facts` with ocrText + documentType + documentId
5. **review**: Show `ExtractionReview` — user confirms or edits each fact
6. On confirm: POST `/api/extract/confirm` → saves to user_facts
7. **done**: Success screen

**Privacy banner** shown before upload listing protections (24h delete, no SSN storage, etc.)

---

## OCR (`lib/ocr.js`)

```js
extractTextFromFile(file, onProgress) // returns Promise<string>
```

- Image: Tesseract.js. `onProgress` called with 0-100 integer.
- PDF: pdfjs-dist lazy-imported. Renders page 1 at scale=2 to canvas. First page only.

---

## Form Schemas (`components/forms/schemas/`)

`getFormSchema(programName)`:
- Lowercases program name, checks if it includes first word of any SCHEMA_MAP key
- Known schemas: SNAP, Medicaid, Unemployment Insurance
- Fallback: generic 7-field form (name, dob, address, state, household_size, monthly_income, phone)

SNAP schema (3 sections):
- Personal Info: full_name, date_of_birth, address, state, phone
- Household & Income: household_size, monthly_income, employment_status
- Citizenship: citizenship_status, ssn_last4

`FormRenderer.jsx`:
- Loads schema, runs mapFactsToForm on mount
- Section-by-section navigation with ProgressBar
- On "Mark as Submitted": calls `onStatusChange('submitted')`
- `ApplicationForm.jsx` handles status change → supabase UPDATE user_programs.status

---

## ApplicationForm Page (`pages/programs/ApplicationForm.jsx`)

Two-column layout (desktop):
- Left 60%: FormRenderer (form + progress + submission)
- Right 40%: ChatPanel (pre-loaded with program context)

On mount:
1. Fetch program + user_programs status in parallel
2. Set user_programs.status = 'in_progress' immediately
3. `getFormSchema(program.name)` determines which form to render
4. `programContext` string built from program name + description + eligibility_rules JSON → injected into ChatPanel

On submit:
- "Mark as Submitted" button → update user_programs.status = 'submitted'
- "I've submitted on the official site" → same status update
- Shows confirmation banner with link to official site

---

## Chat Components

### `ChatPanel` (embedded, right column of ApplicationForm)
- Uses `useChat(programContext)` — program context injected into system prompt
- Header shows "Applying for {programName}"
- Auto-scrolls to bottom on new messages

### `ChatWidget` (floating modal, dashboard + other pages)
- Same pipeline, no programContext
- Controlled by `open` prop — toggled from QuickActions or Sidebar

### `ChatMessage`
- User messages: right-aligned, blue
- Assistant messages: left-aligned, gray

---

## Dashboard (`pages/dashboard/index.jsx`)

Assembles:
1. `QuickActions` — Upload Document / Search Programs / Ask Assistant
2. `MatchedPrograms` — cards for strong + possible (all scores from usePrograms)
3. `ApplicationTracker` — table for rows where status != 'matched'

**Refresh Matches**: POST `/api/eligibility/score` → `refetch()` (re-queries user_programs)

**SearchModal**: text search on programs table by name/category (client-side filter on results from GET /api/programs). "Add manually" inserts into programs (is_user_added=true) + user_programs.

---


## Dependencies

| Package | Purpose |
|---------|---------|
| react 19 | UI |
| react-router-dom 7 | Routing |
| @supabase/supabase-js | DB + Auth |
| tesseract.js 7 | OCR (client-side) |
| pdfjs-dist 5 | PDF → canvas for OCR |
| tailwindcss 3 | Styling |
| vite 8 | Build tool |

No state management library — React Context only.

---

## Known Issues / Gaps

1. **SearchModal** filters programs client-side from GET /api/programs, not from user_programs — doesn't show user's current eligibility score on search results.
2. **OnboardingGuard** checks `profile === null` to redirect — but UserContext initializes profile as `null` before the fetch completes, causing a flash to /onboarding. Should use a separate `profileLoading` state.
3. **FormRenderer** calls `setAutofilledKeys` before the state is declared (lines 30 vs 32 in FormRenderer.jsx) — works due to hoisting but fragile.
4. **DocumentUploader** gets public URL via `getPublicUrl` but the bucket is private — this URL won't work. Should use signed URLs for viewing. Extraction doesn't use the URL anyway (uses the file object directly), so it's unused dead code currently.
5. **Manually added programs** (is_user_added=true) have empty eligibility_rules → scoring engine returns `{ score: 'possible' }` with no rules checked. ApplicationForm falls back to generic form schema. This works but user gets no eligibility explanation.
