import { Trash2 } from 'lucide-react'

import { ActionsCellRenderer, StatusRenderer } from '_Home/components/Grid/renderer'
import { capitalise, formatDate } from '_Home/common/utils'

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

export const a = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Invoice</title>
    <link
      href="https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,300&family=Roboto:wght@400;500;700;900&display=swap"
      rel="stylesheet"
    />
    <style>
      main {
        font-family: Lato, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f9f9f9;
        {{#theme.body}}
        color: {{.}};
        {{/theme.body}}

      }
      * {
        box-sizing: border-box;
      }
      .invoice-container {
        width: 100%;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }

      .invoice-container .body {
        padding: 66px 80px;
        background-color: #fff;
        // min-height: 800px;
      }
      .header {
        display: flex;
        align-items: center;
        margin-bottom: 30px;
      }
      .header img {
        width: 6.25em;
      }
      .header h1 {
        margin: 0;
        font-size: 2.3rem;
        font-weight: 800;
        letter-spacing: 3px;
        {{#theme.header}}
        color: {{.}};
        {{/theme.header}}
      }
      .address {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 3.125em;
        font-size: clamp(0.75rem, 0.165rem + 0.75vw, 0.925rem);
      }
      .address .client p {
        font-weight: 600;
        font-size: clamp(1rem, 0.0025rem + 1.333vw, 1.35rem);
        margin-bottom: 1.555em;
      }
      .address .client div {
        margin-bottom: 0.45em;
      }
      .address .client span {
        font-weight: 600;
        
      }

       .address .client > div {
        display: flex;
      }

      .address .user-detail {
        text-align: right;
      }
      .address .user-detail div {
        margin-bottom: 0.3125em;
      }
      .table-head {
        min-height: 250px;
      }
      .table-container {
        width: 100%;
        border-collapse: collapse;
        font-size: clamp(0.8125rem, 0.165rem + 0.75vw, 1rem);
      }
      .table-container tr:first-of-type td {
        padding-top: 1.5625em;
      }
      .table-container td {
        font-weight: 600;
      }
      .table-container td:last-of-type, .table-container td:nth-of-type(4) {
        {{#theme.accent}}
        color: {{.}};
        {{/theme.accent}}
      }
      .table-container td:last-of-type {
        min-width: 80px;
      }
      .table-container th,
      .table-container td {
        padding: 0.5em;
        text-align: center;
        min-width: 50px;
      }
      .table-container th {
        color: #808080;
        font-weight: 400;
        font-size:clamp(0.75rem, 0.165rem + 0.75vw, 0.87rem);
        border: none;
        border-bottom: 1px solid #ddd;
        margin-bottom: 0.9375em;
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
        {{#theme.footerBg}}
          background: {{.}};
        {{/theme.footerBg}}
        height: 23.875em;
        padding: 4.375em 80px 4.375em;
      }
      .footer-header,
      .footer-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      .footer-header {
        font-size: clamp(0.75rem, 0.165rem + 0.75vw, 0.87rem);
        color: #808080;
        width: 100%;
      }
      .third {
        flex-basis: 33%;
      }
      .third.end {
        text-align: right;
      }
      .footer-item {
        margin: 1.5625em 0;
      }
      .footer-item .account_details {
        font-size: clamp(0.75rem, 0.165rem + 0.75vw, 0.925rem);
      }
      .footer-item .due_item {
        font-size: clamp(1rem, 0.0025rem + 1.333vw, 1.375rem);
      }
      .footer-item .total_item {
        font-size: clamp(1.2rem, 0.0025rem + 1.333vw, 1.675rem);
        {{#theme.accent}}
        color: {{.}};
        {{/theme.accent}}
        font-weight: 700;
        padding-right: 0;
      }
      hr {
        border: 0.7px solid #ccc;
        border-style: solid;
        border-bottom: none;
      }
      .footer-msg {
        margin-top: 2.5em;
      }
      .footer-msg {
        font-size: 1.0625em;
      }
    </style>
  </head>
  <main>
    <div class="invoice-container">
      <div class="body">
        <div class="header">
        {{#logo}}
        <img src="{{.}}" alt="Your Logo" />
        {{/logo}}
          <h1>INVOICE</h1>
        </div>
        <div class="address">
          <div class="client">
            <p>{{client}}</p>
            <div>
            Date Issued:
            {{#invoice.issue_date}}
            <span>{{.}}</span>
            {{/invoice.issue_date}}
            {{^invoice.issue_date}}
            <div style="height: 20px; min-width: 60px; background:#efeeee;margin-left: 12px;"></div>
            {{/invoice.issue_date}}
            
            </div>
            <div>Invoice No:
            {{#invoice.inv_tag}}
            <span>{{.}}</span>
            {{/invoice.inv_tag}}
            {{^invoice.inv_tag}}
            <div style="height: 20px; min-width: 60px; background:#efeeee;margin-left: 12px;"></div>
            {{/invoice.inv_tag}}
            </div>
          </div>
          <div class="user-detail">
            <div>{{ user.name }}</div>
            <div>{{user.address}}</div>
            <div>{{user.city}}, {{user.country}}</div>
            <div>{{user.extras}}</div>
          </div>
        </div>
        <div class="table-head">
          <table class="table-container">
            <thead>
              <tr>
                <th>DESCRIPTION</th>
                <th>RATE</th>
                <th>QTY.</th>
                <th>SUBTOTAL</th>
                <th>TOTAL</th>
              </tr>
            </thead>
            <tbody>
              {{#invoice.items}}
              <tr>
                <td>{{description}}</td>
                <td>{{rate}}</td>
                <td>{{qty}}</td>
                <td>{{subtotal}}</td>
                <td></td>
              </tr>
              {{/invoice.items}}
              {{^invoice.items}}
              <tr>
                <td>
                  <div style="height:20px; min-width:70px; background: #efeeee;"> </div>
                </td>
                <td>
                  <div style="height:20px; min-width:70px; background: #efeeee;"> </div>
                </td>
                <td>
                  <div style="height:20px; min-width:70px; background: #efeeee;"> </div>
                </td>
                <td>
                  <div style="height:20px; min-width:70px; background: #efeeee;"> </div>
                </td>
                <td>
                  <div style="height:20px; min-width:70px; background: #efeeee;"> </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div style="height:20px; min-width:70px; background: #efeeee;"> </div>
                </td>
                <td>
                  <div style="height:20px; min-width:70px; background: #efeeee;"> </div>
                </td>
                <td>
                  <div style="height:20px; min-width:70px; background: #efeeee;"> </div>
                </td>
                <td>
                  <div style="height:20px; min-width:70px; background: #efeeee;"> </div>
                </td>
                <td>
                  <div style="height:20px; min-width:70px; background: #efeeee;"> </div>
                </td>
              </tr>
              {{/invoice.items}}
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td>{{invoice.currency}} {{invoice.total}}</td>
              </tr>
            </tbody>
          </table>
      </div>
      </div>
      <div class="footer">
        <div class="footer-header">
          <div class="third">BANK INFO</div>
          <div class="third">DUE BY</div>
          <div class="third end">TOTAL DUE</div>
        </div>
        <hr />
        <div class="footer-item">
          <div class="third">
            <div class="account_details">
            {{user.bank}}
            <br/>
            {{user.account_name}}
            <br/>
            {{user.account_number}}
            {{^user.account_name}}
                <div style="height:20px; max-width:150px; background: #d1d1d1; margin-bottom: 3px;"> </div>
                <div style="height:20px; max-width:150px; background: #d1d1d1;"> </div>
            {{/user.account_name}}
            </div>
          </div>
          <div class="third due_item">
            <div>
            {{invoice.due_date}}
            {{^invoice.due_date}}
                <div style="height:20px; min-width:70px; background: #d1d1d1;"> </div>
            {{/invoice.due_date}}
            </div>
          </div>
          <div class="third total_item end">{{invoice.currency}} {{invoice.total_due}}</div>
        </div>
        <hr />
        <div class="footer-msg">
          <div class="thanks">
          {{#invoice.description}}
          {{.}}
          {{/invoice.description}}
          {{^invoice.description}}
          ❤️ Thank you!
          {{/invoice.description}}
          </div>
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
    naturalised_due_date: formatDate(invoice?.dueDate),
    total: function total() {
      return parseInt(
        this.invoice?.items?.reduce((acc, cur) => acc + cur.subtotal(), 0),
      )?.toLocaleString()
    },
    total_with_tax: function total_with_tax() {
      return this.invoice.total()
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
