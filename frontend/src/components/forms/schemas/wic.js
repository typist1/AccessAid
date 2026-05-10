export const wicForm = {
  program_id: 'wic',
  sections: [
    {
      title: 'Applicant Information',
      title_es: 'Información del solicitante',
      fields: [
        { id: 'full_name', label: 'Full Name', label_es: 'Nombre completo', type: 'text', required: true },
        { id: 'date_of_birth', label: 'Date of Birth', label_es: 'Fecha de nacimiento', type: 'date', required: true },
        { id: 'address', label: 'Home Address', label_es: 'Dirección de residencia', type: 'text', required: true },
        { id: 'state', label: 'State', label_es: 'Estado', type: 'text', required: true },
        { id: 'phone', label: 'Phone Number', label_es: 'Número de teléfono', type: 'tel', required: true },
      ],
    },
    {
      title: 'Eligibility Category',
      title_es: 'Categoría de elegibilidad',
      fields: [
        {
          id: 'wic_category',
          label: 'Which applies to you?',
          label_es: '¿Cuál le aplica?',
          type: 'select',
          required: true,
          options: [
            { value: 'pregnant', label: 'I am pregnant', label_es: 'Estoy embarazada' },
            { value: 'postpartum', label: 'I gave birth within the last 6 months', label_es: 'Di a luz en los últimos 6 meses' },
            { value: 'breastfeeding', label: 'I am breastfeeding (up to 12 months postpartum)', label_es: 'Estoy amamantando (hasta 12 meses posparto)' },
            { value: 'infant', label: 'I have an infant under 12 months', label_es: 'Tengo un bebé menor de 12 meses' },
            { value: 'child_under_5', label: 'I have a child under 5 years old', label_es: 'Tengo un hijo menor de 5 años' },
          ],
        },
        { id: 'child_name', label: "Child's Full Name (if applying for child)", label_es: 'Nombre completo del hijo (si aplica para el hijo)', type: 'text', required: false },
        { id: 'child_date_of_birth', label: "Child's Date of Birth", label_es: 'Fecha de nacimiento del hijo', type: 'date', required: false },
      ],
    },
    {
      title: 'Income & Household',
      title_es: 'Ingresos y hogar',
      fields: [
        { id: 'household_size', label: 'Household Size', label_es: 'Tamaño del hogar', type: 'number', required: true },
        { id: 'monthly_income', label: 'Monthly Gross Household Income ($)', label_es: 'Ingreso bruto mensual del hogar ($)', type: 'number', required: true },
        {
          id: 'snap_enrolled',
          label: 'Currently enrolled in SNAP, Medicaid, or TANF?',
          label_es: '¿Actualmente inscrito en SNAP, Medicaid o TANF?',
          type: 'select',
          required: false,
          options: [
            { value: 'yes', label: 'Yes — automatically income-eligible', label_es: 'Sí — elegible automáticamente por ingresos' },
            { value: 'no', label: 'No', label_es: 'No' },
          ],
        },
      ],
    },
  ],
}
