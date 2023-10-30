import React from 'react'
import { Modal } from '@mui/material'

interface IModalCustom {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  children: any
}

function ModalCustom({ open, setOpen, children }: IModalCustom) {
  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      {children}
    </Modal>
  )
}

export default ModalCustom
