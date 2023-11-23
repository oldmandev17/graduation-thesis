import { UserRole } from 'modules/user'
import RequiredAuth from 'pages/auth/RequiredAuth'
import { ReactNode, Suspense, lazy, useLayoutEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { IoCloseSharp } from 'react-icons/io5'
import { Provider } from 'react-redux'
import { Outlet, RouterProvider, createBrowserRouter, useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'
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
const GigPage = lazy(() => import('pages/admin/gig/Gig'))
const GigDetailPage = lazy(() => import('pages/admin/gig/GigDetail'))
const OrderPage = lazy(() => import('pages/admin/Order'))
const SettingPage = lazy(() => import('pages/admin/Setting'))
const UserPage = lazy(() => import('pages/admin/user/User'))
const UserDetailPage = lazy(() => import('pages/admin/user/UserDetail'))
const MessagePage = lazy(() => import('pages/admin/Message'))

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
                path: '/gig-detail/:id',
                element: <GigDetailPage />
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
              },
              {
                path: '/user-detail/:id',
                element: <UserDetailPage />
              },
              {
                path: '/message',
                element: <MessagePage />
              }
            ]
          }
        ]
      },
      {
        path: '/test',
        element: <AdminLayout />,
        children: [
          {
            path: '/test/overview',
            element: <OverviewPage />
          },
          {
            path: '/test/account',
            element: <AccountPage />
          },
          {
            path: '/test/category',
            element: <CategoryPage />
          },
          {
            path: '/test/gig',
            element: <GigPage />
          },
          {
            path: '/test/gig-detail/:id',
            element: <GigDetailPage />
          },
          {
            path: '/test/log',
            element: <LogPage />
          },
          {
            path: '/test/order',
            element: <OrderPage />
          },
          {
            path: '/test/setting',
            element: <SettingPage />
          },
          {
            path: '/test/user',
            element: <UserPage />
          },
          {
            path: '/test/user-detail/:id',
            element: <UserDetailPage />
          },
          {
            path: '/test/message',
            element: <MessagePage />
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
            path: '/auth/forgot-password',
            element: <ForgotPasswordPage />
          },
          {
            path: '/auth/reset-password',
            element: <ResetPasswordPage />
          },
          {
            path: '/auth/un-authorize',
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
          <PayPalScriptProvider
            options={{ clientId: 'AcBjmzGF3GNUdDIF7jR_9_56O5dzfgrSKOv39T8gRGoKe0UrSrTeKF-kUCQfP-jScMng_IefD4vKOxjy' }}
          >
            <RouterProvider router={router} />
          </PayPalScriptProvider>
        </App>
        <ToastContainer
          position='bottom-right'
          toastClassName='text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800 border border-gray-400 dark:text-gray-500'
          closeButton={<IoCloseSharp />}
        />
      </Suspense>
    </HelmetProvider>
  </Provider>
)
