-- Portal field mappings: maps gov portal form labels → user_facts keys
-- Run in Supabase SQL editor after 003_pgvector.sql

create table if not exists portal_field_mappings (
  id uuid primary key default gen_random_uuid(),
  portal_id text not null,           -- 'abe_il' | 'healthcare_gov'
  url_pattern text not null default '*',
  field_label text not null,         -- as it appears on the gov form
  field_selector text,               -- CSS selector if known
  user_fact_key text not null,       -- maps to user_facts.field_key
  required boolean default false,
  notes text,
  created_at timestamptz default now()
);

create unique index if not exists portal_field_mappings_portal_label
  on portal_field_mappings (portal_id, lower(field_label));

create index if not exists portal_field_mappings_portal_id
  on portal_field_mappings (portal_id);

-- Also add application_portal_id to programs if not present
alter table programs add column if not exists application_portal_id text;

-- Update existing programs with portal IDs
update programs set application_portal_id = 'abe_il'
  where name in ('SNAP (Food Stamps)', 'Medicaid', 'TANF (Temporary Assistance for Needy Families)');

update programs set application_portal_id = 'healthcare_gov'
  where name = 'ACA Marketplace Health Insurance'
     or (name like '%ACA%')
     or (application_url like '%healthcare.gov%');

-- Seed ABE Illinois field mappings
insert into portal_field_mappings (portal_id, url_pattern, field_label, user_fact_key, required) values
  ('abe_il', 'abe.illinois.gov/*', 'First Name', 'first_name', true),
  ('abe_il', 'abe.illinois.gov/*', 'Last Name', 'last_name', true),
  ('abe_il', 'abe.illinois.gov/*', 'Full Name', 'full_name', true),
  ('abe_il', 'abe.illinois.gov/*', 'Date of Birth', 'date_of_birth', true),
  ('abe_il', 'abe.illinois.gov/*', 'Date of birth', 'date_of_birth', true),
  ('abe_il', 'abe.illinois.gov/*', 'Social Security Number', 'ssn_last4', false),
  ('abe_il', 'abe.illinois.gov/*', 'SSN', 'ssn_last4', false),
  ('abe_il', 'abe.illinois.gov/*', 'Street Address', 'address', false),
  ('abe_il', 'abe.illinois.gov/*', 'Address', 'address', false),
  ('abe_il', 'abe.illinois.gov/*', 'City', 'city', false),
  ('abe_il', 'abe.illinois.gov/*', 'State', 'state', false),
  ('abe_il', 'abe.illinois.gov/*', 'ZIP Code', 'zip_code', false),
  ('abe_il', 'abe.illinois.gov/*', 'Zip Code', 'zip_code', false),
  ('abe_il', 'abe.illinois.gov/*', 'ZIP', 'zip_code', false),
  ('abe_il', 'abe.illinois.gov/*', 'Phone Number', 'phone', false),
  ('abe_il', 'abe.illinois.gov/*', 'Phone', 'phone', false),
  ('abe_il', 'abe.illinois.gov/*', 'Email', 'email', false),
  ('abe_il', 'abe.illinois.gov/*', 'Email Address', 'email', false),
  ('abe_il', 'abe.illinois.gov/*', 'Monthly Income', 'monthly_income', true),
  ('abe_il', 'abe.illinois.gov/*', 'Monthly Income Amount', 'monthly_income', true),
  ('abe_il', 'abe.illinois.gov/*', 'Gross Monthly Income', 'monthly_income', true),
  ('abe_il', 'abe.illinois.gov/*', 'Annual Income', 'annual_wages', false),
  ('abe_il', 'abe.illinois.gov/*', 'Annual Household Income', 'annual_wages', false),
  ('abe_il', 'abe.illinois.gov/*', 'Household Size', 'household_size', true),
  ('abe_il', 'abe.illinois.gov/*', 'Number of People in Household', 'household_size', true),
  ('abe_il', 'abe.illinois.gov/*', 'How many people live in your household', 'household_size', true),
  ('abe_il', 'abe.illinois.gov/*', 'Number of Children', 'children_count', false),
  ('abe_il', 'abe.illinois.gov/*', 'How many children', 'children_count', false),
  ('abe_il', 'abe.illinois.gov/*', 'Employer Name', 'employer_name', false),
  ('abe_il', 'abe.illinois.gov/*', 'Employer', 'employer_name', false),
  ('abe_il', 'abe.illinois.gov/*', 'Citizenship Status', 'citizenship_status', true),
  ('abe_il', 'abe.illinois.gov/*', 'Employment Status', 'employment_status', false),
  -- Healthcare.gov
  ('healthcare_gov', 'healthcare.gov/*', 'First Name', 'first_name', true),
  ('healthcare_gov', 'healthcare.gov/*', 'Last Name', 'last_name', true),
  ('healthcare_gov', 'healthcare.gov/*', 'Date of Birth', 'date_of_birth', true),
  ('healthcare_gov', 'healthcare.gov/*', 'Social Security Number', 'ssn_last4', false),
  ('healthcare_gov', 'healthcare.gov/*', 'Street Address', 'address', false),
  ('healthcare_gov', 'healthcare.gov/*', 'City', 'city', false),
  ('healthcare_gov', 'healthcare.gov/*', 'State', 'state', false),
  ('healthcare_gov', 'healthcare.gov/*', 'ZIP Code', 'zip_code', false),
  ('healthcare_gov', 'healthcare.gov/*', 'ZIP', 'zip_code', false),
  ('healthcare_gov', 'healthcare.gov/*', 'Email Address', 'email', false),
  ('healthcare_gov', 'healthcare.gov/*', 'Annual Household Income', 'annual_wages', true),
  ('healthcare_gov', 'healthcare.gov/*', 'Household Size', 'household_size', true),
  ('healthcare_gov', 'healthcare.gov/*', 'Number of people in household', 'household_size', true),
  ('healthcare_gov', 'healthcare.gov/*', 'Employer Name', 'employer_name', false)
on conflict do nothing;
