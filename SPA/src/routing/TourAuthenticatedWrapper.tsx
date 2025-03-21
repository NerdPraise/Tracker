import { useNavigate } from 'react-router'
import { useEffect, useState } from 'react'
import { CallBackProps, STATUS, EVENTS, ACTIONS, Events, Placement } from 'react-joyride'

import { Tour } from '_Home/components'
import TourSVG from '_Images/tour.svg'

import { useTourContext, TourContextProvider } from './context'
import { AuthenticatedWrapper } from './AuthenticatedWrapper'

const TypewriterText = ({ text, speed = 50 }) => {
  const [displayedText, setDisplayedText] = useState('')
  let currentIndex = -1

  useEffect(() => {
    const typeText = () => {
      if (currentIndex < text.length) {
        setDisplayedText((prev) => prev + text.charAt(currentIndex))
        currentIndex++
        setTimeout(typeText, speed)
      }
    }

    typeText()

    return () => {
      setDisplayedText('')
    }
  }, [text, speed])

  return (
    <div style={{ display: 'flex' }}>
      <div>{displayedText}</div>
    </div>
  )
}

const tourSteps = [
  {
    placement: 'center' as Placement,
    target: 'body',
    styles: {
      tooltip: {
        width: '600px',
      },
    },
    content: (
      <div style={{ padding: '10px 30px' }}>
        <h2
          style={{
            fontSize: '12px',
            color: 'rgb(199, 112, 254)',
            letterSpacing: 2,
          }}
        >
          WELCOME!!!
        </h2>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ flexBasis: '100%' }}>
            <p style={{ fontSize: '30px', fontWeight: 700, marginBottom: '15px', color: '#464646' }}>
              Let's get started
            </p>
            <TypewriterText text="Hi, welcome to useInvoice. Here is a quick tour around your new favorite product! We will have you up in no time" />
          </div>
          <div style={{ width: '250px' }}>
            <img id="full" src={TourSVG} />
          </div>
        </div>
      </div>
    ),
    data: {
      next: '/invoice',
    },
    disableBeacon: true,
  },
  {
    target: '#invoice',
    content: (
      <>
        <h2 style={{ color: '#464646' }}>Accessing Your Invoices</h2>
        <p>
          This is where you can view all your invoices, check their statuses, and take further actions
          like editing or deleting them. You can filter, search, and sort them by date, client, or
          status.
        </p>
      </>
    ),
    data: {
      previous: '/overview',
      next: null,
    },
    disableBeacon: false,
    spotlightClicks: true,
  },
  {
    target: '.add_invoice',
    content: (
      <>
        <h2 style={{ color: '#464646' }}>Create new invoice</h2>
        <p>
          To create a new invoice, click this 'Add Invoice' button. You can customize the invoice by
          adding your business information, items, and client details."
        </p>
      </>
    ),
    data: {
      previous: null,
      next: null,
    },
    spotlightClicks: true,
  },
  {
    target: '.clients',
    content: (
      <>
        <h2 style={{ color: '#464646' }}>Your Clients</h2>
        <p>
          Every invoice needs a client! Click here to add a new client or select an existing one from
          your client list. You can add their name, contact information.
        </p>
      </>
    ),
    data: {
      previous: null,
      next: null,
    },
    spotlightClicks: true,
  },
  {
    target: '#export',
    content: (
      <>
        <h2 style={{ color: '#464646' }}>Download Anytime Anywhere</h2>
        You can also download as many times as you want, either individual invoice or a list of tracked
        invoices
      </>
    ),
    data: {
      previous: null,
      next: '/settings/general',
    },
    spotlightClicks: true,
  },
  {
    target: '#settings',
    content: (
      <>
        <h2 style={{ color: '#464646' }}>Settings</h2>
        <p>
          Make changes to your personal details, invoice settings and subscriptions in your settings page
        </p>
      </>
    ),
    data: {
      previous: '/invoice',
      next: '/settings/invoice',
    },
    spotlightClicks: true,
  },
  {
    target: '#form',
    content: <>Provide defaults for your invoice, and reduce time to send for your invoices</>,
    data: {
      previous: '/settings/general',
      next: null,
    },
    spotlightClicks: true,
  },
  {
    placement: 'center' as Placement,
    target: 'body',
    content: (
      <>
        <h2 style={{ color: '#464646' }}>Start Invoicing!</h2>
        That’s it! You’re ready to start generating and sending invoices. If you ever need help, our
        support team is just a click away. Happy invoicing!
      </>
    ),
    data: {
      previous: null,
      next: null,
    },
    spotlightClicks: true,
  },
]
const TourWrapper = () => {
  const {
    setState,
    state: { run, stepIndex, steps },
  } = useTourContext()

  const navigate = useNavigate()

  const handleJoyrideCallback = (data: CallBackProps) => {
    const {
      index,
      action,
      status,
      type,
      step: {
        data: { next, previous },
      },
    } = data
    const isPreviousAction = action === 'prev'
    const isNextAction = action === 'next'

    if (([STATUS.FINISHED, STATUS.SKIPPED] as string[]).includes(status)) {
      localStorage.setItem('onboarding', 'true')
      setState((prev) => ({ ...prev, run: false, stepIndex: 0, tourActive: false }))
      navigate('/invoice')
    } else if (([EVENTS.STEP_AFTER] as Events[]).includes(type)) {
      if (index < tourSteps.length) {
        if (isPreviousAction) {
          if (previous) {
            setState((prev) => ({ ...prev, run: false }))
            navigate(previous)
          } else {
            setState((prev) => ({ ...prev, stepIndex: index - 1 }))
          }
        }
        if (isNextAction) {
          if (next) {
            setState((prev) => ({ ...prev, run: false }))
            navigate(next)
          } else {
            setState((prev) => ({ ...prev, stepIndex: index + 1 }))
          }
        }
      }

      if (index === tourSteps.length) {
        if (isPreviousAction && previous) {
          setState({ run: false })
          navigate(previous)
        } else {
          setState({ run: false, stepIndex: 0, tourActive: false })
        }
      }
    }
  }

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      steps: tourSteps,
    }))
  }, [])

  return (
    <>
      <AuthenticatedWrapper />
      <Tour steps={steps} stepIndex={stepIndex} run={run} callback={handleJoyrideCallback} />
    </>
  )
}

const TourAuthenticatedWrapper = () => {
  return (
    <TourContextProvider>
      <TourWrapper />
    </TourContextProvider>
  )
}

export default TourAuthenticatedWrapper
