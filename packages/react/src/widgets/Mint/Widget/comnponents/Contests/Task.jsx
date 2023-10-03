import React, { useEffect, useRef, useState } from 'react'
import {
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  ButtonGroup,
  Link,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import { getDiscordOAuthUrl, getTwitterOAuthUrl, sendEmailCodeVerification } from '../../../../../state/user/source'
import { CheckCircleIcon, ExternalLinkIcon } from '@chakra-ui/icons'
import useSignature from '../../../../../hooks/useSignature'
import { useSelector } from 'react-redux'
import useMatchBreakpoints from '../../../../../hooks/useMatchBreakpoints'
import { colors } from '../../../../../styles'
import { Input } from '../../../../../components/ui/input'
import useWalletContext from '../../../../../components/WalletModal/hooks/useWalletContext'
import { truncateAddress } from '../../../../../utils'
import { useWeb3React } from '@web3-react/core'
import { useWallet } from '@solana/wallet-adapter-react'

function getPostIdFromUrl(postUrl) {
  const re = /\/status\/(\d+)/
  const ss = postUrl.match(re)
  if (ss && ss.length >= 2) {
    return ss[1]
  }
  return ''
}

const Task = ({ task, moduleId, user, collectionContest, isCompleted = false, readonly = false }) => {
  const [connecting, setConnecting] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [isTwitterActionCalled, setIsTwitterActionCalled] = useState(false)
  const [sending, setSending] = useState(false)
  const [email, setEmail] = useState('')
  const [isEmailSet, setIsEmailSet] = useState(false)
  const collectionId = useSelector((state) => state.collection.selectedCollectionId)
  const [feedback, setFeedback] = useState({ message: '', error: false })
  const { isMobile } = useMatchBreakpoints()

  const { primaryAddress, setFilterChains, setShowWallets } = useWalletContext()

  const accessKey = useSelector((state) => state.user.accessKey)
  const selectedWallet = useSelector((state) => state.user.selectedWallet)

  const [signature, getSignature] = useSignature()
  const { account } = useWeb3React()
  const wallet = useWallet()

  const toast = useToast()

  const intervalRef = useRef()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { name, description, type, args } = task
  const { user: userDetails, refreshUser } = user || {}
  const { walletAddress, socialmedia } = userDetails || {}

  const { verifyModuleTask, getUserCompletedTasks, chainId } = collectionContest || {}

  const collectionChain = chainId && [9090, 9091].includes(chainId) ? 'SOL' : 'EVM'

  const actionBtnPreProcess = async (e, callback) => {
    try {
      e?.preventDefault()
      e?.stopPropagation()
      if (!primaryAddress) {
        setFilterChains([collectionChain])
        return setShowWallets(true)
      }
      let _signature = signature
      if (!_signature) _signature = await getSignature()
      setConnecting(true)
      setTimeout(() => {
        setConnecting(false)
        refreshUser()
      }, 10000)
      callback(_signature)
    } catch (e) {
      toast({ title: 'Connection failed', description: '', status: 'error' })
    }
  }

  const verifyTask = async (e) => {
    e?.preventDefault()
    e?.stopPropagation()

    try {
      if (!primaryAddress) {
        setFilterChains([collectionChain])
        return setShowWallets(true)
      }
      setVerifying(true)
      await verifyModuleTask(moduleId, task)
    } catch (e) {
      console.log(e)
    } finally {
      setVerifying(false)
    }
  }

  const verifyEmail = async (e) => {
    e?.preventDefault()
    e?.stopPropagation()
    try {
      if (!primaryAddress) {
        setFilterChains([collectionChain])
        return setShowWallets(true)
      }
      // if (readonly || !isEmailSet) return
      setVerifying(true)
      // await verifyEmailContest(email, walletAddress, accessKey, task, collectionId)
      await verifyModuleTask(moduleId, task)
    } catch (e) {
      console.log(e)
    } finally {
      setVerifying(false)
    }
  }

  const verifyTwitterTasks = async (e, type) => {
    try {
      e?.preventDefault()
      e?.stopPropagation()

      if (!primaryAddress) {
        setFilterChains([collectionChain])
        return setShowWallets(true)
      }

      if (type === 'twitter_follow') {
        window.open(
          `https://twitter.com/intent/follow?screen_name=${args.twitterUsername}`,
          '_blank',
          'height=600,width=600',
        )
        return
      }

      if (type === 'twitter_tweet') {
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(args.twitterTweet)}`,
          '_blank',
          'height=600,width=600',
        )
        return
      }

      setActionLoading(true)
      intervalRef.current = setInterval(async () => {
        getUserCompletedTasks && (await getUserCompletedTasks())
      }, 5000)
      let _signature = signature
      if (!_signature) _signature = await getSignature()
      await getTwitterOAuthUrl(
        _signature,
        selectedWallet === 'Phantom' ? wallet?.publicKey?.toBase58() : account,
        accessKey,
        moduleId,
        collectionId,
        task,
        chainId,
        isMobile,
      )
      setIsTwitterActionCalled(true)
      setTimeout(() => {
        setActionLoading(false)
      }, 10000)
    } catch (e) {
      console.log(e)
      setActionLoading(false)
      if (e?.message?.includes('rejected')) {
        toast({ title: 'User rejected', status: 'error' })
      } else {
        toast({ title: 'Verification failed', status: 'error' })
      }
    }
  }

  const sendEmail = async () => {
    try {
      if (readonly) return
      if (!email) return setFeedback({ message: 'Email is required.', error: true })
      setSending(true)
      let _signature = signature
      if (!_signature) _signature = await getSignature()
      await sendEmailCodeVerification(
        email,
        selectedWallet === 'Phantom' ? wallet?.publicKey?.toBase58() : account,
        accessKey,
        task,
        collectionId,
        _signature,
      )
      setIsEmailSet(true)
      setFeedback({ message: 'Please check your inbox.', error: false })
    } catch (e) {
      console.log(e)
      if (e?.message?.includes('rejected')) {
        toast({ title: 'User rejected', status: 'error' })
      } else {
        toast({ title: 'Verification failed', status: 'error' })
      }
    } finally {
      setSending(false)
    }
  }

  useEffect(() => {
    const handleBlur = () => {}

    const handleFocus = () => {
      if (isTwitterActionCalled) {
        clearInterval(intervalRef.current)
        setIsTwitterActionCalled(false)
      }
    }
    window.addEventListener('focus', handleFocus)
    window.addEventListener('blur', handleBlur)

    return () => {
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('blur', handleBlur)
    }
  }, [isTwitterActionCalled])

  const getVerifyButton = () => {
    let title = ''
    let onClick = null
    let isLoading = false
    let loadingText = ''
    if (type === 'telegram_join') {
      title = 'Verify'
      onClick = verifyTask
      isLoading = verifying
      loadingText = 'Verifying'
    } else if (type === 'twitter_follow') {
      title = 'Verify'
      onClick = verifyTask
      isLoading = verifying
      loadingText = 'Verifying'
    } else if (type === 'twitter_tweet') {
      title = 'Verify'
      onClick = verifyTask
      isLoading = verifying
      loadingText = 'Verifying'
    } else if (type === 'twitter_like' || type === 'twitter_retweet') {
      return null
    } else if (type === 'discord_join') {
      if (socialmedia && !!socialmedia.discord) {
        title = 'Verify'
        onClick = verifyTask
        isLoading = verifying
        loadingText = 'Verifying'
      } else {
        title = 'Connect Discord'
        onClick = (e) =>
          actionBtnPreProcess(e, (signature) =>
            getDiscordOAuthUrl(
              signature,
              selectedWallet === 'Phantom' ? wallet?.publicKey?.toBase58() : account,
              accessKey,
            ),
          )
        isLoading = connecting
        loadingText = 'Connecting'
      }
    } else if (type === 'onchain_graph') {
      title = 'Verify'
      onClick = verifyTask
      isLoading = verifying
      loadingText = 'Verifying'
    } else if (type === 'offchain_rest_api') {
      title = 'Verify'
      onClick = verifyTask
      isLoading = verifying
      loadingText = 'Verifying'
    } else if (type === 'email_verify') {
      return null
    } else if (type === 'epns_subscription') {
      title = 'Verify'
      onClick = verifyTask
      isLoading = verifying
      loadingText = 'Verifying'
    }

    return (
      <Button variant="outline" size="xs" onClick={onClick} isLoading={isLoading} loadingText={loadingText}>
        {title}
      </Button>
    )
  }

  const getActionButton = () => {
    let title = ''
    let onClick = null
    let loadingText = ''
    let isLoading = false
    if (type === 'onchain_graph') return
    if (type === 'offchain_rest_api') return
    if (type === 'telegram_join') {
      title = 'Join'
      onClick = () => window.open(`https://t.me/${args.channelUsername}`, '_blank', 'height=600,width=600')
      isLoading = actionLoading
      loadingText = 'Joining'
    } else if (type === 'twitter_follow') {
      title = 'Follow'
      onClick = (e) => verifyTwitterTasks(e, type)
      isLoading = actionLoading
      loadingText = 'Following'
    } else if (type === 'twitter_tweet') {
      title = 'Tweet'
      onClick = (e) => verifyTwitterTasks(e, type)
      isLoading = actionLoading
      loadingText = 'Tweeting'
    } else if (type === 'twitter_like') {
      const tweetId = getPostIdFromUrl(args.twitterPostId)
      title = 'Like'
      onClick = (e) => verifyTwitterTasks(e, type)
      isLoading = actionLoading
      loadingText = 'Liking'
    } else if (type === 'twitter_retweet') {
      const tweetId = getPostIdFromUrl(args.twitterPostId)
      title = 'Retweet'
      onClick = (e) => verifyTwitterTasks(e, type)
      isLoading = actionLoading
      loadingText = 'Retweeting'
    } else if (type === 'discord_join') {
      if (!socialmedia?.discord) return null
      title = 'Join'
      onClick = () => window.open(`https://discord.gg/${args.discordInviteLink}`, '_blank', 'height=600,width=600')
    } else if (type === 'email_verify') {
      title = 'Verify'
      onClick = verifyEmail
      isLoading = verifying
      loadingText = 'Verifying'
    } else if (type === 'epns_subscription') {
      title = 'Subscribe'
      onClick = onClick = () =>
        window.open(`https://app.push.org/channels?channel=${args.channelAddress}`, '_blank', 'height=600,width=600')
      isLoading = actionLoading
      loadingText = 'Subscribing'
    }

    return (
      <>
        {['twitter_like', 'twitter_retweet'].includes(type) && !!primaryAddress ? (
          <Popover placement="bottom" closeOnBlur={false} isOpen={isOpen} onClose={onClose} onOpen={onOpen}>
            <PopoverTrigger>
              <Button size="xs" ml={2} isLoading={isLoading} loadingText={loadingText}>
                {title}
              </Button>
            </PopoverTrigger>
            <PopoverContent bg="muted" borderColor="input" w="52">
              <PopoverHeader fontWeight="bold" border="0" fontSize={'14'}>
                Confirmation Required!
              </PopoverHeader>
              <PopoverArrow bg="muted" boxShadow={`-1px -1px 0px 0 ${colors.input}`} />
              <PopoverBody>
                <Text fontSize={'12'}>
                  Once the action is completed your authorization will be invalidated. You can verify it over{' '}
                  <span
                    style={{ textDecoration: 'underline', cursor: 'pointer' }}
                    onClick={() => window.open('https://twitter.com/settings/connected_accounts')}
                  >
                    here
                  </span>
                  .
                </Text>
              </PopoverBody>
              <PopoverFooter border="0" display="flex" alignItems="center" justifyContent="space-between" pb={4}>
                <Box fontSize="sm"></Box>
                <ButtonGroup size="sm">
                  <Button variant={'ghost'} onClick={onClose} size={'xs'}>
                    Cancel
                  </Button>
                  <Button
                    bg="primary"
                    onClick={() => {
                      onClose()
                      onClick()
                    }}
                    size={'xs'}
                  >
                    Authorize
                  </Button>
                </ButtonGroup>
              </PopoverFooter>
            </PopoverContent>
          </Popover>
        ) : (
          <Button size="xs" ml={2} isLoading={isLoading} onClick={onClick} loadingText={loadingText}>
            {title}
          </Button>
        )}
      </>
    )
  }

  const getTaskDescription = () => {
    let link = ''
    if (type === 'twitter_follow') {
      link = `https://twitter.com/${args.twitterUsername}`
    } else if (type === 'twitter_tweet') {
      link = `https://twitter.com/intent/tweet?text=${encodeURIComponent(args.twitterTweet)}`
    } else if (type === 'twitter_like' || type === 'twitter_retweet') {
      link = args.twitterPostId
    } else if (type === 'discord_join') {
      link = `https://discord.gg/${args.discordInviteLink}`
    } else if (type === 'epns_subscription') {
      link = `https://app.push.org/channels?channel=${args.channelAddress}`
    } else if (type === 'telegram_join') {
      link = `https://t.me/${args.channelUsername}`
    } else if (type === 'email_verify') {
      return (
        <>
          <Input
            placeholder="Email"
            mt="2"
            borderColor="input"
            borderWidth="1.5px"
            size="sm"
            onChange={(e) => setEmail(e.target.value)}
            isDisabled={isEmailSet || isCompleted}
            value={email}
          />
          <Button
            mt="2"
            size={'sm'}
            w="full"
            onClick={sendEmail}
            isDisabled={isEmailSet || isCompleted}
            isLoading={sending}
            loadingText={'Submitting...'}
          >
            Submit
          </Button>
          {feedback.message && (
            <Text mt="1" fontSize={'12'} color={feedback.error ? 'red' : 'initial'}>
              {feedback.message}
            </Text>
          )}
        </>
      )
    } else if (type === 'onchain_graph') {
      return (
        <Text fontSize={'xs'} fontWeight={400} color="mutedForeground">
          Click on verify to know your eligibility
        </Text>
      )
    } else if (type === 'offchain_rest_api') {
      return (
        <Text fontSize={'xs'} fontWeight={400} color="mutedForeground">
          Click on verify to know your eligibility
        </Text>
      )
    }
    return (
      <>
        <Text fontSize={12} fontWeight={500}>
          Call-to-Action
        </Text>
        <Link fontSize={14} fontWeight={600} href={link} isExternal>
          {truncateAddress(link, 15)} <ExternalLinkIcon mx="2px" />
        </Link>
      </>
    )
  }

  const cta =
    type === 'twitter_follow'
      ? args.twitterUsername
      : type === 'twitter_like'
      ? args.twitterPostId
      : type === 'twitter_tweet'
      ? args.twitterTweet
      : args.discordInviteLink
  return (
    <AccordionItem>
      {/* <h6> */}
      <AccordionButton>
        <AccordionIcon />
        <Box as="span" flex="1" textAlign="left" fontSize={12} color={isCompleted ? 'green' : 'inherit'}>
          {name}
        </Box>

        {!isCompleted ? (
          <>
            {!readonly && getVerifyButton()}
            {getActionButton()}
          </>
        ) : (
          <CheckCircleIcon color={'green'} />
        )}
      </AccordionButton>
      {/* </h6> */}
      <AccordionPanel pb={4}>
        <Text fontSize={'xs'} mb={4} whiteSpace="pre-line">
          {description}
        </Text>
        {getTaskDescription()}
        {type === 'twitter_retweet' && (
          <Text fontSize={'10'} mt={4}>
            Be sure to claim this quest right after your retweet, as we are only looking at your 10 last retweets. After
            completion, it can take up to 10s before you can claim.
          </Text>
        )}
        {type === 'twitter_like' && (
          <Text fontSize={'10'} mt={4}>
            Be sure to claim this quest right after your like, as we are only looking at your recent likes. After
            completion, it can take up to 10s before you can claim.
          </Text>
        )}
      </AccordionPanel>
    </AccordionItem>
  )
}

export default Task
