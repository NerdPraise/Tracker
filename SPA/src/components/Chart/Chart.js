import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

export const Chart = ({
  grid,
  className,
  containerHeight,
  containerWidth,
  customChart,
  data,
  legend,
  margin,
  xaxis,
  yaxis,
}) => {
  return (
    <div className={className}>
      <ResponsiveContainer width={containerWidth || '100%'} height={containerHeight}>
        {customChart ? (
          customChart()
        ) : (
          <ComposedChart data={data} margin={margin}>
            {grid && <CartesianGrid stroke={grid?.strokeColor} />}
            {xaxis && <XAxis dataKey="name" scale="band" />}
            {yaxis && <YAxis />}
            <Tooltip />
            {legend && <Legend />}
            <Area type="monotone" dataKey="amount" fill="#008000" stroke="#8884d8" />
            <Line type="monotone" dataKey="amount" stroke="#008000" />
          </ComposedChart>
        )}
      </ResponsiveContainer>
    </div>
  )
}
