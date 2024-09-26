import * as Tooltip from '@radix-ui/react-tooltip'
import { Info } from 'lucide-react'

import styles from './HelpToolTip.module.styl'

interface HelpToolTipProps {
  helpMessage: ReactChildren
  delay?: number
}

export const HelpToolTip = ({ helpMessage, delay }: HelpToolTipProps) => {
  return (
    <Tooltip.Provider delayDuration={delay}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <Info size={15} stroke="#5c5b5b" className={styles.info} />
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content className={styles.Content} sideOffset={5}>
            {helpMessage}
            <Tooltip.Arrow className={styles.Arrow} />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}
