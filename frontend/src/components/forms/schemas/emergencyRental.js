export const emergencyRentalForm = {
  program_id: 'emergency_rental',
  sections: [
    {
      title: 'Tenant Information',
      title_es: 'Información del inquilino',
      fields: [
        { id: 'full_name', label: 'Full Name', label_es: 'Nombre completo', type: 'text', required: true },
        { id: 'date_of_birth', label: 'Date of Birth', label_es: 'Fecha de nacimiento', type: 'date', required: true },
        { id: 'address', label: 'Rental Address', label_es: 'Dirección de arrendamiento', type: 'text', required: true },
        { id: 'state', label: 'State', label_es: 'Estado', type: 'text', required: true },
        { id: 'phone', label: 'Phone Number', label_es: 'Número de teléfono', type: 'tel', required: true },
        { id: 'email', label: 'Email Address', label_es: 'Correo electrónico', type: 'email', required: false },
      ],
    },
    {
      title: 'Rental Situation',
      title_es: 'Situación de arrendamiento',
      fields: [
        { id: 'landlord_name', label: 'Landlord / Property Manager Name', label_es: 'Nombre del propietario / administrador', type: 'text', required: true },
        { id: 'monthly_rent', label: 'Monthly Rent Amount ($)', label_es: 'Monto de renta mensual ($)', type: 'number', required: true },
        { id: 'amount_due', label: 'Total Past-Due Rent Owed ($)', label_es: 'Renta atrasada total adeudada ($)', type: 'number', required: true },
        { id: 'months_behind', label: 'Months Behind on Rent', label_es: 'Meses atrasados en renta', type: 'number', required: true },
        {
          id: 'eviction_notice',
          label: 'Have you received an eviction notice?',
          label_es: '¿Ha recibido aviso de desalojo?',
          type: 'select',
          required: true,
          options: [
            { value: 'yes', label: 'Yes', label_es: 'Sí' },
            { value: 'no', label: 'No', label_es: 'No' },
          ],
        },
      ],
    },
    {
      title: 'Income & Hardship',
      title_es: 'Ingresos y dificultades',
      fields: [
        { id: 'household_size', label: 'Household Size', label_es: 'Tamaño del hogar', type: 'number', required: true },
        { id: 'monthly_income', label: 'Monthly Household Income ($)', label_es: 'Ingreso mensual del hogar ($)', type: 'number', required: true },
        { id: 'hardship_reason', label: 'Reason for financial hardship', label_es: 'Motivo de dificultad financiera', type: 'text', required: true },
      ],
    },
  ],
}
