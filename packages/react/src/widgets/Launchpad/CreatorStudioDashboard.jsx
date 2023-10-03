import { Flex, useDisclosure, useSteps } from '@chakra-ui/react'
import React, { useState } from 'react'
import Collection from './components/steps/Collection'
import Details from './components/steps/Details'
import Introduction from './components/steps/Introduction'
import MintDetails from './components/steps/MintDetails'
import Spaces from './components/steps/Spaces'
import Submit from './components/steps/Submit'
import Whitelist from './components/steps/Whitelist'
import { CreateContextProvider } from './context/CreateContext'
import { useConsumerContext } from '../../hooks/useConsumerContext'

const Dashboard = React.lazy(() => import('./components/Dashboard'))

const createSteps = [
  { title: 'Introduction', component: <Introduction /> },
  { title: 'Collection', component: <Collection /> },
  { title: 'Spaces', component: <Spaces /> },
  { title: 'Details', component: <Details /> },
  { title: 'Mint Details', component: <MintDetails /> },
  { title: 'Whitelist', component: <Whitelist /> },
  { title: 'Submit', component: <Submit /> },
]

const editSteps = [
  // { title: 'Select', component: <SelectCollection /> },
  { title: 'Collection', component: <Collection /> },
  { title: 'Details', component: <Details /> },
  { title: 'Whitelist', component: <Whitelist /> },
  { title: 'Submit', component: <Submit /> },
]

const CreatorStudioDashboard = (props) => {
  const [actionType, setActionType] = useState('')

  const { clientConfig } = props
  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure()
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure()

  const {
    config: { allowedChains },
  } = useConsumerContext()

  const { activeStep, goToPrevious, goToNext, setActiveStep, isCompleteStep, isIncompleteStep, isActiveStep } =
    useSteps({
      index: 0,
      count: actionType === 'create' ? createSteps.length : editSteps.length,
    })

  const changeActionType = (_type) => {
    setActionType(_type)
  }

  const createProps = {
    ...props,
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onClose: onCreateClose,
    activeStep,
    setActiveStep,
    isCompleteStep,
    isIncompleteStep,
    isActiveStep,
    steps: createSteps,
  }
  const editProps = {
    ...props,
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
    activeStep,
    setActiveStep,
    isCompleteStep,
    isIncompleteStep,
    isActiveStep,
    steps: editSteps,
  }

  return (
    <Flex flexDir={'column'} h="full">
      <CreateContextProvider
        setActiveStep={setActiveStep}
        activeStep={activeStep}
        goToNext={goToNext}
        goToPrevious={goToPrevious}
        allowedChains={allowedChains}
        modalProps={{
          isOpen: actionType === 'create' ? isCreateOpen : isEditOpen,
          onClose: actionType === 'create' ? onCreateClose : onEditClose,
        }}
      >
        <Dashboard
          clientConfig={clientConfig}
          changeActionType={changeActionType}
          {...editProps}
          createProps={createProps}
        />
      </CreateContextProvider>
    </Flex>
  )
}

export default CreatorStudioDashboard
