import { useEffect, useRef, useState } from 'react'
import { isEqual } from 'lodash'

interface useAutoSaveProps {
  data: any
  callback: (data?: any) => void
  interval: number
}

export const useAutoSave = ({ data, callback, interval }: useAutoSaveProps) => {
  const [autoSave, setAutoSave] = useState<boolean>(false)
  const initialRender = useRef<boolean>(true)
  const initialData = useRef<any>(data)

  useEffect(() => {
    let automatedSaveInterval = null
    if (initialRender.current) {
      initialRender.current = false
    } else {
      automatedSaveInterval = setInterval(() => {
        console.log('in here')
        setAutoSave(true)
      }, interval)
    }
    return () => {
      setAutoSave(false)
      automatedSaveInterval && clearInterval(automatedSaveInterval)
    }
  }, [])

  useEffect(() => {
    if (autoSave && !isEqual(initialData.current, data) && !initialRender.current) {
      setAutoSave(false)
      callback()
      initialData.current = data
    }
  }, [autoSave, data])
}
