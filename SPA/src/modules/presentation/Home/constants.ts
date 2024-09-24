export const features = [
  {
    title: 'Customizable Invoices',
    description:
      'Easily modify templates to include your logo, colors, and preferred layouts. Add personalized messages and item descriptions to create a professional appearance that resonates with your clients. With our intuitive editor, you can ensure that every invoice not only meets your business needs but also enhances your brand identity, making a lasting impression on your customers.',
  },
  {
    title: 'Financial Reporting',
    description: `Effortlessly track and analyze your business's financial health with our comprehensive reporting features. Generate detailed reports that provide insights into your income, expenses, and overall profitability. With customizable templates and real-time data, you can make informed decisions and streamline your financial management. Stay on top of your finances and ensure your business is always in the best shape possible.`,
  },
  {
    title: 'Recurring Invoice Billing',
    description:
      ' Automatically generate and send invoices at specified intervals, ensuring timely payments without the hassle of manual invoicing. Customize billing cycles, set reminders, and manage subscriptions effortlessly. This feature is perfect for businesses with ongoing services, allowing you to focus on growth while maintaining a steady cash flow.',
  },
  {
    title: 'Print & Download on Demand',
    description:
      'Instantly generate high-quality PDF invoices that are ready for printing or digital distribution. Whether you need to send invoices via email or provide physical copies to clients, our platform ensures that you can access and print your documents whenever necessary. Enjoy the flexibility and convenience of having your invoices at your fingertips, tailored to your specific requirements.',
  },
  {
    title: 'Easy Expense Management',
    description: '',
  },
]

export const PricingDeets = [
  {
    name: 'Free',
    description: "Explore the limit of what's possible",
    price: 0.0,
    offers: ['Customisable Invoices', 'One invoice per month', 'Up to 4 customers/clients'],
  },
  {
    name: 'Premium',
    description: 'Perfect for freelancers and small business in need of multiple invoicing',
    price: 9.99,
    offers: [
      'Everything from Free',
      'Unlimited invoices per month',
      'Advanced Customisation',
      'Add unlimited customers/clients.',
      'Access from anywhere.',
      'Send via email, SMS, or by manually sharing a link.',
      'Accept payments with stripe/paystack',
      'Access to new features',
    ],
    recommended: true,
  },
  {
    name: 'All time',
    description: "Explore the limit of what's possible",
    price: 250.0,
    offers: [
      'All the features from Premium',
      'All time access - one time payment',
      '24/7 customer support',
      'No monthly subscription',
      'Add custom fields to any invoice or contract.',
    ],
  },
]
