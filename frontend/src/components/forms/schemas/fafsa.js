export const fafsaForm = {
  program_id: 'fafsa',
  sections: [
    {
      title: 'Student Information',
      title_es: 'Información del estudiante',
      fields: [
        { id: 'full_name', label: 'Legal Full Name (as on SSN card)', label_es: 'Nombre legal completo (como en la tarjeta del SSN)', type: 'text', required: true },
        { id: 'date_of_birth', label: 'Date of Birth', label_es: 'Fecha de nacimiento', type: 'date', required: true },
        { id: 'ssn_last4', label: 'SSN (last 4 digits)', label_es: 'SSN (últimos 4 dígitos)', type: 'text', required: true, maxLength: 4 },
        { id: 'email', label: 'Email Address', label_es: 'Correo electrónico', type: 'email', required: true },
        { id: 'address', label: 'Permanent Home Address', label_es: 'Dirección permanente de residencia', type: 'text', required: true },
        { id: 'state', label: 'State of Legal Residence', label_es: 'Estado de residencia legal', type: 'text', required: true },
        { id: 'citizenship_status', label: 'Citizenship Status', label_es: 'Estatus migratorio', type: 'text', required: true },
      ],
    },
    {
      title: 'Academic & Dependency',
      title_es: 'Académico y dependencia',
      fields: [
        { id: 'school_name', label: 'School Name(s) to Receive FAFSA', label_es: 'Nombre(s) de escuela(s) para recibir el FAFSA', type: 'text', required: true },
        {
          id: 'dependency_status',
          label: 'Dependency Status',
          label_es: 'Estado de dependencia',
          type: 'select',
          required: true,
          options: [
            { value: 'dependent', label: 'Dependent (parents claimed me on taxes)', label_es: 'Dependiente (mis padres me declararon en impuestos)' },
            { value: 'independent', label: 'Independent (24+, married, veteran, or self-supporting)', label_es: 'Independiente (24+, casado, veterano o autosuficiente)' },
          ],
        },
        {
          id: 'grade_level',
          label: 'Grade Level in 2025–26',
          label_es: 'Nivel de grado en 2025–26',
          type: 'select',
          required: true,
          options: [
            { value: '1st_year', label: '1st Year / Never attended college', label_es: '1er año / Nunca asistió a la universidad' },
            { value: '2nd_year', label: '2nd Year / Sophomore', label_es: '2do año / Segundo año' },
            { value: '3rd_year', label: '3rd Year / Junior', label_es: '3er año / Junior' },
            { value: '4th_year', label: '4th Year / Senior', label_es: '4to año / Senior' },
            { value: 'grad', label: 'Graduate / Professional', label_es: 'Posgrado / Profesional' },
          ],
        },
      ],
    },
    {
      title: 'Financial Information',
      title_es: 'Información financiera',
      fields: [
        { id: 'monthly_income', label: 'Adjusted Gross Income from 2023 taxes ($)', label_es: 'Ingreso bruto ajustado de impuestos 2023 ($)', type: 'number', required: true },
        { id: 'household_size', label: 'Household Size (include parents if dependent)', label_es: 'Tamaño del hogar (incluir padres si es dependiente)', type: 'number', required: true },
        { id: 'bank_balance', label: 'Current Savings / Checking Balance ($)', label_es: 'Saldo actual de ahorros / cuenta corriente ($)', type: 'number', required: false },
      ],
    },
  ],
}
