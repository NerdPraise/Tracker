import Calendar, { TileArgs } from 'react-calendar'
import { useRef, useCallback, useEffect } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { useAppDispatch, useAppSelector } from '_Home/common/hooks'

import { Card, Chart, ChartPlaceholder, ExportButton, Placeholder, Spacer } from '_Home/components'
import { Grid } from '_Home/components/Grid/Grid'
import { SideBarLayout } from '_Home/layout/SideBarLayout'
import { generateColor, monthsForDropdown } from '_Home/common/utils'
import { useTourContext } from '_Home/routing/context'
import { getOverviewData } from './redux/actions'

import MoneyBagIcon from '_Images/moneybag.svg'
import { columnDefs, defaultColDef } from './constants'
import { useDash } from './hooks'
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
    loading: moneyTrackerLoading,
    errorMessage,
    transactions,
  } = useDash()
  const months = monthsForDropdown()
  const dispatch = useAppDispatch()
  const {
    overview: { data, loading: overviewLoading },
  } = useAppSelector((state) => state.moneyTrack)

  const loading = moneyTrackerLoading || overviewLoading

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
    dispatch(getOverviewData())
  }, [])

  const onBtnExport = useCallback(() => {
    gridRef.current?.api.exportDataAsCsv()
  }, [])

  return (
    <SideBarLayout disableHide>
      <div className={styles.MoneyDash}>
        <div className={styles.title}>
          <div className="text-3xl font-semibold" id="Overview">
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
            <Card className={styles.mini_card} title="Recent Activity">
              <div className={styles.card_content}>
                {!loading && (
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <h3 className="text-gray-500">Invoices Sent</h3>
                      <p className="text-xl font-bold">{data?.recentActivity.invoicesSent}</p>
                    </div>
                    <div>
                      <h3 className="text-gray-500">Invoices Paid</h3>
                      <p className="text-xl font-bold">{data?.recentActivity.invoicesPaid}</p>
                    </div>
                    <div>
                      <h3 className="text-gray-500">New Clients</h3>
                      <p className="text-xl font-bold">{data?.recentActivity.newClients}</p>
                    </div>
                  </div>
                )}
                {loading && (
                  <div className={styles.loading_div_two}>
                    <div className={styles.ge_placeholder}>
                      <Placeholder width="100%" height="100px" />
                    </div>
                  </div>
                )}
              </div>
            </Card>
            <div className={styles.half_card}>
              <Card className={styles.quarter_card} title="Sent Invoices">
                <div className={styles.card_content}>
                  {!loading && !errorMessage && (
                    <div className={styles.number}>{data?.recentActivity.invoicesSent}</div>
                  )}
                  {!loading && errorMessage && (
                    <div className={styles.error_message}> {errorMessage} </div>
                  )}
                  {loading &&
                    !errorMessage &&
                    Array(3)
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
              <Card className={styles.quarter_card} title="Draft Invoices">
                <div className={styles.card_content}>
                  {!loading && !errorMessage && (
                    <div className={styles.number}>{data?.invoiceStats.draft}</div>
                  )}
                  {!loading && errorMessage && (
                    <div className={styles.error_message}> {errorMessage} </div>
                  )}
                  {loading &&
                    !errorMessage &&
                    Array(3)
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
          </div>

          <Card className={`${styles.card} ${styles.report_card}`} title="Reports">
            {loading && (
              <div className={styles.category_list}>
                <div className={styles.ge_placeholder}>
                  <Placeholder width="20%" height="50px" />
                  <Placeholder width="78%" height="50px" />
                  <ChartPlaceholder width="100%" height="150px" className={styles.chart} />
                </div>
              </div>
            )}
            {!loading && (
              <div className={styles.category_data}>
                <div className={styles.category_list}>
                  {Object.entries(categoryList).map(([k, v]) => (
                    <div key={k} className={styles.category_item}>
                      <div className={styles.logo} style={{ background: generateColor('c8') }}>
                        <img id="full" src={MoneyBagIcon} alt="" />
                      </div>
                      <div className={styles.category_description}>
                        <div className={styles.category_money}>
                          <span>{data?.currency}</span>
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
        {/* Overview Stats Section */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <h3 className="text-gray-500">Total Invoices</h3>
            <p className="text-2xl font-bold">{data?.invoiceStats.total || 0}</p>
          </Card>
          <Card className="p-4">
            <h3 className="text-gray-500">Pending Revenue</h3>
            <p className="text-2xl font-bold">
              {data?.currency} {data?.financialStats.pendingRevenue?.toLocaleString() || 0}
            </p>
          </Card>
          <Card className="p-4">
            <h3 className="text-gray-500">Total Revenue</h3>
            <p className="text-2xl font-bold">
              {data?.currency} {data?.financialStats.totalRevenue?.toLocaleString() || 0}
            </p>
          </Card>
          <Card className="p-4">
            <h3 className="text-gray-500">Active Clients</h3>
            <p className="text-2xl font-bold">{data?.clientStats.activeClients || 0}</p>
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
          <Spacer />
        </div>
      </div>
    </SideBarLayout>
  )
}
