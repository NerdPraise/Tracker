export const columnDefs = [
  {
    headerName: '',
    valueGetter: 'node.rowIndex + 1',
    width: 3,
    flex: 0,
  },
  {
    headerName: 'Date',
    field: 'created_at',
    valueFormatter: (params) => new Date(params.value).toDateString(),
  },
  {
    headerName: 'Description',
    field: 'description',
    suppressSizeToFit: true,
    minWidth: 150,
    flex: 2,
  },
  {
    headerName: 'Source',
    field: 'source',
  },
  {
    headerName: 'Amount',
    field: 'amount',
  },
  {
    headerName: 'Category',
    field: 'category',
    valueGetter: 'data.category.name || "Unspecified"',
  },
]

export const defaultColDef = {
  flex: 1,
  minWidth: 100,
  sortable: true,
}

export const genericChartData = [
  {
    name: 'Income',
    amount: 0,
  },
  {
    name: 'Fashion',
    amount: 0,
  },
  {
    name: 'Entertainment',
    amount: 0,
  },
  {
    name: 'Food',
    amount: 0,
  },
  {
    name: 'Misc',
    amount: 0,
  },
  {
    name: 'Others',
    amount: 0,
  },
]
