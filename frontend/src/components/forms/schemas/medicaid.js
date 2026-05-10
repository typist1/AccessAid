export const medicaidForm = {
  program_id: 'medicaid',
  sections: [
    {
      title: 'Personal Information',
      title_es: 'Información personal',
      fields: [
        { id: 'full_name', label: 'Full Name', label_es: 'Nombre completo', type: 'text', required: true },
        { id: 'date_of_birth', label: 'Date of Birth', label_es: 'Fecha de nacimiento', type: 'date', required: true },
        { id: 'address', label: 'Home Address', label_es: 'Dirección de residencia', type: 'text', required: true },
        { id: 'state', label: 'State', label_es: 'Estado', type: 'text', required: true },
        { id: 'citizenship_status', label: 'Citizenship Status', label_es: 'Estatus migratorio', type: 'text', required: true },
      ],
    },
    {
      title: 'Income & Household',
      title_es: 'Ingresos y hogar',
      fields: [
        { id: 'household_size', label: 'Household Size', label_es: 'Tamaño del hogar', type: 'number', required: true },
        { id: 'monthly_income', label: 'Monthly Household Income ($)', label_es: 'Ingreso mensual del hogar ($)', type: 'number', required: true },
        { id: 'employer_name', label: 'Employer Name (if employed)', label_es: 'Nombre del empleador (si está empleado)', type: 'text', required: false },
      ],
    },
  ],
}
