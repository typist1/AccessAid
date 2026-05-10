export const wicForm = {
  program_id: 'wic',
  sections: [
    {
      title: 'Applicant Information',
      fields: [
        { id: 'full_name', label: 'Full Name', type: 'text', required: true },
        { id: 'date_of_birth', label: 'Date of Birth', type: 'date', required: true },
        { id: 'address', label: 'Home Address', type: 'text', required: true },
        { id: 'state', label: 'State', type: 'text', required: true },
        { id: 'phone', label: 'Phone Number', type: 'tel', required: true },
      ],
    },
    {
      title: 'Eligibility Category',
      fields: [
        {
          id: 'wic_category',
          label: 'Which applies to you?',
          type: 'select',
          required: true,
          options: [
            { value: 'pregnant', label: 'I am pregnant' },
            { value: 'postpartum', label: 'I gave birth within the last 6 months' },
            { value: 'breastfeeding', label: 'I am breastfeeding (up to 12 months postpartum)' },
            { value: 'infant', label: 'I have an infant under 12 months' },
            { value: 'child_under_5', label: 'I have a child under 5 years old' },
          ],
        },
        { id: 'child_name', label: "Child's Full Name (if applying for child)", type: 'text', required: false },
        { id: 'child_date_of_birth', label: "Child's Date of Birth", type: 'date', required: false },
      ],
    },
    {
      title: 'Income & Household',
      fields: [
        { id: 'household_size', label: 'Household Size', type: 'number', required: true },
        { id: 'monthly_income', label: 'Monthly Gross Household Income ($)', type: 'number', required: true },
        {
          id: 'snap_enrolled',
          label: 'Currently enrolled in SNAP, Medicaid, or TANF?',
          type: 'select',
          required: false,
          options: [
            { value: 'yes', label: 'Yes — automatically income-eligible' },
            { value: 'no', label: 'No' },
          ],
        },
      ],
    },
  ],
}
