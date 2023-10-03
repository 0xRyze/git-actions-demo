import { isAddress } from '@ethersproject/address'
import { AddressZero } from '@ethersproject/constants'
import { Contract } from '@ethersproject/contracts'

// account is not optional
function getSigner(provider, account) {
  return provider.getSigner(account).connectUnchecked()
}

// account is optional
function getProviderOrSigner(provider, account) {
  return account ? getSigner(provider, account) : provider
}

// account is optional
export function getContract(address, ABI, provider, account) {
  if (!isAddress(address) || address === AddressZero) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }

  return new Contract(address, ABI, getProviderOrSigner(provider, account))
}
