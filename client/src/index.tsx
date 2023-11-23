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

import CreateGigLayout from 'layouts/CreateGigLayout'
import App from './App'

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
            path: '/auth/signup',
            element: <SignUpPage />
          }
        ]
      },
      {
        path: '/users',
        element: <CreateGigLayout />,
        children: [
          {
            path: '/users/doanvan/manage_gigs/overview',
            element: <CreateGigOverviewPage />
          },
          {
            path: '/users/doanvan/manage_gigs/pricing',
            element: <CreateGigPricingPage />
          },
          {
            path: '/users/doanvan/manage_gigs/faq&gallery',
            element: <CreateGigFaqGalleryPage />
          },
          {
            path: '/users/doanvan/publishing/',
            element: <CreateGigPushlishPage />
          }
        ]
      },
      {
        path: '/user_id',
        element: <LandingLayout />,
        children: [
          {
            path: '/user_id/gig_title',
            element: <GigDetailPage />
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
        <ToastContainer
          position='bottom-right'
          toastClassName='text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800 border border-gray-400 dark:text-gray-500'
          closeButton={<IoCloseSharp />}
        />
      </Suspense>
    </HelmetProvider>
  </Provider>
)
