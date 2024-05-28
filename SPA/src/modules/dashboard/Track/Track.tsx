import { SideBarLayout } from '_Home/layout/SideBarLayout'
import { ROUTES } from '_Home/routing/routes'

import { Button, Input, Modal } from '_Home/components'

import Plus from '_Images/plus.svg?react'
import styles from './Track.module.styl'
import { useState } from 'react'

export const Track = () => {
  const [source, setSource] = useState<string>('debit')
  const handleTrackSubmit = () => {}
  const [showTrackModal, setShowTrackModal] = useState<boolean>()
  return (
    <SideBarLayout disableHide selectedKey={ROUTES.authenticatedRoutes.TRACK.key}>
      <div className={styles.Track}>
        <div className={styles.header}>
          <h2>Track Spending</h2>
          <Button
            className={styles.track_button}
            logo={<Plus fill="#fff" />}
            onClick={() => setShowTrackModal(true)}
          />
        </div>
      </div>

      <Modal
        className={styles.track_modal}
        isVisible={showTrackModal}
        width="md"
        handleClose={() => setShowTrackModal(false)}
      >
        <div>
          <h4>Track your Financials</h4>
          <p>Better finances, Better life</p>
          <form onSubmit={(e) => e.preventDefault()}>
            <div className={styles.input_group}>
              <Input type="text" name="amount" labelName="Source" />
              <div>Source</div>
              <div></div>
            </div>
            <div className={styles.input_group}>
              <Input type="number" name="amount" labelName="Amount" />
            </div>
            <div className={styles.input_group}>
              <Input type="text" name="amount" labelName="Category" />
            </div>
            <div className={styles.input_group}>
              <Input type="text" name="description" labelName="Write a note" />
            </div>
            <div className={styles.input_group}>
              <Input type="text" name="amount" labelName="Amount" />
            </div>
            <div className={styles.input_group}>
              <Input type="text" name="amount" labelName="Amount" />
            </div>
          </form>
        </div>
      </Modal>
    </SideBarLayout>
  )
}
