import { createBrowserRouter } from 'react-router-dom'
import AuthGuard from './components/layout/AuthGuard'
import OnboardingGuard from './components/layout/OnboardingGuard'
import AuthLayout from './components/layout/AuthLayout'
import Landing from './pages/Landing'
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import AuthCallback from './pages/auth/AuthCallback'
import Onboarding from './pages/onboarding'
import Dashboard from './pages/dashboard'
import ProgramDetail from './pages/programs/ProgramDetail'
import ApplicationForm from './pages/programs/ApplicationForm'
import Documents from './pages/documents'
import Settings from './pages/settings'
import AutofillProfile from './pages/autofill-profile'
import AbeAutofillPage from './pages/programs/AbeAutofillPage'

export const router = createBrowserRouter([
  { path: '/', element: <Landing /> },
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <Login /> },
      { path: '/signup', element: <Signup /> },
    ],
  },
  { path: '/auth/callback', element: <AuthCallback /> },
  {
    path: '/onboarding',
    element: <AuthGuard><Onboarding /></AuthGuard>,
  },
  {
    path: '/dashboard',
    element: <AuthGuard><OnboardingGuard><Dashboard /></OnboardingGuard></AuthGuard>,
  },
  {
    path: '/programs/:id',
    element: <AuthGuard><OnboardingGuard><ProgramDetail /></OnboardingGuard></AuthGuard>,
  },
  {
    path: '/programs/snap/apply',
    element: <AuthGuard><OnboardingGuard><AbeAutofillPage /></OnboardingGuard></AuthGuard>,
  },
  {
    path: '/programs/:id/apply',
    element: <AuthGuard><OnboardingGuard><ApplicationForm /></OnboardingGuard></AuthGuard>,
  },
  {
    path: '/documents',
    element: <AuthGuard><OnboardingGuard><Documents /></OnboardingGuard></AuthGuard>,
  },
  {
    path: '/settings',
    element: <AuthGuard><OnboardingGuard><Settings /></OnboardingGuard></AuthGuard>,
  },
  {
    path: '/profile',
    element: <AuthGuard><OnboardingGuard><AutofillProfile /></OnboardingGuard></AuthGuard>,
  },
])
