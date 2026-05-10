export const tanfForm = {
  program_id: 'tanf',
  sections: [
    {
      title: 'Personal Information',
      fields: [
        { id: 'full_name', label: 'Full Name', type: 'text', required: true },
        { id: 'date_of_birth', label: 'Date of Birth', type: 'date', required: true },
        { id: 'ssn_last4', label: 'SSN (last 4 digits)', type: 'text', required: true, maxLength: 4 },
        { id: 'address', label: 'Home Address', type: 'text', required: true },
        { id: 'state', label: 'State', type: 'text', required: true },
        { id: 'phone', label: 'Phone Number', type: 'tel', required: true },
        { id: 'citizenship_status', label: 'Citizenship Status', type: 'text', required: true },
      ],
    },
    {
      title: 'Children & Household',
      fields: [
        { id: 'household_size', label: 'Total Household Size', type: 'number', required: true },
        { id: 'children_count', label: 'Number of Children Under 18', type: 'number', required: true },
        { id: 'youngest_child_dob', label: "Youngest Child's Date of Birth", type: 'date', required: true },
      ],
    },
    {
      title: 'Income & Employment',
      fields: [
        { id: 'monthly_income', label: 'Total Monthly Household Income ($)', type: 'number', required: true },
        { id: 'employment_status', label: 'Employment Status', type: 'text', required: true },
        { id: 'employer_name', label: 'Employer Name (if employed)', type: 'text', required: false },
      ],
    },
  ],
}
