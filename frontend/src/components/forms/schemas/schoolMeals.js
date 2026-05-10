export const schoolMealsForm = {
  program_id: 'school_meals',
  sections: [
    {
      title: 'Parent / Guardian Information',
      title_es: 'Información del padre / tutor',
      fields: [
        { id: 'full_name', label: 'Parent/Guardian Full Name', label_es: 'Nombre completo del padre/tutor', type: 'text', required: true },
        { id: 'address', label: 'Home Address', label_es: 'Dirección de residencia', type: 'text', required: true },
        { id: 'state', label: 'State', label_es: 'Estado', type: 'text', required: true },
        { id: 'phone', label: 'Phone Number', label_es: 'Número de teléfono', type: 'tel', required: true },
      ],
    },
    {
      title: 'Children Information',
      title_es: 'Información de los hijos',
      fields: [
        { id: 'child_name_1', label: 'Child 1 Full Name', label_es: 'Nombre completo del hijo 1', type: 'text', required: true },
        { id: 'child_school_1', label: 'Child 1 School Name', label_es: 'Nombre de la escuela del hijo 1', type: 'text', required: true },
        { id: 'child_grade_1', label: 'Child 1 Grade', label_es: 'Grado del hijo 1', type: 'text', required: true },
        { id: 'child_name_2', label: 'Child 2 Full Name (if applicable)', label_es: 'Nombre completo del hijo 2 (si aplica)', type: 'text', required: false },
        { id: 'child_school_2', label: 'Child 2 School Name', label_es: 'Nombre de la escuela del hijo 2', type: 'text', required: false },
        { id: 'child_grade_2', label: 'Child 2 Grade', label_es: 'Grado del hijo 2', type: 'text', required: false },
      ],
    },
    {
      title: 'Household & Income',
      title_es: 'Hogar e ingresos',
      fields: [
        { id: 'household_size', label: 'Total Household Members', label_es: 'Total de miembros del hogar', type: 'number', required: true },
        { id: 'monthly_income', label: 'Total Monthly Household Income ($)', label_es: 'Ingreso mensual total del hogar ($)', type: 'number', required: true },
        {
          id: 'snap_enrolled',
          label: 'Currently enrolled in SNAP or TANF?',
          label_es: '¿Actualmente inscrito en SNAP o TANF?',
          type: 'select',
          required: false,
          options: [
            { value: 'yes', label: 'Yes — automatically qualifies children for free meals', label_es: 'Sí — califica automáticamente a los hijos para comidas gratuitas' },
            { value: 'no', label: 'No', label_es: 'No' },
          ],
        },
      ],
    },
  ],
}
