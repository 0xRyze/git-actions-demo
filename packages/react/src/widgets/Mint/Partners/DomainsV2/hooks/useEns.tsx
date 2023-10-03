import { useWeb3React } from '@web3-react/core'
import BigNumber from 'bignumber.js'
import { useCallback } from 'react'
import { useContract } from '../../../../../hooks/useContract'
import { claimEnsDomain } from '../../../../../state/partners/source'
import { DEFAULT_TOKEN_DECIMAL } from '../../../../../constants'
import { ENS_CONTRACT_ABI } from '../../../../../constants/abi'

const useEns = () => {
  const ensRegistarController = useContract('0x283af0b28c62c092c9727f1ee09c02ca627eb7f5', ENS_CONTRACT_ABI)
  const { provider } = useWeb3React()

  const registerEnsDomain = useCallback(
    async (
      accessKey: string,
      name: string,
      owner: any,
      duration: number,
      weiPerSecond: any,
      account: any,
      address: any,
      discountedPrice: any,
      currency: any,
      isProd: boolean,
    ) => {
      try {
        const durationInSeconds = duration * 31536000
        const totalRentPrice = BigNumber(weiPerSecond).multipliedBy(durationInSeconds).multipliedBy(1.1).toFixed(0)
        console.log('totalRentPrice', totalRentPrice.toString())
        const random = new Uint8Array(32)
        window.crypto.getRandomValues(random)
        const salt =
          '0x' +
          Array.from(random)
            .map((b) => b.toString(16).padStart(2, '0'))
            .join('')
        const gasPrice = await provider.getGasPrice()

        const commitment = await ensRegistarController.makeCommitmentWithConfig(
          name,
          owner,
          salt,
          '0x231b0Ee14048e9dCcD1d247744d114a4EB5E8E63',
          owner,
        )

        const tx = await ensRegistarController.commit(commitment)
        await new Promise((resolve) => setTimeout(() => resolve(''), 60000))

        const registerTx = await ensRegistarController.registerWithConfig(
          name,
          owner,
          durationInSeconds,
          salt,
          '0x231b0Ee14048e9dCcD1d247744d114a4EB5E8E63',
          owner,
          {
            value: totalRentPrice.toString(),
            gasLimit: 400000,
            gasPrice: gasPrice,
          },
        )
        const transactionHash = registerTx.hash
        await registerTx.wait()

        console.log(transactionHash)

        if (isProd) {
          await claimEnsDomain(accessKey, {
            name: `${name}.eth`,
            transactionHash,
            transferWallet: account,
            claimWallet: address,
            price: totalRentPrice,
            discountedPrice: new BigNumber(discountedPrice).times(DEFAULT_TOKEN_DECIMAL).toString(),
            currency,
          })
        }
      } catch (error) {
        console.log(error)
        throw error
      }
    },
    [],
  )

  return { registerEnsDomain, ensRegistarController }
}

export default useEns
