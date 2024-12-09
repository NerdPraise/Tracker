import CurrencyList from 'currency-list'

export const plans = [
  {
    name: 'Free',
    price: 0.0,
    offers: ['Customisable Invoices', 'One invoice per month'],
  },
  {
    name: 'Premium',
    description: 'Perfect for freelancers and small business in need of multiple invoicing',
    price: 9.99,
    offers: [
      'Everything from Free',
      'Unlimited invoices per month',
      'Advanced Customisation',
      'Accept online payments',
    ],
    recommended: true,
  },
  {
    name: 'All time',
    description: "Explore the limit of what's possible",
    price: 199.99,
    offers: [
      'All time access - one time payment',
      'Unlimited invoices per month',
      '24/7 customer support',
    ],
  },
]

export const currencyOptions = Object.entries(CurrencyList.getAll('en_US')).map(([k, v]) => ({
  label: `${v.name} ${v.symbol}`,
  value: v.code,
}))

export const steps = [
  {
    title: 'Create an account',
    desc: 'Easy as connecting your google account and accessing your dashboard',
  },
  {
    title: 'Brand your invoice',
    desc: 'Customise invoice as preferred, use any and all of the customisable widgets provided',
  },
  {
    title: 'Set preferred configurations',
    desc: 'Configurations from auto-billing to automated receipts or reminders to due date can all be set in settings',
  },
  {
    title: 'Send Invoice',
    desc: 'Sit back and watch useinvoice work',
  },
]
