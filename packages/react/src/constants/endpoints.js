// export const environment = 'production'

import { environment } from '../context/BanditContext'

export const SDK_API =
  environment === 'development' ? 'https://qa-api-v2.bandit.network/sdk' : 'https://api-v2.bandit.network/sdk'
export const SYNC_V2_API =
  environment === 'development' ? 'https://qa-api-v2.bandit.network/sdk' : 'https://event-api-v2.bandit.network/api'
export const SOLANA_API = 'https://solana-api.bandit.network/api'
