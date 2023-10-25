import { UserRole } from 'modules/user'
import RequiredAuth from 'pages/auth/RequiredAuth'
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

const OverviewPage = lazy(() => import('pages/admin/Overview'))
const LogPage = lazy(() => import('pages/admin/Log'))
const AccountPage = lazy(() => import('pages/admin/Account'))
const CategoryPage = lazy(() => import('pages/admin/Category'))
const GigPage = lazy(() => import('pages/admin/Gig'))
const OrderPage = lazy(() => import('pages/admin/Order'))
const SettingPage = lazy(() => import('pages/admin/Setting'))
const UserPage = lazy(() => import('pages/admin/User'))

const NotFoundPage = lazy(() => import('pages/admin/NotFound'))

const LogInPage = lazy(() => import('pages/auth/LogIn'))
const ForgotPasswordPage = lazy(() => import('pages/auth/ForgotPassword'))
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
        path: '/*',
        element: <NotFoundPage />
      },
      {
        path: '/',
        element: <RequiredAuth allowPermissions={[UserRole.ADMIN, UserRole.MANAGER]} />,
        children: [
          {
            path: '/',
            element: <AdminLayout />,
            children: [
              {
                path: '/overview',
                element: <OverviewPage />
              },
              {
                path: '/account',
                element: <AccountPage />
              },
              {
                path: '/category',
                element: <CategoryPage />
              },
              {
                path: '/gig',
                element: <GigPage />
              },
              {
                path: '/log',
                element: <LogPage />
              },
              {
                path: '/order',
                element: <OrderPage />
              },
              {
                path: '/setting',
                element: <SettingPage />
              },
              {
                path: '/user',
                element: <UserPage />
              }
            ]
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
