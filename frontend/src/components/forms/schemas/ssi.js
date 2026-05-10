export const ssiForm = {
  program_id: 'ssi',
  sections: [
    {
      title: 'Personal Information',
      title_es: 'Información personal',
      fields: [
        { id: 'full_name', label: 'Full Name', label_es: 'Nombre completo', type: 'text', required: true },
        { id: 'date_of_birth', label: 'Date of Birth', label_es: 'Fecha de nacimiento', type: 'date', required: true },
        { id: 'ssn_last4', label: 'Social Security Number (last 4)', label_es: 'Número de Seguro Social (últimos 4)', type: 'text', required: true, maxLength: 4 },
        { id: 'address', label: 'Home Address', label_es: 'Dirección de residencia', type: 'text', required: true },
        { id: 'state', label: 'State', label_es: 'Estado', type: 'text', required: true },
        { id: 'phone', label: 'Phone Number', label_es: 'Número de teléfono', type: 'tel', required: true },
        { id: 'citizenship_status', label: 'Citizenship Status', label_es: 'Estatus migratorio', type: 'text', required: true },
      ],
    },
    {
      title: 'Eligibility Basis',
      title_es: 'Base de elegibilidad',
      fields: [
        {
          id: 'ssi_basis',
          label: 'Applying on basis of:',
          label_es: 'Solicitando por:',
          type: 'select',
          required: true,
          options: [
            { value: 'age', label: 'Age (65 or older)', label_es: 'Edad (65 o más)' },
            { value: 'blind', label: 'Blindness', label_es: 'Ceguera' },
            { value: 'disability', label: 'Disability', label_es: 'Discapacidad' },
          ],
        },
        { id: 'disability_description', label: 'Disability description (if applicable)', label_es: 'Descripción de discapacidad (si aplica)', type: 'text', required: false },
      ],
    },
    {
      title: 'Income & Assets',
      title_es: 'Ingresos y activos',
      fields: [
        { id: 'monthly_income', label: 'Monthly Income from All Sources ($)', label_es: 'Ingresos mensuales de todas las fuentes ($)', type: 'number', required: true },
        { id: 'bank_balance', label: 'Approximate Bank Account Balance ($)', label_es: 'Saldo aproximado de cuenta bancaria ($)', type: 'number', required: true },
        { id: 'other_assets', label: 'Other Assets Value ($)', label_es: 'Valor de otros activos ($)', type: 'number', required: false },
      ],
    },
  ],
}
