import axios from 'axios'
import { SDK_API } from '../../constants/endpoints'

export const subscribe = async (email, accessKey) => {
  try {
    const res = await axios.post(
      `${SDK_API}/subscription`,
      {
        email,
      },
      {
        headers: {
          'X-API-KEY': accessKey,
        },
      },
    )
    return res.data
  } catch (e) {
    throw new Error(e)
  }
}

export const getUser = async (walletAddress, accessKey) => {
  try {
    const res = await axios.get(`${SDK_API}/users/${walletAddress}`, {
      headers: {
        'X-API-KEY': accessKey,
      },
    })
    return res.data
  } catch (e) {
    throw new Error(e)
  }
}

export const getTwitterOAuthUrl = async (
  signature,
  walletAddress,
  accessKey,
  moduleId,
  collectionId,
  task,
  chainId,
  isMobile,
) => {
  try {
    // const data = await axios.post(
    //   `${SDK_API}/users/${walletAddress}/twitter/getAuthUrl`,
    //   {
    //     signature,
    //     walletAddress,
    //   },
    //   {
    //     headers: {
    //       'X-API-KEY': accessKey,
    //     },
    //   },
    // )
    const data = await axios.post(
      `${SDK_API}/users/${walletAddress}/twitter/get-auth-url`,
      {
        signature,
        walletAddress,
        intentModuleId: moduleId,
        intentCollectionId: parseInt(collectionId),
        intentModuleTask: task,
        from: isMobile ? 'MOBILE' : 'DESKTOP',
        chainId,
      },
      {
        headers: {
          'X-API-KEY': accessKey,
        },
      },
    )

    if (isMobile) {
      window.location.href = data.data
    } else {
      window.open(data.data, '_blank', 'height=600,width=600')
    }

    return null
  } catch (e) {
    console.log(e)
    throw e
  }
}

export const getDiscordOAuthUrl = async (signature, walletAddress, accessKey) => {
  try {
    const data = await axios.post(
      `${SDK_API}/users/${walletAddress}/discord/getAuthUrl`,
      {
        signature,
        walletAddress,
      },
      {
        headers: {
          'X-API-KEY': accessKey,
        },
      },
    )
    window.open(data.data, '_blank', 'height=600,width=600')
    return null
  } catch (e) {
    console.log(e)
    throw e
  }
}

export const disconnectTwitter = async (signature, walletAddress, accessKey) => {
  try {
    const data = await axios.post(
      `${SDK_API}/users/${walletAddress}/twitter/disconnect`,
      {
        signature,
        walletAddress,
      },
      {
        headers: {
          'X-API-KEY': accessKey,
        },
      },
    )
    return data.data
  } catch (e) {
    console.log(e)
    throw e
  }
}

export const disconnectDiscord = async (signature, walletAddress, accessKey) => {
  try {
    const data = await axios.post(
      `${SDK_API}/users/${walletAddress}/discord/disconnect`,
      {
        signature,
        walletAddress,
      },
      {
        headers: {
          'X-API-KEY': accessKey,
        },
      },
    )
    return data.data
  } catch (e) {
    console.log(e)
    throw e
  }
}

export const sendEmailCodeVerification = async (email, walletAddress, accessKey, task, collectionId, signature) => {
  try {
    const data = await axios.post(
      `${SDK_API}/collection/contest/${collectionId}/sendVerification`,
      {
        email,
        walletAddress,
        task,
        signature,
      },
      {
        headers: {
          'X-API-KEY': accessKey,
        },
      },
    )
    return data.data
  } catch (e) {
    console.log(e)
    throw e
  }
}

export const getNonce = async (walletAddress, accessKey) => {
  try {
    const res = await axios.post(
      `${SDK_API}/users/getNonce`,
      {
        walletAddress,
      },
      {
        headers: {
          'X-API-KEY': accessKey,
        },
      },
    )
    return res.data
  } catch (e) {
    throw new Error(e)
  }
}
