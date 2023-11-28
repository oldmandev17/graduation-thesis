import { ChangeEventHandler, ReactNode } from 'react'
import ReactDOM from 'react-dom'

function PhotoPicker({ onChange }: { onChange: ChangeEventHandler<HTMLInputElement> }) {
  const component: ReactNode = <input type='file' hidden id='photo-picker' onChange={onChange} />

  return ReactDOM.createPortal(component, document.getElementById('photo-picker-element') as HTMLElement)
}

export default PhotoPicker
