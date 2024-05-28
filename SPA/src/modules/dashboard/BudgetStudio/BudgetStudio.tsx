import { useCallback, useEffect, useRef, useState } from 'react'
import { debounce } from 'lodash'
// import { CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, Tooltip, XAxis } from 'recharts'
import moment from 'moment'

import { SideBarLayout } from '_Home/layout/SideBarLayout'

import { ROUTES } from '_Home/routing/routes'
import {
  StatusCode,
  censorWord,
  generateColor,
  getFirstTwoLetters,
  isFormValid,
} from '_Home/common/utils'
import { Button, Chart, Divider, Input, Modal, PillList, Pill } from '_Home/components'
import { useUser, useAppSelector, useAppDispatch } from '_Home/common/hooks'

import { createUserCategory, getAllCategories } from './redux/actions'
import styles from './BudgetStudio.module.styl'

export const data02 = [
  { name: 'Group B', value: 500 },
  { name: 'Group A', value: 2400 },
]

const COLOR_01 = ['#FFFFFF', '#0088FE']
const COLOR_02 = ['#FFFFFF', '#008800']

export const BudgetStudio = () => {
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [formError, setFormError] = useState({})
  const [isFormSubmitting, setIsFormSubmitting] = useState(false)
  const { transactions, loading, totalSpent, monthlyIncome, budgetAmount } = useAppSelector(
    (state) => state.budget,
  )
  const { categories, errorMessage, statusCode } = useAppSelector((state) => state.categories)
  const dispatch = useAppDispatch()
  const formRef = useRef<HTMLFormElement>(null)
  const { user } = useUser()
  const [selectedPills, setSelectedPills] = useState<string[]>([])

  const debouncedCreateCategory = (values: FormData) => debounce(createUserCategory(values), 1500)

  useEffect(() => {
    dispatch(getAllCategories())
  }, [])

  useEffect(() => {
    if (statusCode === StatusCode.CREATED) {
      setIsModalVisible(false)
      setIsFormSubmitting(false)
    }
  }, [statusCode])

  const chartData = transactions?.map((trans) => ({
    amount: trans.amount,
    created: moment(trans.createdAt).format('ddd D'),
  }))

  const budgetLimit = [
    { value: totalSpent > budgetAmount ? 0 : budgetAmount - totalSpent },
    { value: totalSpent },
  ]
  const incomeLimit = [
    { value: totalSpent > monthlyIncome ? 0 : monthlyIncome - totalSpent },
    { value: totalSpent },
  ]

  const onSubmit = () => {
    setIsFormSubmitting(true)
    const form = formRef.current
    const formData = new FormData(form)

    dispatch(debouncedCreateCategory(formData))
  }
  const handlePillClick = useCallback(
    (value) =>
      setSelectedPills((prev) =>
        prev.includes(value) ? prev.filter((item) => item != value) : prev.concat(value),
      ),
    [selectedPills],
  )

  const validateMaxSpend = () => {
    const form = formRef.current
    const maxSpend = (form.elements.namedItem('maxSpend') as HTMLInputElement).value
    if (parseInt(maxSpend) <= 100) {
      return 'Maximum spend should be higher than 100'
    }
    return ''
  }

  // const customChart = () => (
  //   <LineChart data={chartData}>
  //     <CartesianGrid strokeDasharray="3 3" stroke="#44494c" />
  //     <Tooltip />
  //     <Legend />
  //     <XAxis dataKey="created" />
  //     <Line
  //       type="monotone"
  //       dot={{ stroke: '#cc751966', strokeWidth: 2 }}
  //       dataKey="amount"
  //       strokeWidth={3}
  //       stroke="#cc751966"
  //       activeDot={{ r: 8 }}
  //     />
  //   </LineChart>
  // )
  // const budgetBarChart = (data, COLOR) => (
  //   <PieChart margin={{ top: 0, left: 0, right: 0, bottom: 0 }}>
  //     <Pie
  //       dataKey="value"
  //       data={data}
  //       cx={20}
  //       cy={25}
  //       isAnimationActive={false}
  //       innerRadius={9}
  //       outerRadius={18}
  //       fill="#8884d8"
  //       stroke="#1f2325"
  //       paddingAngle={5}
  //     >
  //       {data.map((entry, index) => (
  //         <Cell key={`cell-${index}`} fill={COLOR[index % COLOR.length]} />
  //       ))}
  //     </Pie>
  //   </PieChart>
  // )

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
          {/* <Chart
            customChart={() => budgetBarChart(budgetLimit, COLOR_01)}
            containerHeight={50}
            containerWidth={50}
            className={styles.customChart}
          /> */}
          <div>
            <div>Budget Limit </div>
            <div>
              {totalSpent} / {budgetAmount}
            </div>
          </div>
        </div>
        <div className="limit">
          {/* <Chart
            customChart={() => budgetBarChart(incomeLimit, COLOR_02)}
            containerHeight={50}
            containerWidth={50}
            className={styles.customChart}
          /> */}
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
    <SideBarLayout
      selectedKey={ROUTES.authenticatedRoutes.BUDGET.key}
      disableHide
      extraContent={extraContent}
    >
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
              onClick={() => setIsModalVisible(true)}
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
            {/* <Chart customChart={customChart} containerHeight={300} className={styles.customChart} /> */}
          </div>
        </div>

        <Modal
          isVisible={isModalVisible}
          width="md"
          handleClose={() => setIsModalVisible(false)}
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
            <div className={styles.pills}>
              <PillList
                value={categories?.map((item) => ({ label: item.name, value: item.id }))}
                selectedPills={selectedPills}
                onClick={handlePillClick}
              />
              <Pill label="Add Category" className={styles.category_add} click={() => 'd'} />
            </div>

            <Button
              loading={isFormSubmitting}
              className={styles.budget_button}
              disabled={isFormSubmitting || !!Object.keys(formError).length || !isFormValid(formRef)}
              onClick={onSubmit}
              text="Add Category"
            />
          </form>
        </Modal>
      </div>
    </SideBarLayout>
  )
}
