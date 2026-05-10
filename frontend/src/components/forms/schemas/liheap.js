export const liheapForm = {
  program_id: 'liheap',
  sections: [
    {
      title: 'Personal Information',
      fields: [
        { id: 'full_name', label: 'Full Name', type: 'text', required: true },
        { id: 'date_of_birth', label: 'Date of Birth', type: 'date', required: true },
        { id: 'address', label: 'Home Address', type: 'text', required: true },
        { id: 'state', label: 'State', type: 'text', required: true },
        { id: 'phone', label: 'Phone Number', type: 'tel', required: true },
      ],
    },
    {
      title: 'Household & Income',
      fields: [
        { id: 'household_size', label: 'Number of People in Household', type: 'number', required: true },
        { id: 'monthly_income', label: 'Total Monthly Household Income ($)', type: 'number', required: true },
        { id: 'employment_status', label: 'Employment Status', type: 'text', required: true },
      ],
    },
    {
      title: 'Utility Information',
      fields: [
        { id: 'utility_provider', label: 'Utility Company Name', type: 'text', required: true },
        { id: 'account_number', label: 'Utility Account Number', type: 'text', required: false },
        { id: 'amount_due', label: 'Amount Past Due ($)', type: 'number', required: false },
        {
          id: 'energy_type',
          label: 'Type of Energy',
          type: 'select',
          required: true,
          options: [
            { value: 'electric', label: 'Electric' },
            { value: 'gas', label: 'Natural Gas' },
            { value: 'oil', label: 'Heating Oil' },
            { value: 'propane', label: 'Propane' },
          ],
        },
        {
          id: 'renter_or_owner',
          label: 'Do you rent or own?',
          type: 'select',
          required: true,
          options: [
            { value: 'rent', label: 'Rent' },
            { value: 'own', label: 'Own' },
          ],
        },
      ],
    },
  ],
}
