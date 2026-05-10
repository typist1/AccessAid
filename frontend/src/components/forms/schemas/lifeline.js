export const lifelineForm = {
  program_id: 'lifeline',
  sections: [
    {
      title: 'Personal Information',
      title_es: 'Información personal',
      fields: [
        { id: 'full_name', label: 'Full Name', label_es: 'Nombre completo', type: 'text', required: true },
        { id: 'date_of_birth', label: 'Date of Birth', label_es: 'Fecha de nacimiento', type: 'date', required: true },
        { id: 'address', label: 'Service Address', label_es: 'Dirección de servicio', type: 'text', required: true },
        { id: 'state', label: 'State', label_es: 'Estado', type: 'text', required: true },
        { id: 'ssn_last4', label: 'Last 4 digits of SSN', label_es: 'Últimos 4 dígitos del SSN', type: 'text', required: true, maxLength: 4 },
      ],
    },
    {
      title: 'Eligibility',
      title_es: 'Elegibilidad',
      fields: [
        { id: 'household_size', label: 'Household Size', label_es: 'Tamaño del hogar', type: 'number', required: true },
        { id: 'monthly_income', label: 'Annual Household Income ($)', label_es: 'Ingreso anual del hogar ($)', type: 'number', required: false },
        {
          id: 'qualifying_program',
          label: 'Do you participate in a qualifying program?',
          label_es: '¿Participa en un programa que califica?',
          type: 'select',
          required: false,
          options: [
            { value: 'snap', label: 'SNAP', label_es: 'SNAP' },
            { value: 'medicaid', label: 'Medicaid', label_es: 'Medicaid' },
            { value: 'ssi', label: 'SSI', label_es: 'SSI' },
            { value: 'fph', label: 'Federal Public Housing', label_es: 'Vivienda pública federal' },
            { value: 'veterans', label: "Veterans Pension/Survivor's Benefit", label_es: 'Pensión de veteranos/beneficio de sobreviviente' },
            { value: 'none', label: 'None — qualifying by income', label_es: 'Ninguno — califico por ingresos' },
          ],
        },
        {
          id: 'service_type',
          label: 'Discount for phone or internet?',
          label_es: '¿Descuento para teléfono o internet?',
          type: 'select',
          required: true,
          options: [
            { value: 'phone', label: 'Phone', label_es: 'Teléfono' },
            { value: 'internet', label: 'Internet', label_es: 'Internet' },
          ],
        },
      ],
    },
  ],
}
