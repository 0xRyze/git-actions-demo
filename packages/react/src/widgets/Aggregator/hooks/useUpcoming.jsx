import { useMemo } from 'react'
import Collection from '../components/TableItems/Collection'
import TotalMints from '../components/TableItems/TotalMints'
import Price from '../components/TableItems/Price'
import LaunchDate from '../components/TableItems/LaunchDate'
import AddToCalendar from '../components/TableItems/AddToCalendar'
import { useDispatch } from 'react-redux'
import { updateSelectedCollectionId } from '../../../state/collection/reducer'
import { changeQueryParams } from '../../../utils'

const useUpcomingMint = () => {
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
          minWidth: '25%',
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
          minWidth: '20%',
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
          minWidth: '20%',
        },
        render: (record) => {
          const { contract, stats } = record
          return <Price price={stats.price} chainId={contract.chainId} />
        },
      },
      {
        title: 'Launch Date',
        textAlign: 'right',
        sx: {
          minWidth: '20%',
        },
        render: (record) => {
          const { stats } = record
          return <LaunchDate startDate={stats.startDate} />
        },
      },
      {
        title: '',
        textAlign: 'right',
        sx: {
          minWidth: '15%',
        },
        render: (record) => {
          return <AddToCalendar collection={record} onClickAdd={() => {}} />
        },
      },
    ]
  }, [onClickCollection])
  return { columns }
}

export default useUpcomingMint
