export const ssdiForm = {
  program_id: 'ssdi',
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
      ],
    },
    {
      title: 'Work History',
      fields: [
        { id: 'employer_name', label: 'Most Recent Employer', type: 'text', required: true },
        { id: 'last_day_worked', label: 'Last Day Worked', type: 'date', required: true },
        { id: 'gross_income', label: 'Annual Earnings Last Year ($)', type: 'number', required: true },
        { id: 'ytd_gross', label: 'YTD Gross Earnings This Year ($)', type: 'number', required: false },
      ],
    },
    {
      title: 'Medical Information',
      fields: [
        { id: 'disability_description', label: 'Describe your disability or condition', type: 'text', required: true },
        { id: 'disability_onset_date', label: 'When did disability begin?', type: 'date', required: true },
        { id: 'doctors_name', label: "Primary Doctor's Name", type: 'text', required: true },
        { id: 'doctors_phone', label: "Doctor's Phone Number", type: 'tel', required: true },
      ],
    },
  ],
}
