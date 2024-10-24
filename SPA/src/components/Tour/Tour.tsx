import Joyride, { Props } from 'react-joyride'

type TourProps = Props & {}

export const Tour = (props: TourProps) => {
  return (
    <Joyride
      continuous
      steps={props.steps}
      run={props.run}
      stepIndex={props.stepIndex}
      showProgress
      disableOverlayClose
      disableCloseOnEsc
      hideCloseButton
      callback={props.callback}
      styles={{
        tooltip: {
          borderRadius: '12px',
        },
        options: {
          // backgroundColor: '#EBFFF4',
          backgroundColor: '#fff',
          arrowColor: '#EBFFF4',
          textColor: '#00A991',
        },
        buttonNext: {
          backgroundColor: '#c770fe',
          color: '#FFFFFF',
          fontSize: '12px',
          padding: '14px 25px',
          outline: 'none',
          borderRadius: '20px',
        },
        buttonBack: {
          fontSize: '12px',
          color: '#c770fe',
          outline: 'none',
        },
        tooltipTitle: {
          fontSize: 15,
          textAlign: 'left',
          lineHeight: '20px',
          fontWeight: 600,
        },
        tooltipContent: {
          textAlign: 'left',
          fontSize: 13,
          padding: '10px 0',
          color: 'rgba(89, 89, 89, 0.80)',
        },
      }}
    />
  )
}
