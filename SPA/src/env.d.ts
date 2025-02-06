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
    number: number
    invoiceItems: IInvoiceItems[]
    name: string
    uuid: string
    issueDate: string
    dueDate: string | null
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
    footerBg?: string
    accent?: string
    background?: string
    body?: string
    header?: string
    color?: string
    logo?: string
  }

  type SimpleSettings = { html: string; theme: ITheme }

  type Widget = {
    name: string
    widgetId: string
    layout: Layout
    content?: React.ReactNode
    color?: string
    img?: string
    background?: string
    frame?: string
    opacity?: number
  }

  type ITemplate = {
    id?: string
    settings: SimpleSettings | Settings
    category: string
    user: string | null
    uuid: string
    image: string | null
    customImage: string | null
  }

  type IClient = {
    id: number
    name: string
    email: string
    createdAt: string
    address: string
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
    timezone: string
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

  type IWidget = {
    name: string
    description: string
    image?: string
  }

  type Layout = {
    width?: number
    height?: number
    left: number
    top: number
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

  type Settings = {
    widgets: Widget[]
    theme: {
      background?: string | HsvaColor
      bgImg?: string
    }
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
