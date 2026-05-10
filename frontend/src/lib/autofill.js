export const fieldMap = {
  'full name': 'full_name',
  'first name': 'first_name',
  'last name': 'last_name',
  'name': 'full_name',
  'date of birth': 'date_of_birth',
  'birth date': 'date_of_birth',
  'dob': 'date_of_birth',
  'age': 'age',
  'address': 'address',
  'home address': 'address',
  'street address': 'address',
  'city': 'city',
  'state': 'state',
  'zip': 'zip',
  'zip code': 'zip',
  'annual income': 'income',
  'monthly income': 'monthly_income',
  'income': 'income',
  'household size': 'household_size',
  'number in household': 'household_size',
  'employer': 'employer_name',
  'employer name': 'employer_name',
  'phone': 'phone',
  'phone number': 'phone',
  'email': 'email',
  'social security': 'ssn_last4',
  'ssn': 'ssn_last4',
  'social security number': 'ssn_last4',
  'citizenship': 'citizenship_status',
  'employment status': 'employment_status',
  'monthly rent': 'monthly_rent',
  'rent': 'monthly_rent',
}

export function mapFactsToForm(fields, facts) {
  const factsMap = Object.fromEntries(facts.map(f => [f.field_key, f.field_value]))
  const result = {}

  for (const field of fields) {
    const label = field.label?.toLowerCase()
    const factKey = fieldMap[label] ?? field.id
    if (factsMap[factKey]) {
      result[field.id] = factsMap[factKey]
    } else if (factsMap[field.id]) {
      result[field.id] = factsMap[field.id]
    }
  }

  return result
}
