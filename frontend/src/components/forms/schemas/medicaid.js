export const medicaidForm = {
  program_id: 'medicaid',
  sections: [
    {
      title: 'Personal Information',
      fields: [
        { id: 'full_name', label: 'Full Name', type: 'text', required: true },
        { id: 'date_of_birth', label: 'Date of Birth', type: 'date', required: true },
        { id: 'address', label: 'Home Address', type: 'text', required: true },
        { id: 'state', label: 'State', type: 'text', required: true },
        { id: 'citizenship_status', label: 'Citizenship Status', type: 'text', required: true },
      ],
    },
    {
      title: 'Income & Household',
      fields: [
        { id: 'household_size', label: 'Household Size', type: 'number', required: true },
        { id: 'monthly_income', label: 'Monthly Household Income ($)', type: 'number', required: true },
        { id: 'employer_name', label: 'Employer Name (if employed)', type: 'text', required: false },
      ],
    },
  ],
}
