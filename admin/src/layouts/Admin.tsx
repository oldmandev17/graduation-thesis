import FooterAdmin from 'components/admin/FooterAdmin'
import HeaderAdmin from 'components/admin/HeaderAdmin'
import { Outlet } from 'react-router-dom'

function Admin() {
  return (
    <>
      <HeaderAdmin />
      <Outlet />
      <FooterAdmin />
    </>
  )
}

export default Admin
