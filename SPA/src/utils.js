export const getFirstTwoLetters = (word) => {
  if (typeof word === 'string') {
    const wordList = word.toUpperCase().split(' ')
    if (wordList.length === 1 || wordList.length >= 2) {
      return wordList[0].slice(0, 2)
    }
    return wordList[0].charAt(0) + wordList[1].charAt(1)
  }
  return ''
}

export const censorWord = (word) => {
  if (typeof word === 'string') {
    return '********' + word.slice(-8)
  }
  return ''
}

export const generateColor = (transparency) => {
  return '#' + Math.random().toString(16).substr(-6) + transparency
}

export const isFormValid = (formRef) => {
  const form = formRef.current || {}
  const length = form?.elements?.length
  if (!length) return false
  for (let i = 0; i < length; i++) {
    if (!form.elements[i].value && form.elements[i].name) {
      return false
    }
  }
  return true
}

export const parseErrorFromResponse = (error) => {
  return Object.entries(error).reduce((prev, current) => {
    const [key, value] = current
    return prev + `${key}: ${value} <br>`
  }, '')
}

export const StatusCode = {
  SUCCESS: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  NOT_ACCEPTABLE: 406,
}
