import React from 'react'
import { Pill } from './Pill'

import styles from './Pill.module.styl'

interface PillListProps {
  value: {
    label: string
    value: string
  }[]
  onClick: (e: string) => void
  selectedPills: string[]
}

const UnMemoizedPillList = ({ value, onClick, selectedPills }: PillListProps) => {
  return (
    <div className={styles.PillList}>
      {value.map((item) => (
        <Pill
          label={item.label}
          click={() => onClick(item.value)}
          key={item.label}
          selected={selectedPills.includes(item.value)}
        />
      ))}
    </div>
  )
}

export const PillList = React.memo(UnMemoizedPillList)
