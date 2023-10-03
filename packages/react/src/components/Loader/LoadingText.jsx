import React from 'react'
import styled from '@emotion/styled'
import { Text } from '@chakra-ui/react'

const LoadingTextWrapper = styled(Text)`
  .one {
    opacity: 0;
    -webkit-animation: dot 1.3s infinite;
    -webkit-animation-delay: 0s;
    animation: dot 1.3s infinite;
    animation-delay: 0s;
  }

  .two {
    opacity: 0;
    -webkit-animation: dot 1.3s infinite;
    -webkit-animation-delay: 0.2s;
    animation: dot 1.3s infinite;
    animation-delay: 0.2s;
  }

  .three {
    opacity: 0;
    -webkit-animation: dot 1.3s infinite;
    -webkit-animation-delay: 0.3s;
    animation: dot 1.3s infinite;
    animation-delay: 0.3s;
  }

  @-webkit-keyframes dot {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @keyframes dot {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`

const LoadingText = ({ text = 'Loading', ...props }) => {
  return (
    <LoadingTextWrapper {...props}>
      {text}
      <span className="one">.</span>
      <span className="two">.</span>
      <span className="three">.</span>
    </LoadingTextWrapper>
  )
}

export default LoadingText
