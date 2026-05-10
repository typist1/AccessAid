export const fafsaForm = {
  program_id: 'fafsa',
  sections: [
    {
      title: 'Student Information',
      fields: [
        { id: 'full_name', label: 'Legal Full Name (as on SSN card)', type: 'text', required: true },
        { id: 'date_of_birth', label: 'Date of Birth', type: 'date', required: true },
        { id: 'ssn_last4', label: 'SSN (last 4 digits)', type: 'text', required: true, maxLength: 4 },
        { id: 'email', label: 'Email Address', type: 'email', required: true },
        { id: 'address', label: 'Permanent Home Address', type: 'text', required: true },
        { id: 'state', label: 'State of Legal Residence', type: 'text', required: true },
        { id: 'citizenship_status', label: 'Citizenship Status', type: 'text', required: true },
      ],
    },
    {
      title: 'Academic & Dependency',
      fields: [
        { id: 'school_name', label: 'School Name(s) to Receive FAFSA', type: 'text', required: true },
        {
          id: 'dependency_status',
          label: 'Dependency Status',
          type: 'select',
          required: true,
          options: [
            { value: 'dependent', label: 'Dependent (parents claimed me on taxes)' },
            { value: 'independent', label: 'Independent (24+, married, veteran, or self-supporting)' },
          ],
        },
        {
          id: 'grade_level',
          label: 'Grade Level in 2025–26',
          type: 'select',
          required: true,
          options: [
            { value: '1st_year', label: '1st Year / Never attended college' },
            { value: '2nd_year', label: '2nd Year / Sophomore' },
            { value: '3rd_year', label: '3rd Year / Junior' },
            { value: '4th_year', label: '4th Year / Senior' },
            { value: 'grad', label: 'Graduate / Professional' },
          ],
        },
      ],
    },
    {
      title: 'Financial Information',
      fields: [
        { id: 'monthly_income', label: 'Adjusted Gross Income from 2023 taxes ($)', type: 'number', required: true },
        { id: 'household_size', label: 'Household Size (include parents if dependent)', type: 'number', required: true },
        { id: 'bank_balance', label: 'Current Savings / Checking Balance ($)', type: 'number', required: false },
      ],
    },
  ],
}
