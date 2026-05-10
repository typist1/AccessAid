export const section8Form = {
  program_id: 'section8',
  sections: [
    {
      title: 'Personal Information',
      title_es: 'Información personal',
      fields: [
        { id: 'full_name', label: 'Full Name', label_es: 'Nombre completo', type: 'text', required: true },
        { id: 'date_of_birth', label: 'Date of Birth', label_es: 'Fecha de nacimiento', type: 'date', required: true },
        { id: 'ssn_last4', label: 'SSN (last 4 digits)', label_es: 'SSN (últimos 4 dígitos)', type: 'text', required: true, maxLength: 4 },
        { id: 'phone', label: 'Phone Number', label_es: 'Número de teléfono', type: 'tel', required: true },
        { id: 'email', label: 'Email Address', label_es: 'Correo electrónico', type: 'email', required: false },
        { id: 'address', label: 'Current Address', label_es: 'Dirección actual', type: 'text', required: true },
        { id: 'state', label: 'State', label_es: 'Estado', type: 'text', required: true },
        { id: 'citizenship_status', label: 'Citizenship / Immigration Status', label_es: 'Estatus de ciudadanía / inmigración', type: 'text', required: true },
      ],
    },
    {
      title: 'Household Members',
      title_es: 'Miembros del hogar',
      fields: [
        { id: 'household_size', label: 'Total Household Members', label_es: 'Total de miembros del hogar', type: 'number', required: true },
        {
          id: 'has_children',
          label: 'Household includes children under 18?',
          label_es: '¿El hogar incluye hijos menores de 18?',
          type: 'select',
          required: true,
          options: [
            { value: 'yes', label: 'Yes', label_es: 'Sí' },
            { value: 'no', label: 'No', label_es: 'No' },
          ],
        },
        {
          id: 'disability_status',
          label: 'Any household member with a disability?',
          label_es: '¿Algún miembro del hogar tiene discapacidad?',
          type: 'select',
          required: true,
          options: [
            { value: 'yes', label: 'Yes', label_es: 'Sí' },
            { value: 'no', label: 'No', label_es: 'No' },
          ],
        },
      ],
    },
    {
      title: 'Income',
      title_es: 'Ingresos',
      fields: [
        { id: 'monthly_income', label: 'Total Monthly Household Income ($)', label_es: 'Ingreso mensual total del hogar ($)', type: 'number', required: true },
        { id: 'income_sources', label: 'Sources of Income', label_es: 'Fuentes de ingresos', type: 'text', required: true },
        { id: 'monthly_rent', label: 'Current Monthly Rent ($)', label_es: 'Renta mensual actual ($)', type: 'number', required: false },
      ],
    },
  ],
}
