const normalizeWalletName = (name) => {
  if (!name) return ''
  return name.replace(/\W/g, '').toLowerCase()
}

export { normalizeWalletName }
