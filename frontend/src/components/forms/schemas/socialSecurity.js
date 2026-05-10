export const socialSecurityForm = {
  program_id: 'social_security',
  sections: [
    {
      title: 'Personal Information',
      fields: [
        { id: 'full_name', label: 'Full Legal Name', type: 'text', required: true },
        { id: 'date_of_birth', label: 'Date of Birth', type: 'date', required: true },
        { id: 'ssn_last4', label: 'Social Security Number (last 4)', type: 'text', required: true, maxLength: 4 },
        { id: 'address', label: 'Mailing Address', type: 'text', required: true },
        { id: 'state', label: 'State', type: 'text', required: true },
        { id: 'phone', label: 'Phone Number', type: 'tel', required: true },
        { id: 'citizenship_status', label: 'Citizenship Status', type: 'text', required: true },
      ],
    },
    {
      title: 'Retirement Details',
      fields: [
        {
          id: 'retirement_month',
          label: 'When do you want benefits to start?',
          type: 'select',
          required: true,
          options: [
            { value: 'now', label: 'As soon as possible' },
            { value: '3_months', label: 'In about 3 months' },
            { value: '6_months', label: 'In about 6 months' },
            { value: 'future', label: 'A specific future date' },
          ],
        },
        {
          id: 'still_working',
          label: 'Are you still working?',
          type: 'select',
          required: true,
          options: [{ value: 'yes', label: 'Yes' }, { value: 'no', label: 'No' }],
        },
        { id: 'employer_name', label: 'Current Employer (if still working)', type: 'text', required: false },
      ],
    },
    {
      title: 'Direct Deposit',
      fields: [
        { id: 'bank_name', label: 'Bank Name', type: 'text', required: false },
        { id: 'bank_routing', label: 'Routing Number', type: 'text', required: false, maxLength: 9 },
        { id: 'bank_account_last4', label: 'Account Number (last 4 digits)', type: 'text', required: false, maxLength: 4 },
      ],
    },
  ],
}
