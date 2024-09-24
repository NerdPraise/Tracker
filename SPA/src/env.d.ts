import 'vite/client'

declare module '*.module.styl' {
  const classes: CSSModuleClasses
  export default classes
}

declare module '*.svg' {
  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >
  ReactComponent
  const src: string
  export default src
}

declare global {
  type ReactChildren = string | JSX.Element | JSX.Element[] | React.ReactNode | React.ReactNode[]

  type IInvoice = {
    id: number
    invoiceItems: IInvoiceItems[]
    name: string
    uuid: string
    issueDate: string
    dueDate: string
    description: string
    extraInfo: string
    client: IClient
    template: ITemplate
    amount: number
    dateSent: string | null
    createdAt: string
    currency: string
    payment: {
      status: string
      totalDue: number
    }
  }

  type ITheme = {
    footer_background?: string
    accent_color?: string
    color?: string
  }

  type ITemplate = {
    settings: { html: string; theme: IThemes }
    category: string
    user: string | null
    uuid: string
    image: string
  }

  type IClient = {
    id: number
    name: string
    email: string
    createdAt: string
  }

  type IUser = {
    id: number
    username: string
    email: string
    firstName: string
    lastName: string
    fullName: string
    address: string
    accountName: string
    accountNumber: string
    dateFormat: string
    subscription: string
    transaction: IUserTransaction
    cardName: string
    cardNumber: string
    expiryDate: string
    cvv: string
  }

  type IInvoiceSettings = {
    id: string
    defaultBank: string
    defaultCurrency: string
    accountName: string
    accountNumber: string
    dueAfter: number
    prefix: string
  }

  type IUserTransaction = {
    amount: number
    date: string
    subscription: string
  }

  const enum IStatusCode {
    'SUCCESS' = 200,
    'CREATED' = 201,
    'NO_CONTENT' = 204,
    'BAD_REQUEST' = 400,
    'UNAUTHORIZED' = 401,
    'FORBIDDEN' = 403,
    'NOT_FOUND' = 404,
    'NOT_ACCEPTABLE' = 406,
  }

  type IInvoiceItems = {
    description: string
    quantity: string
    unitPrice: number
    amount: number
  }
  type PickProps<L, R> = R & Pick<L, Exclude<keyof L, keyof R>>
  type MustacheHtml = string
  type TemplateContext = Record<string, string | number | Array<string | number> | VoidFunction | object>
}
