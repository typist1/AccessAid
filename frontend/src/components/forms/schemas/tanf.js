export const tanfForm = {
  program_id: 'tanf',
  sections: [
    {
      title: 'Personal Information',
      title_es: 'Información personal',
      fields: [
        { id: 'full_name', label: 'Full Name', label_es: 'Nombre completo', type: 'text', required: true },
        { id: 'date_of_birth', label: 'Date of Birth', label_es: 'Fecha de nacimiento', type: 'date', required: true },
        { id: 'ssn_last4', label: 'SSN (last 4 digits)', label_es: 'SSN (últimos 4 dígitos)', type: 'text', required: true, maxLength: 4 },
        { id: 'address', label: 'Home Address', label_es: 'Dirección de residencia', type: 'text', required: true },
        { id: 'state', label: 'State', label_es: 'Estado', type: 'text', required: true },
        { id: 'phone', label: 'Phone Number', label_es: 'Número de teléfono', type: 'tel', required: true },
        { id: 'citizenship_status', label: 'Citizenship Status', label_es: 'Estatus migratorio', type: 'text', required: true },
      ],
    },
    {
      title: 'Children & Household',
      title_es: 'Hijos y hogar',
      fields: [
        { id: 'household_size', label: 'Total Household Size', label_es: 'Tamaño total del hogar', type: 'number', required: true },
        { id: 'children_count', label: 'Number of Children Under 18', label_es: 'Número de hijos menores de 18', type: 'number', required: true },
        { id: 'youngest_child_dob', label: "Youngest Child's Date of Birth", label_es: 'Fecha de nacimiento del hijo menor', type: 'date', required: true },
      ],
    },
    {
      title: 'Income & Employment',
      title_es: 'Ingresos y empleo',
      fields: [
        { id: 'monthly_income', label: 'Total Monthly Household Income ($)', label_es: 'Ingreso mensual total del hogar ($)', type: 'number', required: true },
        { id: 'employment_status', label: 'Employment Status', label_es: 'Situación laboral', type: 'text', required: true },
        { id: 'employer_name', label: 'Employer Name (if employed)', label_es: 'Nombre del empleador (si está empleado)', type: 'text', required: false },
      ],
    },
  ],
}
