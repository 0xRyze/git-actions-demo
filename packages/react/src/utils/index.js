export const getImageUrl = (url, { height, quality }) => {
  if (!url) return
  if (url.includes('imagedelivery.net')) {
    if (url.includes('quality')) {
      return `${url},height=${height}`
    }
    return `${url}/height=${height},quality=${quality}`
  }
  return url
}

// // truncate username
// export const truncateUsername = (username = '') => {
//   if (isValidAddress(username)) {
//     return truncateAddress(username, 5)
//   }
//   return username
// }

// truncate address
export const truncateAddress = (address, digits) => {
  if (address) {
    return address.length > digits
      ? address.substr(0, digits - 1) + '...' + address.substr(address.length - (digits - 1), address.length - 1)
      : address
  } else {
    return ''
  }
}

// make friendly number
export const makeFriendlyNumber = (number) => {
  return new Intl.NumberFormat('en-GB', {
    notation: 'compact',
    compactDisplay: 'short',
  }).format(number)
}

// copy text
export const copyText = (text, cb) => {
  if (navigator.clipboard && navigator.permissions) {
    navigator.clipboard.writeText(text).then(cb)
  } else if (document.queryCommandSupported('copy')) {
    const ele = document.createElement('textarea')
    ele.value = text
    document.body.appendChild(ele)
    ele.select()
    document.execCommand('copy')
    document.body.removeChild(ele)
    cb?.()
  }
}

// extract url from iframe tag if iframe exist
export const extractSrc = (str) => {
  const regex = /<iframe.*src="([^"]+)".*>/
  const match = str.match(regex)
  if (match) {
    return match[1]
  }
  return null
}

export function toCamelize(str) {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
      return index === 0 ? word.toLowerCase() : word.toUpperCase()
    })
    .replace(/\s+/g, '')
}

export function numberToWords(num) {
  const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']
  const tens = ['', 'ten', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']
  const teens = [
    'ten',
    'eleven',
    'twelve',
    'thirteen',
    'fourteen',
    'fifteen',
    'sixteen',
    'seventeen',
    'eighteen',
    'nineteen',
  ]

  if (num === 0) {
    return 'zero'
  }

  let words = ''

  if (num < 0) {
    words += 'negative '
    num = Math.abs(num)
  }

  if (num >= 1000000) {
    words += numberToWords(Math.floor(num / 1000000)) + ' million '
    num %= 1000000
  }

  if (num >= 1000) {
    words += numberToWords(Math.floor(num / 1000)) + ' thousand '
    num %= 1000
  }

  if (num >= 100) {
    words += ones[Math.floor(num / 100)] + ' hundred '
    num %= 100
  }

  if (num >= 20) {
    words += tens[Math.floor(num / 10)] + ' '
    num %= 10
  } else if (num >= 10) {
    words += teens[num - 10] + ' '
    num = 0
  }

  if (num > 0) {
    words += ones[num]
  }

  return words.trim()
}

export function eToNumber(x) {
  if (Math.abs(x) < 1.0) {
    var e = parseInt(x.toString().split('e-')[1])
    if (e) {
      x *= Math.pow(10, e - 1)
      x = '0.' + new Array(e).join('0') + x.toString().substring(2)
    }
  } else {
    var e = parseInt(x.toString().split('+')[1])
    if (e > 20) {
      e -= 20
      x /= Math.pow(10, e)
      x += new Array(e + 1).join('0')
    }
  }
  return x
}

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export const debounce = (func, delay) => {
  let timeoutId
  return function (...args) {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

export const readFile = async (file) => {
  const fileReader = new FileReader()
  return new Promise((resolve, reject) => {
    fileReader.onload = () => {
      const arrayBuffer = fileReader.result
      const buffer = Buffer.from(arrayBuffer)
      resolve(buffer)
    }
    fileReader.onerror = function (error) {
      reject(error)
    }
    fileReader.readAsArrayBuffer(file)
  })
}

export const getJsonByteSize = (json) => {
  const jsonString = JSON.stringify(json)
  const bytes = new TextEncoder().encode(jsonString)
  return bytes.length
}

export const folderValidation = (files) => {
  let totalSize = 0
  // check if files array length is even
  if (files.length % 2 !== 0) {
    throw new Error('Invalid folder')
  }

  // collection
  let collectionFiles = []
  Array.from(files).forEach((jsonFile, i, folder) => {
    if (jsonFile.name === 'collection.json' && jsonFile.type === 'application/json') {
      totalSize += jsonFile.size
      collectionFiles.push(jsonFile)
      folder.find((pngFile) => {
        if (pngFile.name === 'collection.png' && pngFile.type === 'image/png') {
          totalSize += pngFile.size
          collectionFiles.push(pngFile)
        }
      })
    }
  })
  if (collectionFiles.length !== 2) {
    throw new Error('Invalid collection files')
  }

  // remove collection.json and collection.png files from files array
  const filteredFiles = files.filter((file) => {
    return file.name !== 'collection.json' && file.name !== 'collection.png'
  })

  // checking for 0.json and 0.png files till <n>.json and <n>.png
  for (let i = 0; i < filteredFiles.length / 2; i++) {
    const jsonFilename = `${i}.json`
    const pngFilename = `${i}.png`
    let assetFiles = []
    Array.from(filteredFiles).forEach((jsonFile, i) => {
      if (jsonFile.name === jsonFilename && jsonFile.type === 'application/json') {
        totalSize += jsonFile.size
        assetFiles.push(jsonFile)
      }
    })
    Array.from(filteredFiles).find((pngFile) => {
      if (pngFile.name === pngFilename && pngFile.type === 'image/png') {
        totalSize += pngFile.size
        assetFiles.push(pngFile)
      }
    })

    if (assetFiles.length !== 2) {
      throw new Error(`Invalid assets of file starting with ${i}`)
    }
    return totalSize
  }
}

export const changeQueryParams = (searchParam, pathname, collectionId, update, isCollectionView, isMintView, reset) => {
  if (!reset) {
    const queryParams = new URLSearchParams(searchParam)
    queryParams.set('collectionId', collectionId)
    // queryParams.set('collectionView', isCollectionView)
    // queryParams.set('mintView', isMintView)
    const newUrl = `${pathname}?${queryParams.toString()}${isMintView ? '#mint' : ''}`
    update(newUrl)
  } else {
    update(pathname)
  }
}

export const sleep = (seconds) => new Promise((resolve) => setTimeout(resolve, seconds * 1000))
