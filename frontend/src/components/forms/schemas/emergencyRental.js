export const emergencyRentalForm = {
  program_id: 'emergency_rental',
  sections: [
    {
      title: 'Tenant Information',
      fields: [
        { id: 'full_name', label: 'Full Name', type: 'text', required: true },
        { id: 'date_of_birth', label: 'Date of Birth', type: 'date', required: true },
        { id: 'address', label: 'Rental Address', type: 'text', required: true },
        { id: 'state', label: 'State', type: 'text', required: true },
        { id: 'phone', label: 'Phone Number', type: 'tel', required: true },
        { id: 'email', label: 'Email Address', type: 'email', required: false },
      ],
    },
    {
      title: 'Rental Situation',
      fields: [
        { id: 'landlord_name', label: 'Landlord / Property Manager Name', type: 'text', required: true },
        { id: 'monthly_rent', label: 'Monthly Rent Amount ($)', type: 'number', required: true },
        { id: 'amount_due', label: 'Total Past-Due Rent Owed ($)', type: 'number', required: true },
        { id: 'months_behind', label: 'Months Behind on Rent', type: 'number', required: true },
        {
          id: 'eviction_notice',
          label: 'Have you received an eviction notice?',
          type: 'select',
          required: true,
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
        },
      ],
    },
    {
      title: 'Income & Hardship',
      fields: [
        { id: 'household_size', label: 'Household Size', type: 'number', required: true },
        { id: 'monthly_income', label: 'Monthly Household Income ($)', type: 'number', required: true },
        { id: 'hardship_reason', label: 'Reason for financial hardship', type: 'text', required: true },
      ],
    },
  ],
}
