export const lifelineForm = {
  program_id: 'lifeline',
  sections: [
    {
      title: 'Personal Information',
      fields: [
        { id: 'full_name', label: 'Full Name', type: 'text', required: true },
        { id: 'date_of_birth', label: 'Date of Birth', type: 'date', required: true },
        { id: 'address', label: 'Service Address', type: 'text', required: true },
        { id: 'state', label: 'State', type: 'text', required: true },
        { id: 'ssn_last4', label: 'Last 4 digits of SSN', type: 'text', required: true, maxLength: 4 },
      ],
    },
    {
      title: 'Eligibility',
      fields: [
        { id: 'household_size', label: 'Household Size', type: 'number', required: true },
        { id: 'monthly_income', label: 'Annual Household Income ($)', type: 'number', required: false },
        {
          id: 'qualifying_program',
          label: 'Do you participate in a qualifying program?',
          type: 'select',
          required: false,
          options: [
            { value: 'snap', label: 'SNAP' },
            { value: 'medicaid', label: 'Medicaid' },
            { value: 'ssi', label: 'SSI' },
            { value: 'fph', label: 'Federal Public Housing' },
            { value: 'veterans', label: "Veterans Pension/Survivor's Benefit" },
            { value: 'none', label: 'None — qualifying by income' },
          ],
        },
        {
          id: 'service_type',
          label: 'Discount for phone or internet?',
          type: 'select',
          required: true,
          options: [
            { value: 'phone', label: 'Phone' },
            { value: 'internet', label: 'Internet' },
          ],
        },
      ],
    },
  ],
}
