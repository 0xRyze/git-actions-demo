import React from 'react'
import { Box, Flex, Text } from '@chakra-ui/layout'
import useWalletContext from '../hooks/useWalletContext'
import { Image } from '@chakra-ui/image'

const getDetails = (name, id) => {
  let extentionName = ''
  let extentionUrl = ''

  if (name === 'chromeId') {
    extentionName = 'Chrome'
    extentionUrl = `https://chrome.google.com/webstore/detail/${id}`
  }
  if (name === 'braveId') {
    extentionName = 'Brave'
    extentionUrl = `https://chrome.google.com/webstore/detail/${id}`
  }
  if (name === 'firefoxId') {
    extentionName = 'Firefox'
    extentionUrl = `https://addons.mozilla.org/en-US/firefox/addon/${id}`
  }
  if (name === 'edgeId') {
    extentionName = 'Edge'
    extentionUrl = `https://microsoftedge.microsoft.com/addons/detail/${id}`
  }

  return {
    extentionName,
    extentionUrl,
  }
}

const NotInstalled = () => {
  const { selectedWallet } = useWalletContext()
  return (
    <Box>
      <Text fontSize={'lg'} mb={2}>
        Install {selectedWallet.name} extension to connect
      </Text>
      <Text mb={4} fontSize={'sm'}>
        Select from your preferred options below:
      </Text>
      {Object.keys(selectedWallet.desktop || {}).map((id) => (
        <a href={getDetails(id, selectedWallet.desktop[id]).extentionUrl} target={'_blank'}>
          <Flex align="center" mb={2} border="1px solid" borderColor="input" p={2} borderRadius="lg">
            <Image
              src={`https://iconic.dynamic-static-assets.com/icons/sprite.svg#${getDetails(
                id,
                selectedWallet.desktop[id],
              ).extentionName.toLowerCase()}`}
              width={6}
              height={6}
            />
            <Text ml={2} fontSize={14}>
              Install {getDetails(id, selectedWallet.desktop[id]).extentionName} extension
            </Text>
          </Flex>
        </a>
      ))}
    </Box>
  )
}

export default NotInstalled
