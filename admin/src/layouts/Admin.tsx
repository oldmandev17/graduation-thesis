import FooterAdmin from 'components/admin/FooterAdmin'
import HeaderAdmin from 'components/admin/HeaderAdmin'
import SideBarAdmin from 'components/admin/SideBarAdmin'
import { Outlet } from 'react-router-dom'

function Admin() {
  return (
    <div className='antialiased bg-gray-50 dark:bg-gray-900'>
      <HeaderAdmin />
      <SideBarAdmin />
      <main className='p-4 md:ml-64 h-auto pt-20'>
        <Outlet />
        <FooterAdmin />
      </main>
    </div>
  )
}

export default Admin
