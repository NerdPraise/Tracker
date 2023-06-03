import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { debounce } from 'lodash'
import { CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, Tooltip, XAxis } from 'recharts'
import moment from 'moment'

import { ROUTES } from '_Home/routes'
import { StatusCode, censorWord, generateColor, getFirstTwoLetters, isFormValid } from '_Home/utils'

import { createUserCategory, getAllCategories } from './redux/actions'
import { Button, Chart, Divider, Input } from '_Home/components'
import { useUser } from '_Home/hooks/userHooks'
import { Layout } from '../layout'
import styles from './Budget.styl'
import { Modal } from '_Home/components/Modal/Modal'

export const data02 = [
  { name: 'Group B', value: 500 },
  { name: 'Group A', value: 2400 },
]

const COLOR_01 = ['#FFFFFF', '#0088FE']
const COLOR_02 = ['#FFFFFF', '#008800']

export const Budget = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [formError, setFormError] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { transactions, loading, totalSpent, monthlyIncome, Budget } = useSelector(
    (state) => state.budget,
  )
  const { categories, errorMessage, statusCode } = useSelector((state) => state.categories)
  const formRef = useRef(null)
  const { user } = useUser()
  const dispatch = useDispatch()
  const debouncedCreateCategory = (values) => debounce(createUserCategory(values), 1500)

  useEffect(() => {
    dispatch(getAllCategories())
  }, [])

  useEffect(() => {
    if (statusCode === StatusCode.CREATED) {
      setIsVisible(false)
      setIsSubmitting(false)
    }
  }, [statusCode])

  const chartData = transactions?.map((trans) => ({
    amount: trans.amount,
    created: moment(trans.createdAt).format('ddd D'),
  }))

  const budgetLimit = [{ value: totalSpent > Budget ? 0 : Budget - totalSpent }, { value: totalSpent }]
  const incomeLimit = [
    { value: totalSpent > monthlyIncome ? 0 : monthlyIncome - totalSpent },
    { value: totalSpent },
  ]

  const onSubmit = () => {
    setIsSubmitting(true)
    const form = formRef.current

    const {
      name: { value: name },
      maxSpend: { value: maxSpend },
    } = form.elements

    const userCategory = {
      name,
      maxSpend,
    }

    dispatch(debouncedCreateCategory(userCategory))
  }

  const validateMaxSpend = () => {
    const form = formRef.current
    const {
      maxSpend: { value: maxSpend },
    } = form.elements
    if (maxSpend <= 100) {
      return 'Maximum spend should be higher than 100'
    }
    return ''
  }

  const customChart = () => (
    <LineChart data={chartData}>
      <CartesianGrid strokeDasharray="3 3" stroke="#44494c" />
      <Tooltip />
      <Legend />
      <XAxis dataKey="created" />
      <Line
        type="monotone"
        dot={{ stroke: '#cc751966', strokeWidth: 2 }}
        dataKey="amount"
        strokeWidth={3}
        stroke="#cc751966"
        activeDot={{ r: 8 }}
      />
    </LineChart>
  )
  const budgetBarChart = (data, COLOR) => (
    <PieChart margin={{ top: 0, left: 0, right: 0, bottom: 0 }}>
      <Pie
        dataKey="value"
        data={data}
        cx={20}
        cy={25}
        isAnimationActive={false}
        innerRadius={9}
        outerRadius={18}
        fill="#8884d8"
        stroke="#1f2325"
        paddingAngle={5}
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={COLOR[index % COLOR.length]} />
        ))}
      </Pie>
    </PieChart>
  )

  const extraContent = (
    <div className={styles.extraContent}>
      <div className="header">
        <div className="username">{getFirstTwoLetters(user?.username)}</div>
        <div>
          <div className="greeting"> Hello, </div>
          <div>{user?.username}</div>
        </div>
      </div>
      <Divider className="" />
      <div className="budget-data">
        <div className="title">Budget Info</div>
        <div className="limit">
          <Chart
            customChart={() => budgetBarChart(budgetLimit, COLOR_01)}
            containerHeight={50}
            containerWidth={50}
            className={styles.customChart}
          />
          <div>
            <div>Budget Limit </div>
            <div>
              {totalSpent} / {Budget}
            </div>
          </div>
        </div>
        <div className="limit">
          <Chart
            customChart={() => budgetBarChart(incomeLimit, COLOR_02)}
            containerHeight={50}
            containerWidth={50}
            className={styles.customChart}
          />
          <div>
            <div>Income Limit </div>
            <div>
              {totalSpent} / {monthlyIncome}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <Layout selectedKey={ROUTES.BUDGET.key} disableHide extraContent={extraContent}>
      <div className={styles.Budget}>
        <div className="header-date">
          <div className="date">
            <div>Date</div>
            <div>{moment().format('LL')}</div>
          </div>
          <div className="currency">
            <div>Currency</div>
            <div>Nigerian Naira</div>
          </div>
        </div>

        <Divider className={styles.divider} />

        <div className="header-cont">
          <div className="latest-trans">Latest Transactions</div>
          <div className="currency">
            <Button
              onClick={() => setIsVisible(true)}
              text={`Add to ${moment().format('MMM')}'s Budget`}
              className="add-button"
            />
          </div>
        </div>
        <div className="container-transactions">
          {!loading &&
            !errorMessage &&
            !!transactions?.length &&
            transactions?.map((trans) => (
              <div className="row" key={trans.id}>
                <div className="image-text" style={{ backgroundColor: generateColor('66') }}>
                  {getFirstTwoLetters(trans.description)}
                </div>
                <div className="description-obj">
                  <div className="description">{trans.description}</div>
                  <div className="source">{trans.source}</div>
                </div>
                <div className="uuid">{censorWord(trans.uuid)}</div>
                <div className="amount">₦{trans.amount.toLocaleString()}</div>
              </div>
            ))}
        </div>
        <div>
          {categories?.map((category) => {
            return (
              <div>
                {category.name}: {category.max_spend}
              </div>
            )
          })}
        </div>
        <div className="statstics-chart">
          <div className="stats">
            <div className="stats-title">Statistics</div>
            <div className="currency">
              <button>Add + </button>
            </div>
          </div>
          <div className="chart">
            <Chart customChart={customChart} containerHeight={300} className={styles.customChart} />
          </div>
        </div>

        <Modal
          isVisible={isVisible}
          width="md"
          handleClose={() => setIsVisible(false)}
          className={styles.BudgetModal}
        >
          <h2>Add to Budget</h2>
          {!!errorMessage && (
            <div className="error-message" dangerouslySetInnerHTML={{ __html: errorMessage }} />
          )}
          <form ref={formRef} onSubmit={(e) => e.preventDefault()}>
            <Input type="text" error={formError} setError={setFormError} labelName="Name" name="name" />
            <Input
              name="maxSpend"
              error={formError}
              setError={setFormError}
              type="number"
              customValidation={validateMaxSpend}
              labelName="Maximum spend"
            />
            <Button
              loading={isSubmitting}
              className="budget-button"
              disabled={isSubmitting || Object.keys(formError).length || !isFormValid(formRef)}
              onClick={onSubmit}
              text="Add Category"
            />
          </form>
        </Modal>
      </div>
    </Layout>
  )
}
