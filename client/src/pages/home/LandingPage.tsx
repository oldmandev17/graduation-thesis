import { lazy } from 'react'
import { useAppSelector } from 'stores/hooks'

const GuestPage = lazy(() => import('./GuestPage'))
const UserPage = lazy(() => import('./UserPage'))

function LandingPage() {
  const { user } = useAppSelector((state) => state.auth)
  if (user) return <UserPage />
  return <GuestPage />
}

export default LandingPage
