/* eslint-disable @typescript-eslint/no-unused-vars */
import FooterAdmin from 'components/admin/FooterAdmin'
import HeaderAdmin from 'components/admin/HeaderAdmin'
import SideBarAdmin from 'components/admin/SideBarAdmin'
import { Outlet } from 'react-router-dom'

function Admin() {
  return (
    <div className='antialiased bg-gray-50 dark:bg-gray-900'>
      <HeaderAdmin />
      <SideBarAdmin />
      <main className='h-auto min-h-screen p-4 pt-20 md:ml-64'>
        <div className='p-5'>
          <Outlet />
        </div>
        <FooterAdmin />
      </main>
    </div>
  )
}

export default Admin
