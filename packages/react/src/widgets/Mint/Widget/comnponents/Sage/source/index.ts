import axios from 'axios'
import { SOLANA_API } from '../../../../../../constants/endpoints'

export const getSageTransactions = async (
  holderAddress: string,
  curiousMintAddress: string,
  dabblerMintAddress: string,
  degenMintAddress: string,
  serializedMintTransaction: number[],
  isSolGas: boolean,
) => {
  try {
    const { data } = await axios.post(`${SOLANA_API}/transaction`, {
      holderAddress,
      curiousMintAddress,
      dabblerMintAddress,
      degenMintAddress,
      serializedMintTransaction,
      isSolGas,
    })
    return data
  } catch (error) {
    throw error
  }
}

export const getBatPrice = async () => {
  try {
    const { data } = await axios.get(`${SOLANA_API}/price?from=SOL&to=BAT`)
    return data
  } catch (error) {
    throw error
  }
}
