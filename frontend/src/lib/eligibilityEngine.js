const INCOME_MAP = {
  '<15k': 7500,
  '15-30k': 22500,
  '30-50k': 40000,
  '50k+': 75000,
}

export function scoreEligibility(profile, program) {
  const rules = program.eligibility_rules
  if (!rules) return { score: 'possible', missing: [] }

  const annualIncome = INCOME_MAP[profile.income] ?? 22500
  const monthlyIncome = annualIncome / 12
  const householdSize = parseInt(profile.household_size) || 1
  const age = parseInt(profile.age) || 30

  let matched = 0
  let total = 0
  const missing = []

  // Income check — handle all threshold shapes
  const incomeThreshold =
    rules.max_income ??
    rules.gross_income_test?.by_household_size?.[householdSize] ??
    rules.income_test?.expansion_states_annual_by_household?.[householdSize] ??
    rules.income_test?.annual_150pct_fpl_by_household?.[householdSize] ??
    rules.income_test?.annual_135pct_fpl_by_household?.[householdSize] ??
    rules.income_test?.annual_by_household?.[householdSize] ??
    rules.income_test?.approximate_monthly_by_household?.[householdSize] ??
    rules.income_test?.by_household_size?.[householdSize] ??
    rules.income_test?.max_monthly_countable_income ??
    null

  if (incomeThreshold !== null && rules.income_cutoff !== 'none') {
    total++
    const compareIncome = incomeThreshold > 5000 ? annualIncome : monthlyIncome
    if (compareIncome <= incomeThreshold) {
      matched++
    } else {
      missing.push('Income may exceed program limit')
    }
  }

  // State check
  if (rules.states && rules.states !== 'all' && Array.isArray(rules.states) && rules.states[0] !== 'all') {
    total++
    if (rules.states.includes(profile.state)) {
      matched++
    } else {
      missing.push(`Program not available in ${profile.state}`)
    }
  }

  // Employment status
  if (rules.employment_status && Array.isArray(rules.employment_status)) {
    total++
    if (rules.employment_status.includes(profile.employment_status)) {
      matched++
    } else {
      missing.push('Employment status may not qualify')
    }
  }

  // Children required
  if (rules.must_have_children_under_18 || rules.has_children_required) {
    total++
    if (profile.has_children) {
      matched++
    } else {
      missing.push('Must have children under 18')
    }
  }

  // Disability required
  if (rules.disability_required) {
    total++
    if (profile.disability_status === 'yes') {
      matched++
    } else {
      missing.push('Disability status required')
    }
  }

  // Category eligibility (age/status based)
  if (rules.eligible_categories) {
    const cats = rules.eligible_categories
    total++
    const met =
      (cats.includes('age_65_plus') && age >= 65) ||
      (cats.includes('child_under_19') && age < 19) ||
      (cats.includes('child_under_5') && age < 5) ||
      (cats.includes('infant_under_12_months') && age < 1) ||
      (cats.includes('must_be_undergraduate') && profile.student_status === 'yes') ||
      (cats.includes('pregnant') && false) || // can't determine from profile
      cats.includes('school_age_children')    // pass if household has children
    if (met) {
      matched++
    } else if (!cats.includes('school_age_children') && !cats.includes('pregnant')) {
      missing.push('Category eligibility requirements not met')
    } else {
      matched++ // can't determine — treat as possible
    }
  }

  // Minimum age
  if (rules.minimum_age) {
    total++
    if (age >= rules.minimum_age) {
      matched++
    } else {
      missing.push(`Must be at least ${rules.minimum_age} years old`)
    }
  }

  // Student required
  if (rules.must_be_undergraduate || rules.student_required) {
    total++
    if (profile.student_status === 'yes') {
      matched++
    } else {
      missing.push('Must be enrolled as a student')
    }
  }

  // Must be renter — can't determine, treat as neutral
  if (rules.must_be_renter) {
    total++
    matched++
  }

  if (total === 0) return { score: 'possible', missing: [] }

  const ratio = matched / total
  const score = ratio >= 0.8 ? 'strong' : ratio >= 0.5 ? 'possible' : 'unlikely'
  return { score, missing }
}
