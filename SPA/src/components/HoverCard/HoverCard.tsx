import React from 'react'
import ClassNames from 'classnames'
import * as HoverCardRadix from '@radix-ui/react-hover-card'

import styles from './HoverCard.module.styl'

interface HoverCardProps extends HoverCardRadix.HoverCardProps {
  trigger: ReactChildren
  item: ReactChildren
  className?: string
  open?: boolean
  side?: 'top' | 'right' | 'bottom' | 'left'
  sideOffset?: number
}

export const HoverCard = ({
  trigger,
  item,
  className,
  open,
  side = 'bottom',
  sideOffset,
}: HoverCardProps) => (
  <HoverCardRadix.Root open={open} openDelay={0}>
    <HoverCardRadix.Trigger asChild>{trigger}</HoverCardRadix.Trigger>

    <HoverCardRadix.Portal>
      <HoverCardRadix.Content
        className={ClassNames(styles.Content, className)}
        side={side}
        sideOffset={sideOffset}
        onInteractOutside={(e) => e.preventDefault()}
      >
        {item}
      </HoverCardRadix.Content>
    </HoverCardRadix.Portal>
  </HoverCardRadix.Root>
)
