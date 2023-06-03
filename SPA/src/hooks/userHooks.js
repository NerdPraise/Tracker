import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { getUserAction } from '_Home/modules/Login/redux/actions'

export const useUser = () => {
  const { isLoggedIn, isCheckingLoginStatus, user } = useSelector((state) => state.user)
  const dispatch = useDispatch()

  useEffect(() => {
    if (!isLoggedIn) {
      dispatch(getUserAction())
    }
  }, [])

  return {
    user,
    isLoggedIn,
    isCheckingLoginStatus,
  }
}
