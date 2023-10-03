import React from 'react'
import { Flex, Text, Tooltip } from '@chakra-ui/react'
import { truncateAddress } from '../../../utils'
import { useDispatch } from 'react-redux'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWeb3React } from '@web3-react/core'
import { updateSelectedWallet } from '../../../state/user/reducer'
import { CloseIcon } from '@chakra-ui/icons'
import TokenIcon from '../../../components/Svgs/tokenIcons'

const Account = ({ selectedWallet }) => {
  const { account, connector, chainId } = useWeb3React()
  const { publicKey: solanaAccount, disconnect } = useWallet()
  // const selectedWallet = useSelector((state) => state.user.selectedWallet)

  const dispatch = useDispatch()

  const disconnectEvmWallet = () => {
    try {
      if (connector.deactivate) {
        connector.deactivate()
      } else {
        connector.resetState()
      }
      dispatch(updateSelectedWallet({ wallet: undefined }))
    } catch (e) {
      console.log(e)
    }
  }

  const solanaAccountStr = !!solanaAccount ? solanaAccount.toBase58() : ''

  return (
    <>
      {(selectedWallet === 'Phantom' && !!solanaAccountStr) || (selectedWallet !== 'Phantom' && !!account) ? (
        <>
          <Flex alignItems="center">
            {selectedWallet === 'Phantom' ? (
              <>
                <TokenIcon width={'14px'} height="14px" chainId={9090} style={{ marginRight: '5px' }} />
                <Tooltip label={solanaAccountStr}>{truncateAddress(solanaAccountStr, 5)}</Tooltip>
              </>
            ) : (
              <>
                <TokenIcon width={'14px'} height="14px" chainId={chainId} style={{ marginRight: '5px' }} />
                <Tooltip label={account}>{truncateAddress(account, 5)}</Tooltip>
              </>
            )}
            <CloseIcon
              ml={'5px'}
              cursor="pointer"
              boxSize={'10px'}
              onClick={selectedWallet === 'Phantom' ? disconnect : disconnectEvmWallet}
            />
          </Flex>
        </>
      ) : (
        <Text fontSize={12}>Not Connected </Text>
      )}
    </>
  )
}

export default Account
