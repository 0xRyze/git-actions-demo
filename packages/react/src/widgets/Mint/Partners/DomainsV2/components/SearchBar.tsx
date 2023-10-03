import { Button, Flex } from '@chakra-ui/react'
import React from 'react'
import Input from '../../../../../components/Forms/Input'

interface Props {
  onChangeSearch: (e: any) => void
  enterPressed: (e: any) => void
  getSuggestions: (...args: any[]) => void
}

const SearchBar: React.FC<Props> = ({ onChangeSearch, enterPressed, getSuggestions }) => {
  return (
    <Flex mt={2} w="full">
      <Input
        id="ud-search"
        placeholder="Search for your new domain"
        onChange={onChangeSearch}
        onKeyPress={enterPressed}
        size="md"
        autoComplete="off"
      />
      <Button size="md" variant={'primary'} cursor="pointer" onClick={getSuggestions} ml={3} mt={2}>
        Search
      </Button>
    </Flex>
  )
}

export default SearchBar
