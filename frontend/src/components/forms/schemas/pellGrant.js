export const pellGrantForm = {
  program_id: 'pell_grant',
  sections: [
    {
      title: 'Student Information',
      fields: [
        { id: 'full_name', label: 'Full Name', type: 'text', required: true },
        { id: 'date_of_birth', label: 'Date of Birth', type: 'date', required: true },
        { id: 'ssn_last4', label: 'SSN (last 4 digits)', type: 'text', required: true, maxLength: 4 },
        { id: 'address', label: 'Home Address', type: 'text', required: true },
        { id: 'state', label: 'State', type: 'text', required: true },
        { id: 'email', label: 'Email Address', type: 'email', required: true },
        { id: 'phone', label: 'Phone Number', type: 'tel', required: true },
      ],
    },
    {
      title: 'Academic Information',
      fields: [
        { id: 'school_name', label: 'College / University Name', type: 'text', required: true },
        {
          id: 'enrollment_status',
          label: 'Enrollment Status',
          type: 'select',
          required: true,
          options: [
            { value: 'full_time', label: 'Full-time' },
            { value: 'half_time', label: 'Half-time' },
            { value: 'less_than_half', label: 'Less than half-time' },
          ],
        },
        {
          id: 'degree_type',
          label: 'Degree Program',
          type: 'select',
          required: true,
          options: [
            { value: 'associates', label: "Associate's" },
            { value: 'bachelors', label: "Bachelor's" },
            { value: 'certificate', label: 'Certificate' },
          ],
        },
        {
          id: 'fafsa_completed',
          label: 'Have you completed FAFSA?',
          type: 'select',
          required: true,
          options: [
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No — complete FAFSA first at studentaid.gov' },
          ],
        },
      ],
    },
    {
      title: 'Financial Information',
      fields: [
        { id: 'household_size', label: 'Family Household Size', type: 'number', required: true },
        { id: 'monthly_income', label: "Family Annual Income ($) — use parent's if dependent", type: 'number', required: true },
      ],
    },
  ],
}
