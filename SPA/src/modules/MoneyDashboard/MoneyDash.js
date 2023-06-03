import monthsForDropdown from 'months-list'
import Calendar from 'react-calendar'

import { Card, Chart, ChartPlaceholder, Placeholder } from '_Home/components'
import { Grid } from '_Home/components/Grid/Grid'
import { Layout } from '_Home/modules/layout'
import { ROUTES } from '_Home/routes'

import { columnDefs, defaultColDef } from './constants'
import styles from './MoneyDash.styl'
import { useMoneyDash } from './hooks'

export const MoneyDashboard = () => {
  const {
    transactionList,
    categoryList,
    chartData,
    setMonth,
    selectedMonth,
    calendarDate,
    loading,
    errorMessage,
    rowData,
  } = useMoneyDash()
  const months = monthsForDropdown()

  return (
    <Layout disableHide selectedKey={ROUTES.OVERVIEW_TRACK.key}>
      <div className={styles.MoneyDash}>
        <div className="title">
          <div className="overview"> Overview</div>
          <div className="months-selection">
            <select value={selectedMonth.month() + 1} onChange={(e) => setMonth(e.target.value)}>
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="cards-overview">
          <Card className="card" title="All Transaction">
            <div className="card-content">
              {!loading && !errorMessage && transactionList}
              {!loading && errorMessage && <div className="error-message"> {errorMessage} </div>}
              {loading &&
                !errorMessage &&
                Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <div className="loading-div-two" key={i}>
                      <div className="ge-placeholder">
                        <Placeholder width="20%" height="50px" />
                        <Placeholder width="78%" height="50px" />
                      </div>
                      <Placeholder width="100px" height="50px" />
                    </div>
                  ))}
            </div>
          </Card>

          <Card className="card report-card" title="Reports">
            {loading && (
              <div className="category-list">
                <div className="ge-placeholder">
                  <Placeholder width="20%" height="50px" />
                  <Placeholder width="78%" height="50px" />
                </div>
                <ChartPlaceholder width="100%" height="150px" className="chart" />
              </div>
            )}
            {!loading && (
              <div className="category-data">
                <div className="category-list">{categoryList}</div>
                <Chart
                  data={chartData}
                  containerHeight={150}
                  margin={{
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                  }}
                  className="chart"
                />
              </div>
            )}
          </Card>

          <Card className="card" title="Calendar">
            <Calendar
              onClickMonth={setMonth}
              tileContent={
                <div>
                  <div />
                </div>
              }
              tileClassName="tile"
              className={styles.calendar}
              value={calendarDate}
            />
          </Card>
        </div>
        <div className="cards-overview">
          <Card className="card" title="All Transaction">
            <div className="card-content">
              {!loading && !errorMessage && transactionList}
              {!loading && errorMessage && <div className="error-message"> {errorMessage} </div>}
              {loading &&
                !errorMessage &&
                Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <div className="loading-div-two" key={i}>
                      <div className="ge-placeholder">
                        <Placeholder width="20%" height="50px" />
                        <Placeholder width="78%" height="50px" />
                      </div>
                      <Placeholder width="100px" height="50px" />
                    </div>
                  ))}
            </div>
          </Card>

          <Card className="card report-card" title="Reports">
            {loading && (
              <div className="category-list">
                <div className="ge-placeholder">
                  <Placeholder width="20%" height="50px" />
                  <Placeholder width="78%" height="50px" />
                </div>
                <ChartPlaceholder width="100%" height="150px" className="chart" />
              </div>
            )}
            {!loading && (
              <div className="category-data">
                <div className="category-list">{categoryList}</div>
                <Chart
                  data={chartData}
                  containerHeight={150}
                  margin={{
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                  }}
                  className="chart"
                />
              </div>
            )}
          </Card>

          <Card className="card" title="Calendar">
            <Calendar
              onClickMonth={setMonth}
              tileContent={
                <div>
                  <div />
                </div>
              }
              tileClassName="tile"
              className={styles.calendar}
              value={calendarDate}
            />
          </Card>
        </div>

        <div className="money-transactions">
          <div className="months-selection">
            <select value={selectedMonth} onChange={setMonth} className="">
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>
          <Grid
            className="grid"
            rowSelection={'multiple'}
            columnDefs={columnDefs}
            rowData={rowData}
            defaultColDef={defaultColDef}
            overlayNoRowsTemplate={errorMessage}
            loadingOverlayComponent={<Placeholder width="500px" height="500px" />}
          />
        </div>
      </div>
    </Layout>
  )
}
