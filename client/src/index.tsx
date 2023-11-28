import { ReactNode, Suspense, lazy, useLayoutEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Outlet, RouterProvider, createBrowserRouter, useLocation } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { IoCloseSharp } from 'react-icons/io5'
import { Provider } from 'react-redux'
import { store } from 'stores/configureStore'
// import RequiredAuth from 'pages/auth/RequiredAuth'
// import { UserRole } from 'modules/user'
import { MessageProvider } from 'contexts/StateContext'
import App from './App'

const CreateGigLayout = lazy(() => import('layouts/CreateGigLayout'))
const AuthenticationLayout = lazy(() => import('layouts/AuthenticationLayout'))
const LandingLayout = lazy(() => import('layouts/LandingLayout'))

const NotFoundPage = lazy(() => import('pages/home/NotFoundPage'))

const LandingPage = lazy(() => import('pages/home/LandingPage'))
const GigDetailPage = lazy(() => import('pages/home/GigDetailPage'))

const LogInPage = lazy(() => import('pages/auth/LoginPage'))
const SignUpPage = lazy(() => import('pages/auth/SignupPage'))
const CreateGigOverviewPage = lazy(() => import('pages/home/SellerPage/CreateGigOverviewPage'))
const CreateGigPricingPage = lazy(() => import('pages/home/SellerPage/CreateGigPricingPage'))
const CreateGigFaqGalleryPage = lazy(() => import('pages/home/SellerPage/CreateGigFaqGalleryPage'))
const CreateGigPushlishPage = lazy(() => import('pages/home/SellerPage/CreateGigPushlishPage'))

const MessagePage = lazy(() => import('pages/home/MessagePage'))

const Wrapper = ({ children }: { children: ReactNode }): any => {
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
        element: <LandingLayout />,
        children: [
          {
            path: '/',
            element: <LandingPage />
          },
          {
            path: '/gig-detail/:gigTitle',
            element: <GigDetailPage />
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
            element: <SignUpPage />
          }
        ]
      },
      {
        path: '/message',
        element: <MessagePage />
      },
      {
        path: '/:userId',
        element: <CreateGigLayout />,
        children: [
          {
            path: '/:userId/gig-create/overview',
            element: <CreateGigOverviewPage />
          },
          {
            path: '/:userId/gig-create/:slug/overview',
            element: <CreateGigOverviewPage />
          },
          {
            path: '/:userId/gig-create/:slug/pricing',
            element: <CreateGigPricingPage />
          },
          {
            path: '/:userId/gig-create/:slug/faq&gallery',
            element: <CreateGigFaqGalleryPage />
          },
          {
            path: '/:userId/gig-create/:slug/publish',
            element: <CreateGigPushlishPage />
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
        <MessageProvider>
          <App>
            <RouterProvider router={router} />
          </App>
        </MessageProvider>
        <ToastContainer
          position='bottom-right'
          toastClassName='text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800 border border-gray-400 dark:text-gray-500'
          closeButton={<IoCloseSharp />}
        />
      </Suspense>
    </HelmetProvider>
  </Provider>
)
