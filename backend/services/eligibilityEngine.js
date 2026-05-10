import { chat } from './claude.js'

const INCOME_MAP = {
  '<15k': 7500,
  '15-30k': 22500,
  '30-50k': 40000,
  '50k+': 75000,
}

export async function scoreEligibility(userProfile, program) {
  const rules = program.eligibility_rules
  const annualIncome = INCOME_MAP[userProfile.income] ?? 22500
  const monthlyIncome = annualIncome / 12

  let matched = 0
  let total = 0
  const reasons = []
  const missing = []

  // Income check — handle both annual and monthly thresholds
  const incomeThreshold =
    rules.max_income ??
    rules.gross_income_test?.by_household_size?.[userProfile.household_size] ??
    rules.income_test?.expansion_states_annual_by_household?.[userProfile.household_size] ??
    rules.income_test?.annual_150pct_fpl_by_household?.[userProfile.household_size] ??
    rules.income_test?.annual_135pct_fpl_by_household?.[userProfile.household_size] ??
    rules.income_test?.annual_by_household?.[userProfile.household_size] ??
    null

  if (incomeThreshold !== null) {
    total++
    const compareIncome = incomeThreshold > 5000 ? annualIncome : monthlyIncome
    if (compareIncome <= incomeThreshold) {
      matched++
      reasons.push('Income within program threshold')
    } else {
      missing.push('Income may exceed program limit')
    }
  }

  // State check
  const states = rules.states
  if (states && states !== 'all' && Array.isArray(states) && states[0] !== 'all') {
    total++
    if (states.includes(userProfile.state)) {
      matched++
    } else {
      missing.push(`Program not available in ${userProfile.state}`)
    }
  }

  // Employment status
  if (rules.employment_status && Array.isArray(rules.employment_status)) {
    total++
    if (rules.employment_status.includes(userProfile.employment_status)) {
      matched++
    } else {
      missing.push('Employment status may not qualify')
    }
  }

  // Children required
  if (rules.must_have_children_under_18 || rules.has_children_required) {
    total++
    if (userProfile.has_children) {
      matched++
    } else {
      missing.push('Must have children under 18')
    }
  }

  // Disability required
  if (rules.disability_required) {
    total++
    if (userProfile.disability_status === 'yes') {
      matched++
    } else {
      missing.push('Disability status required')
    }
  }

  // Age checks
  if (rules.eligible_categories) {
    const cats = rules.eligible_categories
    total++
    const age = parseInt(userProfile.age)
    const catMet =
      (cats.includes('age_65_plus') && age >= 65) ||
      (cats.includes('child_under_19') && age < 19) ||
      (cats.includes('child_under_5') && age < 5) ||
      (cats.includes('must_be_undergraduate') && userProfile.student_status === 'yes') ||
      cats.includes('school_age_children')
    if (catMet) {
      matched++
    } else if (!cats.includes('school_age_children')) {
      missing.push('Category eligibility requirements not met')
    } else {
      matched++ // school_age_children — pass if household has children
    }
  }

  if (rules.minimum_age) {
    total++
    if (parseInt(userProfile.age) >= rules.minimum_age) {
      matched++
    } else {
      missing.push(`Must be at least ${rules.minimum_age} years old`)
    }
  }

  // Student required
  if (rules.must_be_undergraduate || rules.student_required) {
    total++
    if (userProfile.student_status === 'yes') {
      matched++
    } else {
      missing.push('Must be enrolled as a student')
    }
  }

  // Must be renter
  if (rules.must_be_renter) {
    total++
    matched++ // can't determine from profile — assume possible
    reasons.push('Must be a renter (unverified)')
  }

  if (total === 0) {
    return { score: 'possible', reasons: ['No strict rules found'], missing: [] }
  }

  const ratio = matched / total
  let score
  if (ratio >= 0.8) score = 'strong'
  else if (ratio >= 0.5) score = 'possible'
  else score = 'unlikely'

  // If income bucket may not reflect current situation, note it for LLM
  if (missing.includes('Income may exceed program limit') && userProfile.employment_status === 'unemployed') {
    reasons.push('Note: user is currently unemployed — actual income may be lower than reported range')
  }

  let notes = ''
  if (score !== 'unlikely') {
    try {
      notes = await chat([
        {
          role: 'system',
          content: 'You are a benefits advisor. In 1-2 plain sentences explain why this person may qualify. Important: income is self-reported as a range — if they are recently unemployed their actual income may be lower. Say "may qualify", never "you qualify". Be brief.',
        },
        {
          role: 'user',
          content: `Profile: ${JSON.stringify(userProfile)}. Program: ${program.name}. Matched rules: ${reasons.join(', ')}. Missing: ${missing.join(', ')}.`,
        },
      ])
    } catch {
      notes = `You may qualify for ${program.name} based on your profile.`
    }
  }

  return { score, reasons, missing, notes }
}
