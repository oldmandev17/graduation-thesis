import { MessageStatus as Status } from 'modules/message'
import React from 'react'
import { BsCheck, BsCheckAll } from 'react-icons/bs'

function MessageStatus({ status }: { status: Status }) {
  return (
    <>
      {status === Status.SENT && <BsCheck className='text-lg' />}
      {status === Status.DELIVERED && <BsCheckAll className='text-lg' />}
      {status === Status.READ && <BsCheckAll className='text-lg text-icon-ack' />}
    </>
  )
}

export default MessageStatus
