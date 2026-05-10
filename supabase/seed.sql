-- Seed 16 programs. Run after migrations.
insert into programs (name, category, description_en, eligibility_rules, required_documents, application_url, is_user_added)
values
  (
    'SNAP (Food Stamps)',
    'food',
    'Provides monthly food benefits on an EBT card to help low-income individuals and families buy groceries.',
    '{
      "gross_income_test": {
        "by_household_size": {"1": 1718, "2": 2326, "3": 2933, "4": 3540, "5": 4147, "6": 4754},
        "each_additional": 607
      },
      "states": "all",
      "work_requirements": {"age_range": [18, 64], "hours_per_month": 80, "exemptions": ["has_children_under_14", "disability"]}
    }',
    '{"government_issued_id","proof_of_residency","proof_of_income_last_30_days","proof_of_household_size","social_security_number"}',
    'https://www.fns.usda.gov/snap/state-directory',
    false
  ),
  (
    'WIC (Women, Infants & Children)',
    'food',
    'Provides healthy food, nutrition education, and health referrals to pregnant women, new mothers, infants, and children under 5.',
    '{
      "eligible_categories": ["pregnant","given_birth_within_6_months","breastfeeding_up_to_12_months_postpartum","infant_under_12_months","child_under_5"],
      "income_test": {"by_household_size": {"1": 2248, "2": 3041, "3": 3834, "4": 4628, "5": 5421}, "each_additional": 793},
      "states": "all",
      "citizenship": "no_citizenship_required"
    }',
    '{"proof_of_identity","proof_of_residency","proof_of_income_or_program_enrollment","proof_of_pregnancy_or_childs_age"}',
    'https://www.fns.usda.gov/wic/wic-eligibility-requirements',
    false
  ),
  (
    'Medicaid',
    'health',
    'Free or low-cost health coverage for low-income adults, children, pregnant women, elderly adults, and people with disabilities.',
    '{
      "income_test": {
        "expansion_states_annual_by_household": {"1": 20120, "2": 27215, "3": 34298, "4": 41400, "5": 48500, "6": 55600},
        "seniors_disabled_monthly_max": 967
      },
      "states": "all"
    }',
    '{"government_issued_id","proof_of_residency","proof_of_income","social_security_number","proof_of_citizenship_or_immigration_status"}',
    'https://www.healthcare.gov/medicaid-chip/getting-medicaid-chip/',
    false
  ),
  (
    'CHIP (Children''s Health Insurance Program)',
    'health',
    'Low-cost health coverage for children in families that earn too much for Medicaid but can''t afford private insurance.',
    '{
      "eligible_categories": ["child_under_19"],
      "income_test": {"annual_by_household": {"1": 29160, "2": 39440, "3": 49720, "4": 60000, "5": 70280}},
      "must_be_uninsured_or_underinsured": true,
      "states": "all"
    }',
    '{"proof_of_childs_age","proof_of_residency","proof_of_income","proof_of_citizenship_for_child","proof_of_no_current_insurance"}',
    'https://www.insurekidsnow.gov/coverage/index.html',
    false
  ),
  (
    'LIHEAP (Utility Bill Assistance)',
    'utilities',
    'Helps low-income households pay heating and cooling bills. May also cover emergency energy situations.',
    '{
      "income_test": {"annual_150pct_fpl_by_household": {"1": 21870, "2": 29580, "3": 37290, "4": 45000, "5": 52710, "6": 60420}},
      "must_pay_energy_costs": true,
      "states": "all"
    }',
    '{"government_issued_id","proof_of_residency","proof_of_income","most_recent_utility_bill","proof_of_household_size"}',
    'https://www.acf.hhs.gov/ocs/map/liheap-grantees-state-and-territory-contact-listing',
    false
  ),
  (
    'Lifeline (Phone & Internet Assistance)',
    'utilities',
    'Federal program providing a monthly discount on phone or internet service for qualifying low-income households.',
    '{
      "income_test": {"annual_135pct_fpl_by_household": {"1": 19683, "2": 26622, "3": 33561, "4": 40500, "5": 47439}},
      "benefit_amount": "$9.25/month discount",
      "states": "all"
    }',
    '{"government_issued_id","proof_of_income_or_program_participation","proof_of_address"}',
    'https://www.lifelinesupport.org/',
    false
  ),
  (
    'TANF (Temporary Assistance for Needy Families)',
    'financial',
    'Provides temporary cash assistance to low-income families with children while helping parents find work.',
    '{
      "must_have_children_under_18": true,
      "income_test": {"approximate_monthly_by_household": {"1": 700, "2": 950, "3": 1200, "4": 1450, "5": 1700}},
      "states": "all"
    }',
    '{"government_issued_id","social_security_numbers_all_household_members","proof_of_residency","proof_of_income","proof_of_child_custody_or_birth_certificate","proof_of_citizenship"}',
    'https://www.acf.hhs.gov/ofa/map/about-tanf-map',
    false
  ),
  (
    'SSI (Supplemental Security Income)',
    'financial',
    'Monthly cash payments to people who are 65 or older, blind, or disabled and have very limited income and assets.',
    '{
      "eligible_categories": ["age_65_plus", "blind", "disabled_any_age"],
      "income_test": {"max_monthly_countable_income": 967},
      "asset_limits": {"individual": 2000, "couple": 3000},
      "states": "all"
    }',
    '{"government_issued_id","social_security_number","proof_of_age","medical_records_if_disability","proof_of_income_and_assets","proof_of_residency"}',
    'https://www.ssa.gov/ssi/',
    false
  ),
  (
    'SSDI (Social Security Disability Insurance)',
    'financial',
    'Monthly disability benefits for people who become disabled and have worked long enough to qualify.',
    '{
      "disability_definition": "Unable to perform substantial gainful activity due to medically determinable impairment",
      "disability_required": true,
      "substantial_gainful_activity_limit_monthly": 1620,
      "states": "all"
    }',
    '{"social_security_number","birth_certificate","medical_records","list_of_medications","w2s_or_self_employment_tax_returns"}',
    'https://www.ssa.gov/benefits/disability/',
    false
  ),
  (
    'Unemployment Insurance',
    'financial',
    'Temporary weekly payments to workers who lost their job through no fault of their own while they search for new work.',
    '{
      "employment_status": ["unemployed"],
      "separation_requirements": {"eligible": ["laid_off","position_eliminated","company_downsizing","temporary_work_ended"]},
      "states": "all"
    }',
    '{"social_security_number","government_issued_id","employer_name_address_phone","dates_of_employment","reason_for_separation","wage_records_or_recent_pay_stubs"}',
    'https://www.dol.gov/general/topic/unemployment-insurance',
    false
  ),
  (
    'Section 8 / Housing Choice Voucher',
    'housing',
    'Subsidizes rent for low-income families, elderly, and disabled in private market housing. You pay 30% of income, voucher covers the rest.',
    '{
      "income_test": {"standard_eligibility_pct_ami": 50, "note": "Must be below 50% Area Median Income — varies by location"},
      "must_be_renter": true,
      "states": "all"
    }',
    '{"government_issued_id","social_security_numbers_all_members","proof_of_income","proof_of_citizenship_or_eligible_immigration_status","rental_history"}',
    'https://www.hud.gov/topics/housing_choice_voucher_program_section_8',
    false
  ),
  (
    'Emergency Rental Assistance',
    'housing',
    'Emergency funds to help renters pay past-due rent and utilities to avoid eviction. Runs at state and local levels.',
    '{
      "must_be_renter": true,
      "financial_hardship_required": true,
      "income_test": {"generally": "At or below 80% AMI"},
      "states": "all"
    }',
    '{"government_issued_id","lease_agreement","proof_of_income","past_due_rent_notice_or_eviction_notice"}',
    'https://home.treasury.gov/policy-issues/coronavirus/assistance-for-state-local-and-tribal-governments/emergency-rental-assistance-program',
    false
  ),
  (
    'Pell Grant',
    'education',
    'Need-based federal grant for undergraduate students to help pay for college. Does not need to be repaid. Maximum $7,395 for 2025-2026.',
    '{
      "must_be_undergraduate": true,
      "must_not_have_bachelors_degree": true,
      "financial_need": {"likely_full_grant_income": "Family income under $30,000", "likely_partial_grant_income": "Family income $30,000-$60,000"},
      "max_award": 7395,
      "states": "all"
    }',
    '{"fafsa_completion","social_security_number","prior_year_tax_return","proof_of_enrollment"}',
    'https://studentaid.gov/understand-aid/types/grants/pell',
    false
  ),
  (
    'FAFSA (Federal Student Aid)',
    'education',
    'Free Application for Federal Student Aid — gateway to all federal financial aid including Pell Grants, loans, and work-study. No income cutoff.',
    '{
      "income_cutoff": "none",
      "must_be_enrolled_or_accepted": true,
      "states": "all"
    }',
    '{"fsa_id","social_security_number","prior_year_federal_tax_return","w2s_and_other_income_records","bank_account_information"}',
    'https://studentaid.gov/h/apply-for-aid/fafsa',
    false
  ),
  (
    'Social Security Retirement',
    'financial',
    'Monthly retirement benefits for workers who have paid into Social Security. Benefit based on earnings history and age you start collecting.',
    '{
      "minimum_age": 62,
      "minimum_work_credits": 40,
      "average_monthly_benefit_2025": 1976,
      "states": "all"
    }',
    '{"social_security_number","birth_certificate","proof_of_citizenship_or_lawful_status","w2s_or_self_employment_tax_returns"}',
    'https://www.ssa.gov/retirement/',
    false
  ),
  (
    'School Meals (Free & Reduced Price)',
    'food',
    'Free or reduced-price breakfast and lunch for children at participating schools. Summer food service also available.',
    '{
      "eligible_categories": ["school_age_children"],
      "income_test": {
        "free_meals": {"by_household_size": {"1": 19578, "2": 26973, "3": 34371, "4": 41750, "5": 49147}},
        "reduced_meals": {"by_household_size": {"1": 27861, "2": 37814, "3": 47769, "4": 57720, "5": 67674}}
      },
      "must_have_children_under_18": true,
      "states": "all"
    }',
    '{"school_enrollment_proof","proof_of_household_income"}',
    'https://www.fns.usda.gov/nslp/national-school-lunch-program',
    false
  )
on conflict do nothing;
