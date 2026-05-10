export const pellGrantForm = {
  program_id: 'pell_grant',
  sections: [
    {
      title: 'Student Information',
      title_es: 'Información del estudiante',
      fields: [
        { id: 'full_name', label: 'Full Name', label_es: 'Nombre completo', type: 'text', required: true },
        { id: 'date_of_birth', label: 'Date of Birth', label_es: 'Fecha de nacimiento', type: 'date', required: true },
        { id: 'ssn_last4', label: 'SSN (last 4 digits)', label_es: 'SSN (últimos 4 dígitos)', type: 'text', required: true, maxLength: 4 },
        { id: 'address', label: 'Home Address', label_es: 'Dirección de residencia', type: 'text', required: true },
        { id: 'state', label: 'State', label_es: 'Estado', type: 'text', required: true },
        { id: 'email', label: 'Email Address', label_es: 'Correo electrónico', type: 'email', required: true },
        { id: 'phone', label: 'Phone Number', label_es: 'Número de teléfono', type: 'tel', required: true },
      ],
    },
    {
      title: 'Academic Information',
      title_es: 'Información académica',
      fields: [
        { id: 'school_name', label: 'College / University Name', label_es: 'Nombre del colegio / universidad', type: 'text', required: true },
        {
          id: 'enrollment_status',
          label: 'Enrollment Status',
          label_es: 'Estado de inscripción',
          type: 'select',
          required: true,
          options: [
            { value: 'full_time', label: 'Full-time', label_es: 'Tiempo completo' },
            { value: 'half_time', label: 'Half-time', label_es: 'Medio tiempo' },
            { value: 'less_than_half', label: 'Less than half-time', label_es: 'Menos de medio tiempo' },
          ],
        },
        {
          id: 'degree_type',
          label: 'Degree Program',
          label_es: 'Programa de título',
          type: 'select',
          required: true,
          options: [
            { value: 'associates', label: "Associate's", label_es: 'Asociado' },
            { value: 'bachelors', label: "Bachelor's", label_es: 'Licenciatura' },
            { value: 'certificate', label: 'Certificate', label_es: 'Certificado' },
          ],
        },
        {
          id: 'fafsa_completed',
          label: 'Have you completed FAFSA?',
          label_es: '¿Ha completado el FAFSA?',
          type: 'select',
          required: true,
          options: [
            { value: 'yes', label: 'Yes', label_es: 'Sí' },
            { value: 'no', label: 'No — complete FAFSA first at studentaid.gov', label_es: 'No — complete el FAFSA primero en studentaid.gov' },
          ],
        },
      ],
    },
    {
      title: 'Financial Information',
      title_es: 'Información financiera',
      fields: [
        { id: 'household_size', label: 'Family Household Size', label_es: 'Tamaño del hogar familiar', type: 'number', required: true },
        { id: 'monthly_income', label: "Family Annual Income ($) — use parent's if dependent", label_es: 'Ingreso anual familiar ($) — use el de sus padres si es dependiente', type: 'number', required: true },
      ],
    },
  ],
}
