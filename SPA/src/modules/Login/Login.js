import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router'

import { Button } from '_Home/components'
import { useUser } from '_Home/hooks'

import { loginAction } from './redux/actions'
import { AuthLayout } from '../AuthLayout'
import { ROUTES } from '_Home/routes'
import styles from './Login.styl'

export const Login = () => {
  const dispatch = useDispatch()
  const { isLoggedIn } = useUser()
  const { loading, errorMessage } = useSelector((state) => state.user)
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const navigate = useNavigate()
  const location = useLocation()

  const onSubmit = () => {
    const loginData = {
      email,
      password,
    }
    dispatch(loginAction(loginData))
  }

  useEffect(() => {
    if (isLoggedIn) {
      const queryParams = new URLSearchParams(location.search)
      const redirectPath = queryParams.get('rdr') || ROUTES.OVERVIEW_TRACK.path
      navigate(redirectPath)
    }
  })

  return (
    <AuthLayout>
      <div className={styles.LoginContainer}>
        <input name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button loading={loading} onClick={onSubmit} text="Login" />
        {!loading && errorMessage && <div className="error-message">{errorMessage}</div>}
      </div>
    </AuthLayout>
  )
}
