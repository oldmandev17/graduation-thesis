import Footer from 'components/Footer'
import HeaderSeller from 'components/seller/HeaderSeller'
import { Navigate, Outlet, useLocation, useParams } from 'react-router-dom'
import { useAppSelector } from 'stores/hooks'

function SellerOnboardLayout() {
  const location = useLocation()
  const { user } = useAppSelector((state) => state.auth)
  const { userId } = useParams<{ userId?: string }>()
  if (user && userId !== user?.id) return <Navigate to='/auth/un-authorize' state={{ from: location }} replace />
  return (
    <div>
      <HeaderSeller />
      <div className='bg-[#f7f7f7]'>
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}

export default SellerOnboardLayout
