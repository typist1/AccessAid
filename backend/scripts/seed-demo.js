import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const admin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

const EMAIL = 'maria@accessaid.demo'
const PASSWORD = 'Demo1234!'

async function run() {
  // 1. Create or find auth user
  let userId
  const { data: existing } = await admin.auth.admin.listUsers()
  const found = existing?.users?.find(u => u.email === EMAIL)

  if (found) {
    console.log('User already exists, updating password…')
    const { data: updated } = await admin.auth.admin.updateUserById(found.id, { password: PASSWORD })
    userId = updated.user.id
  } else {
    const { data: created, error } = await admin.auth.admin.createUser({
      email: EMAIL,
      password: PASSWORD,
      email_confirm: true,
    })
    if (error) { console.error('Create user failed:', error.message); process.exit(1) }
    userId = created.user.id
    console.log('Created auth user:', userId)
  }

  // 2. Upsert user_profile
  const { error: profileErr } = await admin.from('user_profile').upsert({
    user_id: userId,
    full_name: 'Maria Hernandez',
    age: 34,
    state: 'IL',
    zip_code: '60629',
    employment_status: 'unemployed',
    income: '<15k',
    household_size: 3,
    has_children: true,
    num_children: 2,
    citizenship_status: 'citizen',
    disability_status: 'no',
    student_status: 'no',
    language_preference: 'en',
  }, { onConflict: 'user_id' })
  if (profileErr) { console.error('Profile upsert failed:', profileErr.message); process.exit(1) }
  console.log('Upserted user_profile')

  // 3. Upsert user_facts (what the extension reads for autofill)
  const facts = [
    { field_key: 'full_name', field_value: 'Maria Hernandez' },
    { field_key: 'first_name', field_value: 'Maria' },
    { field_key: 'last_name', field_value: 'Hernandez' },
    { field_key: 'age', field_value: '34' },
    { field_key: 'date_of_birth', field_value: '1991-03-15' },
    { field_key: 'state', field_value: 'IL' },
    { field_key: 'zip_code', field_value: '60629' },
    { field_key: 'address_line_1', field_value: '4821 S Kedzie Ave' },
    { field_key: 'city', field_value: 'Chicago' },
    { field_key: 'phone_number', field_value: '(773) 555-0192' },
    { field_key: 'email', field_value: EMAIL },
    { field_key: 'employment_status', field_value: 'unemployed' },
    { field_key: 'income', field_value: '<15k' },
    { field_key: 'monthly_income', field_value: '0' },
    { field_key: 'annual_income_last_year', field_value: '22000' },
    { field_key: 'household_size', field_value: '3' },
    { field_key: 'num_children', field_value: '2' },
    { field_key: 'has_children', field_value: 'true' },
    { field_key: 'citizenship_status', field_value: 'citizen' },
    { field_key: 'disability_status', field_value: 'no' },
    { field_key: 'student_status', field_value: 'no' },
    { field_key: 'ssn_last4', field_value: '4821' },
  ]

  for (const fact of facts) {
    const { error } = await admin.from('user_facts').upsert(
      { user_id: userId, ...fact, source: 'onboarding' },
      { onConflict: 'user_id,field_key' }
    )
    if (error) console.warn(`  fact ${fact.field_key} failed:`, error.message)
  }
  console.log(`Upserted ${facts.length} user_facts`)

  // 4. Seed strong-match user_programs for SNAP, Medicaid, TANF (skipped if programs table empty)
  const { data: programs } = await admin.from('programs').select('id, name')
  if (!programs?.length) {
    console.warn('  Programs table empty — run supabase/seed.sql in Supabase SQL editor first, then re-run this script to add program matches.')
  } else {
    const targets = ['SNAP', 'Medicaid', 'TANF']
    for (const target of targets) {
      const prog = programs.find(p => p.name.toUpperCase().includes(target))
      if (!prog) { console.warn(`  Program not found: ${target}`); continue }
      const { error } = await admin.from('user_programs').upsert({
        user_id: userId,
        program_id: prog.id,
        eligibility_score: 'strong',
        reasoning: `Based on Maria's income and household size, she likely qualifies for ${prog.name}.`,
        status: 'matched',
      }, { onConflict: 'user_id,program_id' })
      if (error) console.warn(`  user_programs ${target} failed:`, error.message)
      else console.log(`  Seeded user_programs: ${prog.name}`)
    }
  }

  console.log('\n✓ Demo user ready!')
  console.log(`  Email:    ${EMAIL}`)
  console.log(`  Password: ${PASSWORD}`)
  console.log(`  Dashboard: http://localhost:5173`)
}

run().catch(e => { console.error(e); process.exit(1) })
