import { Flex } from '@chakra-ui/layout'
import { Box, Skeleton, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react'
import styled from '@emotion/styled'
import { useCallback, useEffect, useState } from 'react'
import CopyAddressOrDomain from '../../../components/CopyAddressOrDomain'
import { useConsumerContext } from '../../../hooks/useConsumerContext'
import { fetchSpaceLeaderBoard } from '../../../state/space/source'
import Pagination from '../../Aggregator/components/Pagination'

const StyledTh = styled(Th)`
  padding-left: 0;
  text-transform: unset;
  /* color: ${({ theme }) => theme.colors.text}; */
  font-size: 14px;
`

const ITEMS_PER_PAGE = 10

const LeaderBoardTable = ({ selectedSpaceId }) => {
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [totalResults, setTotalResults] = useState(0)
  const [leaderboardData, setLeaderboardData] = useState({})
  const { accessKey } = useConsumerContext()

  const loadLeaderboard = useCallback(async () => {
    try {
      setIsLoading(true)
      const { data, totalResults } = await fetchSpaceLeaderBoard(
        selectedSpaceId,
        (page - 1) * ITEMS_PER_PAGE,
        ITEMS_PER_PAGE,
        accessKey,
      )
      setLeaderboardData((state) => ({
        ...state,
        [page]: data.map((d) => ({ collectionId: d?.User?.username, ...d })),
      }))
      setTotalResults(totalResults)
    } catch (e) {
    } finally {
      setIsLoading(false)
    }
  }, [selectedSpaceId, page, setLeaderboardData])

  useEffect(() => {
    if (selectedSpaceId) {
      loadLeaderboard()
    }
  }, [selectedSpaceId, loadLeaderboard])

  const onPageChange = useCallback((_page) => {
    setIsLoading(true)
    setPage(_page)
  }, [])

  return (
    <Flex flexDir={'column'} w={'full'}>
      <TableContainer pt={'20px'}>
        <Table size="sm">
          <Thead width={'100'}>
            <Tr pb="2">
              <StyledTh color={'mutedForeground'} borderColor={'input'}>
                Ranking
              </StyledTh>
              <StyledTh color={'mutedForeground'} borderColor={'input'} textAlign={'left'} px="0">
                User
              </StyledTh>
              <StyledTh color={'mutedForeground'} borderColor={'input'} textAlign={'right'} px="0">
                Quest completed
              </StyledTh>
            </Tr>
          </Thead>
          <Tbody>
            {leaderboardData?.[page]
              ? leaderboardData?.[page]?.map((data, index) => (
                  <Tr key={index}>
                    <Td data-title="Raking" borderColor={'input'} px="0" w="24">
                      {isLoading ? (
                        <Skeleton borderRadius={'4'} w="6" h="6" startColor="muted" endColor="input" />
                      ) : (
                        <Box>
                          <Text>{data?.rank}</Text>
                        </Box>
                      )}
                    </Td>
                    <Td data-title="User" borderColor={'input'} px="0">
                      {isLoading ? (
                        <Skeleton borderRadius={'4'} w="32" h="6" startColor="muted" endColor="input" />
                      ) : (
                        <CopyAddressOrDomain domain={data?.user?.domainName} address={data?.user?.username} />
                      )}
                    </Td>
                    <Td data-title="Quest completed" borderColor={'input'} px="0">
                      {isLoading ? (
                        <Skeleton borderRadius={'4'} ml="auto" w="8" h="6" startColor="muted" endColor="input" />
                      ) : (
                        <Text textAlign={'right'} fontWeight={600} fontSize={14}>
                          {data?.stats?.questCompleted}
                        </Text>
                      )}
                    </Td>
                  </Tr>
                ))
              : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((_, index) => (
                  <Tr key={index}>
                    <Td data-title="Raking" borderColor={'input'} px="0" w="24">
                      <Skeleton borderRadius={'4'} w="6" h="6" startColor="muted" endColor="input" />
                    </Td>
                    <Td data-title="User" borderColor={'input'} px="0">
                      <Skeleton borderRadius={'4'} w="32" h="6" startColor="muted" endColor="input" />
                    </Td>
                    <Td data-title="Quest completed" borderColor={'input'} px="0">
                      <Skeleton borderRadius={'4'} ml="auto" w="8" h="6" startColor="muted" endColor="input" />
                    </Td>
                  </Tr>
                ))}
          </Tbody>
        </Table>
      </TableContainer>
      <Flex justify="center" marginY={3}>
        <Pagination
          currentPage={page}
          totalCount={totalResults}
          pageSize={ITEMS_PER_PAGE}
          onPageChange={onPageChange}
        />
      </Flex>
    </Flex>
  )

  // return (
  //   <div>
  //     <Table
  //       columns={[
  //         {
  //           title: 'Ranking',
  //           textAlign: 'left',
  //           sx: {
  //             minWidth: '20%',
  //           },
  //           render: (record) => {
  //             const { rank } = record
  //             return rank
  //           },
  //         },
  //         {
  //           title: 'User',
  //           textAlign: 'left',
  //           sx: {
  //             minWidth: '60%',
  //           },
  //           render: (record) => {
  //             const { user } = record
  //             return (
  //               <Flex>
  //                 {
  //                   <CopyAddress
  //                     address={user?.username}
  //                     domain={user?.domainName}
  //                     addressLength={user?.domainName ? 10 : 6}
  //                   />
  //                 }
  //               </Flex>
  //             )
  //           },
  //         },
  //         {
  //           title: 'Quests completed',
  //           textAlign: 'left',
  //           sx: {
  //             minWidth: '20%',
  //           },
  //           render: (record) => {
  //             const { stats } = record
  //             return stats?.questCompleted
  //           },
  //         },
  //       ]}
  //       data={leaderboardData[page] || []}
  //       isLoading={isLoading}
  //       itemsPerPage={ITEMS_PER_PAGE}
  //       emptyState={{
  //         title: 'No Users Found!',
  //         subtitle: 'Complete a quest to top this leaderboard.',
  //       }}
  //     />

  //     <Flex justify="center" marginY={3}>
  //       <Pagination
  //         currentPage={page}
  //         totalCount={totalResults}
  //         pageSize={ITEMS_PER_PAGE}
  //         onPageChange={onPageChange}
  //       />
  //     </Flex>
  //   </div>
  // )
}

export default LeaderBoardTable
