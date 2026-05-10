export const socialSecurityForm = {
  program_id: 'social_security',
  sections: [
    {
      title: 'Personal Information',
      title_es: 'Información personal',
      fields: [
        { id: 'full_name', label: 'Full Legal Name', label_es: 'Nombre legal completo', type: 'text', required: true },
        { id: 'date_of_birth', label: 'Date of Birth', label_es: 'Fecha de nacimiento', type: 'date', required: true },
        { id: 'ssn_last4', label: 'Social Security Number (last 4)', label_es: 'Número de Seguro Social (últimos 4)', type: 'text', required: true, maxLength: 4 },
        { id: 'address', label: 'Mailing Address', label_es: 'Dirección postal', type: 'text', required: true },
        { id: 'state', label: 'State', label_es: 'Estado', type: 'text', required: true },
        { id: 'phone', label: 'Phone Number', label_es: 'Número de teléfono', type: 'tel', required: true },
        { id: 'citizenship_status', label: 'Citizenship Status', label_es: 'Estatus migratorio', type: 'text', required: true },
      ],
    },
    {
      title: 'Retirement Details',
      title_es: 'Detalles de jubilación',
      fields: [
        {
          id: 'retirement_month',
          label: 'When do you want benefits to start?',
          label_es: '¿Cuándo quiere que comiencen los beneficios?',
          type: 'select',
          required: true,
          options: [
            { value: 'now', label: 'As soon as possible', label_es: 'Lo antes posible' },
            { value: '3_months', label: 'In about 3 months', label_es: 'En aproximadamente 3 meses' },
            { value: '6_months', label: 'In about 6 months', label_es: 'En aproximadamente 6 meses' },
            { value: 'future', label: 'A specific future date', label_es: 'Una fecha futura específica' },
          ],
        },
        {
          id: 'still_working',
          label: 'Are you still working?',
          label_es: '¿Sigue trabajando?',
          type: 'select',
          required: true,
          options: [
            { value: 'yes', label: 'Yes', label_es: 'Sí' },
            { value: 'no', label: 'No', label_es: 'No' },
          ],
        },
        { id: 'employer_name', label: 'Current Employer (if still working)', label_es: 'Empleador actual (si sigue trabajando)', type: 'text', required: false },
      ],
    },
    {
      title: 'Direct Deposit',
      title_es: 'Depósito directo',
      fields: [
        { id: 'bank_name', label: 'Bank Name', label_es: 'Nombre del banco', type: 'text', required: false },
        { id: 'bank_routing', label: 'Routing Number', label_es: 'Número de ruta', type: 'text', required: false, maxLength: 9 },
        { id: 'bank_account_last4', label: 'Account Number (last 4 digits)', label_es: 'Número de cuenta (últimos 4 dígitos)', type: 'text', required: false, maxLength: 4 },
      ],
    },
  ],
}
