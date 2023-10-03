import { useWeb3React } from '@web3-react/core'
import React, { useState } from 'react'
import LaunchpadLayout from './components/LaunchpadLayout'
import Stepper from './components/Stepper'
import { useCreateContext } from './hooks/useCreateContext'

// const steps = [
//   // { title: 'Select', component: <SelectCollection /> },
//   { title: 'Collection', component: <Collection /> },
//   { title: 'Details', component: <Details /> },
//   { title: 'Whitelist', component: <Whitelist /> },
//   { title: 'Submit', component: <Submit /> },
// ]

export const EditCollection = (props) => {
  const [showWallets, setShowWallets] = useState(false)
  const { reset } = useCreateContext()

  const { account } = useWeb3React()
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

  const onClickConnectWallet = () => {
    setShowWallets(true)
  }

  const closeAndReset = () => {
    reset()
    onClose()
  }

  // if (!account)
  //   return (
  //     <WalletLayout isOpen={isOpen} onClose={onClose}>
  //       {(() => {
  //         if (showWallets) {
  //           return <AllWallets onlyEvm={true} />
  //         } else {
  //           return <WelcomeScreen onClickConnectWallet={onClickConnectWallet} clientConfig={clientConfig} />
  //         }
  //       })()}
  //     </WalletLayout>
  //   )
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

export default EditCollection
