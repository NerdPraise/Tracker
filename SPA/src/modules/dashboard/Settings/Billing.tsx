import * as RadioGroup from '@radix-ui/react-radio-group'
import { useState } from 'react'
import { Info } from 'lucide-react'

import { useUser, useAppSelector } from '_Home/common/hooks'
import { Button, Input, Grid, HelpToolTip } from '_Home/components'

import styles from './Settings.module.styl'
import { noRowRenderer } from '_Home/components/Grid/renderer'

const Billing = () => {
  const { user } = useUser()
  const { userTransaction } = useAppSelector((state) => state.settings)
  const [disableCardDeets, setDisableCardDeets] = useState<boolean>(true)

  return (
    <div className={styles.Billing}>
      <div className={styles.payment_method}>
        <p>Payment Method</p>
        <p>Update your billing details and address</p>
      </div>

      <div className={styles.card_details}>
        <div className={styles.card_details_text}>
          <p>Card Details</p>
          <p>Update your billing details and address</p>
          <Button onClick={() => setDisableCardDeets(false)} text="Update card details" />
        </div>
        <div className={styles.card_details_deet}>
          <div>
            <Input
              className={styles.input}
              disabled={disableCardDeets}
              defaultValue={user?.cardName}
              type="text"
              name="cardName"
              labelName="Name on your card"
            />
            <Input
              className={styles.input}
              disabled={disableCardDeets}
              defaultValue={user?.cardNumber}
              type="text"
              name="cardNumber"
              labelName="Card Number"
            />
          </div>
          <div>
            <Input
              className={styles.input}
              disabled={disableCardDeets}
              defaultValue={user?.expiryDate}
              type="text"
              name="expiry"
              maxlength={5}
              labelName="Expiry"
            />
            <Input
              className={styles.input}
              disabled={disableCardDeets}
              defaultValue="***"
              type="password"
              name="cvv"
              labelName="CVV"
              maxlength={4}
            />
          </div>
        </div>
      </div>
      <div className={styles.card_details}>
        <div className={styles.card_details_text}>
          <p>Contact email</p>
          <p>Where should all your subscription receipt be sent to?</p>
        </div>
        <div className={styles.card_details_deet}>
          <RadioGroup.Root
            className={styles.RadioGroupRoot}
            defaultValue="default"
            aria-label="View density"
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
              <RadioGroup.Item className={styles.RadioGroupItem} value="default">
                <RadioGroup.Indicator className={styles.RadioGroupIndicator} />
              </RadioGroup.Item>
              <label className={styles.Label}>
                <div>
                  <p>Send to the existing email</p>
                  <small>{user?.email}</small>
                </div>
                <HelpToolTip delay={0} helpMessage="To change, upgrade to a paid plan" />
              </label>
            </div>
            {user.subscription.toLowerCase() !== 'free' && (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <RadioGroup.Item className={styles.RadioGroupItem} value="comfortable">
                  <RadioGroup.Indicator className={styles.RadioGroupIndicator} />
                </RadioGroup.Item>
                <label className={styles.Label}>Add a new email </label>
              </div>
            )}
          </RadioGroup.Root>
        </div>
      </div>

      <div className={styles.card_details}>
        <div className={styles.card_details_text}>
          <p>Billing Address</p>
          <p>Where should all your subscription receipt be sent to?</p>
        </div>
        <div className={styles.card_details_deet}>
          <Input
            className={styles.input}
            type="text"
            name="billingAddress"
            labelName="Billing Address"
          />
          <Input className={styles.input} type="text" name="billingCity" labelName="City" />
          <Input className={styles.input} type="text" name="billingCountry" labelName="Country" />
        </div>
      </div>

      <div className={styles.previous_payments}>
        <h3>Previous Payments</h3>
        <div className={styles.grid}>
          <Grid
            className={`${styles.grid} ag-theme-customtracker`}
            columnDefs={[
              {
                headerName: 'Name',
                valueFormatter: (params) => `Payment ${params.node.rowIndex + 1}`,
                flex: 1,
              },
              {
                headerName: 'Date',
                field: 'date',
                // TODO format by user date_format
                valueFormatter: (params) => {
                  return new Intl.DateTimeFormat('en-GB', {
                    dateStyle: 'long',
                  }).format(new Date(params.value))
                },
              },
              {
                headerName: 'Plan',
                field: 'plan',
                valueFormatter: (params) => `${user.subscription} plan`,
              },
              {
                headerName: 'amount',
                field: 'amount',
                valueFormatter: (params) => `USD $${params.data.amount}`,
              },
            ]}
            rowData={userTransaction.userTransactions}
            defaultColDef={{ sortable: true }}
            overlayNoRowsTemplate={noRowRenderer(`payments`)}
          />
        </div>
      </div>
    </div>
  )
}
export default Billing
