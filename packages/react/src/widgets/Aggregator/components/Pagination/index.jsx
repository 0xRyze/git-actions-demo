import React from 'react'
import { DOTS, usePagination } from './usePagination'
import { PaginationContainer, PaginationItem } from './styles'
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'
import { Box, Flex } from '@chakra-ui/react'

const classnames = () => {
  return ''
}
const Pagination = (props) => {
  const { onPageChange, totalCount, siblingCount = 1, currentPage, pageSize, className } = props

  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  })

  if (currentPage === 0 || paginationRange.length < 2) {
    return null
  }

  const onNext = () => {
    onPageChange(currentPage + 1)
  }

  const onPrevious = () => {
    onPageChange(currentPage - 1)
  }

  let lastPage = paginationRange[paginationRange.length - 1]
  return (
    <Flex align="center">
      <Box>
        <ChevronLeftIcon
          boxSize={6}
          onClick={currentPage === 1 ? () => {} : onPrevious}
          opacity={currentPage === 1 ? 0.1 : 1}
          cursor={currentPage === 1 ? 'not-allowed' : 'pointer'}
        />
      </Box>
      <PaginationContainer>
        {paginationRange.map((pageNumber, index) => {
          if (pageNumber === DOTS) {
            return (
              <PaginationItem key={index} className="dots">
                &#8230;
              </PaginationItem>
            )
          }

          return (
            <PaginationItem
              key={index}
              className={pageNumber === currentPage ? 'selected' : ''}
              onClick={pageNumber === currentPage ? () => {} : () => onPageChange(pageNumber)}
            >
              {pageNumber}
            </PaginationItem>
          )
        })}
      </PaginationContainer>
      <Box>
        <ChevronRightIcon
          boxSize={6}
          onClick={currentPage === lastPage ? () => {} : onNext}
          opacity={currentPage === lastPage ? 0.1 : 1}
          cursor={currentPage === lastPage ? 'not-allowed' : 'pointer'}
        />
      </Box>
    </Flex>
  )
}

export default Pagination
