export const ssiForm = {
  program_id: 'ssi',
  sections: [
    {
      title: 'Personal Information',
      fields: [
        { id: 'full_name', label: 'Full Name', type: 'text', required: true },
        { id: 'date_of_birth', label: 'Date of Birth', type: 'date', required: true },
        { id: 'ssn_last4', label: 'Social Security Number (last 4)', type: 'text', required: true, maxLength: 4 },
        { id: 'address', label: 'Home Address', type: 'text', required: true },
        { id: 'state', label: 'State', type: 'text', required: true },
        { id: 'phone', label: 'Phone Number', type: 'tel', required: true },
        { id: 'citizenship_status', label: 'Citizenship Status', type: 'text', required: true },
      ],
    },
    {
      title: 'Eligibility Basis',
      fields: [
        {
          id: 'ssi_basis',
          label: 'Applying on basis of:',
          type: 'select',
          required: true,
          options: [
            { value: 'age', label: 'Age (65 or older)' },
            { value: 'blind', label: 'Blindness' },
            { value: 'disability', label: 'Disability' },
          ],
        },
        { id: 'disability_description', label: 'Disability description (if applicable)', type: 'text', required: false },
      ],
    },
    {
      title: 'Income & Assets',
      fields: [
        { id: 'monthly_income', label: 'Monthly Income from All Sources ($)', type: 'number', required: true },
        { id: 'bank_balance', label: 'Approximate Bank Account Balance ($)', type: 'number', required: true },
        { id: 'other_assets', label: 'Other Assets Value ($)', type: 'number', required: false },
      ],
    },
  ],
}
