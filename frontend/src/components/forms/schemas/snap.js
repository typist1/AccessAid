export const snapForm = {
  program_id: 'snap',
  sections: [
    {
      title: 'Personal Information',
      fields: [
        { id: 'full_name', label: 'Full Name', type: 'text', required: true },
        { id: 'date_of_birth', label: 'Date of Birth', type: 'date', required: true },
        { id: 'address', label: 'Home Address', type: 'text', required: true },
        { id: 'state', label: 'State', type: 'text', required: true },
        { id: 'phone', label: 'Phone Number', type: 'tel', required: false },
      ],
    },
    {
      title: 'Household & Income',
      fields: [
        { id: 'household_size', label: 'Household Size', type: 'number', required: true },
        { id: 'monthly_income', label: 'Monthly Gross Income ($)', type: 'number', required: true },
        { id: 'employment_status', label: 'Employment Status', type: 'text', required: true },
      ],
    },
    {
      title: 'Citizenship',
      fields: [
        { id: 'citizenship_status', label: 'Citizenship Status', type: 'text', required: true },
        { id: 'ssn_last4', label: 'Last 4 digits of SSN', type: 'text', required: false, maxLength: 4 },
      ],
    },
  ],
}
