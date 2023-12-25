import { OrderStatus } from 'modules/order'

function OrderStatusTag({ status }: { status: OrderStatus | undefined }) {
  switch (status) {
    case OrderStatus.COMPLETE:
      return (
        <span className='text-white border border-green-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 bg-green-800'>
          {OrderStatus.COMPLETE}
        </span>
      )
    case OrderStatus.PAID:
      return (
        <span className='text-white border-red-700 border font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 bg-red-800'>
          {OrderStatus.PAID}
        </span>
      )
    case OrderStatus.PENDING:
      return (
        <span className='text-white border border-gray-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 bg-gray-900'>
          {OrderStatus.PENDING}
        </span>
      )
    case OrderStatus.ACCEPT:
      return (
        <span className='text-white border border-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 bg-blue-800'>
          {OrderStatus.ACCEPT}
        </span>
      )
    case OrderStatus.BUYER_COMFIRM:
      return (
        <span className='text-white border border-yellow-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 bg-yellow-500'>
          {OrderStatus.BUYER_COMFIRM}
        </span>
      )
    case OrderStatus.SELLER_COMFIRM:
      return (
        <span className='text-white border border-lime-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 bg-lime-800'>
          {OrderStatus.SELLER_COMFIRM}
        </span>
      )
    case OrderStatus.ADMIN_COMFIRM:
      return (
        <span className='text-white border border-purple-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 bg-purple-800'>
          {OrderStatus.ADMIN_COMFIRM}
        </span>
      )
    default:
      return (
        <span className='text-white border border-orange-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 bg-orange-800'>
          {OrderStatus.CANCEL}
        </span>
      )
  }
}

export default OrderStatusTag
