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
    price: 300.0,
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
