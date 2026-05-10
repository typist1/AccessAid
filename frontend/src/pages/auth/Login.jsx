import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { signIn } from '../../lib/auth'
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

  return (
    <div
      className="rounded-2xl p-8 w-full"
      style={{
        background: 'rgba(255,255,255,0.06)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        border: '1px solid rgba(255,255,255,0.15)',
        boxShadow: '0 0 0 1px rgba(255,255,255,0.06), 0 8px 16px rgba(0,0,0,0.4), 0 24px 64px rgba(0,0,0,0.6), 0 0 80px rgba(0,0,0,0.35)',
      }}
    >
      <div className="flex justify-end mb-4">
        <LanguagePicker />
      </div>
      <h1 className="text-2xl font-bold text-white mb-2">{t('auth.login_title')}</h1>
      <p className="mb-6 font-medium text-white">{t('auth.login_subtitle')}</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input label={t('auth.email_label')} type="email" value={email} onChange={e => setEmail(e.target.value)} required labelClassName="text-white text-base font-semibold" />
        <Input label={t('auth.password_label')} type="password" value={password} onChange={e => setPassword(e.target.value)} required labelClassName="text-white text-base font-semibold" />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <Button type="submit" disabled={loading}>{loading ? t('auth.signing_in') : t('auth.sign_in_btn')}</Button>
      </form>

      <p className="text-center text-sm mt-6 font-medium text-white">
        {t('auth.no_account')}{' '}
        <Link to="/signup" className="font-semibold underline underline-offset-2 text-white hover:text-purple-200">{t('auth.sign_up_link')}</Link>
      </p>
    </div>
  )
}
