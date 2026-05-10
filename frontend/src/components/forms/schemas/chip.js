export const chipForm = {
  program_id: 'chip',
  sections: [
    {
      title: "Child's Information",
      fields: [
        { id: 'child_full_name', label: "Child's Full Name", type: 'text', required: true },
        { id: 'child_date_of_birth', label: "Child's Date of Birth", type: 'date', required: true },
        { id: 'child_ssn_last4', label: "Child's SSN (last 4 digits)", type: 'text', required: false, maxLength: 4 },
      ],
    },
    {
      title: 'Parent / Guardian Information',
      fields: [
        { id: 'full_name', label: 'Parent/Guardian Full Name', type: 'text', required: true },
        { id: 'address', label: 'Home Address', type: 'text', required: true },
        { id: 'state', label: 'State', type: 'text', required: true },
        { id: 'phone', label: 'Phone Number', type: 'tel', required: true },
        { id: 'email', label: 'Email Address', type: 'email', required: false },
      ],
    },
    {
      title: 'Household & Income',
      fields: [
        { id: 'household_size', label: 'Number of People in Household', type: 'number', required: true },
        { id: 'monthly_income', label: 'Monthly Household Income ($)', type: 'number', required: true },
        { id: 'citizenship_status', label: "Child's Citizenship Status", type: 'text', required: true },
        {
          id: 'currently_insured',
          label: 'Does child currently have health insurance?',
          type: 'select',
          required: true,
          options: [
            { value: 'no', label: 'No' },
            { value: 'yes', label: 'Yes' },
          ],
        },
      ],
    },
  ],
}
