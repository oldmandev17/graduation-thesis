import React from 'react'
import Footer from 'components/Footer'
import HeaderBuyer from 'components/HeaderBuyer'
import { Outlet } from 'react-router-dom'

function LandingLayout() {
  return (
    <div>
      <HeaderBuyer />
      <Outlet />
      <Footer />
    </div>
  )
}

export default LandingLayout
