import { forwardRef } from 'react'

import { BaseWidget } from './BaseWidget'

export const TextWidget = forwardRef((props, ref) => {
  return <BaseWidget {...props} gridRef={ref} />
})
