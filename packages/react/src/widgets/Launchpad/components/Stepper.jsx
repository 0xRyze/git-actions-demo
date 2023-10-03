import React from 'react'
import { Box, Flex, Step, StepIcon, Stepper as ChakraStepper, StepStatus, StepTitle } from '@chakra-ui/react'

const Stepper = ({ steps, activeStep, setActiveStep, isCompleteStep, isIncompleteStep, isActiveStep }) => {
  return (
    <Flex>
      <ChakraStepper index={activeStep} orientation="vertical" height="300px" gap="0">
        {steps.map((step, index) => (
          <Step
            key={index}
            onClick={index < activeStep ? () => setActiveStep(index) : null}
            cursor={index < activeStep ? 'pointer' : 'unset'}
          >
            {/*<StepIndicator>*/}
            {/*<StepStatus complete={<StepIcon />} incomplete={<StepNumber />} active={<StepNumber />} />*/}
            {/*</StepIndicator>*/}

            <Flex minW={135}>
              <StepTitle opacity={isIncompleteStep(index) ? 0.4 : 1} fontWeight={isActiveStep(index) ? 600 : 500}>
                {step.title}
              </StepTitle>
              <Box ml={'auto'}>
                <StepStatus complete={<StepIcon color={'green'} />} incomplete={null} active={null} />
              </Box>
            </Flex>

            {/*<StepSeparator />*/}
          </Step>
        ))}
      </ChakraStepper>
      <Flex flexDirection="column" width={'full'} ml={4}>
        {steps[activeStep].component}
      </Flex>
    </Flex>
  )
}

export default Stepper
