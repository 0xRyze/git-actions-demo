import { Image } from '@chakra-ui/image'
import { Box, Flex, Text } from '@chakra-ui/layout'
import { Divider, Link } from '@chakra-ui/react'
import React from 'react'
import { QRCode } from '../../QrCode'
import { normalizeWalletName } from '../utils/normaliseWalletName'

const CustomQRCode = ({ uri, selectedWallet }) => {
  return (
    <Box>
      <Flex justify="center" pos={'relative'}>
        <Box pos={'absolute'} top="50%" transform={'translateY(-50%)'}>
          <Image
            src={`https://bandit.network/svgs/wallets.svg#${normalizeWalletName(selectedWallet?.name || '')}`}
            width={14}
            height={14}
          />
        </Box>
        <QRCode uri={uri} size={288} ecl="M" clearArea={true} />
      </Flex>
      <Text mb={2} mt={4} textAlign="center">
        Connect to your wallet
      </Text>
      <Text fontSize={14} textAlign="center">
        Scan this QR code from your mobile wallet or phone's camera to connect.
      </Text>

      {normalizeWalletName(selectedWallet?.name || '') !== 'walletconnect' && (
        <>
          <Divider marginY={2} />

          <Box>
            <Flex justify="center" mb={2}>
              <Image
                src="https://www.haha.me/images/install-button.png"
                h="10"
                cursor={'pointer'}
                onClick={() => {
                  window.open('https://join.haha.me/SANDESH-D9D3KI')
                }}
              />
            </Flex>
            {/* <Flex justify="center" mb={2}>
              <Link isExternal href={`https://apps.apple.com/us/app/${selectedWallet.mobile.iosId}`}>
                <Image marginX={2} h={8} src={downloadIos} />
              </Link>
              <Link
                isExternal
                href={`https://play.google.com/store/apps/details?id=${selectedWallet.mobile.androidId}`}
              >
                <Image marginX={2} h={8} src={downloadAndroid} />
              </Link>
            </Flex> */}
            <Text textAlign="center" fontSize="sm">
              {selectedWallet?.description}
            </Text>
            <Link isExternal href={`${selectedWallet.mobile.website}`}>
              <Text fontSize="xs" textAlign="center">
                Learn more
              </Text>
            </Link>
          </Box>
        </>
      )}
    </Box>
  )
}

export default CustomQRCode
