import { Trash2 } from 'lucide-react'

import { ActionsCellRenderer, StatusRenderer } from '_Home/components/Grid/renderer'
import { capitalise } from '_Home/common/utils'

import { deleteInvoice, deleteUserClient } from './redux/actions'

export const columnDefs = [
  {
    headerName: '',
    valueGetter: 'node.rowIndex + 1',
    width: 3,
    flex: 0,
  },
  {
    headerName: 'Name',
    field: 'name',
    flex: 1,
    cellClass: 'grid_click',
  },
  {
    headerName: 'Client',
    field: 'client.name',
    flex: 1,
  },
  {
    headerName: 'Amount',
    field: 'amount',
    maxWidth: 120,
    valueFormatter: (params) => `${params.data.currency} ${params.data.amount}`,
  },
  {
    headerName: 'Issue Date',
    field: 'issueDate',
    valueFormatter: (params) => {
      if (!params.value) {
        return 'Still in Draft'
      }
      return new Intl.DateTimeFormat('en-GB', {
        dateStyle: 'long',
      }).format(new Date(params.value))
    },
  },
  {
    headerName: 'Due Date',
    field: 'dueDate',
    valueFormatter: (params) => {
      return new Intl.DateTimeFormat('en-GB', {
        dateStyle: 'long',
      }).format(new Date(params.value))
    },
  },
  {
    headerName: 'Status',
    field: 'payment',
    cellRenderer: StatusRenderer,
    maxWidth: 100,
  },
  {
    field: 'actions',
    cellRenderer: ActionsCellRenderer,
    maxWidth: 120,
    cellRendererParams: { DeleteBtn: Trash2, deleteAction: deleteInvoice },
  },
]

export const a = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Invoice</title>
    <link href="https://fonts.googleapis.com/css2?family=Abel&display=swap" rel="stylesheet" />
    <link
      href="https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,300..700;1,300..700&display=swap"
      rel="stylesheet"
    />
    <style>
      main#main {
        font-family: "Abel", sans-serif !important;
        margin: 0;
        padding: 0;
        {{#theme.body}}
        color: {{.}};
        {{/theme.body}}
      }

      main#main div,
      main#main h1,
      main#main p,
      {
        font-family: "Abel", sans-serif;
      }
    
      * {
        box-sizing: border-box;
      }
      .invoice-container {
        width: 100%;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }

      .invoice-container .body {
        padding: 66px 80px 30px;
        background-color: #fff;
      }

      .header {
        display: flex;
        flex-direction: column;
        align-items: end;
        margin-bottom: 40px;
        justify-content: center;
      }

      .header h1 {
        font-family: "Abel", sans-serif;
        margin: 0;
        font-size: clamp(4.2rem, 0.0025rem + 1.933vw, 5.3rem);
        font-weight: 800;
        letter-spacing: 14px;

        {{#theme.header}}
        color: {{.}};
        {{/theme.header}}
      }

      .header .invoice_number {
        font-family: "Abel", sans-serif;
        margin: 20px 0 0;
        font-size: 16px;
        font-weight: 800;

       {{#theme.accent}}
        color: {{.}};
        {{/theme.accent}}
      }

      .address {
        max-width: 350px;
        display: flex;
        justify-content: space-between;
        flex-direction: column;
        margin-bottom: 3.125em;
        font-size: clamp(0.75rem, 0.165rem + 0.75vw, 0.925rem);
      }

      .address .address_group {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 0.125em;
        font-size: clamp(0.75rem, 0.165rem + 0.75vw, 0.925rem);
      }

      .address .address_group div {
        flex-basis:48%;
      }

      .address .address_group.major p {
        font-family: "Abel", sans-serif;
      }

      .address .address_group p {
        font-family: "Cormorant", serif;
        margin-bottom: 8px;
        font-size: 16px;
      }

      .address .address_group.major > div:first-child p {
        font-size: 18px;
        font-weight: 700;
        letter-spacing: 3px;
      }

      .table-container {
        font-family: "Cormorant", serif !important;
        width: 100%;
        border-collapse: collapse;
        font-size: clamp(0.8125rem, 0.165rem + 0.75vw, 1rem);
      }

      .table-container tr {
       border-bottom: 1.5px solid black;
      }

      .table-container tr td {
        font-weight: 300;
        padding: 1.3625em;
      }
      .table-container td:last-of-type, .table-container td:nth-of-type(4), .table-container th{
        {{#theme.accent}}
        color: {{.}};
        {{/theme.accent}}
      }


      .table-container tr:last-of-type {
          border-bottom: none;
      }

      .table-container th,
      .table-container td {
        min-width: 25%;
        padding: 0.5em;
        text-align: center;
        min-width: 50px;
      }

      .table-container tr:last-of-type td {
        font-size: 20px;
        font-weight: 600;
        font-family: "Abel", sans-serif;
      }

      .table-container th {
        font-size: 20px;
        font-weight: 800;
        border: none;
        border-bottom: 1.5px solid black;
        margin-bottom: 0.9375em;
        padding-bottom: 1.3625em;
        font-family: "Abel", sans-serif;
      }

      .table-container td:first-of-type,
      .table-container th:first-of-type {
        text-align: left;
        padding-left: 0;
        width: 260px;
      }

      .table-container td:last-of-type,
      .table-container th:last-of-type {
        text-align: right;
        padding-right: 0;
      }
      .footer {
        padding: 10px 0 30px;
        font-weight: 300;
        font-family: "Cormorant", serif;
      }
      #cormorant {
        font-family: "Cormorant", serif;
      }
    </style>
  </head>
  <main id="main">
    <div class="invoice-container">
      <div class="body">
        <div class="header">
          <h1>INVOICE</h1>
          <p class="invoice_number"># {{invoice.inv_tag}}</p>
        </div>
        <div class="address">
          <div class="address_group major">
            <div>
              <p>BILLED TO:</p>
            </div>
            <div>
              <p>{{client}}</p>
            </div>
          </div>
          <div class="address_group major">
            <div>
            <p>PAY TO:</p>
            </div>
            <div>
            <p>
              {{ user.name }}
              <br />
              {{user.address}}
              <br />
              {{user.extras}}
            </p>
            </div>
          </div>
          <div class="address_group" id="cormorant">
            <div>
            <p>Bank</p>
          </div>
            <div>
            <p>{{user.bank}}</p>
          </div>
          </div>
          <div class="address_group" id="cormorant">
            <div>
            <p>Account Name</p>
          </div>
            <div>
            <p>{{user.account_name}}</p>
          </div>
          </div>
          <div class="address_group" id="cormorant">
            <div>
            <p>Account Number</p>
          </div>
            <div>
            <p>{{user.account_number}}</p>
          </div>
          </div>
          <div class="address_group" id="cormorant">
            <div>
            <p>ISSUE DATE:</p>
          </div>
            <div>
            <p>{{invoice.issue_date}}</p>
          </div>
          </div>
        </div>
        <table class="table-container" id="cormorant">
          <thead>
            <tr>
              <th>DESCRIPTION</th>
              <th>RATE</th>
              <th>QTY/HRS.</th>
              <th>AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            {{#invoice.items}}
            <tr>
              <td>{{description}}</td>
              <td>{{rate}}</td>
              <td>{{qty}}</td>
              <td>{{subtotal}}</td>
            </tr>
            {{/invoice.items}}
            <tr>
              <td>TOTAL</td>
              <td></td>
              <td></td>
              <td>{{invoice.currency}} {{invoice.total}}</td>
            </tr>
          </tbody>
        </table>
        <div class="footer">
          {{invoice.description}}
        </div>
      </div>
    </div>
  </main>
</html>
`

export const paymentColumnDefs = [
  {
    headerName: '',
    valueGetter: (params) => '⚫️',
    maxWidth: 110,
    flex: 0,
  },
  {
    headerName: 'CUSTOMER NAME',
    field: 'client.name',
    suppressSizeToFit: true,
    flex: 1,
  },
  {
    headerName: 'AMOUNT',
    field: 'amount',
    valueFormatter: (params) => `${params.data.currency} ${params.data.amount}`,
    flex: 1,
  },
  {
    headerName: 'PAYMENT DATE',
    field: 'paymentDate',
    valueFormatter: (params) => {
      return new Intl.DateTimeFormat('en-GB', {
        dateStyle: 'long',
      }).format(new Date(params.value))
    },
    flex: 1,
  },
]

interface ITheme {
  footerBg?: string
  accent?: string
  color?: string
}

export const getContext = (invoice: IInvoice, user: IUser, invoiceSettings: IInvoiceSettings) => ({
  logo: '',
  user: {
    name: user?.fullName,
    address: user?.address,
    city: 'some city',
    country: 'NG',
    bank: invoiceSettings?.defaultBank,
    account_name: invoiceSettings?.accountName,
    account_number: invoiceSettings?.accountNumber,
  },
  client: invoice?.client?.name,
  theme: {
    footerBg: invoice?.template?.settings.theme?.footerBg,
    accent: invoice?.template?.settings.theme?.accent,
    header: invoice?.template?.settings.theme?.header,
    body: invoice?.template?.settings.theme?.body,
  },
  invoice: {
    description: invoice?.description,
    issue_date: invoice?.issueDate,
    due_date: invoice?.dueDate,
    total: function total() {
      return parseInt(
        this.invoice.items?.reduce((acc, cur) => acc + cur.subtotal(), 0),
      )?.toLocaleString()
    },
    total_due: invoice?.payment.totalDue?.toLocaleString(),
    status: capitalise(invoice?.payment.status),
    inv_tag: invoice?.name,
    currency: invoice?.currency || invoiceSettings?.defaultCurrency,
    items: invoice?.invoiceItems.map((item) => ({
      description: item.description,
      rate: item.unitPrice,
      qty: item.quantity,
      subtotal: function subtotal() {
        return this.rate * this.qty
      },
    })),
  },
})

export const contactColumnDefs = [
  {
    headerName: '',
    valueGetter: 'node.rowIndex + 1',
    width: 3,
    flex: 0,
  },
  {
    headerName: 'Name',
    field: 'name',
    flex: 1,
    cellClass: 'grid_click',
  },
  {
    headerName: 'Email',
    field: 'email',
    flex: 1,
  },
  {
    headerName: 'Created On',
    field: 'createdAt',
    valueFormatter: (params) => {
      return new Intl.DateTimeFormat('en-GB', {
        dateStyle: 'long',
      }).format(new Date(params.value))
    },
  },
  {
    field: 'actions',
    cellRenderer: ActionsCellRenderer,
    maxWidth: 120,
    cellRendererParams: { deleteAction: deleteUserClient },
  },
]

// console.log(JSON.stringify(a))
