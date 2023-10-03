import { useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { updateSelectedCollectionId } from '../../../state/collection/reducer'
import { changeQueryParams } from '../../../utils'
import Collection from '../components/TableItems/Collection'
import MintButton from '../components/TableItems/MintButton'
import OneHourMints from '../components/TableItems/OneHourMints'
import Price from '../components/TableItems/Price'
import TotalMints from '../components/TableItems/TotalMints'
import UniqueMinters from '../components/TableItems/UniqueMinters'

const useFreeMint = () => {
  const dispatch = useDispatch()
  const onClickCollection = (id) => {
    dispatch(updateSelectedCollectionId({ id }))
    changeQueryParams(
      window.location.search,
      window.location.pathname,
      id,
      (url) => {
        window.history.pushState({}, '', url)
      },
      true,
      false,
      false,
    )
  }
  const columns = useMemo(() => {
    return [
      {
        title: 'Collection',
        textAlign: 'left',
        sx: {
          minWidth: '20%',
        },
        render: (record) => {
          const { collectionId, isFeatured, profile, stats, contract } = record
          return (
            <Collection
              collectionId={collectionId}
              profileImage={profile.profileImage}
              name={profile.name}
              isFeatured={isFeatured}
              launchedOn={stats.launchedOn}
              startDate={stats.startDate}
              onClickCollection={onClickCollection}
              launchpad={contract.launchpad}
            />
          )
        },
      },
      {
        title: 'Total Mints',
        textAlign: 'right',
        sx: {
          minWidth: '18%',
        },
        render: (record) => {
          const { stats } = record
          return <TotalMints totalSupply={stats.totalSupply} maxSupply={stats.maxSupply} />
        },
      },
      {
        title: 'Mint Price',
        textAlign: 'right',
        sx: {
          minWidth: '18%',
        },
        render: (record) => {
          const { contract, stats } = record
          return <Price price={stats.price} chainId={contract.chainId} />
        },
      },
      {
        title: '1h Mints',
        textAlign: 'right',
        sx: {
          minWidth: '14%',
        },
        render: (record) => {
          const { stats } = record
          return <OneHourMints hourlyMint={stats.hourlyMint} />
        },
      },
      {
        title: 'Unique Minters',
        textAlign: 'right',
        sx: {
          minWidth: '18%',
        },
        render: (record) => {
          const { stats } = record
          return <UniqueMinters minters={stats.minters} totalSupply={stats.totalSupply} />
        },
      },
      {
        title: '',
        textAlign: 'right',
        sx: {
          minWidth: '12%',
        },
        render: (record) => {
          const { profile, collectionId, isExternalMint, isCollectionContest } = record
          return (
            <MintButton
              collectionId={collectionId}
              isExternalMint={isExternalMint}
              profile={profile}
              isCollectionContest={isCollectionContest}
            />
          )
        },
      },
    ]
  }, [onClickCollection])
  return { columns }
}

export default useFreeMint
