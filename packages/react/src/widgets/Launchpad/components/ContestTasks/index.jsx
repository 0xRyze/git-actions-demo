import React, { useState } from 'react'
import { Accordion, Box, Button, Checkbox, Flex, Text } from '@chakra-ui/react'
import AddModule from './AddModule'
import ContestModule from '../../../Mint/Widget/comnponents/Contests/ContestModule'
import { CloseIcon, EditIcon } from '@chakra-ui/icons'
import { useCreateContext } from '../../hooks/useCreateContext'
import { useSelector } from 'react-redux'

const ContestTasks = ({ modules, addModule, deleteModule, editModule, proceed, toggleHideFooter }) => {
  const [showAddModule, setShowAddModule] = useState(false)
  const [editModuleIndex, setEditModuleIndex] = useState(null)
  const { nftTransferBlocked, setNftTransferBlock, createState } = useCreateContext()
  const selectedWallet = useSelector((state) => state.user.selectedWallet)
  const resetDefaultValues = () => {
    setEditModuleIndex(null)
  }
  return (
    <Box position="relative" width="full" height="full">
      {showAddModule ? (
        <AddModule
          addModule={addModule}
          editModule={editModule}
          onClickBack={() => {
            setShowAddModule(false)
          }}
          defaultValues={modules[editModuleIndex]}
          editModuleIndex={editModuleIndex}
          isEdit={editModuleIndex !== null}
          resetDefaultValues={resetDefaultValues}
        />
      ) : !modules.length ? (
        <>
          {selectedWallet !== 'Phantom' && !createState?.isGasLessMint ? (
            <Flex flexDir="column" height="full" alignItems={'center'}>
              <Text textAlign="center" fontSize={18}>
                Would you like to create a whitelist for your collection ?
              </Text>
              <Text textAlign="center" fontSize={14} mt={4}>
                Using whitelist, you can create a set of tasks and only after completing those tasks will users be able
                to mint your collection's NFT.
              </Text>
              <Flex>
                <Button
                  variant={'outline'}
                  w="30"
                  onClick={() => {
                    proceed()
                    resetDefaultValues()
                  }}
                  mt="4"
                >
                  No
                </Button>
                <Button
                  variant={'primary'}
                  w="30"
                  ml={4}
                  onClick={() => {
                    setShowAddModule(true)
                    resetDefaultValues()
                  }}
                  mt="4"
                >
                  Yes
                </Button>
              </Flex>
            </Flex>
          ) : (
            <Flex flexDir="column" height="full" alignItems={'center'}>
              <Text textAlign="center" fontSize={18}>
                Create a whitelist for your collection
              </Text>
              <Text textAlign="center" fontSize={14} mt={4}>
                Using whitelist, you can create a set of tasks and only after completing those tasks will users be able
                to mint your collection's NFT.
              </Text>
              <Flex>
                <Button
                  variant={'primary'}
                  w="30"
                  ml={4}
                  onClick={() => {
                    setShowAddModule(true)
                    resetDefaultValues()
                    setNftTransferBlock(false)
                  }}
                  mt="4"
                >
                  Proceed
                </Button>
              </Flex>
            </Flex>
          )}
        </>
      ) : (
        <>
          <Text mb={4} fontSize={14}>
            A whitelist can have any number of groups, and each group can contain any number of tasks. Users would be
            able to mint a specific number of NFTS after completing each group of tasks.
          </Text>
          <Box mt={2}>
            <Text fontWeigt={600}>Group List</Text>
            <Accordion allowToggle>
              {modules.map((module, index) => (
                <Flex flexDir="column" py="1">
                  {!module.readOnly && (
                    <Flex alignSelf={'flex-end'} mb="1">
                      <EditIcon
                        w="3"
                        h="3"
                        mr="2"
                        cursor="pointer"
                        onClick={() => {
                          setShowAddModule(true)
                          setEditModuleIndex(index)
                        }}
                      />
                      <CloseIcon w="3" h="3" cursor="pointer" onClick={() => deleteModule(index)} />
                    </Flex>
                  )}
                  <Box position="relative" key={index} mb={2}>
                    <ContestModule key={index} module={module} readonly={true} />
                  </Box>
                </Flex>
              ))}
            </Accordion>
          </Box>

          <Box>
            <Checkbox
              isChecked={!nftTransferBlocked || selectedWallet === 'Phantom'}
              onChange={() => setNftTransferBlock(!nftTransferBlocked)}
              isDisabled={selectedWallet === 'Phantom'}
            >
              Do you want the minted NFTs to be transferable?
            </Checkbox>
          </Box>

          <Flex justifyContent="flex-end" mt="10">
            <Button
              variant="outline"
              onClick={() => {
                setShowAddModule(true)
              }}
            >
              Add more tasks
            </Button>
            <Button ml={2} variant="primary" onClick={proceed}>
              Proceed
            </Button>
          </Flex>
        </>
      )}
    </Box>
  )
}

export default ContestTasks
