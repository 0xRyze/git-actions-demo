import { Flex, Text } from '@chakra-ui/react'
import styled from '@emotion/styled'
import React, { useEffect, useState } from 'react'
import { copyText, truncateAddress } from '../../utils'
import JazzIcon from '../Svgs/JazzIcon'
import CheckCircle from '../Svgs/checkCircle'
import Copy from '../Svgs/copy'

const Icon = styled(Copy)`
  cursor: pointer;
`
const Copied = styled(CheckCircle)`
  cursor: pointer;
`

interface Props {
  address?: string
  domain?: string
}

const CopyAddressOrDomain: React.FC<Props> = ({ address, domain }) => {
  const [copied, setCopied] = useState(false)
  const [text, setText] = useState(address)

  const onClickCopy = () => {
    setCopied(true)

    copyText(address)

    setTimeout(() => {
      setCopied(false)
    }, 1000)
  }

  useEffect(() => {
    if (domain) {
      setText(domain)
    } else {
      setText(truncateAddress(address, 6))
    }
  }, [domain, address])

  return (
    <Flex alignItems={'center'}>
      <JazzIcon address={address} />
      <Flex alignItems={'center'}>
        <Text mx="1">{text}</Text>
        {copied ? (
          <Copied width={24} height={24} iconcolor={copied && 'green'} />
        ) : (
          <Icon width={24} height={24} onClick={onClickCopy} />
        )}
      </Flex>
    </Flex>
  )
}

export default CopyAddressOrDomain
