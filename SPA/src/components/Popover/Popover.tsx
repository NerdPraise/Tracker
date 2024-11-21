import { memo } from 'react'
import ClassNames from 'classnames'
import * as PopoverRadix from '@radix-ui/react-popover'

import styles from './Popover.module.styl'

interface PopoverProps extends PopoverRadix.PopoverProps {
  trigger: ReactChildren
  item: ReactChildren
  className?: string
  open?: boolean
  side?: 'top' | 'right' | 'bottom' | 'left'
  sideOffset?: number
}

export const Popover = memo(
  ({ trigger, item, className, open, side = 'top', sideOffset }: PopoverProps) => (
    <PopoverRadix.Root open={open}>
      <PopoverRadix.Trigger asChild>{trigger}</PopoverRadix.Trigger>
      <PopoverRadix.Portal>
        <PopoverRadix.Content
          className={ClassNames(styles.Content, className)}
          sideOffset={sideOffset}
          side={side}
        >
          {item}
        </PopoverRadix.Content>
      </PopoverRadix.Portal>
    </PopoverRadix.Root>
  ),
)
