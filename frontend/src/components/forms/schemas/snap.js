export const snapForm = {
  program_id: 'snap',
  sections: [
    {
      title: 'Personal Information',
      title_es: 'Información personal',
      fields: [
        { id: 'full_name', label: 'Full Name', label_es: 'Nombre completo', type: 'text', required: true },
        { id: 'date_of_birth', label: 'Date of Birth', label_es: 'Fecha de nacimiento', type: 'date', required: true },
        { id: 'address', label: 'Home Address', label_es: 'Dirección de residencia', type: 'text', required: true },
        { id: 'state', label: 'State', label_es: 'Estado', type: 'text', required: true },
        { id: 'phone', label: 'Phone Number', label_es: 'Número de teléfono', type: 'tel', required: false },
      ],
    },
    {
      title: 'Household & Income',
      title_es: 'Hogar e ingresos',
      fields: [
        { id: 'household_size', label: 'Household Size', label_es: 'Tamaño del hogar', type: 'number', required: true },
        { id: 'monthly_income', label: 'Monthly Gross Income ($)', label_es: 'Ingreso bruto mensual ($)', type: 'number', required: true },
        { id: 'employment_status', label: 'Employment Status', label_es: 'Situación laboral', type: 'text', required: true },
      ],
    },
    {
      title: 'Citizenship',
      title_es: 'Ciudadanía',
      fields: [
        { id: 'citizenship_status', label: 'Citizenship Status', label_es: 'Estatus migratorio', type: 'text', required: true },
        { id: 'ssn_last4', label: 'Last 4 digits of SSN', label_es: 'Últimos 4 dígitos del SSN', type: 'text', required: false, maxLength: 4 },
      ],
    },
  ],
}
