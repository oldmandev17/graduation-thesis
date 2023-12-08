import { ReactNode, Suspense, lazy, useLayoutEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { IoCloseSharp } from 'react-icons/io5'
import { Provider } from 'react-redux'
import { Outlet, RouterProvider, createBrowserRouter, useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { store } from 'stores/configureStore'
import './index.css'
// import RequiredAuth from 'pages/auth/RequiredAuth'
// import { UserRole } from 'modules/user'
import { MessageProvider } from 'contexts/StateContext'
// import RequiredAuth from 'pages/auth/RequiredAuth'
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
const CategoryPage = lazy(() => import('pages/home/CategoryPage'))
const BecomeSellerPage = lazy(() => import('pages/home/SellerPage/BecomeSellerPage'))
const GigsPage = lazy(() => import('pages/home/GigsPage'))
const RegisterSellerPage = lazy(() => import('pages/home/SellerPage/SellerOverviewPage'))
const SellerOverviewPage = lazy(() => import('pages/home/SellerPage/SellerOverviewPage'))
const SellerOverviewDoPage = lazy(() => import('pages/home/SellerPage/SellerOverviewDoPage'))
const SellerOverviewDontPage = lazy(() => import('pages/home/SellerPage/SellerOverviewDontPage'))
const SellerPersonalInfo = lazy(() => import('pages/home/SellerPage/SellerPersonalInfo'))

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
            path: '/*',
            element: <NotFoundPage />
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
            path: '/register-seller',
            element: <RegisterSellerPage />
          },
          {
            path: '/sub-category/:slug',
            element: <GigsPage />
          }
        ]
      },
      // {
      //   path: '/seller-onboarding',
      //   element: <RequiredAuth allowPermissions={[]} />,
      //   children: [
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
      },
      //   ]
      // },
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
        path: '/gig-create/:userId',
        element: <CreateGigLayout />,
        children: [
          {
            path: '/gig-create/:userId/overview',
            element: <CreateGigOverviewPage />
          },
          {
            path: '/gig-create/:userId/:id/overview',
            element: <CreateGigOverviewPage />
          },
          {
            path: '/gig-create/:userId/:id/pricing',
            element: <CreateGigPricingPage />
          },
          {
            path: '/gig-create/:userId/:id/faq&gallery',
            element: <CreateGigFaqGalleryPage />
          },
          {
            path: '/gig-create/:userId/:id/publish',
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
