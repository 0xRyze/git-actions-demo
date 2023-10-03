import React from 'react'
import LaunchpadLayout from './components/LaunchpadLayout'
import Stepper from './components/Stepper'
import { useCreateContext } from './hooks/useCreateContext'

// const steps = [
//   { title: 'Introduction', component: <Introduction /> },
//   { title: 'Collection', component: <Collection /> },
//   { title: 'Spaces', component: <Spaces /> },
//   { title: 'Details', component: <Details /> },
//   { title: 'Mint Details', component: <MintDetails /> },
//   { title: 'Whitelist', component: <Whitelist /> },
//   { title: 'Submit', component: <Submit /> },
// ]

export const CreateCollection = (props) => {
  const { reset } = useCreateContext()
  const {
    accessKey,
    isOpen,
    onClose,
    allowedChains,
    activeStep,
    setActiveStep,
    isCompleteStep,
    isIncompleteStep,
    isActiveStep,
    steps,
  } = props

  const closeAndReset = () => {
    reset()
    onClose()
  }

  return (
    <LaunchpadLayout isOpen={isOpen} onClose={closeAndReset}>
      {/* <CreateContextProvider
        activeStep={activeStep}
        goToNext={goToNext}
        goToPrevious={goToPrevious}
        allowedChains={allowedChains}
        modalProps={{
          isOpen,
          onClose,
        }}
      > */}
      <Stepper
        steps={steps}
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        isCompleteStep={isCompleteStep}
        isIncompleteStep={isIncompleteStep}
        isActiveStep={isActiveStep}
      />
      {/* </CreateContextProvider> */}
    </LaunchpadLayout>
  )
}

export default CreateCollection
