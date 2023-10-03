import { NoData, TBody, TContainer, TdCell, ThCell, THeader, TRow } from './styles'
import { Box, Skeleton, Text, useMediaQuery } from '@chakra-ui/react'

const Table = ({
  data,
  columns,
  isLoading = false,
  itemsPerPage,
  emptyState = { title: 'No Mints Found!', subtitle: `We'll replenish soon. Check back later.` },
}) => {
  const [isLesserThan768] = useMediaQuery('(max-width: 768px)', {
    ssr: false,
  })

  const { title, subtitle } = emptyState

  return (
    <TContainer>
      {!isLesserThan768 && (
        <THeader>
          {columns.map(({ title, textAlign, sx }, index) => (
            <ThCell
              key={title + index}
              {...sx}
              fontSize={'xs'}
              fontWeight={'medium'}
              justify={textAlign === 'right' && 'flex-end'}
              color="mutedForeground"
            >
              {title}
            </ThCell>
          ))}
        </THeader>
      )}
      <>
        {(() => {
          if (isLoading) {
            const _columns = isLesserThan768 ? [columns[0], columns[columns.length - 1]] : columns

            return Array.from(Array(itemsPerPage).keys()).map((item, index) => (
              <TRow key={index} borderBottom="1px" borderColor="muted">
                {_columns.map(({ render, sx, textAlign }, index) => (
                  <TdCell
                    key={index + index}
                    {...sx}
                    width={isLesserThan768 ? '50%' : '100%'}
                    justify={textAlign === 'right' && 'flex-end'}
                  >
                    <Skeleton
                      speed={0.6}
                      height={8}
                      width={isLesserThan768 ? '80%' : '60%'}
                      startColor="muted"
                      endColor="primary"
                      opacity={0.1}
                      sx={{
                        borderRadius: 'md',
                      }}
                    />
                  </TdCell>
                ))}
              </TRow>
            ))
          } else {
            return (
              <TBody>
                {data.map((item, index) => {
                  if (isLesserThan768) {
                    const middleColumns = columns.slice(1, columns.length - 1)
                    return (
                      <Box key={item.collectionId}>
                        <TRow>
                          {[columns[0], columns[columns.length - 1]].map(({ render, sx, textAlign }, index) => (
                            <TdCell
                              key={item.collectionId + index}
                              {...sx}
                              width="50%"
                              justify={textAlign === 'right' && 'flex-end'}
                            >
                              {render && render(item)}
                            </TdCell>
                          ))}
                        </TRow>
                        <TRow overflowX="auto">
                          {middleColumns.map(({ title, textAlign, sx, render }, index) => (
                            <Box width={`calc(100% / ${middleColumns.length})`} key={title + index}>
                              <ThCell
                                fontSize={'2xs'}
                                {...sx}
                                minWidth="50px"
                                justify={'flex-start'}
                                color="mutedForeground"
                              >
                                {title}
                              </ThCell>
                              <TdCell {...sx} minWidth="50px" justify={'flex-start'}>
                                {render && render(item)}
                              </TdCell>
                            </Box>
                          ))}
                        </TRow>
                      </Box>
                    )
                  }

                  return (
                    <TRow key={item.collectionId} borderBottom="1px" borderColor="muted">
                      {columns.map(({ render, sx, textAlign }, index) => (
                        <TdCell key={item.collectionId + index} {...sx} justify={textAlign === 'right' && 'flex-end'}>
                          {render && render(item)}
                        </TdCell>
                      ))}
                    </TRow>
                  )
                })}

                {!data.length && (
                  <NoData>
                    <Text fontSize="md">{title}</Text>
                    <Text fontSize="sm" color="mutedForeground">
                      {subtitle}
                    </Text>
                  </NoData>
                )}
              </TBody>
            )
          }
        })()}
      </>
    </TContainer>
  )
}

export default Table
