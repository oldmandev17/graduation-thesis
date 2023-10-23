import { ReactNode, Suspense, lazy, useLayoutEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { Provider } from 'react-redux'
import { Outlet, RouterProvider, createBrowserRouter, useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { store } from 'stores/configureStore'
import App from './App'
import './index.css'

const AdminLayout = lazy(() => import('layouts/Admin'))
const AuthenticationLayout = lazy(() => import('layouts/Authentication'))

const DashboardPage = lazy(() => import('pages/admin/Dashboard'))
const NotFoundPage = lazy(() => import('pages/admin/NotFound'))

const LogInPage = lazy(() => import('pages/auth/LogIn'))
const RegisterPage = lazy(() => import('pages/auth/Register'))
const ForgotPasswordPage = lazy(() => import('pages/auth/ForgotPassword'))
// const RequiredAuthPage = lazy(() => import('pages/auth/RequiredAuth'))
const ResetPasswordPage = lazy(() => import('pages/auth/ResetPassword'))
const UnAuthorizePage = lazy(() => import('pages/auth/UnAuthorize'))

const Wrapper = ({ children }: { children: ReactNode }) => {
  const location = useLocation()
  useLayoutEffect(() => {
    document.documentElement.scrollTo(0, 0)
  }, [location.pathname])
  return children
}

const container = document.getElementById('root') as HTMLElement
const router = createBrowserRouter([
  {
    element: (
      <Wrapper>
        <Outlet />
      </Wrapper>
    ),
    children: [
      {
        path: '/',
        element: <AdminLayout />,
        children: [
          {
            path: '/',
            element: <DashboardPage />
          },
          {
            path: '/*',
            element: <NotFoundPage />
          }
        ]
      },
      {
        path: '/auth',
        element: <AuthenticationLayout />,
        children: [
          {
            path: '/auth/login',
            element: <LogInPage />
          },
          {
            path: '/auth/register',
            element: <RegisterPage />
          },
          {
            path: '/auth/forgotPassword',
            element: <ForgotPasswordPage />
          },
          {
            path: '/auth/resetPassword',
            element: <ResetPasswordPage />
          },
          {
            path: '/auth/unAuthorize',
            element: <UnAuthorizePage />
          }
        ]
      }
    ]
  }
])

createRoot(container).render(
  <Provider store={store}>
    <HelmetProvider>
      <Suspense fallback={<p />}>
        <App>
          <RouterProvider router={router} />
        </App>
        <ToastContainer />
      </Suspense>
    </HelmetProvider>
  </Provider>
)
