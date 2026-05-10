export const chipForm = {
  program_id: 'chip',
  sections: [
    {
      title: "Child's Information",
      title_es: 'Información del hijo',
      fields: [
        { id: 'child_full_name', label: "Child's Full Name", label_es: 'Nombre completo del hijo', type: 'text', required: true },
        { id: 'child_date_of_birth', label: "Child's Date of Birth", label_es: 'Fecha de nacimiento del hijo', type: 'date', required: true },
        { id: 'child_ssn_last4', label: "Child's SSN (last 4 digits)", label_es: 'SSN del hijo (últimos 4 dígitos)', type: 'text', required: false, maxLength: 4 },
      ],
    },
    {
      title: 'Parent / Guardian Information',
      title_es: 'Información del padre / tutor',
      fields: [
        { id: 'full_name', label: 'Parent/Guardian Full Name', label_es: 'Nombre completo del padre/tutor', type: 'text', required: true },
        { id: 'address', label: 'Home Address', label_es: 'Dirección de residencia', type: 'text', required: true },
        { id: 'state', label: 'State', label_es: 'Estado', type: 'text', required: true },
        { id: 'phone', label: 'Phone Number', label_es: 'Número de teléfono', type: 'tel', required: true },
        { id: 'email', label: 'Email Address', label_es: 'Correo electrónico', type: 'email', required: false },
      ],
    },
    {
      title: 'Household & Income',
      title_es: 'Hogar e ingresos',
      fields: [
        { id: 'household_size', label: 'Number of People in Household', label_es: 'Número de personas en el hogar', type: 'number', required: true },
        { id: 'monthly_income', label: 'Monthly Household Income ($)', label_es: 'Ingreso mensual del hogar ($)', type: 'number', required: true },
        { id: 'citizenship_status', label: "Child's Citizenship Status", label_es: 'Estatus migratorio del hijo', type: 'text', required: true },
        {
          id: 'currently_insured',
          label: 'Does child currently have health insurance?',
          label_es: '¿El hijo tiene seguro médico actualmente?',
          type: 'select',
          required: true,
          options: [
            { value: 'no', label: 'No', label_es: 'No' },
            { value: 'yes', label: 'Yes', label_es: 'Sí' },
          ],
        },
      ],
    },
  ],
}
