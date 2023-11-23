import Footer from 'components/Footer'
import HeaderSeller from 'components/HeaderSeller'
import React from 'react'
import { Outlet } from 'react-router-dom'

function CreateGigLayout() {
  return (
    <div>
      <HeaderSeller />
      <Outlet />
      <Footer />
    </div>
  )
}

export default CreateGigLayout
