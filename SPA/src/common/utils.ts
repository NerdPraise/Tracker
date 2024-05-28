import { camelCase, snakeCase, isArray, transform, isObject } from 'lodash'
export const getFirstTwoLetters = (word: string) => {
  if (typeof word !== 'string') {
    return ''
  }
  const wordList = word.toUpperCase().split(' ')
  if (wordList.length === 1 || wordList.length >= 2) {
    return wordList[0].slice(0, 2)
  }
  return wordList[0].charAt(0) + wordList[1].charAt(1)
}

export const censorWord = (word: string) => {
  if (typeof word !== 'string') {
    return ''
  }
  return '********' + word.slice(-8)
}

export const camelize = (obj: Record<string, unknown>) =>
  transform(obj, (result: Record<string, unknown>, value: unknown, key: string, target) => {
    const camelKey = isArray(target) ? key : camelCase(key)
    result[camelKey] = isObject(value) ? camelize(value as Record<string, unknown>) : value
  })

export const snakify = (obj: Record<string, unknown>) => {
  return transform(obj, (result: Record<string, unknown>, value: unknown, key: string, target) => {
    const camelKey = isArray(target) ? key : snakeCase(key)
    result[camelKey] = isObject(value) ? snakify(value as Record<string, unknown>) : value
  })
}

export const generateColor = (transparency) => {
  return '#' + Math.random().toString(16).substr(-6) + transparency
}

export const isFormValid = (formRef) => {
  const form = formRef.current || {}
  const length = form?.elements?.length
  if (!length) {
    return false
  }
  for (let i = 0; i < length; i++) {
    if (!form.elements[i].value && form.elements[i].name) {
      return false
    }
  }
  return true
}

export const parseErrorFromResponse = (error: Record<string, string>) => {
  return Object.entries(error).reduce((prev, current) => {
    const [key, value] = current
    return prev + `${key}: ${value} <br>`
  }, '')
}

export const capitalise = (word: string) => {
  if (typeof word !== 'string') {
    return ''
  }
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
}

export const StatusCode = {
  CLEARED: 0,
  SUCCESS: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  NOT_ACCEPTABLE: 406,
}

export function monthsForDropdown() {
  return [
    { label: 'January', value: '1' },
    { label: 'February', value: '2' },
    { label: 'March', value: '3' },
    { label: 'April', value: '4' },
    { label: 'May', value: '5' },
    { label: 'June', value: '6' },
    { label: 'July', value: '7' },
    { label: 'August', value: '8' },
    { label: 'September', value: '9' },
    { label: 'October', value: '10' },
    { label: 'November', value: '11' },
    { label: 'December', value: '12' },
  ]
}

// defaultDict equivalent in JS
export class DefaultDict<T extends Object> {
  constructor(defaultInit) {
    return new Proxy<T>({} as T, {
      get: (target, name) =>
        name in target
          ? target[name]
          : (target[name] =
              typeof defaultInit === 'function' ? new defaultInit().valueOf() : defaultInit),
    })
  }
}
export class DefaultDicts<K, V> {
  constructor(private readonly map: Map<K, V>, private readonly defaultFn: (key: K) => V) {}

  get(key: K): V {
    if (this.map.has(key)) {
      return this.map.get(key)!
    }
    const val = this.defaultFn(key)
    this.map.set(key, val)
    return val
  }
}
