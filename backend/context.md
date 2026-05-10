# Backend Context

Node.js + Express 5 API server. ESM modules (`"type": "module"`).

**Start:** `npm run dev` (node --watch) | `npm start`  
**Port:** 3001 (override with `PORT` env var)

---

## File Map

```
backend/
├── index.js                  Express app. Registers middleware + routes, starts server.
├── .env                      SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, QWEN_API_KEY, PORT
├── package.json              Dependencies: express, @supabase/supabase-js, openai, cors, dotenv
│
├── lib/
│   └── supabaseAdmin.js      Supabase client with SERVICE_ROLE_KEY.
│                             Bypasses RLS — use only server-side. Never expose to client.
│
├── middleware/
│   ├── auth.js               requireAuth middleware.
│   │                         Reads Bearer token from Authorization header.
│   │                         Calls supabase.auth.getUser(token) to validate.
│   │                         Attaches req.user = { id, email, ... } on success.
│   │                         Returns 401 if missing or invalid.
│   └── errorHandler.js       Global Express error handler. Catches next(err) from all routes.
│
├── routes/
│   ├── chat.js               POST /api/chat/message
│   ├── eligibility.js        POST /api/eligibility/score
│   ├── embed.js              POST /api/embed/all
│   ├── extract.js            POST /api/extract/facts
│   │                         POST /api/extract/confirm
│   └── programs.js           GET /api/programs
│
└── services/
    ├── cleanup.js            cleanupExpiredDocuments()
    ├── eligibilityEngine.js  scoreEligibility(userProfile, program)
    ├── factExtractor.js      extractFacts(ocrText, documentType)
    ├── qwen.js               chat(messages, model) + embed(text)
    └── ragService.js         getRelevantChunks(query)
```

---

## Routes Detail

### `GET /api/programs` — No auth
Returns all programs (id, name, category, description_en, application_url, deadline, required_documents) ordered by name.

Used by frontend SearchModal to populate search results.

---

### `POST /api/eligibility/score` — Auth required
Scores all programs for the authenticated user and upserts results into `user_programs`.

**Flow:**
1. Fetch `user_profile` for `req.user.id`
2. Fetch all `programs`
3. For each program: call `scoreEligibility(profile, program)` in parallel
4. Upsert results into `user_programs` (conflict: user_id + program_id — updates score/notes but won't downgrade status if user already applied)

**Note:** Status field upsert always sets `status: 'matched'`. This will overwrite in_progress/submitted rows if re-scored. Known bug — should skip rows where status != 'matched'.

---

### `POST /api/chat/message` — Auth required
**Request body:**
```json
{
  "message": "string",
  "history": [{ "role": "user|assistant", "content": "string" }],
  "programContext": "string | null"
}
```

**Response:** `{ "response": "string with disclaimer appended" }`

**Flow:**
1. Fetch user profile (name, state, income, household_size, employment_status, has_children)
2. `getRelevantChunks(message)` → top 5 RAG chunks via pgvector
3. Build system prompt with user profile + RAG + optional programContext
4. Last 10 messages from history + new message → Qwen qwen-turbo
5. Append DISCLAIMER to response
6. Fire-and-forget: `detectAndSaveFacts(userId, message)` — extracts new facts from user message, saves to user_facts with source='chat'

---

### `POST /api/extract/facts` — Auth required
**Request body:**
```json
{
  "ocrText": "string",
  "documentType": "drivers_license|passport|social_security_card|w2|pay_stub|birth_certificate|utility_bill|lease_agreement|benefit_letter",
  "documentId": "uuid"
}
```

**Response:** `{ "facts": { "field_key": "value", ... } }`

Calls `extractFacts(ocrText, documentType)` which sends to Qwen with a schema-specific prompt. Returns only non-null fields. Never returns full SSN (strips to ssn_last4). Updates `documents.extraction_status = 'completed'`.

---

### `POST /api/extract/confirm` — Auth required
**Request body:**
```json
{
  "facts": { "field_key": "value" },
  "documentType": "string"
}
```

Called after user reviews extracted facts on the ExtractionReview screen. Upserts all facts to `user_facts` with `source = documentType`.

---

### `POST /api/embed/all` — No auth (admin)
Run once after seeding programs. Iterates all programs, builds a text chunk (name + category + description + eligibility_rules JSON + required_documents), calls Qwen `text-embedding-v3`, stores 1536-dim vector in `embeddings` table.

Safe to re-run (upserts on source_type + source_id).

---

## Services Detail

### `services/qwen.js`
Wraps Alibaba Cloud Qwen via OpenAI-compatible SDK.

```js
chat(messages, model = 'qwen-plus')  // returns string
embed(text)                           // returns float[]
```

Models in use:
- `qwen-turbo` — chat (fast, cheap)
- `text-embedding-v3` — embeddings (1536 dims)

Base URL: `https://dashscope.aliyuncs.com/compatible-mode/v1`

---

### `services/eligibilityEngine.js`
`scoreEligibility(userProfile, program)` → `{ score, reasons, missing, notes }`

**Income bucket midpoints used for comparison:**
- `<15k` → 7500
- `15-30k` → 22500
- `30-50k` → 40000
- `50k+` → 75000

**Income threshold lookup (in priority order from eligibility_rules):**
1. `rules.max_income`
2. `rules.gross_income_test.by_household_size[household_size]` (monthly)
3. `rules.income_test.expansion_states_annual_by_household[household_size]` (annual)
4. `rules.income_test.annual_150pct_fpl_by_household[household_size]`
5. `rules.income_test.annual_135pct_fpl_by_household[household_size]`
6. `rules.income_test.annual_by_household[household_size]`

**Annual vs monthly detection:** if threshold > 5000 → compare annual income, else compare monthly income.

**Checks run (each adds to total if rule exists):**
- Income threshold
- State availability (if not 'all')
- Employment status (if array in rules)
- Children required (`must_have_children_under_18` or `has_children_required`)
- Disability required
- Category eligibility (`eligible_categories` array — age checks, student)
- Minimum age (`minimum_age`)
- Student required
- Must be renter (auto-passes — can't verify from profile)

**Score:** matched/total >= 0.8 → strong, >= 0.5 → possible, else unlikely

**LLM note:** generated for strong + possible using qwen-turbo. Falls back to generic string on error.

---

### `services/factExtractor.js`
`extractFacts(ocrText, documentType)` → `{ field_key: value, ... }`

Per-document-type field schemas:
```
drivers_license    → full_name, date_of_birth, address, state, license_number, expiration_date
passport           → full_name, date_of_birth, nationality, passport_number, expiration_date
social_security_card → full_name, ssn_last4
w2                 → employer_name, annual_wages, federal_tax_withheld, tax_year
pay_stub           → employer_name, gross_income, net_income, pay_period, ytd_gross
birth_certificate  → full_name, date_of_birth, place_of_birth
utility_bill       → service_address, utility_provider, amount_due, due_date
lease_agreement    → property_address, monthly_rent, lease_start_date, landlord_name
benefit_letter     → program_name, benefit_amount, effective_date, case_number
```

Unknown doc type → union of all fields.

Sends to Qwen with strict JSON-only prompt. Strips full SSN: any `ssn` field → `ssn_last4 = last 4 chars`. Returns only non-null fields.

---

### `services/ragService.js`
`getRelevantChunks(query)` → concatenated string of top 5 matching chunks

1. Embed query via `embed(query)`
2. Call `match_embeddings(query_embedding, 5)` — Supabase RPC
3. Join `content_chunk` with double newline

The `match_embeddings` SQL function uses IVFFlat cosine similarity (`<=>` operator).

---

### `services/cleanup.js`
`cleanupExpiredDocuments()` — called manually or via a cron job (not auto-wired in index.js).

Finds documents where `uploaded_at < now() - 24h` AND `file_url IS NOT NULL`.
Deletes from Storage at path `{user_id}/{document_type}/{id}`.
Nulls `file_url` and sets `file_deleted_at` timestamp.

**Note:** Path used is `user_id/document_type/document_id` — but `DocumentUploader.jsx` uploads to `user_id/docType/timestamp_filename`. These paths won't match. Cleanup needs the actual storage path stored in the documents table — currently stored as `file_url` but the cleanup service constructs its own path. **Bug to fix.**

---

## Auth Architecture

Frontend sends Supabase access token as Bearer. Backend validates with a second supabase client (using service role key, not anon key) calling `auth.getUser(token)`. This is the official Supabase pattern for server-side auth validation.

Two separate supabase clients:
- `middleware/auth.js`: inline client for token validation
- `lib/supabaseAdmin.js`: shared admin client for DB operations (bypasses RLS)

---

## Known Issues / Gaps

1. **Eligibility re-score overwrites status** — `eligibility.js` always sets `status: 'matched'` on upsert, wiping in_progress/submitted rows.
2. **Cleanup path mismatch** — `cleanup.js` constructs path as `userId/docType/docId` but Storage path is `userId/docType/timestamp_filename`.
3. **No cron wiring** — `cleanup.js` is never called from index.js. Needs a cron job or manual invocation.
4. **Income bucket coarseness** — "50k+" maps to 75000 midpoint. A user who just got laid off with prior $85k salary fails every income test even if current income is $0.
5. **Medicaid non-expansion states** — scoring engine only uses `expansion_states_annual_by_household`. Non-expansion state users (e.g. Texas) incorrectly scored.
