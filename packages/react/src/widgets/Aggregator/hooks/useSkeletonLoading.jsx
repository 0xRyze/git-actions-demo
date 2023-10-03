import { useMemo } from 'react'

const useSkeletonLoading = () => {
  const columns = useMemo(() => {
    return [
      {
        title: 'Collection',
        textAlign: 'left',
        sx: {
          minWidth: '20%',
        },
      },
      {
        title: 'Total Mints',
        textAlign: 'right',
        sx: {
          minWidth: '15%',
        },
      },
      {
        title: 'Mint Price',
        textAlign: 'right',
        sx: {
          minWidth: '15%',
        },
      },
      {
        title: '1h Mints',
        textAlign: 'right',
        sx: {
          minWidth: '15%',
        },
      },
      {
        title: 'Mint %',
        textAlign: 'right',
        sx: {
          minWidth: '15%',
        },
      },
      {
        title: 'Unique Minters',
        textAlign: 'right',
        sx: {
          minWidth: '15%',
        },
      },
      {
        title: '',
        textAlign: 'right',
        sx: {
          minWidth: '5%',
        },
      },
    ]
  }, [])
  return { columns }
}

export default useSkeletonLoading
