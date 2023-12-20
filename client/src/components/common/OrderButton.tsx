import React, { ReactNode } from 'react'

function OrderButton({ children }: { children: ReactNode }) {
  return (
    <>
      <button type='button'>{children}</button>
    </>
  )
}

export default OrderButton
