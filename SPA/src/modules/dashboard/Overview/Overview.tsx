import Calendar, { TileArgs } from 'react-calendar'
import { useRef, useCallback, useEffect } from 'react'
import { AgGridReact } from 'ag-grid-react'

import { Card, Chart, ChartPlaceholder, ExportButton, Placeholder } from '_Home/components'
import { Grid } from '_Home/components/Grid/Grid'
import { SideBarLayout } from '_Home/layout/SideBarLayout'
import { generateColor, monthsForDropdown } from '_Home/common/utils'
import { useTourContext } from '_Home/routing/context'
import { dateRenderer } from '_Home/components/renderers/renderers'

import MoneyBagIcon from '_Images/moneybag.svg'
import { columnDefs, defaultColDef } from './constants'
import { useMoneyDash } from './hooks'
import styles from './Overview.module.styl'

export const Overview = () => {
  const { setState } = useTourContext()
  const gridRef = useRef<AgGridReact>(null)
  const {
    transactionList,
    categoryList,
    chartData,
    updateMonth,
    selectedMonth,
    currentDate,
    loading,
    errorMessage,
    transactions,
  } = useMoneyDash()
  const months = monthsForDropdown()

  const isTodayTileContent = ({ activeStartDate, date, view }: TileArgs) => {
    const currentDate = new Date()
    return view === 'month' && date.getDate() === currentDate.getDate() ? (
      <div className={styles.active_day}>
        <div />
      </div>
    ) : null
  }
  useEffect(() => {
    setState((prev) => ({
      ...prev,
      run: !localStorage.getItem('onboarding'),
      tourActive: !localStorage.getItem('onboarding'),
      stepIndex: 0,
    }))
  }, [])

  const onBtnExport = useCallback(() => {
    gridRef.current?.api.exportDataAsCsv()
  }, [])

  return (
    <SideBarLayout disableHide>
      <div className={styles.MoneyDash}>
        <div className={styles.title}>
          <div className={styles.overview} id="Overview">
            Overview
          </div>
          <div className={styles.months_selection}>
            <select value={selectedMonth.month() + 1} onChange={(e) => updateMonth(e.target.value)}>
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.expenses_overview}>
          <div className={styles.half_mini}>
            <Card className={styles.mini_card} title="This Month">
              <div className={styles.card_content}>
                {!loading &&
                  !errorMessage &&
                  transactions?.map((item) => (
                    <div className={styles.transactions_list} key={item.uuid}>
                      <div>
                        <div className={styles.moneybag} style={{ background: generateColor('c8') }}>
                          {/* {getFirstTwoLetters(item.description)} */}
                          {dateRenderer(item.createdAt, 'DD')}
                        </div>
                        <div className={styles.description}>
                          <div>{item.description}</div>
                          <div>{dateRenderer(item.createdAt)}</div>
                        </div>
                      </div>
                      <div className={item.source}>₦{item.amount}</div>
                    </div>
                  ))}
                {!loading && errorMessage && (
                  <div className={styles.error_message}> {errorMessage} </div>
                )}
                {loading &&
                  !errorMessage &&
                  Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <div className={styles.loading_div_two} key={i}>
                        <div className={styles.ge_placeholder}>
                          <Placeholder width="20%" height="50px" />
                          <Placeholder width="78%" height="50px" />
                        </div>
                        <Placeholder width="100px" height="50px" />
                      </div>
                    ))}
              </div>
            </Card>
            <Card className={styles.mini_card} title="This Month">
              <div className={styles.card_content}>
                {!loading &&
                  !errorMessage &&
                  transactions?.map((item) => (
                    <div className={styles.transactions_list} key={item.uuid}>
                      <div>
                        <div className={styles.moneybag} style={{ background: generateColor('c8') }}>
                          {/* {getFirstTwoLetters(item.description)} */}
                          {dateRenderer(item.createdAt, 'DD')}
                        </div>
                        <div className={styles.description}>
                          <div>{item.description}</div>
                          <div>{dateRenderer(item.createdAt)}</div>
                        </div>
                      </div>
                      <div className={item.source}>₦{item.amount}</div>
                    </div>
                  ))}
                {!loading && errorMessage && (
                  <div className={styles.error_message}> {errorMessage} </div>
                )}
                {loading &&
                  !errorMessage &&
                  Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <div className={styles.loading_div_two} key={i}>
                        <div className={styles.ge_placeholder}>
                          <Placeholder width="20%" height="50px" />
                          <Placeholder width="78%" height="50px" />
                        </div>
                        <Placeholder width="100px" height="50px" />
                      </div>
                    ))}
              </div>
            </Card>
          </div>

          <Card className={`${styles.card} ${styles.report_card}`} title="Reports">
            {loading && (
              <div className={styles.category_list}>
                <div className={styles.ge_placeholder}>
                  <Placeholder width="20%" height="50px" />
                  <Placeholder width="78%" height="50px" />
                </div>
                <ChartPlaceholder width="100%" height="150px" className={styles.chart} />
              </div>
            )}
            {!loading && (
              <div className={styles.category_data}>
                <div className={styles.category_list}>
                  {Object.entries(categoryList).map(([k, v]) => (
                    <div key={k} className={styles.category_item}>
                      <div className={styles.logo} style={{ background: generateColor('c8') }}>
                        <img src={MoneyBagIcon} alt="" />
                      </div>
                      <div className={styles.category_description}>
                        <div className={styles.category_money}>
                          <span>₦</span>
                          <span>{v}</span>
                        </div>
                        <small>{k}</small>
                      </div>
                    </div>
                  ))}
                </div>
                <Chart
                  data={chartData}
                  containerHeight={150}
                  margin={{
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                  }}
                  className={styles.chart}
                />
              </div>
            )}
          </Card>

          <Card className={styles.card} title="Calendar">
            <Calendar
              onClickMonth={updateMonth}
              tileContent={isTodayTileContent}
              tileClassName="tile"
              className={styles.calendar}
              value={currentDate}
            />
          </Card>
        </div>
        <div className={styles.todo_overview}></div>

        <div className={styles.money_transactions}>
          <ExportButton onClick={onBtnExport} classname={styles.export} />
          <Grid
            className={styles.grid}
            innerRef={gridRef}
            rowSelection={'multiple'}
            columnDefs={columnDefs}
            rowData={transactions}
            defaultColDef={defaultColDef}
            // overlayNoRowsTemplate={errorMessage}
            loadingOverlayComponent={<Placeholder width="500px" height="500px" />}
          />
        </div>
      </div>
    </SideBarLayout>
  )
}
