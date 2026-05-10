# [PROJECT NAME] — Build Guide

> **Working title** — replace `[PROJECT NAME]` throughout with whatever you call this. Suggestions: Liaison, Threshold, Onramp, Provision, Frontline.

## Executive summary

A government benefits navigator with two surfaces: a **web dashboard** that stores a user's facts and shows them which programs they likely qualify for, and a **Chrome extension** that autofills their information directly into the real government application portals (ABE.illinois.gov and healthcare.gov for v1).

This is "JobRight for government benefits." JobRight gives 500K+ job seekers an unfair advantage by autofilling employer applications on real ATSs (Workday, Greenhouse, Lever). We do the same for low-income and immigrant families applying for the government benefits they're already entitled to — but on real government portals, with AI eligibility scoring before they apply, in their language.

The key architectural decision: **we never recreate government forms inside our app**. We autofill on the official .gov pages. This means real submissions, real confirmation numbers, real legal standing, and a path to scale across portals via per-portal field-mapping configs rather than per-portal form rebuilds.

## The asymmetry being closed

Hackathon prompt is "Unfair Advantage": every system has hidden cheat codes (knowledge, access, networks, language, capital), some people have them, others don't.

The asymmetry: people who read fluent professional English, know which programs exist, and have time to fill out 30-page government forms get the benefits they qualify for. Everyone else doesn't. Roughly $140B in federal benefits go unclaimed each year. SNAP misses 18% of eligible people. WIC misses half. LIHEAP reaches only 17% of who needs it. TANF reaches just 23 of every 100 poor families.

The cheat code being redistributed: knowing what you qualify for, having it pre-filled, having it explained.

## Audience (Illinois-focused for v1)

Primary users:
- Recently unemployed Illinoisans
- Low-income families in Cook County and surrounding areas
- Spanish-speaking and other non-English-speaking residents (Cook County: 1.4M+ Spanish speakers, large Polish, Mandarin, Arabic populations)
- Seniors 65+ on fixed incomes
- Single parents

Distribution channels (post-hackathon, for context): public libraries, Chicago Food Depository helpline (773-247-3663), community health clinics, free legal aid intake offices, ESL classrooms, senior centers.

## Differentiation

What exists in this space:
- **mRelief** (Chicago-based): SNAP-only screener and simplified application, all 53 states, web/text/voice. Closest competitor on the screening side.
- **BenefitsCheckUp** (NCOA): ~2,000 programs, eligibility quiz, English/Spanish/Vietnamese, electronic submission for Medicare Extra Help only.
- **Single Stop**: 20+ programs, distributed through nonprofits and community colleges.
- **Propel**: Manages benefits post-enrollment for 5M+ users, explicitly does *not* help apply.
- **GetCalFresh** (Code for America, sunset 2025): California-only, simplified SNAP applications. Folded into BenefitsCal.
- **Illinois ABE.illinois.gov**: official state portal for SNAP/Medicaid/TANF/cash assistance/Medicare Savings — combined application, but classic government UX (no plain language, no AI guidance, English/Spanish only).
- **healthcare.gov**: federal ACA marketplace.

**What no one does**: a Chrome extension that autofills on the actual government portals using a centrally-stored profile, with AI eligibility scoring pre-application, multilingual, and consumer-facing. That's the gap.

---

# Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                     USER (browser)                           │
└───────────────────┬─────────────────────────┬───────────────┘
                    │                         │
                    │ Visits dashboard        │ Visits gov portal
                    ▼                         ▼
        ┌────────────────────┐    ┌──────────────────────────┐
        │   Web Dashboard    │    │   Chrome Extension       │
        │   (Vercel-hosted)  │    │   (content script)       │
        │                    │    │                          │
        │  - Auth            │    │  - URL whitelist match   │
        │  - Onboarding      │    │  - Read form fields      │
        │  - Documents       │    │  - Request autofill      │
        │  - Programs        │    │  - Highlight + populate  │
        │  - Eligibility UI  │    │  - Report submission     │
        │  - Settings        │    │                          │
        └─────────┬──────────┘    └──────────┬───────────────┘
                  │                          │
                  │ REST                     │ REST
                  └────────────┬─────────────┘
                               ▼
                  ┌───────────────────────────────┐
                  │    Backend API                │
                  │    (Vercel serverless +       │
                  │     Supabase Postgres)        │
                  │                               │
                  │  - /api/profile               │
                  │  - /api/facts                 │
                  │  - /api/programs              │
                  │  - /api/eligibility/run       │
                  │  - /api/extension/autofill    │
                  │  - /api/extension/submit      │
                  │  - /api/documents/upload      │
                  │  - /api/documents/extract     │
                  └────────────┬──────────────────┘
                               │
                               ▼
                  ┌──────────────────────────┐
                  │    Anthropic API         │
                  │    (Claude Sonnet 4.6)   │
                  │                          │
                  │  - Eligibility judging   │
                  │  - Field mapping (LLM)   │
                  │  - Doc fact extraction   │
                  │  - Translations          │
                  │  - Chat assistant        │
                  └──────────────────────────┘
```

## Three components, clean separation of concerns

**Dashboard (web app)**: stores facts and intelligence. Auth, onboarding, document upload, program library, eligibility scoring, settings. Never autofills anything itself; just shows matches and links out to the real government portals.

**Chrome extension**: an autofill agent. Recognizes known government benefit URLs (whitelist). On those pages, reads the form fields, asks the backend "given these labels, return values for this user," highlights pre-fills in blue, lets the user review and submit on the actual .gov page.

**AI eligibility engine**: hybrid rules-plus-LLM. Rules engine generates a candidate score; the LLM judge produces the plain-language explanation, flags edge cases the rules missed, and outputs confidence levels. Conservative UX with generous internals (see below).

---

# Tech stack

- **Frontend**: React 18 + Vite + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Vercel serverless functions (Node.js 20)
- **Database + Auth + Storage**: Supabase (Postgres 15)
- **Row-level security**: enforced on every user-data table
- **LLM**: Anthropic Claude API (`claude-sonnet-4-6`) for eligibility, fact extraction, field mapping, translations, chat
- **OCR**: skip Tesseract; send document images directly to Claude's vision API for combined OCR + structured extraction
- **Chrome Extension**: Manifest V3, TypeScript, vanilla DOM (no React in content scripts to keep injection lightweight)
- **State management**: React Context + Supabase real-time subscriptions
- **Hosting**: Vercel (web app + serverless functions), Supabase (DB), Chrome Web Store (extension)
- **i18n**: i18next for UI strings (English + Spanish for v1)

Skip: Tesseract.js (use vision LLM instead), pgvector/RAG (program corpus is small enough to fit in system prompt), Firebase (Supabase is the only backend), Google OAuth (email/password only for v1), Eleven Labs voice (out of scope for v1), Gmail integration (out of scope).

---

# Data models

All Supabase Postgres. RLS enabled on every user-data table. Cascade delete on user deletion.

## `users`
Managed by Supabase Auth. Reference `auth.users.id` from other tables.

## `user_profile`
```sql
create table user_profile (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade unique,
  full_name text,
  age integer,
  state text,                          -- "IL", "OH", etc.
  zip_code text,
  employment_status text,              -- "employed" | "unemployed" | "part-time" | "retired" | "student"
  monthly_income_current numeric,      -- USD/month, current. Means-tested programs care about NOW.
  annual_income_last_year numeric,     -- USD/year, last calendar year. Some programs use this.
  household_size integer,
  has_children boolean,
  num_children integer,
  citizenship_status text,             -- "citizen" | "permanent_resident" | "visa" | "undocumented" | "prefer_not_to_say"
  disability_status text,              -- "yes" | "no" | "prefer_not_to_say"
  pregnant boolean,
  student_status text,                 -- "yes_full_time" | "yes_part_time" | "no"
  is_veteran boolean,
  language_preference text default 'en',  -- "en" | "es"
  delete_docs_after_extraction boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table user_profile enable row level security;
create policy "users access own profile" on user_profile for all using (auth.uid() = user_id);
```

**Critical fix from original spec**: income is a number, not a bucket. Buckets break eligibility scoring — a "50k+" user who's been laid off and now makes $0 can't be scored correctly. Capture both current monthly and last-year annual.

## `user_facts`
The autofill knowledge base. Every piece of info we learn about the user goes here, keyed by a normalized field name.

```sql
create table user_facts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  field_key text not null,             -- normalized: "monthly_rent", "ssn_last4", "employer_name"
  field_value text not null,
  source text not null,                -- "onboarding" | "document" | "form" | "chat" | "manual"
  confidence numeric default 1.0,      -- 0.0-1.0
  effective_date date,                 -- when this value became true (e.g., new income started)
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (user_id, field_key)
);

create index on user_facts(user_id);
alter table user_facts enable row level security;
create policy "users access own facts" on user_facts for all using (auth.uid() = user_id);
```

## `documents`
Tracks document uploads. We **never** store SSNs, only last 4. Files auto-delete after extraction within 24h.

```sql
create table documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  document_type text not null,         -- "drivers_license" | "pay_stub" | "w2" | "lease" | "utility_bill" | "benefit_letter" | "ssn_card" | "birth_certificate" | "other"
  file_url text,                       -- nullable; null after deletion
  extraction_status text default 'pending',   -- "pending" | "completed" | "failed"
  extracted_facts_count integer default 0,
  uploaded_at timestamptz default now(),
  file_deleted_at timestamptz
);

alter table documents enable row level security;
create policy "users access own documents" on documents for all using (auth.uid() = user_id);
```

## `programs`
Master list of benefit programs. v1 ships with 5 seeded programs. Public read, no RLS.

```sql
create table programs (
  id text primary key,                 -- "snap" | "medicaid_il" | "tanf_il" | "aca_marketplace" | "msp"
  name text not null,
  category text not null,              -- "food" | "health" | "financial" | "housing" | "utilities"
  description_en text not null,
  description_es text,
  eligibility_rules jsonb not null,
  required_documents jsonb,
  application_url text not null,       -- "https://abe.illinois.gov" | "https://healthcare.gov"
  application_portal_id text,          -- "abe_il" | "healthcare_gov" | null for external
  is_user_added boolean default false,
  created_at timestamptz default now()
);
```

## `user_programs`
The match table. One row per (user, program) pair after eligibility runs.

```sql
create table user_programs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  program_id text references programs(id),
  eligibility_score text not null,     -- "strong" | "possible" | "unlikely"
  confidence numeric,                  -- 0.0-1.0
  reasoning text,                      -- LLM-generated plain-English explanation
  missing_facts jsonb,                 -- list of facts we don't know that would change the score
  status text default 'matched',       -- "matched" | "in_progress" | "submitted" | "approved" | "denied"
  submitted_at timestamptz,
  decision_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (user_id, program_id)
);

alter table user_programs enable row level security;
create policy "users access own program matches" on user_programs for all using (auth.uid() = user_id);
```

## `portal_field_mappings`
Per-portal field configurations the extension consults when autofilling. Public read (no PII), seeded.

```sql
create table portal_field_mappings (
  id uuid primary key default gen_random_uuid(),
  portal_id text not null,             -- "abe_il" | "healthcare_gov"
  url_pattern text not null,           -- "abe.illinois.gov/access/*"
  field_label text not null,           -- as it appears on the gov form
  field_selector text,                 -- CSS selector if known/stable
  user_fact_key text not null,         -- maps to user_facts.field_key
  required boolean default false,
  notes text,
  created_at timestamptz default now()
);

create index on portal_field_mappings(portal_id);
```

---

# The 5 v1 programs

Each program needs `eligibility_rules` JSON the engine can read, and a `required_documents` list. Below: the actual rules to seed, with FPL numbers updated for 2025-2026.

## Program 1: SNAP (Food Stamps)

```json
{
  "id": "snap",
  "name": "SNAP (Food Stamps)",
  "category": "food",
  "description_en": "Monthly food benefits on an EBT card to help low-income individuals and families buy groceries.",
  "application_url": "https://abe.illinois.gov",
  "application_portal_id": "abe_il",
  "eligibility_rules": {
    "gross_income_test_monthly_by_household_size": {
      "1": 1718, "2": 2326, "3": 2933, "4": 3540, "5": 4147, "6": 4754,
      "each_additional": 607
    },
    "net_income_test_monthly_by_household_size": {
      "1": 1321, "2": 1792, "3": 2263, "4": 2833, "5": 3304, "6": 3775,
      "each_additional": 471
    },
    "senior_or_disabled_exemption": {
      "applies_when": "age >= 60 OR disability_status == 'yes'",
      "effect": "skip gross income test, only apply net income test"
    },
    "asset_limits_2025": { "general": 3000, "senior_or_disabled": 4500 },
    "work_requirements": {
      "applies_to_age_range": [18, 64],
      "hours_per_month": 80,
      "exemptions": ["has_children_under_14", "disability", "pregnant", "age_under_18", "age_65_plus", "abawd_waiver_area"]
    },
    "abawd_waiver_areas": ["Cook County, IL"],
    "categorical_eligibility": ["tanf", "ssi"],
    "citizenship_required": "citizens_or_qualified_noncitizens",
    "states_available": "all"
  },
  "required_documents": ["government_id", "proof_of_residency", "proof_of_income_30_days", "ssn"]
}
```

## Program 2: Medicaid (Illinois)

```json
{
  "id": "medicaid_il",
  "name": "Medicaid (Illinois)",
  "category": "health",
  "description_en": "Free or low-cost health coverage for low-income adults, children, pregnant women, seniors, and people with disabilities. Illinois is an expansion state.",
  "application_url": "https://abe.illinois.gov",
  "application_portal_id": "abe_il",
  "eligibility_rules": {
    "expansion_state_138pct_fpl_annual_by_household_size": {
      "1": 20120, "2": 27215, "3": 34298, "4": 41400, "5": 48500, "6": 55600
    },
    "pregnancy_threshold_annual_by_household_size": {
      "1": 30000, "2": 40500, "3": 51000, "4": 61500
    },
    "children_chip_threshold_pct_fpl": 200,
    "senior_or_disabled_monthly_max": 1235,
    "ssi_recipients_auto_enrolled": true,
    "citizenship_required": "citizens_or_lawful_residents",
    "states_available": ["IL"]
  },
  "required_documents": ["government_id", "proof_of_residency", "proof_of_income", "ssn", "proof_of_citizenship_or_immigration"]
}
```

## Program 3: TANF (Temporary Assistance for Needy Families)

```json
{
  "id": "tanf_il",
  "name": "TANF (Cash Assistance for Families)",
  "category": "financial",
  "description_en": "Monthly cash assistance for low-income families with children under 18, with work requirements and a 60-month lifetime limit.",
  "application_url": "https://abe.illinois.gov",
  "application_portal_id": "abe_il",
  "eligibility_rules": {
    "must_have_children_under_18": true,
    "illinois_payment_standard_monthly_by_household_size": {
      "2": 522, "3": 624, "4": 749, "5": 847
    },
    "income_max_monthly_by_household_size": {
      "2": 522, "3": 624, "4": 749, "5": 847
    },
    "asset_limit": 3000,
    "work_requirement_hours_per_week": 30,
    "work_exemptions": ["caring_for_child_under_1", "disability", "domestic_violence_victim", "age_60_plus"],
    "lifetime_limit_months": 60,
    "citizenship_required": "citizens_only",
    "states_available": ["IL"]
  },
  "required_documents": ["government_id", "ssn_all_household_members", "proof_of_residency", "proof_of_income", "birth_certificates", "proof_of_citizenship"]
}
```

## Program 4: ACA Marketplace (Premium Tax Credits + Cost-Sharing Reductions)

```json
{
  "id": "aca_marketplace",
  "name": "ACA Marketplace Health Insurance",
  "category": "health",
  "description_en": "Health insurance plans sold through the federal marketplace, with subsidies (Premium Tax Credits) for households between 100% and 400% of the federal poverty line, and Cost-Sharing Reductions up to 250% FPL.",
  "application_url": "https://healthcare.gov",
  "application_portal_id": "healthcare_gov",
  "eligibility_rules": {
    "ptc_min_pct_fpl": 100,
    "ptc_max_pct_fpl": null,
    "ptc_2025_household_thresholds_annual": {
      "1": { "100": 15060, "400": 60240 },
      "2": { "100": 20440, "400": 81760 },
      "3": { "100": 25820, "400": 103280 },
      "4": { "100": 31200, "400": 124800 }
    },
    "csr_max_pct_fpl": 250,
    "must_be_uninsured_or_employer_unaffordable": true,
    "citizenship_required": "citizens_or_lawful_residents",
    "open_enrollment_period": "Nov 1 - Jan 15 (with special enrollment for life events)",
    "states_available": "all_federal_marketplace"
  },
  "required_documents": ["ssn", "proof_of_citizenship_or_immigration", "household_income_estimate"]
}
```

## Program 5: Medicare Savings Program (MSP)

```json
{
  "id": "msp",
  "name": "Medicare Savings Program",
  "category": "health",
  "description_en": "Helps Medicare beneficiaries with limited income pay Medicare Part A and B premiums, deductibles, copays, and coinsurance. Three tiers: QMB, SLMB, QI.",
  "application_url": "https://abe.illinois.gov",
  "application_portal_id": "abe_il",
  "eligibility_rules": {
    "must_have_medicare": true,
    "must_be_age_65_plus_or_disabled": true,
    "qmb_income_max_monthly_2025": { "individual": 1255, "couple": 1704 },
    "slmb_income_max_monthly_2025": { "individual": 1506, "couple": 2044 },
    "qi_income_max_monthly_2025": { "individual": 1695, "couple": 2300 },
    "asset_limits_2025": { "individual": 9430, "couple": 14130 },
    "states_available": "all"
  },
  "required_documents": ["medicare_card", "proof_of_income", "proof_of_assets"]
}
```

---

# Eligibility engine

## Hybrid rules + LLM architecture

```
            ┌─────────────────────────────┐
            │   user_profile + user_facts │
            └──────────────┬──────────────┘
                           ▼
            ┌─────────────────────────────┐
            │  Step 1: Rules engine       │
            │  - Run scoreEligibility()   │
            │    for each program         │
            │  - Output: candidate score  │
            │    + matched/unmatched      │
            │    rules + missing_facts    │
            └──────────────┬──────────────┘
                           ▼
            ┌─────────────────────────────┐
            │  Step 2: LLM judge          │
            │  - Receive: profile + facts │
            │    + program rules +        │
            │    rules-engine output      │
            │  - Output:                  │
            │    - confidence_adjustment  │
            │    - reasoning              │
            │    - flagged_edge_cases     │
            │    - language: user.lang    │
            └──────────────┬──────────────┘
                           ▼
            ┌─────────────────────────────┐
            │  Step 3: Final score        │
            │  - Combine rules + LLM      │
            │    confidence               │
            │  - Bucket: strong / possible│
            │    / unlikely               │
            │  - Write to user_programs   │
            └─────────────────────────────┘
```

## Step 1: Rules engine (TypeScript)

```typescript
type EligibilityScore = "strong" | "possible" | "unlikely";

interface RulesResult {
  score: EligibilityScore;
  confidence: number;       // 0.0-1.0
  matched: string[];        // which rules passed
  unmatched: string[];      // which rules failed
  missing_facts: string[];  // facts we'd need to know to be sure
}

function scoreEligibility(
  profile: UserProfile,
  facts: Record<string, string>,
  program: Program
): RulesResult {
  const rules = program.eligibility_rules;
  let matched: string[] = [];
  let unmatched: string[] = [];
  let missing: string[] = [];
  let totalChecks = 0;
  let passedChecks = 0;

  // Income test (program-specific)
  if (program.id === "snap") {
    const isSeniorOrDisabled = profile.age >= 60 || profile.disability_status === "yes";
    const grossLimit = rules.gross_income_test_monthly_by_household_size[profile.household_size] ?? null;
    const netLimit = rules.net_income_test_monthly_by_household_size[profile.household_size] ?? null;

    if (isSeniorOrDisabled) {
      // Senior exemption: only net income test applies
      if (profile.monthly_income_current <= netLimit) {
        passedChecks++; matched.push("Net income within SNAP limit (senior/disabled exemption applied)");
      } else {
        unmatched.push("Net income exceeds limit");
      }
      totalChecks++;
    } else {
      // Standard test: both gross and net
      if (profile.monthly_income_current <= grossLimit) {
        passedChecks++; matched.push("Gross income within SNAP limit");
      } else {
        unmatched.push("Gross income may exceed SNAP limit");
      }
      totalChecks++;
    }

    // ABAWD work requirements (Cook County is currently waived)
    const inWaiverArea = profile.zip_code?.startsWith("606") || profile.zip_code?.startsWith("607");  // Cook County zips
    const isABAWD =
      profile.age >= 18 && profile.age <= 49 &&
      !profile.has_children &&
      profile.disability_status !== "yes";
    if (isABAWD && !inWaiverArea) {
      missing.push("Need to verify 80+ hrs/month work or work program");
    }
  }

  if (program.id === "medicaid_il") {
    if (profile.state !== "IL") {
      unmatched.push("Medicaid (Illinois) only available to IL residents");
    } else {
      passedChecks++; matched.push("Illinois resident");
    }
    totalChecks++;

    const annualIncome = profile.monthly_income_current * 12;
    const expansionLimit = rules.expansion_state_138pct_fpl_annual_by_household_size[profile.household_size];
    const pregnancyLimit = rules.pregnancy_threshold_annual_by_household_size[profile.household_size];

    if (profile.pregnant && annualIncome <= pregnancyLimit) {
      passedChecks++; matched.push("Income within Illinois pregnancy Medicaid threshold");
    } else if (annualIncome <= expansionLimit) {
      passedChecks++; matched.push("Income within Illinois Medicaid expansion threshold");
    } else {
      unmatched.push("Income may exceed Medicaid threshold");
    }
    totalChecks++;
  }

  // [...similar logic for tanf_il, aca_marketplace, msp...]

  const score: EligibilityScore =
    passedChecks / totalChecks >= 0.8 ? "strong" :
    passedChecks / totalChecks >= 0.5 ? "possible" : "unlikely";

  return {
    score,
    confidence: passedChecks / totalChecks,
    matched,
    unmatched,
    missing_facts: missing
  };
}
```

## Step 2: LLM judge

System prompt for the judge:

```
You are a benefits eligibility judge. You receive a user's profile, a benefit program's eligibility rules, and a rules engine's preliminary scoring. Your job is to:

1. Verify the rules engine got it right.
2. Flag edge cases the rules might have missed (especially: senior SNAP exemptions, pregnancy Medicaid in non-expansion states, student SNAP rules, ABAWD waivers, categorical eligibility).
3. Identify missing information that would change the score.
4. Generate a 1-2 sentence plain-language explanation in the user's preferred language.

Never say "you qualify" — always "you may qualify". Never give legal or financial advice. If uncertain, say so.

Return JSON:
{
  "score_adjustment": "upgrade" | "downgrade" | "no_change",
  "final_score": "strong" | "possible" | "unlikely",
  "confidence": 0.0-1.0,
  "reasoning": "Plain-language 1-2 sentence explanation in {language}",
  "missing_facts": ["fact_key_1", "fact_key_2"],
  "flagged_edge_cases": ["short description"]
}
```

User prompt:

```
Profile: {JSON.stringify(profile)}
Facts: {JSON.stringify(facts)}
Program: {program.name}
Rules: {JSON.stringify(program.eligibility_rules)}
Rules engine output: {JSON.stringify(rulesResult)}
User's preferred language: {profile.language_preference}
```

## Step 3: Conservative UX, generous internals

The engine is generous (considers every program, generates real scores for borderline cases). The dashboard is conservative:

- **Strong matches**: always shown prominently with green badges, top of page.
- **Possible matches**: shown in a collapsed "We found other programs you may also qualify for — see them" section with yellow badges and confidence indicators.
- **Unlikely matches**: not shown by default; reachable through search ("Don't see what you're looking for?").

Each match displays:
- Program name + category badge
- Eligibility badge (🟢 strong / 🟡 possible)
- 1-line LLM-generated reasoning ("Based on your income and household size, you likely qualify for SNAP.")
- Link: "Learn more" → /programs/:id
- CTA: "Start application" → opens the gov portal in a new tab; extension takes over there.

Display the disclaimer below every match: *"This is informational guidance only, not legal advice. Confirm by applying."*

---

# Pages

## 1. Landing (/)

Pre-login marketing page. Single page, scroll-driven.

Sections:
- Hero: headline ("The same advantage anyone with a lawyer has — but for the benefits you're already entitled to"), CTA "Get started in 5 minutes", brief 2-line value prop
- 3-step explainer with icons: 1) Tell us about yourself once, 2) See programs you may qualify for, 3) Click apply — we autofill the actual government forms
- Stats: $140B unclaimed benefits/year, 18% of eligible miss SNAP, 50% miss WIC
- Programs covered (logos: SNAP, Medicaid, TANF, ACA, MSP)
- Privacy reassurance section
- Footer: privacy policy, contact

CTAs: "Sign up free", "Already have an account? Log in"

## 2. Auth (/login, /signup)

Standard email/password via Supabase Auth. Privacy consent checkbox on signup. No OAuth in v1.

## 3. Onboarding (/onboarding)

11 conversational screens, one question per screen, progress bar at top. Skip multi-step if user closes — resume on next login.

| # | Question | Field | Validation |
|---|---|---|---|
| 1 | Full legal name | `full_name` | required, text |
| 2 | Age | `age` | required, integer 18-120 |
| 3 | State (dropdown) | `state` | required, US state |
| 4 | ZIP code | `zip_code` | required, 5 digits |
| 5 | Employment status | `employment_status` | required, select |
| 6 | Current monthly income (USD) | `monthly_income_current` | required, ≥ 0 |
| 7 | Household size (number) | `household_size` | required, integer ≥ 1 |
| 8 | Citizenship status | `citizenship_status` | required, select |
| 9 | Children under 18? If yes, how many | `has_children` + `num_children` | required |
| 10 | Disability / pregnancy / student status (multi-question) | three fields | required (can answer "no" or "prefer not to say") |
| 11 | Privacy consent | checkbox | required to proceed |

UI behavior:
- One question per screen, large clean type
- Back/Next buttons; Back preserves state
- All answers held in React state until step 11 → on submit, single transactional write to `user_profile` + 11 inserts to `user_facts` (one per field, with `source: "onboarding"`)
- After submit: trigger eligibility engine via API; redirect to /dashboard with loading state

Critical: write each onboarding answer as both a `user_profile` row and a `user_facts` row. The extension reads from `user_facts`; the eligibility engine reads from `user_profile`.

## 4. Dashboard (/dashboard)

Main hub. Left sidebar (persistent across all logged-in pages) + main content.

**Sidebar**: app logo, Dashboard (active), Documents, Programs, Settings, log out.

**Main content sections, top to bottom**:

**A. Greeting and quick stats**
- "Hi, Maria — you may qualify for [N] programs"
- Quick stats: 3 strong, 2 possible

**B. Strong matches (prominent)**
Card grid, 3 across on desktop, 1 column on mobile. Each card:
- Program name
- Category badge with icon
- Green "Strong match" badge
- 1-line LLM reasoning ("Your monthly income is well within the SNAP limit for a household of 3.")
- Required documents status (checkmark if we have facts that satisfy them)
- Two buttons: "Learn more" / "Start application"
- "Start application" opens the program's `application_url` in a new tab; extension takes over

**C. Possible matches (collapsed)**
"We found 2 other programs you may qualify for — see them" → expand to show same card format, yellow badges. Yellow card includes "this depends on..." note.

**D. Application tracker** (only renders if user has any `user_programs.status` other than "matched")
Table: Program | Status | Last updated | Action
- Status colors: matched gray, in_progress blue, submitted purple, approved green, denied red
- Action column: "Continue" / "View" / "Update status"

**E. Quick actions bar**
Three buttons: "Upload document", "Search programs", "Ask assistant" (opens chat widget).

**Floating chat widget**: bottom-right corner, opens drawer with the chat assistant (see chat spec below). Persists across pages.

## 5. Program Detail (/programs/:id)

Single column, scrollable.

Sections:
1. Header: program name, category badge, eligibility badge, "Start application" CTA, official site link
2. What is this program — pulled from `programs.description_{lang}`
3. Why you may qualify — `user_programs.reasoning`
4. Eligibility checklist — visual rendering of `eligibility_rules` against `user_profile`:
   - ✅ Green check: requirement met
   - ⚠️ Yellow warning: uncertain or close to threshold
   - ❌ Red X: requirement not met
   - Each row: requirement name + your status
5. Required documents — list from `programs.required_documents`. Each: ✅ "On file" or ❌ "Missing — upload now" → /documents
6. Next steps — static numbered list:
   1. Review the requirements above
   2. Gather any missing documents
   3. Click "Start application" — we'll open the official government portal and autofill your information
   4. Submit through the official site

## 6. Documents (/documents)

Upload, view, manage uploaded documents.

Layout: header + "Upload new document" CTA + grid of document cards.

Upload flow:
1. User clicks "Upload"
2. Modal: select document type (drivers_license / pay_stub / w2 / lease / utility_bill / benefit_letter / ssn_card / birth_certificate / other)
3. File picker (max 10MB, accepts PDF/JPG/PNG/HEIC) or "Take a photo" (mobile camera input)
4. Upload to Supabase Storage `documents/{user_id}/{document_id}_{timestamp}.{ext}`
5. Insert row into `documents` with `extraction_status: 'pending'`
6. Background job: send file to Claude vision API with document-type-specific prompt
7. Parse JSON response, write each non-null field to `user_facts` with `source: 'document'`
8. Update `documents.extraction_status: 'completed'`, `extracted_facts_count: N`
9. Show user a review screen: "We found these details — confirm or correct"
10. After 24h, scheduled cleanup deletes file from Storage, sets `file_url = null`

Each document card shows:
- Document type icon
- Filename
- Upload date
- Extraction status (pending / completed / failed)
- "View extracted facts" button → opens modal listing what was pulled
- "Delete" button

## 7. Settings (/settings)

Tabs:

**Profile**: edit any onboarding field. Saving triggers re-running eligibility engine.

**Privacy**:
- Toggle: "Delete documents after extraction" (default on)
- Button: "Delete all my stored facts" (wipes user_facts)
- Button: "Delete my account" (cascade deletes everything, signs out)

**Language**: select between English / Spanish. Triggers UI re-render via i18next + flips `language_preference`.

**Notifications**: (placeholder for v2)

---

# Chrome extension

Manifest V3. TypeScript with esbuild. Distribution: Chrome Web Store (or local "Load unpacked" for hackathon demo).

## File structure

```
extension/
├── manifest.json
├── src/
│   ├── content/
│   │   ├── index.ts                  # entry point
│   │   ├── detectors/
│   │   │   ├── abe_il.ts            # ABE-specific field detection
│   │   │   └── healthcare_gov.ts    # healthcare.gov-specific detection
│   │   ├── autofill.ts              # field-fill orchestration
│   │   └── ui.ts                    # in-page banner UI
│   ├── popup/
│   │   ├── index.html
│   │   ├── index.ts                 # extension popup
│   │   └── styles.css
│   ├── background.ts                # service worker
│   └── shared/
│       ├── api.ts                   # backend API client
│       └── types.ts
├── icons/
│   ├── 16.png
│   ├── 48.png
│   └── 128.png
└── package.json
```

## manifest.json

```json
{
  "manifest_version": 3,
  "name": "[PROJECT NAME] — benefits autofill",
  "version": "0.1.0",
  "description": "Autofill government benefit applications using your stored profile.",
  "permissions": ["storage", "activeTab"],
  "host_permissions": [
    "https://abe.illinois.gov/*",
    "https://*.healthcare.gov/*",
    "https://*.your-app-domain.com/*"
  ],
  "action": {
    "default_popup": "popup/index.html",
    "default_icon": {
      "16": "icons/16.png",
      "48": "icons/48.png",
      "128": "icons/128.png"
    }
  },
  "background": {
    "service_worker": "background.js"
  },
  "content_scripts": [
    {
      "matches": [
        "https://abe.illinois.gov/*",
        "https://*.healthcare.gov/*"
      ],
      "js": ["content/index.js"],
      "run_at": "document_idle"
    }
  ]
}
```

## Content script flow

```
1. Page loads → content script runs at document_idle
2. URL match check: which portal are we on?
3. Auth check: is the user logged into the dashboard? (check Supabase session token via fetch to backend)
   - If not: show banner "Log in to [PROJECT NAME] to autofill"
4. Field discovery: run portal-specific detector
   - ABE: scan for <input>, <select>, <textarea> with associated <label>; build map of label → element
   - healthcare.gov: same, plus listen for SPA navigation events to re-scan on each step
5. Show banner: "Autofill {N} fields from your profile?" with [Autofill] [Dismiss] buttons
6. On click Autofill:
   a. POST /api/extension/autofill with { portal_id, field_labels: [...], user_id }
   b. Backend matches each label against portal_field_mappings table
   c. For unmatched labels, backend uses LLM to suggest a user_facts key
   d. Backend returns: { values: [{ label, value, confidence }, ...], unfilled: [labels we couldn't match] }
   e. For each (label, value): find element, set value, dispatch 'input' and 'change' events, highlight blue
   f. For unfilled fields: highlight yellow with tooltip "We don't know this — please fill in"
7. User reviews, edits, submits ON THE GOV SITE
8. After submit: page navigates; on next page if it's a confirmation, content script reports "submitted" to backend → POST /api/extension/submit
```

## ABE.illinois.gov field detector

```typescript
// src/content/detectors/abe_il.ts

interface DetectedField {
  label: string;
  selector: string;
  type: "text" | "select" | "radio" | "checkbox" | "date" | "number";
  element: HTMLElement;
}

export function detectAbeFields(): DetectedField[] {
  const fields: DetectedField[] = [];

  // ABE uses traditional form controls with adjacent <label> elements
  document.querySelectorAll("input, select, textarea").forEach((el) => {
    const element = el as HTMLInputElement;
    if (element.type === "hidden" || element.type === "submit") return;

    // Try multiple label-finding strategies
    let label = "";

    // Strategy 1: <label for="id">
    if (element.id) {
      const labelEl = document.querySelector(`label[for="${element.id}"]`);
      if (labelEl) label = labelEl.textContent?.trim() ?? "";
    }

    // Strategy 2: parent <label>
    if (!label) {
      const parentLabel = element.closest("label");
      if (parentLabel) label = parentLabel.textContent?.trim().replace(element.value, "") ?? "";
    }

    // Strategy 3: aria-label
    if (!label) label = element.getAttribute("aria-label") ?? "";

    // Strategy 4: placeholder
    if (!label) label = element.placeholder ?? "";

    if (!label) return;

    fields.push({
      label,
      selector: cssPath(element),
      type: element.tagName === "SELECT" ? "select" : (element.type as any),
      element
    });
  });

  return fields;
}

function cssPath(el: Element): string {
  // Generate stable CSS path; prefer id, then classname + nth-of-type
  if (el.id) return `#${el.id}`;
  // ... full implementation
}
```

## healthcare.gov field detector

healthcare.gov is a multi-step SPA. The detector needs to:
- Listen for URL changes (history.pushState / popstate)
- Re-scan fields after each step transition
- Handle dynamically-rendered fields via MutationObserver
- Avoid double-filling on re-renders

```typescript
// src/content/detectors/healthcare_gov.ts

let lastUrl = location.href;
const observer = new MutationObserver(() => {
  if (location.href !== lastUrl) {
    lastUrl = location.href;
    onStepChange();
  }
});
observer.observe(document.body, { childList: true, subtree: true });

function onStepChange() {
  // Wait for fields to render
  setTimeout(() => {
    const fields = detectFields();
    if (fields.length > 0) {
      showAutofillBanner(fields);
    }
  }, 500);
}
```

## In-page banner UI

Inject a small fixed-position banner in the corner of the gov site:

```html
<div id="proj-banner" style="
  position: fixed; top: 16px; right: 16px; z-index: 999999;
  background: white; border-radius: 12px; padding: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15); max-width: 320px;
  font-family: -apple-system, system-ui, sans-serif;">
  <div style="font-weight: 600;">Autofill 14 fields from your profile?</div>
  <div style="margin-top: 12px; display: flex; gap: 8px;">
    <button id="proj-fill" style="...">Autofill</button>
    <button id="proj-dismiss" style="...">Not now</button>
  </div>
</div>
```

## Privacy guarantees

- Extension only activates on whitelisted URLs (manifest `host_permissions`)
- No data is read from any other page
- All requests to the backend are authenticated; the extension uses the same Supabase session as the dashboard
- The extension never auto-submits — user always reviews on the gov site
- No telemetry, no analytics

---

# API endpoints

All routes are Vercel serverless functions. Auth: Supabase JWT in `Authorization: Bearer` header. RLS enforces user-data isolation at the DB level.

## `POST /api/profile`
Create or update user_profile. Body: profile fields. Side effect: writes corresponding user_facts.

## `GET /api/profile`
Read current user's profile.

## `POST /api/facts`
Upsert a single user_fact. Body: `{ field_key, field_value, source }`.

## `GET /api/facts`
Read all user_facts for current user.

## `GET /api/programs`
Read all programs (public).

## `GET /api/programs/:id`
Read one program.

## `POST /api/eligibility/run`
Re-run eligibility engine for current user. Body: `{}`. Returns: `{ matches: UserProgram[] }`. Side effect: upserts to user_programs.

## `POST /api/extension/autofill`
The extension's main endpoint.

Request:
```json
{
  "portal_id": "abe_il",
  "page_url": "https://abe.illinois.gov/access/AddIncome",
  "field_labels": [
    "Annual Household Income",
    "Number of People in Household",
    "Date of Birth",
    "Are you a U.S. Citizen?"
  ]
}
```

Response:
```json
{
  "values": [
    { "label": "Annual Household Income", "value": "22000", "user_fact_key": "annual_income_last_year", "confidence": 1.0 },
    { "label": "Number of People in Household", "value": "3", "user_fact_key": "household_size", "confidence": 1.0 },
    { "label": "Date of Birth", "value": "1991-04-12", "user_fact_key": "date_of_birth", "confidence": 1.0 },
    { "label": "Are you a U.S. Citizen?", "value": "Yes", "user_fact_key": "citizenship_status", "confidence": 0.95 }
  ],
  "unfilled": []
}
```

Logic:
1. For each label, look in `portal_field_mappings` for an exact match → return value if `user_facts` has that key
2. For unmapped labels, call Claude with: "Given these user facts {facts} and these field labels we don't have mappings for {labels}, return JSON of best-guess mappings with confidence." Use confidence threshold 0.7.
3. Cache new mappings to `portal_field_mappings` for future reuse.

## `POST /api/extension/submit`
Extension reports a submission. Body: `{ portal_id, program_id, page_url }`. Updates `user_programs.status = 'submitted'`, sets `submitted_at`.

## `POST /api/documents/upload`
Generate a signed Supabase Storage upload URL. Body: `{ document_type, file_name }`. Returns: `{ signed_url, document_id }`.

## `POST /api/documents/extract`
Triggered after upload completes. Body: `{ document_id }`. Side effects:
1. Fetch file from Storage
2. Send to Claude vision API with prompt for that document_type
3. Parse JSON response
4. Upsert each non-null field to user_facts with source: 'document'
5. Update documents row: extraction_status, extracted_facts_count

## `POST /api/chat`
Body: `{ messages: ConversationMessage[] }`. Returns streaming Claude response. System prompt includes user profile + relevant program data (small enough to fit; no RAG needed).

---

# User scenarios (test data + demo personas)

These are both test users for development and demo personas for the pitch. Seed the database with these for the demo.

## Persona 1: Maria — primary demo persona

```
full_name: "Maria Hernandez"
age: 34
state: "IL"
zip_code: "60629"  // Chicago Lawn neighborhood
employment_status: "unemployed"
monthly_income_current: 0
annual_income_last_year: 22000
household_size: 3
has_children: true
num_children: 2
citizenship_status: "citizen"
disability_status: "no"
pregnant: false
student_status: "no"
language_preference: "es"  // Spanish
```

Expected eligibility (run by engine):
- ✅ **SNAP**: strong (income well under limit, has children, exempt from work requirements)
- ✅ **Medicaid (IL)**: strong (income under expansion threshold, IL resident, citizen)
- ✅ **TANF**: strong (has kids under 18, very low income, IL)
- ✅ **ACA Marketplace + PTC**: possible (currently no income; might prefer Medicaid which she qualifies for)
- ❌ **MSP**: unlikely (under 65, not on Medicare)

Demo narrative: Maria is the protagonist. Her path is the cleanest demo and exercises the full feature set.

## Persona 2: Robert — senior, edge-case demo

```
full_name: "Robert Williams"
age: 68
state: "IL"
zip_code: "60628"  // Roseland, Chicago
employment_status: "retired"
monthly_income_current: 1400  // Social Security
annual_income_last_year: 16800
household_size: 1
has_children: false
num_children: 0
citizenship_status: "citizen"
disability_status: "yes"  // mild
pregnant: false
student_status: "no"
```

Expected eligibility:
- ✅ **SNAP**: strong (income exceeds gross test, but **senior/disabled exemption** applies — only net test, which he passes). This is the case where the LLM judge is critical: a strict rules engine without the exemption logic would mark him "unlikely". He's the test for whether the LLM catches edge cases.
- ✅ **Medicaid (IL)**: strong (well under limit)
- ✅ **MSP**: strong (Medicare-age, low income)
- ❌ **TANF**: unlikely (no children)
- ❌ **ACA**: unlikely (already on Medicare)

Demo use: show how the extension handles a senior. If we have time in the demo, mention how the LLM judge caught his eligibility despite him exceeding the gross income test.

## Persona 3: Aisha — Spanish-speaking, pregnancy edge case

```
full_name: "Aisha Patel"
age: 28
state: "IL"
zip_code: "60804"  // Cicero
employment_status: "part_time"
monthly_income_current: 2800
annual_income_last_year: 33000
household_size: 3  // pregnant + 3yo + her
has_children: true
num_children: 1
citizenship_status: "permanent_resident"
disability_status: "no"
pregnant: true
student_status: "no"
language_preference: "es"
```

Expected eligibility:
- ✅ **Medicaid (IL pregnancy)**: strong (income well under pregnancy threshold for HH of 3)
- ✅ **SNAP**: strong (income within limit for HH of 3, has children, citizenship qualifying noncitizen)
- ✅ **WIC**: strong (pregnant + child under 5) — *not in v1 program list, mention only*
- ❓ **TANF**: depends on hours worked (work requirement is 30 hrs/week)
- ✅ **ACA Marketplace**: possible (alternative if she doesn't take Medicaid)

Demo use: shows multilingual support (Spanish dashboard, autofill in English on the gov site). Also demonstrates the engine handling pregnancy threshold separately from standard Medicaid.

## Persona 4: Marcus — recent layoff, income transition edge case

```
full_name: "Marcus Johnson"
age: 29
state: "IL"
zip_code: "60615"  // Hyde Park
employment_status: "unemployed"
monthly_income_current: 0  // just laid off
annual_income_last_year: 85000  // last year's tech contract
household_size: 1
has_children: false
num_children: 0
citizenship_status: "citizen"
disability_status: "no"
pregnant: false
student_status: "no"
```

Expected eligibility:
- ✅ **SNAP**: strong (current income $0, work requirement applies but Cook County has ABAWD waiver) — but ONLY if engine uses `monthly_income_current` not `annual_income_last_year`. If we screwed this up, he'd be marked "unlikely" because of the $85K bucket.
- ✅ **Medicaid (IL)**: strong (current monthly income → annual ~$0)
- ❌ **TANF**: no children
- ✅ **ACA Marketplace + PTC**: possible alternative
- ❌ **MSP**: under 65

Demo use: tests that we correctly use current income for means-tested programs. This is the case the original spec got wrong by bucketing income.

---

# Build order and milestones

Numbered roughly in dependency order. Each milestone is a checkpoint where the system is in a coherent state.

## M1: Project skeleton (1-2 days)
- Vite + React + TypeScript + Tailwind set up
- Supabase project created, env vars configured
- Run schema migrations: create all tables, enable RLS, create policies
- Seed `programs` table with 5 programs
- Seed `portal_field_mappings` with hand-coded ABE mappings (start with ~30 most common fields)
- Vercel deploy of empty React app

**Acceptance**: app deploys, Supabase connection works, programs are queryable from frontend.

## M2: Auth + onboarding (1-2 days)
- Supabase Auth with email/password
- Sign up, log in, sign out
- Onboarding flow (11 screens) — write to `user_profile` + `user_facts`
- Privacy consent
- Auth guard on protected routes

**Acceptance**: a new user can sign up, complete onboarding, and have rows in both `user_profile` and `user_facts`.

## M3: Dashboard skeleton (1-2 days)
- Layout with sidebar + main content
- Greeting + stats area (placeholder values)
- Sections placeholders: strong matches, possible matches, tracker, quick actions
- Settings page with profile editing
- Language toggle (EN/ES) with i18next

**Acceptance**: a logged-in user sees a dashboard with their name, can navigate to settings and edit fields.

## M4: Eligibility engine (2-3 days)
- Implement `scoreEligibility()` for all 5 programs (rules engine)
- Implement Claude judge endpoint
- `/api/eligibility/run` endpoint
- Re-run trigger: post-onboarding, post-profile-edit, manual button
- Render strong + possible matches on dashboard
- Implement "Possible matches" collapsed section
- Program detail page (/programs/:id) with eligibility checklist

**Acceptance**: the 4 personas above produce the expected eligibility results when seeded and run.

## M5: Document upload + OCR (1-2 days)
- Documents page UI
- Upload to Supabase Storage with signed URLs
- Send to Claude vision API for extraction
- Per-document-type prompt templates
- Parse + write to user_facts
- Review screen
- 24-hour deletion job (Vercel cron or scheduled Supabase function)

**Acceptance**: uploading a pay stub for Maria results in `monthly_income_current` (or annual) being populated in `user_facts`.

## M6: Chrome extension — ABE only (3-4 days)
- Extension scaffold (manifest, content script, popup, background)
- ABE field detector
- Backend `/api/extension/autofill` endpoint
- LLM-powered field-mapping for unmapped labels
- In-page banner UI
- Authentication (extension reads Supabase session)
- End-to-end: load extension, navigate to ABE.illinois.gov, complete onboarding via dashboard, return to ABE → see banner → click → fields populate
- Submission detection → POST `/api/extension/submit`
- Update dashboard tracker

**Acceptance**: a logged-in user landing on ABE.illinois.gov sees the autofill banner, clicks it, and Maria's profile fields populate the form.

## M7: Chrome extension — healthcare.gov (2-3 days)
- healthcare.gov detector (handle SPA navigation)
- MutationObserver for dynamically-rendered fields
- Step-by-step autofill (re-run on each wizard transition)
- Add healthcare.gov mappings to `portal_field_mappings`

**Acceptance**: same flow as M6 works on healthcare.gov.

## M8: Chat assistant (1-2 days)
- Floating widget (bottom-right of dashboard)
- Streaming Claude responses with system prompt that includes user profile + program info
- Background fact extraction from chat (after each user message, async LLM call to detect new facts → confirm with user via toast → write to user_facts)

**Acceptance**: chat answers questions about programs accurately, extracts facts from conversational messages.

## M9: Polish + multilingual (1-2 days)
- All UI strings in i18next (English + Spanish)
- Translate program descriptions on the fly (cache in `program_translations` table for the user's language)
- Eligibility reasoning generated in user's language by the LLM judge
- Empty states, loading states, error states
- Responsive mobile layout
- Privacy policy page
- Landing page polish

## M10: Demo prep + testing
- Seed database with 4 personas
- Record demo video (4-min Maria walkthrough)
- Slide deck
- Rehearse the live demo on ABE + healthcare.gov

---

# Demo script (4 minutes)

This is the demo for hackathon judging. Maria is the protagonist; everything she does maps to a real user's needs.

**0:00–0:20 — Hook**
> "Roughly $140 billion in federal benefits go unclaimed every year. SNAP misses 18% of eligible people. WIC misses half. Why? Not because people don't need help — because the applications are 30 pages of legal English, in a language they may not speak, with rules they don't understand. Today we're going to show you what happens when you give them the same advantage anyone with a lawyer or accountant has."

**0:20–0:50 — Sign up + onboarding**
- Show sign-up page → Maria's email
- Speed-run onboarding (11 screens, ~2 seconds each, narrating "name, age, Illinois, ZIP, unemployed, monthly income zero, household of 3, two kids, U.S. citizen, no disability, consent")

**0:50–1:30 — Dashboard reveal**
- Loading: "Running eligibility on 5 federal and state programs..."
- Result: 3 strong matches (SNAP, Medicaid, TANF), 1 possible (ACA)
- Read out the LLM-generated reasoning lines: "Your monthly income is well within the SNAP limit for a household of 3. As an unemployed parent of children under 14, you're exempt from work requirements."
- "She's qualified for these programs the entire time she's been laid off. She just didn't know."

**1:30–2:00 — Document upload**
- Click "Upload pay stub"
- Drop a real pay stub image
- Watch extraction: Vision LLM extracts employer, gross income, ytd income, pay period, employer address
- Review screen, click confirm
- "We never store the file. The image is deleted in 24 hours. Only the data we extracted lives on."

**2:00–3:30 — The autofill (the wow)**
- Click "Start application — SNAP" → opens **ABE.illinois.gov** in a new tab
- *Live*: the autofill banner appears in the corner: "Autofill 14 fields from your profile?"
- Click Autofill → fields light up blue: name, address, household size, children's names, income, employment, citizenship — all populated from the profile + pay stub
- Two yellow fields remain: "Date you last worked" and "Spouse's income (if applicable)" — Maria fills them
- Click Submit ON THE OFFICIAL ABE SITE
- Show real Illinois confirmation page
- "She just submitted to the State of Illinois. That's a real application with a real confirmation number. We never replicated their form. We never held her data hostage. We made the form fillable in 60 seconds instead of 60 minutes."

**3:30–4:00 — Close**
- Switch to **healthcare.gov** to show portability: "And this works on healthcare.gov too. Same profile, same extension, completely different portal."
- One quick autofill on healthcare.gov to prove the pattern
- "JobRight gave 500,000 job seekers an unfair advantage by autofilling employer applications. We do the same for low-income and immigrant families applying for the government benefits they're already entitled to. The cheat code is no longer hidden."

---

# Privacy and security

## Data handling principles
- **Encryption at rest**: Supabase encrypts all DB and Storage data with AES-256.
- **HTTPS everywhere**: enforced by Vercel and Supabase.
- **Documents auto-delete after 24 hours**: scheduled cleanup job.
- **SSN handling**: store only last 4 digits. Full SSN typed by user directly into government portal at submission time, never stored on our servers.
- **RLS on every user-data table**: users cannot read or write each other's data even if the app code is exploited.
- **Cascade delete on user deletion**: deleting an account wipes user_profile, user_facts, documents, user_programs, and Storage files.
- **No third-party analytics, no telemetry, no ads**: this audience cannot afford our data being shared.
- **Extension only activates on whitelisted URLs**: manifest `host_permissions` is restrictive.
- **Extension never auto-submits**: user always reviews on the gov site.

## Required disclaimers
Every AI-generated response, eligibility explanation, and chat message ends with:
> *This is informational guidance only and does not constitute legal or financial advice.*

Privacy policy page is required and linked from the landing page footer + onboarding consent.

## Compliance notes
- **HIPAA**: we are not a covered entity, but health-related facts (e.g., disability status, pregnancy) are sensitive. Treat as such.
- **State privacy laws**: Illinois has the Biometric Information Privacy Act (BIPA). We do not collect biometrics. If we ever add face/voice recognition, this becomes a real concern.
- **Children's data**: we capture children's existence (`has_children`, `num_children`) but never their names or details. If we ever do, COPPA applies.

---

# Out of scope for v1

Explicitly NOT building in v1:
- Form schemas inside the app (replaced by Chrome extension on real .gov sites)
- More than 2 portals (ABE + healthcare.gov)
- More than 5 programs (SNAP, Medicaid IL, TANF IL, ACA, MSP)
- More than 2 languages (English + Spanish)
- Voice interface
- Email/Gmail integration
- Mobile app (web-responsive only)
- Application status appeals workflow
- Caseworker / navigator B2B mode
- Government API integrations for real-time status
- pgvector / RAG (program corpus fits in system prompt)
- Tesseract OCR (vision LLM handles it)
- Background fact-detection from chat (cool but cuts demo time)
- Translation caching across users (just translate inline per request)

---

# How to use this file with Claude Code

This file is structured to work as project context for Claude Code. Recommended workflow:

1. Drop this file at the root of your project as `CLAUDE.md`. Claude Code reads it automatically.
2. Use the build order section (M1–M10) to scope each work session: "implement milestone M2."
3. The eligibility engine pseudocode in TypeScript is a starting point — Claude Code can extend it with the rules for the other 4 programs following the same pattern.
4. The user scenarios are seedable test data — drop them into a `seed.ts` file.
5. The demo script is the acceptance test: if you can demo Maria's flow end-to-end on real ABE.illinois.gov, you've shipped v1.

When asking Claude Code for help, reference specific sections of this doc by name (e.g., "implement the eligibility engine described in the Eligibility engine section, starting with SNAP").
