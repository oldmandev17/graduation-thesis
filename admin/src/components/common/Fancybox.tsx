/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/require-default-props */
import { PropsWithChildren, useEffect, useRef } from 'react'

import { Fancybox as NativeFancybox } from '@fancyapps/ui'
import '@fancyapps/ui/dist/fancybox/fancybox.css'

import type { OptionsType } from '@fancyapps/ui/types/Fancybox/options'

interface Props {
  delegate?: string
  options?: Partial<OptionsType>
}

function Fancybox(props: PropsWithChildren<Props>) {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current

    const delegate = props.delegate || '[data-fancybox]'
    const options = props.options || {}

    NativeFancybox.bind(container, delegate, options)

    return () => {
      NativeFancybox.unbind(container)
      NativeFancybox.close()
    }
  })

  return <div ref={containerRef}>{props.children}</div>
}

export default Fancybox
