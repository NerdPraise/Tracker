export const columnDefs = [
  {
    headerName: 'Used for',
    field: 'description',
    suppressSizeToFit: false,
    checkboxSelection: true,
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
    headerName: 'Added on',
    field: 'created_at',
  },
]

export const defaultColDef = {
  flex: 1,
  minWidth: 100,
}

export const dateFormat = 'YYYY-MM-DD'
