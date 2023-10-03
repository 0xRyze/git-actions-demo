import React, { useEffect, useState } from 'react'
import { isAddress } from '@ethersproject/address'
import { PublicKey } from '@solana/web3.js'
import styled from '@emotion/styled'
import { Box, Flex } from '@chakra-ui/react'
import Copy from '../Svgs/copy'
import CheckCircle from '../Svgs/checkCircle'
import { copyText, truncateAddress } from '../../utils'
import { BLOCK_EXPLORER, SupportedChainId } from '../../constants/chains'
import { NULL_ADDRESS } from '../../constants'

const Wrapper = styled(Flex)`
  align-items: center;
  position: relative;
`
const Address = styled.a`
  font-size: 14px;
  font-weight: 600;
  margin-right: 5px;
  cursor: pointer;

  &:hover {
    text-decoration: underline !important;
  }
`

const Icon = styled(Copy)`
  cursor: pointer;
`
const Copied = styled(CheckCircle)`
  cursor: pointer;
`

const CopyAddress = (props) => {
  const [copied, setCopied] = useState(false)
  const [isValidAddress, setIsValidAddress] = useState(false)
  const { address, addressLength = 5, chainId = 1, domain, ...rest } = props

  const isStacks = [SupportedChainId.STACKS_TESTNET, SupportedChainId.STACKS_MAINNET].includes(chainId)
  const isSolana = [SupportedChainId.SOLANA_DEVNET, SupportedChainId.SOLANA].includes(chainId)

  useEffect(() => {
    try {
      if (isStacks) {
        setIsValidAddress(true)
        return
      }
      if (isSolana) {
        const _isValid = PublicKey.isOnCurve(address) || true
        setIsValidAddress(_isValid)
        return
      }
      const _isValidAddress = isAddress(address)
      setIsValidAddress(_isValidAddress)
    } catch (e) {
      // console.log(e)
    }
  }, [address, chainId, isStacks])

  const onClickCopy = () => {
    setCopied(true)

    copyText(isValidAddress ? address : NULL_ADDRESS)

    setTimeout(() => {
      setCopied(false)
    }, 1000)
  }

  return (
    <Box {...rest}>
      <Wrapper>
        <Address
          href={
            isStacks
              ? `${BLOCK_EXPLORER[chainId]}txid/${address}${
                  chainId === SupportedChainId.STACKS_TESTNET ? '?chain=testnet' : ''
                }`
              : `${BLOCK_EXPLORER[chainId]}address/${address}${
                  chainId === SupportedChainId.SOLANA_DEVNET ? '?cluster=devnet' : ''
                }`
          }
          target="_blank"
        >
          {isValidAddress
            ? truncateAddress(domain ? domain : address, addressLength)
            : truncateAddress(NULL_ADDRESS, addressLength)}
        </Address>
        {copied ? (
          <Copied width={24} height={24} iconcolor={copied && 'green'} />
        ) : (
          <Icon width={24} height={24} onClick={onClickCopy} />
        )}
      </Wrapper>
    </Box>
  )
}

export default CopyAddress
