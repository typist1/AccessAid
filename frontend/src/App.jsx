import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { LanguageProvider } from './context/LanguageContext'
import { UserProvider } from './context/UserContext'
import { ToastProvider } from './components/ui/Toast'
import { router } from './router'

export default function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <UserProvider>
          <ToastProvider>
            <RouterProvider router={router} />
          </ToastProvider>
        </UserProvider>
      </LanguageProvider>
    </AuthProvider>
  )
}
