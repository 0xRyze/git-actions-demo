import { Button, Icon } from '@chakra-ui/react'
import { FiExternalLink } from 'react-icons/fi'
import { useDispatch, useSelector } from 'react-redux'
import { logMetric } from '../../../../components/analytics'
import { METRICS } from '../../../../components/analytics/constants'
import { updateSelectedCollectionId, updateShowMint } from '../../../../state/collection/reducer'
import { changeQueryParams } from '../../../../utils'

const MintButton = ({ collectionId, isExternalMint, profile, isCollectionContest }) => {
  const dispatch = useDispatch()
  const accessKey = useSelector((state) => state.user.accessKey)

  const onClickMint = () => {
    if (isExternalMint) {
      window.open(profile.socialmedia.website)
    } else {
      dispatch(updateSelectedCollectionId({ id: collectionId }))
      dispatch(updateShowMint({ showMint: true }))
      changeQueryParams(
        window.location.search,
        window.location.pathname,
        collectionId,
        (url) => {
          window.history.pushState({}, '', url)
        },
        false,
        true,
        false,
      )
    }
    logMetric(accessKey, METRICS.MINT_CLICK, { collectionId })
  }
  return (
    <Button variant="outline" size="sm" w="20" onClick={onClickMint}>
      {isCollectionContest ? `Claim` : `Mint`}
      {isExternalMint && <Icon as={FiExternalLink} pos="absolute" right="2.5" h="3" w="3" />}
    </Button>
  )
}

export default MintButton
