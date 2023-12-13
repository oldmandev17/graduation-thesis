import { MessageProvider } from 'contexts/StateContext'
import { UserRole } from 'modules/user'
import RequiredAuth from 'pages/auth/RequiredAuth'
import NotFoundPage from 'pages/home/NotFoundPage'
import BecomeSellerPage from 'pages/home/SellerPage/BecomeSellerPage'
import { ReactNode, Suspense, lazy, useLayoutEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { IoCloseSharp } from 'react-icons/io5'
import { Provider } from 'react-redux'
import { Outlet, RouterProvider, createBrowserRouter, useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { store } from 'stores/configureStore'
import App from './App'
import './index.css'

const SellerOnboardLayout = lazy(() => import('layouts/SellerOnboardLayout'))
const AuthenticationLayout = lazy(() => import('layouts/AuthenticationLayout'))
const LandingLayout = lazy(() => import('layouts/LandingLayout'))
const LandingPage = lazy(() => import('pages/home/LandingPage'))
const GigDetailPage = lazy(() => import('pages/home/GigDetailPage'))
const LogInPage = lazy(() => import('pages/auth/LoginPage'))
const SignUpPage = lazy(() => import('pages/auth/SignupPage'))
const CreateGigOverviewPage = lazy(() => import('pages/home/SellerPage/CreateGigOverviewPage'))
const CreateGigPricingPage = lazy(() => import('pages/home/SellerPage/CreateGigPricingPage'))
const CreateGigFaqGalleryPage = lazy(() => import('pages/home/SellerPage/CreateGigFaqGalleryPage'))
const CreateGigPushlishPage = lazy(() => import('pages/home/SellerPage/CreateGigPushlishPage'))
const MessagePage = lazy(() => import('pages/home/MessagePage'))
const CategoryPage = lazy(() => import('pages/home/CategoryPage'))
const GigsPage = lazy(() => import('pages/home/GigsPage'))
const SellerOverviewPage = lazy(() => import('pages/home/SellerPage/SellerOverviewPage'))
const SellerOverviewDoPage = lazy(() => import('pages/home/SellerPage/SellerOverviewDoPage'))
const SellerOverviewDontPage = lazy(() => import('pages/home/SellerPage/SellerOverviewDontPage'))
const SellerPersonalInfo = lazy(() => import('pages/home/SellerPage/SellerPersonalInfo'))
const DashboardPage = lazy(() => import('pages/home/SellerPage/DashboardPage'))

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
        path: '/',
        element: <LandingLayout />,
        children: [
          {
            path: '/',
            element: <LandingPage />
          },

          {
            path: '/gig-detail/:slug',
            element: <GigDetailPage />
          },
          {
            path: '/category/:slug',
            element: <CategoryPage />
          },
          {
            path: '/start-selling',
            element: <BecomeSellerPage />
          },
          {
            path: '/sub-category/:slug',
            element: <GigsPage />
          }
        ]
      },
      {
        path: '/*',
        element: <NotFoundPage />
      },
      {
        path: '/seller-onboarding',
        element: <RequiredAuth allowPermissions={[UserRole.BUYER]} />,
        children: [
          {
            path: '/seller-onboarding/overview',
            element: <SellerOverviewPage />
          },
          {
            path: '/seller-onboarding/overview-do',
            element: <SellerOverviewDoPage />
          },
          {
            path: '/seller-onboarding/overview-dont',
            element: <SellerOverviewDontPage />
          },
          {
            path: '/seller-onboarding/personal-info',
            element: <SellerPersonalInfo />
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
            path: '/auth/login/:accessToken/:refreshToken',
            element: <LogInPage />
          },
          {
            path: '/auth/register',
            element: <SignUpPage />
          }
        ]
      },
      {
        path: '/message/:userId',
        element: <MessagePage />
      },
      {
        path: '/dashboard',
        element: <DashboardPage />
      },
      {
        path: '/user/:userId',
        element: <RequiredAuth allowPermissions={[UserRole.SELLER]} />,
        children: [
          {
            path: '/user/:userId',
            element: <SellerOnboardLayout />,
            children: [
              {
                path: '/user/:userId/',
                element: <DashboardPage />
              },
              {
                path: '/user/:userId/gig-create/overview',
                element: <CreateGigOverviewPage />
              },
              {
                path: '/user/:userId/gig-create/:id/overview',
                element: <CreateGigOverviewPage />
              },
              {
                path: '/user/:userId/gig-create/:id/pricing',
                element: <CreateGigPricingPage />
              },
              {
                path: '/user/:userId/gig-create/:id/faq&gallery',
                element: <CreateGigFaqGalleryPage />
              },
              {
                path: '/user/:userId/gig-create/:id/publish',
                element: <CreateGigPushlishPage />
              }
            ]
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
          toastClassName='text-gray-500 bg-white rounded-lg shadow border border-gray-400'
          closeButton={<IoCloseSharp />}
        />
      </Suspense>
    </HelmetProvider>
  </Provider>
)
