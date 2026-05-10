export const section8Form = {
  program_id: 'section8',
  sections: [
    {
      title: 'Personal Information',
      fields: [
        { id: 'full_name', label: 'Full Name', type: 'text', required: true },
        { id: 'date_of_birth', label: 'Date of Birth', type: 'date', required: true },
        { id: 'ssn_last4', label: 'SSN (last 4 digits)', type: 'text', required: true, maxLength: 4 },
        { id: 'phone', label: 'Phone Number', type: 'tel', required: true },
        { id: 'email', label: 'Email Address', type: 'email', required: false },
        { id: 'address', label: 'Current Address', type: 'text', required: true },
        { id: 'state', label: 'State', type: 'text', required: true },
        { id: 'citizenship_status', label: 'Citizenship / Immigration Status', type: 'text', required: true },
      ],
    },
    {
      title: 'Household Members',
      fields: [
        { id: 'household_size', label: 'Total Household Members', type: 'number', required: true },
        {
          id: 'has_children',
          label: 'Household includes children under 18?',
          type: 'select',
          required: true,
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
        },
        {
          id: 'disability_status',
          label: 'Any household member with a disability?',
          type: 'select',
          required: true,
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
        },
      ],
    },
    {
      title: 'Income',
      fields: [
        { id: 'monthly_income', label: 'Total Monthly Household Income ($)', type: 'number', required: true },
        { id: 'income_sources', label: 'Sources of Income', type: 'text', required: true },
        { id: 'monthly_rent', label: 'Current Monthly Rent ($)', type: 'number', required: false },
      ],
    },
  ],
}
