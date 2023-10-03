export const SOL_DEVNET_TOKENS = [
  {
    label: 'BONK (Solana)',
    value: 'BONK',
    ticker: 'BONK',
    address: 'ERkzwkBkPeF1Q2LJr9Jqr2dcy4zZSV1pX6VGFxDmniM2',
    chain: 9091,
    decimals: 6,
    id: 9,
  },
  {
    label: 'SOL (Solana)',
    value: 'SOL',
    ticker: 'SOL',
    address: '',
    chain: 9091,
    decimals: 9,
    id: 6,
  },
  {
    label: 'USDT (Solana)',
    value: 'SOL_USDT',
    ticker: 'USDT',
    address: '26TJZb2cciYM95dioxB5u7Yo2A3seLXEkbrLAaiCNwSr',
    chain: 9091,
    decimals: 6,
    id: 12,
  },
]
export const SOL_MAINNET_TOKENS = [
  {
    label: 'BONK (Solana)',
    value: 'BONK',
    ticker: 'BONK',
    address: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
    chain: 9091,
    decimals: 5,
    id: 9,
  },
  {
    label: 'SOL (Solana)',
    value: 'SOL',
    ticker: 'SOL',
    address: '',
    chain: 9091,
    decimals: 9,
    id: 6,
  },
  {
    label: 'USDT (Solana)',
    value: 'SOL_USDT',
    ticker: 'USDT',
    address: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
    chain: 9091,
    decimals: 6,
    id: 12,
  },
]
export const EVM_DEVNET_TOKENS = [
  {
    label: 'USDT (Goerli)',
    value: 'ETH_USDT',
    ticker: 'USDT',
    address: '0x72904413f681e3ad1e054eb5473e65e57aa6856e',
    chain: 5,
  },
  {
    label: 'ETH (Goerli)',
    value: 'ETH',
    ticker: 'ETH',
    chain: 5,
  },
  {
    label: 'MATIC (Mumbai)',
    value: 'MATIC',
    ticker: 'MATIC',
    chain: 80001,
  },
  {
    label: 'USDT (Mumbai)',
    value: 'MATIC_USDT',
    ticker: 'USDT',
    address: '0xf35524a13b9f49885a7c6848f5b164603db92bc0',
    chain: 80001,
  },
]
export const EVM_MAINNET_TOKENS = [
  {
    label: 'ETH (Ethereum)',
    value: 'ETH',
    ticker: 'ETH',
    chain: 1,
  },
  {
    label: 'USDT (Ethereum)',
    value: 'ETH_USDT',
    ticker: 'USDT',
    address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    chain: 1,
  },
  {
    label: 'MATIC (Polygon)',
    value: 'MATIC',
    ticker: 'MATIC',
    chain: 137,
  },
  {
    label: 'USDT (Polygon)',
    value: 'MATIC_USDT',
    ticker: 'USDT',
    address: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
    chain: 137,
  },
]

export const getSolanaTokenFromAddress = (address, isProd) => {
  const tokens = isProd ? SOL_MAINNET_TOKENS : SOL_DEVNET_TOKENS
  return tokens.find((token) => token.address === address)
}
