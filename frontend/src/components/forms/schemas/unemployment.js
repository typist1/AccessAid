export const unemploymentForm = {
  program_id: 'unemployment',
  sections: [
    {
      title: 'Personal Information',
      title_es: 'Información personal',
      fields: [
        { id: 'full_name', label: 'Full Name', label_es: 'Nombre completo', type: 'text', required: true },
        { id: 'date_of_birth', label: 'Date of Birth', label_es: 'Fecha de nacimiento', type: 'date', required: true },
        { id: 'address', label: 'Home Address', label_es: 'Dirección de residencia', type: 'text', required: true },
        { id: 'state', label: 'State', label_es: 'Estado', type: 'text', required: true },
        { id: 'ssn_last4', label: 'Last 4 digits of SSN', label_es: 'Últimos 4 dígitos del SSN', type: 'text', required: true, maxLength: 4 },
      ],
    },
    {
      title: 'Employment History',
      title_es: 'Historial laboral',
      fields: [
        { id: 'employer_name', label: 'Last Employer Name', label_es: 'Nombre del último empleador', type: 'text', required: true },
        { id: 'employment_status', label: 'Reason for Separation', label_es: 'Motivo de separación', type: 'text', required: true },
        { id: 'gross_income', label: 'Last Annual Gross Wages ($)', label_es: 'Último salario bruto anual ($)', type: 'number', required: false },
      ],
    },
  ],
}
