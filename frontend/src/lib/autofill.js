export const fieldMap = {
  // Name
  'full name': 'full_name',
  'first name': 'first_name',
  'middle initial': 'middle_initial',
  'last name': 'last_name',
  'suffix': 'name_suffix',
  'former name': 'former_name',
  'name': 'full_name',

  // Date of birth
  'date of birth': 'date_of_birth',
  'birth date': 'date_of_birth',
  'dob': 'date_of_birth',
  'birthdate': 'date_of_birth',

  // Age / marital / gender
  'age': 'age',
  'gender': 'gender',
  'gender at birth': 'gender',
  'sex': 'gender',
  'marital status': 'marital_status',

  // Address — physical
  'address': 'address',
  'home address': 'address',
  'street address': 'address',
  'physical address': 'address',
  'apartment number': 'apartment_number',
  'apt': 'apartment_number',
  'city': 'city',
  'state': 'state',
  'zip': 'zip_code',
  'zip code': 'zip_code',
  'county': 'county',

  // Address — mailing
  'mailing address': 'mailing_address',
  'mailing city': 'mailing_city',
  'mailing state': 'mailing_state',
  'mailing zip': 'mailing_zip_code',
  'mailing zip code': 'mailing_zip_code',
  'mailing county': 'mailing_county',

  // Phone / contact
  'phone': 'phone_cell',
  'phone number': 'phone_cell',
  'home': 'phone_home',
  'home phone': 'phone_home',
  'work': 'phone_work',
  'work phone': 'phone_work',
  'cell': 'phone_cell',
  'cell phone': 'phone_cell',
  'alternate': 'phone_alternate',
  'alternate phone': 'phone_alternate',
  'email': 'email',
  'email address': 'email',

  // SSN
  'social security': 'ssn_last4',
  'ssn': 'ssn_last4',
  'social security number': 'ssn_last4',
  'social security #': 'ssn_last4',

  // Citizenship / immigration
  'citizenship': 'citizenship_status',
  'u.s. citizen': 'citizenship_status',
  'citizen': 'citizenship_status',
  'arrival date': 'us_arrival_date',
  'arrival date in the united states': 'us_arrival_date',
  'registration document': 'alien_registration_number',
  'alien registration number': 'alien_registration_number',

  // Employment
  'employment status': 'employment_status',
  'employer': 'employer_name',
  'employer name': 'employer_name',
  'employer address': 'employer_address',
  'employer phone': 'employer_phone',
  'hours worked weekly': 'hours_per_week',
  'number of hours worked weekly': 'hours_per_week',
  'how often paid': 'pay_frequency',

  // Income
  'annual income': 'annual_income_last_year',
  'monthly income': 'monthly_income_current',
  'income': 'annual_income_last_year',
  'gross income': 'monthly_income_current',
  'amount paid': 'gross_wages',
  'amount paid (including tips) before taxes': 'gross_wages',
  'monthly gross income': 'monthly_income_current',
  'total income this year': 'annual_income_last_year',
  'total income next year': 'annual_income_next_year',
  'self-employment income': 'self_employment_income',

  // Household
  'household size': 'household_size',
  'number in household': 'household_size',
  'number of people in household': 'household_size',
  'how many people live with you': 'household_size',
  'how many babies expected': 'babies_expected',

  // Pregnancy
  'pregnant': 'pregnant',
  'due date': 'due_date',

  // Disability / health
  'disabled': 'disability_status',
  'disability': 'disability_status',
  'blind': 'is_blind',

  // Student / foster
  'full-time student': 'student_status',
  'student': 'student_status',
  'foster care': 'was_in_foster_care',

  // Shelter costs
  'monthly rent': 'monthly_rent',
  'rent': 'monthly_rent',
  'mortgage': 'monthly_mortgage',
  'rent or mortgage': 'monthly_rent',

  // Utilities
  'electricity': 'utility_electricity',
  'water and/or sewerage': 'utility_water',
  'water': 'utility_water',
  'garbage': 'utility_garbage',
  'cooking fuel': 'utility_cooking_fuel',
  'basic phone service': 'utility_phone',
  'phone service': 'utility_phone',

  // Expenses
  'alimony paid': 'alimony_paid',
  'student loan interest': 'student_loan_interest',
  'day-care': 'daycare_expense',
  'daycare': 'daycare_expense',
  'child support paid': 'child_support_paid',
  'child support': 'child_support_received',

  // Other income
  'source': 'other_income_source',
  'monthly amount': 'other_income_monthly',
  'social security benefits': 'social_security_income',
  'unemployment benefits': 'unemployment_income',
  'pension': 'pension_income',
  'retirement': 'retirement_income',

  // Facility / living
  'living arrangement': 'living_arrangement',
  'name of facility': 'facility_name',
  'type of facility': 'facility_type',
  'expected release date': 'facility_release_date',

  // Insurance / health coverage
  'name of insurance': 'insurance_name',
  'policy number': 'insurance_policy_number',
  'employer identification number': 'employer_ein',
  'ein': 'employer_ein',

  // Tribal
  'tribe name': 'tribe_name',

  // Resources
  'liquid assets': 'liquid_assets',
  'cash': 'liquid_assets',

  // Language
  'preferred spoken language': 'language_spoken',
  'preferred written language': 'language_written',

  // Race / ethnicity (collected, not used for eligibility)
  'race': 'race',
  'hispanic': 'is_hispanic',
  'hispanic or latino': 'is_hispanic',
}

// Conflict resolution: higher-priority source wins
const SOURCE_PRIORITY = {
  form: 4,
  chat: 4,
  document: 3,
  onboarding: 2,
  manual: 1,
}

export function mapFactsToForm(fields, facts) {
  const factsMap = Object.fromEntries(facts.map(f => [f.field_key, f.field_value]))
  const result = {}

  for (const field of fields) {
    const label = field.label?.toLowerCase().trim()
    const factKey = fieldMap[label] ?? field.id
    if (factsMap[factKey]) {
      result[field.id] = factsMap[factKey]
    } else if (factsMap[field.id]) {
      result[field.id] = factsMap[field.id]
    }
  }

  return result
}
