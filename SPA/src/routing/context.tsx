import { createContext, useState, useMemo, useContext } from 'react'
import { Step } from 'react-joyride'

export interface AppState {
  run: boolean
  stepIndex: number
  steps: Step[]
  tourActive: boolean
}

const appState = {
  run: false,
  stepIndex: 0,
  steps: [],
  tourActive: false,
}

export const TourContext = createContext({
  state: appState,
  setState: () => undefined,
})

TourContext.displayName = 'TourContext'

export const TourContextProvider = (props: any) => {
  const [state, setState] = useState(appState)

  const value = useMemo(
    () => ({
      state,
      setState,
    }),
    [setState, state],
  )
  const { Provider } = TourContext
  return <Provider value={value} {...props} />
}

export function useTourContext(): {
  setState: (patch: Partial<AppState> | ((previousState: AppState) => Partial<AppState>)) => void
  state: AppState
} {
  const context = useContext(TourContext)

  if (!context) {
    throw new Error('useAppContext must be used within a AppProvider')
  }

  return context
}
