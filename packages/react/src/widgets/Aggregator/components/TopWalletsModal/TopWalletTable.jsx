import { Box, Skeleton, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react'
import styled from '@emotion/styled'
import CopyAddress from '../../../../components/CopyAddress'

const StyledTh = styled(Th)`
  padding-left: 0;
  text-transform: unset;
  /* color: ${({ theme }) => theme.colors.text}; */
  font-size: 14px;
`

export function TopWalletTable({ loading, data, chainId }) {
  return (
    <TableContainer pt={'20px'}>
      <Table size="sm">
        <Thead width={'100'}>
          <Tr pb="2">
            <StyledTh color={'mutedForeground'} borderColor={'input'}>
              Whale Wallet
            </StyledTh>
            <StyledTh color={'mutedForeground'} borderColor={'input'} textAlign={'right'} px="0">
              Items Minted
            </StyledTh>
          </Tr>
        </Thead>
        <Tbody>
          {data?.map((data, index) => {
            return (
              <Tr key={index}>
                <Td data-title="Whale Wallet" borderColor={'input'} px="0">
                  {loading ? (
                    <Skeleton borderRadius={'4'} w="32" h="6" startColor="muted" endColor="input" />
                  ) : (
                    <Box>
                      <CopyAddress address={data.wallet_address} chainId={chainId} />
                    </Box>
                  )}
                </Td>
                <Td data-title="Items Minted" borderColor={'input'} px="0">
                  {loading ? (
                    <Skeleton borderRadius={'4'} ml="auto" w="8" h="6" startColor="muted" endColor="input" />
                  ) : (
                    <Text textAlign={'right'} fontWeight={600} fontSize={14}>
                      {data.total_mints}
                    </Text>
                  )}
                </Td>
              </Tr>
            )
          })}
        </Tbody>
      </Table>
    </TableContainer>
  )
}
