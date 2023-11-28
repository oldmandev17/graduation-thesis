/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useEffect, useRef } from 'react'

function ContextMenu({
  options,
  cordinates,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  contextMenu,
  setContextMenu
}: {
  options: { name: string; callback: Function }[]
  cordinates: { x: number; y: number }
  contextMenu: any
  setContextMenu: any
}) {
  const contextMenuRef = useRef<any>(null)

  useEffect(() => {
    const handleOutsideClick = (event: any) => {
      if (event.target.id !== 'context-opener') {
        if (contextMenuRef.current && !contextMenuRef.current.contains(event.target)) {
          setContextMenu(false)
        }
      }
    }

    document.addEventListener('click', handleOutsideClick)

    return () => {
      document.removeEventListener('click', handleOutsideClick)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleClick = (e: any, callback: Function) => {
    e.stopPropagation()
    setContextMenu(false)
    callback()
  }

  return (
    <div
      className='bg-dropdown-background fixed py-2 z-[100] shadow-xl'
      ref={contextMenuRef}
      style={{
        top: cordinates.y,
        left: cordinates.x
      }}
    >
      <ul>
        {options.map(({ name, callback }) => (
          <li
            key={name}
            onClick={(e: any) => handleClick(e, callback)}
            className='px-5 py-2 cursor-pointer hover:bg-background-default-hover'
          >
            <span className='text-white'>{name}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default ContextMenu
