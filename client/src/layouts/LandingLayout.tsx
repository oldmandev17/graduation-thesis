import React from 'react'
import Footer from 'components/Footer'
import HeaderBuyer from 'components/buyer/HeaderBuyer'
import { Outlet } from 'react-router-dom'
import { useAppSelector } from 'stores/hooks'
import HeaderBasic from 'components/HeaderBasic'

function LandingLayout() {
  const { user } = useAppSelector((state) => state.auth)

  return (
    <div>
      {user ? <HeaderBuyer /> : <HeaderBasic />}
      <Outlet />
      <Footer />
    </div>
  )
}

export default LandingLayout
