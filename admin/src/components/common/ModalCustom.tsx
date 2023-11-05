import React from 'react'
import { Dialog } from '@mui/material'

interface IModalCustom {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  children: any
  onCancel: () => void
}

function ModalCustom({ open, setOpen, children, onCancel }: IModalCustom) {
  const handleClose = () => {
    setOpen(false)
    onCancel()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      {children}
    </Dialog>
  )
}

export default ModalCustom
