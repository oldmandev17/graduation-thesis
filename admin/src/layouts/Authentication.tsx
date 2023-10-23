import FooterAuth from 'components/auth/FooterAuth'
import HeaderAuth from 'components/auth/HeaderAuth'
import { Outlet } from 'react-router-dom'

function Authentication() {
  return (
    <>
      <HeaderAuth />
      <Outlet />
      <FooterAuth />
    </>
  )
}

export default Authentication
