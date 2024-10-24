import React from 'react'
import ClassNames from 'classnames'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

import styles from './Dropdown.module.styl'

interface DropdownProps extends DropdownMenu.DropdownMenuProps {
  trigger: ReactChildren
  items: { label?: string; child: ReactChildren }[]
  className?: string
  open?: boolean
  modal?: boolean
  side?: 'top' | 'right' | 'bottom' | 'left'
}

export const Dropdown = ({ trigger, items, className, open, modal, side = 'bottom' }: DropdownProps) => (
  <DropdownMenu.Root open={open} modal={modal}>
    <DropdownMenu.Trigger asChild>{trigger}</DropdownMenu.Trigger>

    <DropdownMenu.Portal>
      <DropdownMenu.Content className={ClassNames(styles.Content, className)} side={side}>
        {items.map((item, index) => (
          <React.Fragment key={`${item.label} ${index}`}>
            {item?.label && <DropdownMenu.Label>{item?.label}</DropdownMenu.Label>}
            <DropdownMenu.Item className={styles.Item}>{item.child}</DropdownMenu.Item>
          </React.Fragment>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  </DropdownMenu.Root>
)
