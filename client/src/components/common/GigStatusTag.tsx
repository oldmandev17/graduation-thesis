import { GigStatus } from 'modules/gig'

function GigStatusTag({ status }: { status: GigStatus | undefined }) {
  switch (status) {
    case GigStatus.ACTIVE:
      return (
        <span className='text-white border border-green-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 bg-green-800'>
          {GigStatus.ACTIVE}
        </span>
      )
    case GigStatus.BANNED:
      return (
        <span className='text-white border-red-700 border font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 bg-red-800'>
          {GigStatus.BANNED}
        </span>
      )
    case GigStatus.DELETED:
      return (
        <span className='text-white border border-gray-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 bg-gray-900'>
          {GigStatus.DELETED}
        </span>
      )
    case GigStatus.NONE:
      return (
        <span className='text-white border border-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 bg-blue-800'>
          {GigStatus.NONE}
        </span>
      )
    case GigStatus.WAITING:
      return (
        <span className='text-white border border-yellow-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 bg-yellow-500'>
          {GigStatus.WAITING}
        </span>
      )
    case GigStatus.INACTIVE:
      return (
        <span className='text-white border border-purple-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 bg-purple-800'>
          {GigStatus.INACTIVE}
        </span>
      )
    default:
      return null
  }
}

export default GigStatusTag
