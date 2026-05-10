-- Additional healthcare.gov screener field label mappings
-- Run in Supabase SQL editor after 005_renewal_tracking.sql

insert into portal_field_mappings (portal_id, url_pattern, field_label, user_fact_key, required)
values
  -- ZIP / state (screener step 1)
  ('healthcare_gov', 'healthcare.gov/*', 'ZIP code', 'zip_code', true),
  ('healthcare_gov', 'healthcare.gov/*', 'Zip code', 'zip_code', true),
  ('healthcare_gov', 'healthcare.gov/*', 'What ZIP code do you live in?', 'zip_code', true),
  ('healthcare_gov', 'healthcare.gov/*', 'Enter your ZIP code', 'zip_code', true),
  ('healthcare_gov', 'healthcare.gov/*', 'State', 'state', true),
  ('healthcare_gov', 'healthcare.gov/*', 'What state do you live in?', 'state', true),

  -- Household size (screener step 2)
  ('healthcare_gov', 'healthcare.gov/*', 'How many people are in your household?', 'household_size', true),
  ('healthcare_gov', 'healthcare.gov/*', 'How many people in your household', 'household_size', true),
  ('healthcare_gov', 'healthcare.gov/*', 'Number of people in your household', 'household_size', true),
  ('healthcare_gov', 'healthcare.gov/*', 'Household members', 'household_size', true),
  ('healthcare_gov', 'healthcare.gov/*', 'People in household', 'household_size', true),

  -- Age (screener step 3 — per person)
  ('healthcare_gov', 'healthcare.gov/*', 'Age', 'age', false),
  ('healthcare_gov', 'healthcare.gov/*', 'Your age', 'age', false),
  ('healthcare_gov', 'healthcare.gov/*', 'How old are you?', 'age', false),
  ('healthcare_gov', 'healthcare.gov/*', 'Date of birth', 'date_of_birth', false),
  ('healthcare_gov', 'healthcare.gov/*', 'Date of Birth', 'date_of_birth', false),

  -- Income (screener step 4)
  ('healthcare_gov', 'healthcare.gov/*', 'Annual income', 'annual_income_last_year', true),
  ('healthcare_gov', 'healthcare.gov/*', 'Estimated annual income', 'annual_income_last_year', true),
  ('healthcare_gov', 'healthcare.gov/*', 'Estimated household income', 'annual_income_last_year', true),
  ('healthcare_gov', 'healthcare.gov/*', 'Annual household income', 'annual_income_last_year', true),
  ('healthcare_gov', 'healthcare.gov/*', 'What is your household''s current annual income?', 'annual_income_last_year', true),
  ('healthcare_gov', 'healthcare.gov/*', 'Total annual income', 'annual_income_last_year', true),
  ('healthcare_gov', 'healthcare.gov/*', 'Household income', 'annual_income_last_year', true),
  ('healthcare_gov', 'healthcare.gov/*', 'Your income', 'annual_income_last_year', false),

  -- Personal info (enrollment steps, if they log in)
  ('healthcare_gov', 'healthcare.gov/*', 'First name', 'first_name', true),
  ('healthcare_gov', 'healthcare.gov/*', 'Last name', 'last_name', true),
  ('healthcare_gov', 'healthcare.gov/*', 'Phone number', 'phone_number', false),
  ('healthcare_gov', 'healthcare.gov/*', 'Phone', 'phone_number', false),
  ('healthcare_gov', 'healthcare.gov/*', 'Email', 'email', false),
  ('healthcare_gov', 'healthcare.gov/*', 'Email address', 'email', false),
  ('healthcare_gov', 'healthcare.gov/*', 'Street address', 'address_line_1', false),
  ('healthcare_gov', 'healthcare.gov/*', 'Address line 1', 'address_line_1', false),
  ('healthcare_gov', 'healthcare.gov/*', 'City', 'city', false)

on conflict do nothing;
