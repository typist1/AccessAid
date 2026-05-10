export const schoolMealsForm = {
  program_id: 'school_meals',
  sections: [
    {
      title: 'Parent / Guardian Information',
      fields: [
        { id: 'full_name', label: 'Parent/Guardian Full Name', type: 'text', required: true },
        { id: 'address', label: 'Home Address', type: 'text', required: true },
        { id: 'state', label: 'State', type: 'text', required: true },
        { id: 'phone', label: 'Phone Number', type: 'tel', required: true },
      ],
    },
    {
      title: 'Children Information',
      fields: [
        { id: 'child_name_1', label: 'Child 1 Full Name', type: 'text', required: true },
        { id: 'child_school_1', label: 'Child 1 School Name', type: 'text', required: true },
        { id: 'child_grade_1', label: 'Child 1 Grade', type: 'text', required: true },
        { id: 'child_name_2', label: 'Child 2 Full Name (if applicable)', type: 'text', required: false },
        { id: 'child_school_2', label: 'Child 2 School Name', type: 'text', required: false },
        { id: 'child_grade_2', label: 'Child 2 Grade', type: 'text', required: false },
      ],
    },
    {
      title: 'Household & Income',
      fields: [
        { id: 'household_size', label: 'Total Household Members', type: 'number', required: true },
        { id: 'monthly_income', label: 'Total Monthly Household Income ($)', type: 'number', required: true },
        {
          id: 'snap_enrolled',
          label: 'Currently enrolled in SNAP or TANF?',
          type: 'select',
          required: false,
          options: [
            { value: 'yes', label: 'Yes — automatically qualifies children for free meals' },
            { value: 'no', label: 'No' },
          ],
        },
      ],
    },
  ],
}
