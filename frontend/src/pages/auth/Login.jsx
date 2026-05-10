import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { signIn, signInWithGoogle } from '../../lib/auth'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import LanguagePicker from '../../components/ui/LanguagePicker'

export default function Login() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await signIn(email, password)
    if (error) { setError(error.message); setLoading(false); return }
    navigate('/dashboard')
  }

  async function handleGoogle() {
    await signInWithGoogle()
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 w-full max-w-md">
        <div className="flex justify-end mb-4">
          <LanguagePicker />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{t('auth.login_title')}</h1>
        <p className="text-gray-600 mb-6">{t('auth.login_subtitle')}</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input label={t('auth.email_label')} type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          <Input label={t('auth.password_label')} type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" disabled={loading}>{loading ? t('auth.signing_in') : t('auth.sign_in_btn')}</Button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
          <div className="relative flex justify-center"><span className="bg-white px-2 text-sm text-gray-500">{t('common.or')}</span></div>
        </div>

        <Button variant="secondary" className="w-full" onClick={handleGoogle}>
          {t('auth.google_btn')}
        </Button>

        <p className="text-center text-sm text-gray-600 mt-4">
          {t('auth.no_account')} <Link to="/signup" className="text-blue-600 hover:underline">{t('auth.sign_up_link')}</Link>
        </p>
      </div>
    </div>
  )
}
