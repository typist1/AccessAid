export const ssdiForm = {
  program_id: 'ssdi',
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
      ],
    },
    {
      title: 'Work History',
      title_es: 'Historial laboral',
      fields: [
        { id: 'employer_name', label: 'Most Recent Employer', label_es: 'Empleador más reciente', type: 'text', required: true },
        { id: 'last_day_worked', label: 'Last Day Worked', label_es: 'Último día trabajado', type: 'date', required: true },
        { id: 'gross_income', label: 'Annual Earnings Last Year ($)', label_es: 'Ingresos anuales del año pasado ($)', type: 'number', required: true },
        { id: 'ytd_gross', label: 'YTD Gross Earnings This Year ($)', label_es: 'Ingresos brutos del año actual hasta la fecha ($)', type: 'number', required: false },
      ],
    },
    {
      title: 'Medical Information',
      title_es: 'Información médica',
      fields: [
        { id: 'disability_description', label: 'Describe your disability or condition', label_es: 'Describa su discapacidad o condición', type: 'text', required: true },
        { id: 'disability_onset_date', label: 'When did disability begin?', label_es: '¿Cuándo comenzó la discapacidad?', type: 'date', required: true },
        { id: 'doctors_name', label: "Primary Doctor's Name", label_es: 'Nombre del médico principal', type: 'text', required: true },
        { id: 'doctors_phone', label: "Doctor's Phone Number", label_es: 'Teléfono del médico', type: 'tel', required: true },
      ],
    },
  ],
}
