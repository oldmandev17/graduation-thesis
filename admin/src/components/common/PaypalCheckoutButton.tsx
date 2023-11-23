import { PayPalButtons } from '@paypal/react-paypal-js'
// import { IGig, Package } from 'modules/gig'
import React from 'react'

// { gig, parcel }: { gig: IGig; parcel: Package }

function PaypalCheckoutButton() {
  const handleApprove = (orderId: string) => {
    console.log('🚀 ~ file: PaypalCheckoutButton.tsx:9 ~ handleApprove ~ orderId:', orderId)
  }

  return (
    <PayPalButtons
      style={{
        color: 'silver',
        layout: 'horizontal',
        height: 48,
        tagline: false,
        shape: 'pill'
      }}
      //   onClick={(data, actions) => {
      //     if (!gig || !parcel) {
      //       return actions.reject()
      //     }
      //     return actions.resolve()
      //   }}
      createOrder={(data, actions) => {
        return actions.order.create({
          purchase_units: [
            {
              amount: {
                // value: String(parcel.price)
                value: '10'
              }
            }
          ]
        })
      }}
      onApprove={async (data, actions) => {
        const order = await actions.order?.capture()
        console.log('🚀 ~ file: PaypalCheckoutButton.tsx:36 ~ onApprove={ ~ order:', order)
        handleApprove(data.orderID)
      }}
      onCancel={() => {
        // Display cancel message, modal or redirect user to cancel page or back to cart
      }}
      onError={(err) => {
        console.log('🚀 ~ file: PaypalCheckoutButton.tsx:46 ~ onApprove={ ~ err:', err)
      }}
    />
  )
}

export default PaypalCheckoutButton
