import FooterAuth from 'components/auth/FooterAuth'
import HeaderAuth from 'components/auth/HeaderAuth'
import { Outlet } from 'react-router-dom'

function Authentication() {
  return (
    <div className='h-screen bg-gray-50 dark:bg-gray-900'>
      <HeaderAuth />
      <Outlet />
      <FooterAuth />
    </div>
  )
}

export default Authentication
