export const liheapForm = {
  program_id: 'liheap',
  sections: [
    {
      title: 'Personal Information',
      title_es: 'Información personal',
      fields: [
        { id: 'full_name', label: 'Full Name', label_es: 'Nombre completo', type: 'text', required: true },
        { id: 'date_of_birth', label: 'Date of Birth', label_es: 'Fecha de nacimiento', type: 'date', required: true },
        { id: 'address', label: 'Home Address', label_es: 'Dirección de residencia', type: 'text', required: true },
        { id: 'state', label: 'State', label_es: 'Estado', type: 'text', required: true },
        { id: 'phone', label: 'Phone Number', label_es: 'Número de teléfono', type: 'tel', required: true },
      ],
    },
    {
      title: 'Household & Income',
      title_es: 'Hogar e ingresos',
      fields: [
        { id: 'household_size', label: 'Number of People in Household', label_es: 'Número de personas en el hogar', type: 'number', required: true },
        { id: 'monthly_income', label: 'Total Monthly Household Income ($)', label_es: 'Ingreso mensual total del hogar ($)', type: 'number', required: true },
        { id: 'employment_status', label: 'Employment Status', label_es: 'Situación laboral', type: 'text', required: true },
      ],
    },
    {
      title: 'Utility Information',
      title_es: 'Información de servicios',
      fields: [
        { id: 'utility_provider', label: 'Utility Company Name', label_es: 'Nombre de la empresa de servicios', type: 'text', required: true },
        { id: 'account_number', label: 'Utility Account Number', label_es: 'Número de cuenta de servicios', type: 'text', required: false },
        { id: 'amount_due', label: 'Amount Past Due ($)', label_es: 'Monto vencido ($)', type: 'number', required: false },
        {
          id: 'energy_type',
          label: 'Type of Energy',
          label_es: 'Tipo de energía',
          type: 'select',
          required: true,
          options: [
            { value: 'electric', label: 'Electric', label_es: 'Electricidad' },
            { value: 'gas', label: 'Natural Gas', label_es: 'Gas natural' },
            { value: 'oil', label: 'Heating Oil', label_es: 'Aceite de calefacción' },
            { value: 'propane', label: 'Propane', label_es: 'Propano' },
          ],
        },
        {
          id: 'renter_or_owner',
          label: 'Do you rent or own?',
          label_es: '¿Renta o es propietario?',
          type: 'select',
          required: true,
          options: [
            { value: 'rent', label: 'Rent', label_es: 'Renta' },
            { value: 'own', label: 'Own', label_es: 'Propietario' },
          ],
        },
      ],
    },
  ],
}
