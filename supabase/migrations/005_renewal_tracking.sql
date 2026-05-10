-- Renewal tracking: adds renewal cadence to programs + approval date to user_programs
-- Run in Supabase SQL editor after 004_portal_field_mappings.sql

alter table programs
  add column if not exists renewal_period_months integer,
  add column if not exists renewal_notes text;

alter table user_programs
  add column if not exists approved_at timestamptz,
  add column if not exists last_renewed_at timestamptz;

-- Seed renewal periods for the 16 programs
-- SNAP: 12-month cert period (IL standard)
update programs set
  renewal_period_months = 12,
  renewal_notes = 'Annual recertification required. Contact your local SNAP office or renew online at ABE.illinois.gov before your cert period ends — benefits stop immediately if you miss it.'
where name ilike '%SNAP%';

-- WIC: 6-month certification
update programs set
  renewal_period_months = 6,
  renewal_notes = 'Recertify every 6 months at your local WIC agency. Bring proof of income, residency, and your child''s age/weight records.'
where name ilike '%WIC%';

-- Medicaid: annual renewal
update programs set
  renewal_period_months = 12,
  renewal_notes = 'Annual renewal required. Illinois sends a renewal packet by mail — complete it before the deadline or coverage ends. Also renew at ABE.illinois.gov.'
where name ilike '%Medicaid%';

-- CHIP: annual renewal
update programs set
  renewal_period_months = 12,
  renewal_notes = 'Annual renewal required. Illinois sends a renewal notice. Children lose coverage if renewal is missed.'
where name ilike '%CHIP%';

-- LIHEAP: annual (per heating season)
update programs set
  renewal_period_months = 12,
  renewal_notes = 'Apply each year — LIHEAP funding is first-come, first-served. Apply as early as possible in the heating season (Illinois opens Oct/Nov).'
where name ilike '%LIHEAP%';

-- Lifeline: annual recertification
update programs set
  renewal_period_months = 12,
  renewal_notes = 'Annual recertification required by the Universal Service Administrative Company (USAC). Miss it and service is cancelled within 30 days.'
where name ilike '%Lifeline%';

-- TANF: 6 months (Illinois redetermination)
update programs set
  renewal_period_months = 6,
  renewal_notes = 'Illinois requires redetermination every 6 months. Work participation and compliance are reviewed continuously. DHS will contact you before your case closes.'
where name ilike '%TANF%';

-- SSI: continuing disability review every 1–3 years
update programs set
  renewal_period_months = 12,
  renewal_notes = 'SSA conducts Continuing Disability Reviews (CDR) every 1–3 years. Report any income/living changes immediately — overpayments must be repaid.'
where name ilike '%SSI%' and name not ilike '%SSDI%';

-- SSDI: CDR every 1–3 years
update programs set
  renewal_period_months = 24,
  renewal_notes = 'Continuing Disability Reviews every 1–3 years. Report any work activity or income changes to SSA promptly.'
where name ilike '%SSDI%';

-- Unemployment Insurance: certify weekly, max ~26 weeks
update programs set
  renewal_period_months = 6,
  renewal_notes = 'Weekly certification required — log in to the Illinois Department of Employment Security (IDES) portal every week to certify. Maximum benefit period is typically 26 weeks.'
where name ilike '%Unemployment%';

-- Section 8: annual recertification
update programs set
  renewal_period_months = 12,
  renewal_notes = 'Annual recertification with your local Public Housing Authority (PHA) required. Must report any income or household changes within 30 days.'
where name ilike '%Section 8%' or name ilike '%Housing Choice%';

-- Emergency Rental Assistance: program-specific, typically 3–6 months
update programs set
  renewal_period_months = 3,
  renewal_notes = 'Most ERA programs provide up to 3 months of assistance at a time, renewable while funds are available. Check with your local program for reapplication rules.'
where name ilike '%Emergency Rental%';

-- Pell Grant: annual FAFSA required
update programs set
  renewal_period_months = 12,
  renewal_notes = 'Complete FAFSA every year by the priority deadline (typically March 1 for Illinois). Award amount changes based on annual income and enrollment status.'
where name ilike '%Pell%';

-- FAFSA: annual
update programs set
  renewal_period_months = 12,
  renewal_notes = 'Submit FAFSA every year — aid does not automatically renew. Illinois priority deadline is typically March 1.'
where name ilike '%FAFSA%';

-- Social Security Retirement: no renewal needed
update programs set
  renewal_period_months = null,
  renewal_notes = 'No renewal required — Social Security retirement benefits continue automatically. Report any major life changes (marriage, death, address) to SSA.'
where name ilike '%Social Security Retirement%' or name ilike '%Social Security%';

-- School Meals: annual application
update programs set
  renewal_period_months = 12,
  renewal_notes = 'Reapply each school year — approval does not carry over. Schools send home applications at the start of every year.'
where name ilike '%School Meal%';
