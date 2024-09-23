import ClassNames from 'classnames'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

import styles from './Dropdown.module.styl'

interface DropdownProps {
  trigger: ReactChildren
  items: { label?: string; child: ReactChildren }[]
  className?: string
  open?: boolean
  modal?: boolean
}

export const Dropdown = ({ trigger, items, className, open, modal }: DropdownProps) => (
  <DropdownMenu.Root open={open} modal={modal}>
    <DropdownMenu.Trigger asChild>{trigger}</DropdownMenu.Trigger>

    <DropdownMenu.Portal>
      <DropdownMenu.Content className={ClassNames(styles.Content, className)}>
        {items.map((item) => (
          <>
            {item?.label && <DropdownMenu.Label>{item?.label}</DropdownMenu.Label>}
            <DropdownMenu.Item className={styles.Item}>{item.child}</DropdownMenu.Item>
          </>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  </DropdownMenu.Root>
)
