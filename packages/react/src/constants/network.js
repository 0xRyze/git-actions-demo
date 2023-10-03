import { SupportedChainId } from './chains'

const SUPPORTED_NETWORKS_NAMES = {
  [SupportedChainId.MAINNET]: 'Ethereum',
  [SupportedChainId.GOERLI]: 'Goerli',
  [SupportedChainId.BINANCE]: 'BNB Smart Chain',
  [SupportedChainId.BINANCE_TESTNET]: 'BNB Smart Chain Testnet',
  [SupportedChainId.SOLANA]: 'Solana Mainnet',
  [SupportedChainId.SOLANA_DEVNET]: 'Solana Devnet',
  [SupportedChainId.SHARDEUM20]: 'Shardeum Sphinx DApp 1.X',
  [SupportedChainId.SHARDEUM_SPHINX]: 'Shardeum Sphinx',
  [SupportedChainId.POLYGON_MUMBAI]: 'Polygon Mumbai',
  [SupportedChainId.POLYGON_MAINNET]: 'Polygon',
  [SupportedChainId.BASE_MAINNET]: 'Base Mainnet',
  [SupportedChainId.BASE_TESTNET]: 'Base Goerli',
  [SupportedChainId.CORE_MAINNET]: 'Core Mainnet',
  [SupportedChainId.CORE_TESTNET]: 'Core Testnet',
  [SupportedChainId.TELOS_MAINNET]: 'Telos',
  [SupportedChainId.TELOS_TESTNET]: 'Telos Testnet',
  [SupportedChainId.OPTIMISM_MAINNET]: 'Optimism',
  [SupportedChainId.OPTIMISM_GOERLI]: 'Optimism Goerli',
  [SupportedChainId.ARBITRUM]: 'Arbitrum',
  [SupportedChainId.ARBITRUM_GOERLI]: 'Arbitrum Goerli',
  [SupportedChainId.AVALANCHE]: 'Avalanche',
  [SupportedChainId.AVALANCHE_TESTNET]: 'Avalanche Testnet',
  [SupportedChainId.ZORA_MAINNET]: 'Zora Mainnet',
  [SupportedChainId.ZORA_GOERLI]: 'Zora Goerli',
}

export const SUPPORTED_NETWORKS_INFO = {
  [SupportedChainId.MAINNET]: {
    name: 'Ethereum mainnet',
    api: 'https://api.etherscan.io/api',
    key: '7GJC7W52P7BJ3ESQCBGG2YP3M597M69ZEC',
    explorer: 'https://etherscan.io',
  },

  [SupportedChainId.GOERLI]: {
    name: 'Goerli',
    api: 'https://api-goerli.etherscan.io/api',
    key: '7GJC7W52P7BJ3ESQCBGG2YP3M597M69ZEC',
    explorer: 'https://goerli.etherscan.io',
  },
  [SupportedChainId.BINANCE]: {
    name: 'Binance smart chain mainnet',
    api: 'https://api.bscscan.com/api',
    key: '3THBPRKH4RNSF4KF52JFAJZX92SHX2FUIV',
    explorer: 'https://bscscan.com',
  },
  [SupportedChainId.BINANCE_TESTNET]: {
    name: 'Binance smart chain testnet',
    api: 'https://api-testnet.bscscan.com/api',
    key: '3THBPRKH4RNSF4KF52JFAJZX92SHX2FUIV',
    explorer: 'https://testnet.bscscan.com',
  },
  [SupportedChainId.SHARDEUM20]: {
    name: 'Shadreum liberty 2.0',
    api: '',
    key: '',
    explorer: 'https://explorer-liberty20.shardeum.org/',
  },
  [SupportedChainId.SOLANA]: {
    name: 'Solana',
    api: '',
    key: '',
  },
  [SupportedChainId.SOLANA_DEVNET]: {
    name: 'Solana devnet',
    api: '',
    key: '',
  },
  [SupportedChainId.BASE_MAINNET]: {
    name: 'Base mainnet',
    api: '',
    key: '',
    explorer: 'https://basescan.org',
  },
  [SupportedChainId.BASE_TESTNET]: {
    name: 'Base testnet',
    api: '',
    key: '',
    explorer: 'https://goerli.basescan.org',
  },
  [SupportedChainId.CORE_MAINNET]: {
    name: 'Core mainnet',
    api: '',
    key: '',
    explorer: 'https://scan.coredao.org/',
  },
  [SupportedChainId.CORE_TESTNET]: {
    name: 'Core testnet',
    api: '',
    key: '',
    explorer: 'https://scan.test.btcs.network/',
  },
}

/**
 * These are the network URLs used by the interface when there is not another available source of chain data
 */
export const NETWORK_URLS = {
  [SupportedChainId.MAINNET]: `https://mainnet.infura.io/v3/3e34307cdece46d9a15cce3d2a7525a2`,
  [SupportedChainId.GOERLI]: `https://goerli.infura.io/v3/82e1f883cd2d45608ba6022fa9432ff0`,
  [SupportedChainId.SHARDEUM20]: `https://dapps.shardeum.org/`,
  [SupportedChainId.SHARDEUM_SPHINX]: `https://sphinx.shardeum.org/`,
  [SupportedChainId.BINANCE]: `https://bsc-dataseed.binance.org`,
  [SupportedChainId.BINANCE_TESTNET]: `https://data-seed-prebsc-1-s1.binance.org:8545`,
  [SupportedChainId.POLYGON_MUMBAI]: `https://polygon-mumbai.infura.io/v3/3e34307cdece46d9a15cce3d2a7525a2`,
  [SupportedChainId.POLYGON_MAINNET]: `https://polygon-mainnet.infura.io/v3/82e1f883cd2d45608ba6022fa9432ff0`,
  [SupportedChainId.BASE_MAINNET]: `https://mainnet.base.org`,
  [SupportedChainId.BASE_TESTNET]: `https://goerli.base.org`,
  [SupportedChainId.CORE_MAINNET]: `https://rpc.coredao.org/`,
  [SupportedChainId.CORE_TESTNET]: `https://rpc.test.btcs.network/`,
  [SupportedChainId.TELOS_MAINNET]: `https://mainnet.telos.net/evm`,
  [SupportedChainId.TELOS_TESTNET]: `https://testnet.telos.net/evm`,
  [SupportedChainId.OPTIMISM_GOERLI]: `https://goerli.optimism.io`,
  [SupportedChainId.OPTIMISM_MAINNET]: `https://optimism.meowrpc.com`,
  [SupportedChainId.ARBITRUM]: `https://arb1.arbitrum.io/rpc`,
  [SupportedChainId.ARBITRUM_GOERLI]: `https://endpoints.omniatech.io/v1/arbitrum/goerli/public`,
  [SupportedChainId.AVALANCHE]: `https://api.avax.network/ext/bc/C/rpc`,
  [SupportedChainId.AVALANCHE_TESTNET]: `https://api.avax-test.network/ext/bc/C/rpc`,
  [SupportedChainId.ZORA_MAINNET]: `https://rpc.zora.energy`,
  [SupportedChainId.ZORA_GOERLI]: `https://testnet.rpc.zora.energy`,
}
export const NETWORK_URLS_FOR_WALLET = {
  [SupportedChainId.MAINNET]: `https://mainnet.infura.io/v3/3e34307cdece46d9a15cce3d2a7525a2`,
  [SupportedChainId.GOERLI]: `https://goerli.infura.io/v3/82e1f883cd2d45608ba6022fa9432ff0`,
  [SupportedChainId.BINANCE]: `https://bsc-dataseed.binance.org`,
  [SupportedChainId.SHARDEUM_SPHINX]: `https://sphinx.shardeum.org/`,
  [SupportedChainId.SHARDEUM20]: `https://dapps.shardeum.org/`,
  [SupportedChainId.BINANCE_TESTNET]: `https://data-seed-prebsc-1-s1.binance.org:8545`,
  [SupportedChainId.POLYGON_MUMBAI]: `https://endpoints.omniatech.io/v1/matic/mumbai/public`,
  [SupportedChainId.POLYGON_MAINNET]: `https://polygon.llamarpc.com`,
  [SupportedChainId.BASE_MAINNET]: `https://mainnet.base.org`,
  [SupportedChainId.BASE_TESTNET]: `https://goerli.base.org`,
  [SupportedChainId.TELOS_MAINNET]: `https://mainnet.telos.net/evm`,
  [SupportedChainId.TELOS_TESTNET]: `https://testnet.telos.net/evm`,
  [SupportedChainId.OPTIMISM_GOERLI]: `https://goerli.optimism.io`,
  [SupportedChainId.OPTIMISM_MAINNET]: `https://optimism.meowrpc.com`,
  [SupportedChainId.ARBITRUM]: `https://arb1.arbitrum.io/rpc`,
  [SupportedChainId.ARBITRUM_GOERLI]: `https://endpoints.omniatech.io/v1/arbitrum/goerli/public`,
  [SupportedChainId.AVALANCHE]: `https://api.avax.network/ext/bc/C/rpc`,
  [SupportedChainId.AVALANCHE_TESTNET]: `https://api.avax-test.network/ext/bc/C/rpc`,
  [SupportedChainId.ZORA_MAINNET]: `https://rpc.zora.energy`,
  [SupportedChainId.ZORA_GOERLI]: `https://testnet.rpc.zora.energy`,
}

export const FALLBACK_URLS = {
  [SupportedChainId.MAINNET]: [
    // "Safe" URLs
    'https://api.mycryptoapi.com/eth',
    'https://cloudflare-eth.com',
    // "Fallback" URLs
    'https://rpc.ankr.com/eth',
    'https://eth-mainnet.public.blastapi.io',
  ],

  [SupportedChainId.GOERLI]: [
    // "Safe" URLs
    'https://rpc.goerli.mudit.blog/',
    // "Fallback" URLs
    'https://rpc.ankr.com/eth_goerli',
  ],
}

export const CHAIN_IDS_TO_NAMES_URL_COMPONENT = {
  [SupportedChainId.MAINNET]: encodeURIComponent('ethereum'),
  [SupportedChainId.GOERLI]: encodeURIComponent('goerli'),
  [SupportedChainId.BINANCE]: encodeURIComponent('binance'),
  [SupportedChainId.BINANCE_TESTNET]: encodeURIComponent('binance testnet'),
  [SupportedChainId.SOLANA]: encodeURIComponent('solana'),
  [SupportedChainId.SOLANA_DEVNET]: encodeURIComponent('solana_devnet'),
  [SupportedChainId.SHARDEUM20]: encodeURIComponent('shardeum 2.0'),
  [SupportedChainId.POLYGON_MAINNET]: encodeURIComponent('polygon'),
  [SupportedChainId.POLYGON_MUMBAI]: encodeURIComponent('polygon-mumbai'),
  [SupportedChainId.STACKS_MAINNET]: encodeURIComponent('stacks'),
  [SupportedChainId.STACKS_TESTNET]: encodeURIComponent('stacks testnet'),
  [SupportedChainId.BASE_MAINNET]: encodeURIComponent('base mainnet'),
  [SupportedChainId.BASE_TESTNET]: encodeURIComponent('base testnet'),
  [SupportedChainId.CORE_MAINNET]: encodeURIComponent('core mainnet'),
  [SupportedChainId.CORE_TESTNET]: encodeURIComponent('core testnet'),
}

export const CHAIN_IDS_TO_NAMES = {
  [SupportedChainId.MAINNET]: 'ETHEREUM',
  [SupportedChainId.GOERLI]: 'GOERLI',
  [SupportedChainId.BINANCE]: 'BSC',
  [SupportedChainId.BINANCE_TESTNET]: 'BSC_TESTNET',
  [SupportedChainId.SOLANA]: 'SOLANA',
  [SupportedChainId.SOLANA_DEVNET]: 'SOLANA_DEVNET',
  [SupportedChainId.SHARDEUM20]: 'SHARDEUM',
  [SupportedChainId.SHARDEUM_SPHINX]: 'SHARDEUM_SPHINX_1.X',
  [SupportedChainId.POLYGON_MAINNET]: 'POLYGON',
  [SupportedChainId.POLYGON_MUMBAI]: 'POLYGON_MUMBAI',
  [SupportedChainId.STACKS_MAINNET]: 'STACKS',
  [SupportedChainId.STACKS_TESTNET]: 'STACKS_TESTNET',
  [SupportedChainId.BASE_MAINNET]: 'BASE_MAINNET',
  [SupportedChainId.BASE_TESTNET]: 'BASE_GOERLI',
  [SupportedChainId.CORE_MAINNET]: 'CORE',
  [SupportedChainId.CORE_TESTNET]: 'CORE_TESTNET',
  [SupportedChainId.TELOS_MAINNET]: 'TELOS_MAINNET',
  [SupportedChainId.TELOS_TESTNET]: 'TELOS_TESTNET',
  [SupportedChainId.OPTIMISM_MAINNET]: 'OPTIMISM',
  [SupportedChainId.OPTIMISM_GOERLI]: 'OPTIMISM_GOERLI',
  [SupportedChainId.ARBITRUM]: 'ARBITRUM',
  [SupportedChainId.ARBITRUM_GOERLI]: 'ARBITRUM_GOERLI',
  [SupportedChainId.AVALANCHE]: 'AVALANCHE',
  [SupportedChainId.AVALANCHE_TESTNET]: 'AVALANCHE_TESTNET',
  [SupportedChainId.ZORA_GOERLI]: 'ZORA_GOERLI',
  [SupportedChainId.ZORA_MAINNET]: 'ZORA',
}

export { SUPPORTED_NETWORKS_NAMES }
