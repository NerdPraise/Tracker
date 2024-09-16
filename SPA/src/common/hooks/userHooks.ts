import { useEffect } from 'react'

import { getUserAction } from '_Home/modules/authentication/Login/redux/actions'

import { useAppSelector, useAppDispatch } from './'

export const useUser = () => {
  const dispatch = useAppDispatch()
  const { isLoggedIn, isCheckingLoginStatus, user } = useAppSelector((state) => state.user)

  useEffect(() => {
    if (!isLoggedIn) {
      dispatch(getUserAction())
    }
  }, [])

  return {
    isLoggedIn,
    isCheckingLoginStatus,
    user,
  }
}
