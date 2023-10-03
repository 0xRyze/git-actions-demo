import React, { useCallback } from 'react'
import { claimBnsDomain, registerBnsDomain } from '../../../../../state/partners/source'
import { useContract } from '../../../../../hooks/useContract'
import { BNS_CONTACT_ABI } from '../../../../../constants/abi'
import { Interface } from '@ethersproject/abi'
// @ts-ignore
import namehash from '@ensdomains/eth-ens-namehash'
import { environment } from '../../../../..'

const isProd = environment === 'production'

const CONTRACT_ADDRESS = isProd
  ? '0x4079d84889e0E1AC22beec60dc8e5E7b621bf55D'
  : '0xdFd267E83f3150D2C1CCec622776fC6A30bfbb21'

const useBns = () => {
  const baseRegistrarController = useContract(CONTRACT_ADDRESS, BNS_CONTACT_ABI)
  const registerBns = useCallback(
    async (accessKey: string, name: any, userWalletAddress: any) => {
      try {
        if (!baseRegistrarController) return

        const abiInterface = new Interface(BNS_CONTACT_ABI)

        const { signedRegisterRequest } = await registerBnsDomain(accessKey, name, userWalletAddress)
        const hashedName = namehash.hash(signedRegisterRequest[0] + '.base')
        const avatar = 'files.basename.app/avatars/' + hashedName + '.svg'

        const encodedDataAddress = abiInterface.encodeFunctionData('setAddr', [hashedName, userWalletAddress])

        const encodedDataAvatar = abiInterface.encodeFunctionData('setText', [hashedName, 'avatar', avatar])

        const callData = [encodedDataAddress, encodedDataAvatar]

        // console.log(signedRegisterRequest, callData)

        const { hash: transactionHash } = await baseRegistrarController.registerWithSignature(
          signedRegisterRequest,
          callData,
          {
            value: signedRegisterRequest[7],
            gasLimit: 400000,
          },
        )

        console.log(transactionHash)

        await claimBnsDomain(accessKey, { name: name + '.base', transactionHash })
      } catch (error) {
        throw error
      }
    },
    [baseRegistrarController],
  )

  return { registerBns }
}

export default useBns
