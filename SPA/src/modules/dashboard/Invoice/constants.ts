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
    <link href="https://fonts.googleapis.com/css2?family=Pinyon+Script&display=swap" rel="stylesheet">
    <link
      href="https://fonts.googleapis.com/css2?family=Abel&display=swap"
      rel="stylesheet"
    />
    <link
      href="https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,300..700;1,300..700&display=swap"
      rel="stylesheet"
    />
    <style>
      main#main {
        margin: 0;
        padding: 0;
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
        padding: 66px 40px 30px;
        {{#theme.background}}
        background-color:{{.}}
        {{/theme.background}}
        {{^theme.background}}
        background-color: #fff;
        {{/theme.background}}
      }

      .header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
        align-items: center;
        height: 80px;

        img {
          height: 100%;
          max-width: 200px;
          width: 100%;
        }

        h1 {
          margin: 0;
          font-size: 40px;
          font-weight: 600;
          {{#theme.header}}
          color: {{.}};
          {{/theme.header}}
        }
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

      .invoice_details {
        display: flex;
        flex-direction: column;
        max-width: 240px;
        font-size: 14px;
        margin-bottom: 15px;

        .detail_group {
          display: flex;
          align-items: center;
          justify-content: space-between;
          p {
            margin: 1px 0;
          }
        }
      }

      .address {
        margin-top: 25px;
        max-width: 420px;
        display: flex;
        justify-content: space-between;
        gap: 20px;
        .address_group {
          max-width: 230px;
          display: flex;
          flex-direction: column;
          margin-bottom: 15px;
        }
      }

      .address .address_group p {
        font-size: 14px;
        margin: 4px 0;
      }

      .total_due {
        font-size: 20px;
        margin: 18px 0;
      }

      .table-container {
        width: 100%;
        border-collapse: collapse;
        font-size: clamp(0.8125rem, 0.165rem + 0.75vw, 1rem);

        tr {
          border-bottom: 1px solid #cfcfcf;

          td {
            font-weight: 500;
            padding: 1.3625em;
            padding-right: 0;
          }
        }
        tr:last-of-type {
          border-bottom: none;
        }
        th, td {
          padding: 0.5em;
          text-align: right;
          width: 17%;
        }
        th {
          font-size: 12px;
          font-weight: 400;
          border: none;
          border-bottom: 1.5px solid black;
          padding-bottom: 0.5625em;
        }
        td:first-of-type,
        th:first-of-type {
          text-align: left;
          padding-left: 0;
          width: 45%;
        }
        td:last-of-type,
        th:last-of-type {
          text-align: right;
          padding-right: 0;
        }
      }

      .table-container td:last-of-type, .table-container td:nth-of-type(4), .table-container th{
        {{#theme.accent}}
        color: {{.}};
        {{/theme.accent}}
      }

      .subtotal_field {
        margin-top: 20px;
        width: 400px;
        margin-left: auto;
        div {
          border-top: 1px solid #cfcfcf;
          display: flex;
          justify-content: space-between;
          p {
            margin: 10px 0;
            font-size: 14px;
          }
        }
      }
      .footer {
        margin-top: 15px;
        font-size: 14px;
        max-width: 400px;
        padding: 10px 0 30px;
        font-weight: 300;
      }
    </style>
  </head>
  <main id="main">
    <div class="invoice-container">
      <div class="body">
        <div class="header">
          <h1>Invoice</h1>
          {{#logo}}
          <img src={{logo}} />
          {{/logo}}
          {{^logo}}
          <div style="font-family:sign; font-weight:700; font-size:70px;">logo</div>
          {{/logo}}
        </div>
        <div class="invoice_details">
          <div class="detail_group">
            <div>
              <p><strong>Invoice number:</strong></p>
            </div>
            <div>
            {{#invoice.inv_tag}}
            <p>{{.}}</p>
            {{/invoice.inv_tag}}
            {{^invoice.inv_tag}}
            <div style="height: 15px; min-width: 120px; background: #efeeee; mix-blend-mode: darken;"></div>
            {{/invoice.inv_tag}}
            </div>
          </div>
          <div class="detail_group">
            <div>
              <p>Date due:</p>
            </div>
            <div>
              {{#invoice.due_date}}
              <p>{{.}}</p>
              {{/invoice.due_date}}
              {{^invoice.due_date}}
              <div style="height: 15px; min-width: 120px; background: #efeeee; mix-blend-mode: darken;"></div>
              {{/invoice.due_date}}
            </div>
          </div>
          {{#invoice.issue_date}}
          <div class="detail_group">
            <div>
              <p>Date issued:</p>
            </div>
            <div>
              <p>{{.}}</p>
            </div>
          </div>
          {{/invoice.issue_date}}
        </div>
        <div class="address">
          <div class="address_group">
            <p><strong>Pay to</strong></p>
            <div>
              <p>
                {{ user.name }}
                {{^user.name }}
                <div style="height: 15px; min-width: 120px; background: #efeeee; mix-blend-mode: darken;"></div>
                {{/user.name }}
              </p>
              <p>
                {{user.address}}
                {{^user.address }}
                <div style="height: 15px; min-width: 120px; background: #efeeee; mix-blend-mode: darken;"></div>
                {{/user.address }}
              </p>
              <p>
                {{user.bank}}
                {{^user.bank }}
                <div style="height: 15px; min-width: 120px; background: #efeeee; mix-blend-mode: darken;"></div>
                {{/user.bank }}
                </>
              <p>
                {{user.account_name}}
                {{^user.account_name }}
                <div style="height: 15px; min-width: 120px; background: #efeeee; mix-blend-mode: darken;"></div>
                {{/user.account_name }}
                </p>
              <p>
                {{user.account_number}}
                {{^user.account_number }}
                <div style="height: 15px; min-width: 120px; background: #efeeee; mix-blend-mode: darken;"></div>
                {{/user.account_number }}
              </p>
            </div>
          </div>
          <div class="address_group">
            <p><strong>Billed to</strong></p>
            {{#client}}
            <p>{{.}}</p>
            {{/client }}

            {{^client }}
            <div style="height: 15px; margin-bottom: 5px; min-width: 120px; background: #efeeee; mix-blend-mode: darken; flex-basis:none;"></div>
            {{/client }}
            {{#clientEmail}}
              <p>{{.}}</p> 
              {{/clientEmail }} 
              {{^clientEmail }} 
              <div
                style="height: 15px!important;margin-bottom: 5px; min-width: 120px; background: #efeeee; mix-blend-mode: darken; flex-basis:none;"></div>
            {{/clientEmail }}

            {{#clientAddress}}
              <p>{{.}}</p> 
              {{/clientAddress }} 
              {{^clientAddress }} 
              <div
                style="height: 15px!important; min-width: 120px; background: #efeeee; mix-blend-mode: darken; flex-basis:none;"></div>
            {{/clientAddress }}
          </div>
        </div>

        <div class="total_due">
          <p>
            <strong>
              {{invoice.total}} {{invoice.currency}} due {{invoice.naturalised_due_date}}
            </strong>
          </p>
        </div>
        <div style="min-height: 300px">
          <table class="table-container">
            <thead>
              <tr>
                <th>Description</th>
                <th>Rate</th>
                <th>Quantity/Hours</th>
                <th>Amount</th>
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
                  <div style="height:20px; min-width:70px; background: #efeeee; mix-blend-mode: darken;"> </div>
                </td>
                <td>
                  <div style="height:20px; min-width:70px; background: #efeeee; mix-blend-mode: darken;"> </div>
                </td>
                <td>
                  <div style="height:20px; min-width:70px; background: #efeeee; mix-blend-mode: darken;"> </div>
                </td>
                <td>
                  <div style="height:20px; min-width:70px; background: #efeeee; mix-blend-mode: darken;"> </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div style="height:20px; min-width:70px; background: #efeeee; mix-blend-mode: darken;"> </div>
                </td>
                <td>
                  <div style="height:20px; min-width:70px; background: #efeeee; mix-blend-mode: darken;"> </div>
                </td>
                <td>
                  <div style="height:20px; min-width:70px; background: #efeeee; mix-blend-mode: darken;"> </div>
                </td>
                <td>
                  <div style="height:20px; min-width:70px; background: #efeeee; mix-blend-mode: darken;"> </div>
                </td>
              </tr>
              {{/invoice.items}}
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td>{{invoice.currency}} {{invoice.total}}</td>
              </tr>
            </tbody>
          </table>
          </div>
        <div class="subtotal_field">
          <div>
            <p>Subtotal</p>
            <p>{{invoice.currency}} {{invoice.total}}</p>
          </div>
         
          <div>
            <p>Total</p>
            <p>{{invoice.currency}} {{invoice.total}}</p>
          </div>
          <div>
            <p><strong>Amount Due</strong></p>
            <p><strong>{{invoice.currency}} {{invoice.total_due}}</strong></p>
          </div>
        </div>
        <div class="footer">
          {{invoice.description}}
          {{^invoice.description}}
          <p> Extra information........ </p>
          <p> 🙌🏾Thank you </p>
          {{/invoice.description}}
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
  logo: (invoice?.template?.settings as SimpleSettings)?.theme?.logo || '',
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
  clientAddress: invoice?.client?.address,
  clientEmail: invoice?.client?.email,
  theme: {
    footerBg: (invoice?.template?.settings as SimpleSettings)?.theme?.footerBg,
    accent: (invoice?.template?.settings as SimpleSettings)?.theme?.accent,
    header: (invoice?.template?.settings as SimpleSettings)?.theme?.header,
    body: (invoice?.template?.settings as SimpleSettings)?.theme?.body,
    background: (invoice?.template?.settings as SimpleSettings)?.theme?.background,
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

console.log(JSON.stringify(a))
