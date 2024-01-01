function SellerTag({ total }: { total: number }) {
  if (total <= 5)
    return <span className='px-1.5 py-1 text-sm font-medium text-gray-800 bg-gray-100 rounded'>Starting Seller</span>
  if (total > 5 && total <= 10)
    return <span className='px-1.5 py-1 text-sm font-medium text-blue-800 bg-blue-100 rounded '>Level 1</span>
  if (total > 10 && total <= 15)
    return <span className='px-1.5 py-1 text-sm font-medium text-pink-800 bg-pink-100 rounded '>Level 2</span>
  if (total > 15)
    return <span className='px-1.5 py-1 text-sm font-medium text-yellow-800 bg-yellow-100 rounded '>Best Seller</span>
  return null
}

export default SellerTag
