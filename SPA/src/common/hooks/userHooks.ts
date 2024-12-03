import { useEffect, useRef, useState } from 'react'

import { getUserAction } from '_Home/modules/authentication/Login/redux/actions'

import { useAppSelector, useAppDispatch } from './'

export const useUser = () => {
  const [hasCheckedLoginStatus, setHasCheckedLoginStatus] = useState<boolean>(false)
  const dispatch = useAppDispatch()
  const { isLoggedIn, isCheckingLoginStatus, user } = useAppSelector((state) => state.user)
  const didMount = useRef<boolean>(false)

  useEffect(() => {
    if (didMount.current) {
      if (!isCheckingLoginStatus) {
        setHasCheckedLoginStatus(true)
      }
    } else {
      didMount.current = true
    }
  }, [isCheckingLoginStatus])

  useEffect(() => {
    if (!isLoggedIn) {
      dispatch(getUserAction())
    } else {
      setHasCheckedLoginStatus(true)
    }
  }, [hasCheckedLoginStatus])

  return {
    isLoggedIn,
    isCheckingLoginStatus,
    user,
    hasCheckedLoginStatus,
  }
}
