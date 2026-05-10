import { chat } from './qwen.js'

const SCHEMAS = {
  drivers_license: ['full_name', 'date_of_birth', 'address', 'state', 'license_number', 'expiration_date'],
  passport: ['full_name', 'date_of_birth', 'nationality', 'passport_number', 'expiration_date'],
  social_security_card: ['full_name', 'ssn_last4'],
  w2: ['employer_name', 'annual_wages', 'federal_tax_withheld', 'tax_year'],
  pay_stub: ['employer_name', 'gross_income', 'net_income', 'pay_period', 'ytd_gross'],
  birth_certificate: ['full_name', 'date_of_birth', 'place_of_birth'],
  utility_bill: ['service_address', 'utility_provider', 'amount_due', 'due_date'],
  lease_agreement: ['property_address', 'monthly_rent', 'lease_start_date', 'landlord_name'],
  benefit_letter: ['program_name', 'benefit_amount', 'effective_date', 'case_number'],
}

export async function extractFacts(ocrText, documentType) {
  const fields = SCHEMAS[documentType] ?? Object.values(SCHEMAS).flat()
  const template = Object.fromEntries(fields.map(f => [f, null]))

  const response = await chat([
    {
      role: 'system',
      content: `Extract structured data from documents. Return ONLY valid JSON with these exact keys: ${JSON.stringify(Object.keys(template))}. Use null for missing fields. No markdown, no explanation.`,
    },
    {
      role: 'user',
      content: `Document type: ${documentType}\n\nDocument text:\n${ocrText}`,
    },
  ])

  try {
    const parsed = JSON.parse(response.replace(/```json\n?|\n?```/g, '').trim())
    // Never store full SSN — keep only last 4
    if (parsed.ssn) {
      parsed.ssn_last4 = String(parsed.ssn).slice(-4)
      delete parsed.ssn
    }
    return Object.fromEntries(Object.entries(parsed).filter(([, v]) => v !== null))
  } catch {
    return {}
  }
}
