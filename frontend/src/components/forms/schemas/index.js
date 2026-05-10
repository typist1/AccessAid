import { snapForm } from './snap'
import { medicaidForm } from './medicaid'
import { unemploymentForm } from './unemployment'
import { wicForm } from './wic'
import { chipForm } from './chip'
import { liheapForm } from './liheap'
import { lifelineForm } from './lifeline'
import { tanfForm } from './tanf'
import { ssiForm } from './ssi'
import { ssdiForm } from './ssdi'
import { section8Form } from './section8'
import { emergencyRentalForm } from './emergencyRental'
import { pellGrantForm } from './pellGrant'
import { fafsaForm } from './fafsa'
import { socialSecurityForm } from './socialSecurity'
import { schoolMealsForm } from './schoolMeals'

const genericForm = (programName) => ({
  program_id: 'generic',
  sections: [
    {
      title: 'Applicant Information',
      fields: [
        { id: 'full_name', label: 'Full Name', type: 'text', required: true },
        { id: 'date_of_birth', label: 'Date of Birth', type: 'date', required: true },
        { id: 'address', label: 'Home Address', type: 'text', required: true },
        { id: 'state', label: 'State', type: 'text', required: true },
        { id: 'household_size', label: 'Household Size', type: 'number', required: true },
        { id: 'monthly_income', label: 'Monthly Income ($)', type: 'number', required: true },
        { id: 'phone', label: 'Phone Number', type: 'tel', required: false },
      ],
    },
  ],
})

// Keys checked via .includes() on lowercased program name — order matters (more specific first)
const SCHEMA_MAP = [
  ['snap', snapForm],
  ['medicaid', medicaidForm],
  ['unemployment', unemploymentForm],
  ['wic', wicForm],
  ['chip', chipForm],
  ['liheap', liheapForm],
  ['lifeline', lifelineForm],
  ['tanf', tanfForm],
  ['ssdi', ssdiForm],     // ssdi before ssi — both match 'ss'
  ['ssi', ssiForm],
  ['section 8', section8Form],
  ['housing choice', section8Form],
  ['emergency rental', emergencyRentalForm],
  ['pell', pellGrantForm],
  ['fafsa', fafsaForm],
  ['social security retirement', socialSecurityForm],
  ['social security', socialSecurityForm],
  ['school meals', schoolMealsForm],
]

export function getFormSchema(programName) {
  if (!programName) return genericForm('Program')
  const lower = programName.toLowerCase()
  for (const [key, schema] of SCHEMA_MAP) {
    if (lower.includes(key)) return schema
  }
  return genericForm(programName)
}
