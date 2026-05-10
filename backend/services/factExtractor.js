import { chat, extractFromFile } from './claude.js'

const SCHEMAS = {
  drivers_license: [
    'full_name', 'first_name', 'last_name',
    'date_of_birth', 'address', 'city', 'state', 'zip_code',
    'gender', 'license_number', 'expiration_date', 'issue_date',
  ],
  passport: [
    'full_name', 'first_name', 'last_name',
    'date_of_birth', 'nationality', 'passport_number',
    'expiration_date', 'issue_date', 'place_of_birth',
  ],
  social_security_card: [
    'full_name', 'ssn_last4',
  ],
  w2: [
    'employer_name', 'employer_address', 'employer_ein',
    'first_name', 'last_name', 'full_name', 'address', 'city', 'state', 'zip_code',
    'ssn_last4', 'annual_wages', 'federal_tax_withheld',
    'social_security_wages', 'social_security_tax_withheld',
    'medicare_wages', 'medicare_tax_withheld',
    'state_wages', 'state_tax_withheld',
    'tax_year',
  ],
  pay_stub: [
    'employer_name', 'employer_address',
    'full_name', 'first_name', 'last_name', 'address', 'city', 'state', 'zip_code',
    'gross_wages', 'net_income', 'pay_period_start', 'pay_period_end',
    'ytd_gross', 'ytd_net',
    'pay_frequency', 'hourly_rate', 'hours_per_week',
    'federal_tax_withheld', 'state_tax_withheld',
    'social_security_withheld', 'medicare_withheld',
  ],
  birth_certificate: [
    'full_name', 'first_name', 'last_name',
    'date_of_birth', 'place_of_birth', 'city', 'state',
    'gender', 'mother_full_name', 'father_full_name',
    'certificate_number',
  ],
  utility_bill: [
    'service_address', 'city', 'state', 'zip_code',
    'full_name', 'utility_provider',
    'account_number', 'amount_due', 'due_date',
    'billing_period_start', 'billing_period_end',
    'utility_electricity', 'utility_gas', 'utility_water',
  ],
  lease_agreement: [
    'property_address', 'city', 'state', 'zip_code',
    'full_name', 'monthly_rent',
    'lease_start_date', 'lease_end_date',
    'landlord_name', 'landlord_address', 'landlord_phone',
    'security_deposit',
  ],
  benefit_letter: [
    'full_name', 'address', 'city', 'state', 'zip_code',
    'program_name', 'benefit_amount', 'benefit_frequency',
    'effective_date', 'case_number',
    'agency_name', 'agency_phone',
  ],
}

function sanitize(parsed) {
  // Never store full SSN — keep only last 4
  if (parsed.ssn) {
    parsed.ssn_last4 = String(parsed.ssn).slice(-4)
    delete parsed.ssn
  }
  return Object.fromEntries(Object.entries(parsed).filter(([, v]) => v !== null && v !== ''))
}

// input: string (OCR text) OR { fileBase64, mimeType } (image/PDF)
export async function extractFacts(input, documentType) {
  const fields = SCHEMAS[documentType] ?? Object.values(SCHEMAS).flat()
  const template = Object.fromEntries(fields.map(f => [f, null]))
  const schemaStr = JSON.stringify(Object.keys(template))

  let response

  if (typeof input === 'object' && input.fileBase64) {
    const prompt = `Document type: ${documentType}. Extract these fields: ${schemaStr}. Return ONLY valid JSON with those exact keys. Use null for missing fields. No markdown, no explanation.`
    response = await extractFromFile(input.fileBase64, input.mimeType, prompt)
  } else {
    response = await chat([
      {
        role: 'system',
        content: `Extract structured data from documents. Return ONLY valid JSON with these exact keys: ${schemaStr}. Use null for missing fields. No markdown, no explanation.`,
      },
      { role: 'user', content: `Document type: ${documentType}\n\nDocument text:\n${input}` },
    ])
  }

  try {
    const parsed = JSON.parse(response.replace(/```json\n?|\n?```/g, '').trim())
    return sanitize(parsed)
  } catch {
    return {}
  }
}
