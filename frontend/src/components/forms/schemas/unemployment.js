export const unemploymentForm = {
  program_id: 'unemployment',
  sections: [
    {
      title: 'Personal Information',
      fields: [
        { id: 'full_name', label: 'Full Name', type: 'text', required: true },
        { id: 'date_of_birth', label: 'Date of Birth', type: 'date', required: true },
        { id: 'address', label: 'Home Address', type: 'text', required: true },
        { id: 'state', label: 'State', type: 'text', required: true },
        { id: 'ssn_last4', label: 'Last 4 digits of SSN', type: 'text', required: true, maxLength: 4 },
      ],
    },
    {
      title: 'Employment History',
      fields: [
        { id: 'employer_name', label: 'Last Employer Name', type: 'text', required: true },
        { id: 'employment_status', label: 'Reason for Separation', type: 'text', required: true },
        { id: 'gross_income', label: 'Last Annual Gross Wages ($)', type: 'number', required: false },
      ],
    },
  ],
}
