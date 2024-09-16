import { CircleCheckBig } from 'lucide-react'
import { useEffect } from 'react'
import PaystackPop from '@paystack/inline-js'

import { Button } from '_Home/components'
import { useAppDispatch, useUser } from '_Home/common/hooks'

import { plans } from '_Home/constants'
import { getUserTransactions, updateTransaction } from './redux/actions'
import styles from './Settings.module.styl'

const Subscription = () => {
  const dispatch = useAppDispatch()
  const { user } = useUser()

  const handlePlanClick = (obj: (typeof plans)[0]) => {
    const popup = new PaystackPop()
    let paymentObj: object = {
      key: import.meta.env.VITE_PAYSTACK_PK,
      email: user?.email,
      amount: obj.price,
      onSuccess: (transaction) => {
        dispatch(updateTransaction({ ...transaction, amount: obj.price }))
      },
    }
    if (obj.name === 'Premium') {
      paymentObj = { ...paymentObj, planInterval: 'monthly' }
    }
    popup.newTransaction(paymentObj)
  }

  useEffect(() => {
    dispatch(getUserTransactions())
  }, [])

  return (
    <div className={styles.Subscription}>
      <div className={styles.plans}>
        {plans.map((item) => (
          <div className={item.name.toLowerCase() === user?.subscription.toLowerCase() && styles.active}>
            <div className={styles.dheader}>
              <p>{item.name}</p>
              <p>${item.price}/m</p>
            </div>
            <div className={styles.list_container}>
              {item.offers.map((offer) => (
                <div className={styles.list_item}>
                  <CircleCheckBig />
                  {offer}
                </div>
              ))}
            </div>
            <Button
              onClick={
                item.name.toLowerCase() === user?.subscription.toLowerCase()
                  ? null
                  : () => handlePlanClick(item)
              }
              text={
                item.name.toLowerCase() === user?.subscription.toLowerCase()
                  ? 'Current Plan'
                  : 'Switch to this plan'
              }
            />
          </div>
        ))}
      </div>
      {/* <Modal
        className={styles.ModalSubscription}
        isVisible={showBilling}
        width="md"
        handleClose={() => setShowBilling(false)}
      >
        {!user?.cardNumber && (
          <div className={styles.payment}>
            <form id="payment-form" onSubmit={(e) => e.preventDefault()}>
              <Input type="text" labelName="Name on Card" placeholder="John Doe" name="card_name" />
              <label htmlFor="card-number"></label>
              <Input
                type="text"
                labelName="Card Number"
                placeholder="1234 5678 9012 3456"
                name="card_number"
              />
              <Input
                type="text"
                labelName="Expiration Date (MM/YY)"
                placeholder="MM/YY"
                name="expiry_date"
              />
              <Input type="text" labelName="CVV" placeholder="123" name="cvv" />
              <Button onClick={null} text="Pay" />
            </form>
          </div>
        )}
        {user?.cardNumber && (
          <div className={styles.has_card_details}>
            <div className={styles.header}>Payment for the {selectedPlan} plan</div>
            <p>Continue payment with existing card {user.cardNumber}?</p>
            <Button text="Pay" onClick={null} />
          </div>
        )}
      </Modal> */}
    </div>
  )
}
export default Subscription
