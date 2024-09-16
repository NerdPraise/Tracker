import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { Link } from 'react-router-dom'
import { useGoogleLogin } from '@react-oauth/google'

import { API } from '_Home/store/api'
import { Button, Input } from '_Home/components'
import { ROUTES } from '_Home/routing/routes'
import { useUser, useAppSelector, useAppDispatch } from '_Home/common/hooks'

import Google from '_Images/google.svg?react'

import { getUserAction, loginAction, loginGoogleUser } from './redux/actions'
import styles from './Login.module.styl'

export const Login = () => {
  const dispatch = useAppDispatch()
  const { isLoggedIn } = useUser()
  const navigate = useNavigate()
  const location = useLocation()
  const { loading, authErrorMessage } = useAppSelector((state) => state.user)
  const [formLoginData, setFormLoginData] = useState<Record<string, string>>({})

  const onSubmit = () => {
    dispatch(loginAction(formLoginData))
  }
  const googleLogin = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (response) => {
      API.post('auth/google/', JSON.stringify({ code: response.code })).then((response) =>
        dispatch(loginGoogleUser(response)),
      )
    },
    onError: (err) => console.log(err),
  })

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(getUserAction())
      const queryParams = new URLSearchParams(location.search)
      const redirectPath = queryParams.get('rdr') ?? ROUTES.authenticatedRoutes.OVERVIEW.path
      navigate(redirectPath)
    }
  }, [isLoggedIn])

  return (
    <div className={styles.LoginContainer}>
      <div className={styles.header}>
        <h2>Log in to your account</h2>
        <p className={styles.tagline}>Experience the best of financial management</p>
      </div>
      <Input
        placeholder="Email"
        type="email"
        name="email"
        value={formLoginData?.email}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setFormLoginData((prev) => ({ ...prev, email: e.target.value }))
        }}
      />
      <Input
        placeholder="Password"
        type="password"
        name="password"
        value={formLoginData?.password}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setFormLoginData((prev) => ({ ...prev, password: e.target.value }))
        }
      />
      <Button
        loading={loading}
        onClick={onSubmit}
        text="Login"
        disabled={Object.entries(formLoginData).length !== 2}
        className={styles.form_btn}
      />
      {!loading && authErrorMessage && <div className={styles.error_message}>{authErrorMessage}</div>}
      <div className={styles.divider}>Or log in with</div>
      <div className={styles.other_signup}>
        <div onClick={googleLogin}>
          <Google />
          GOOGLE
        </div>
      </div>
      <p className="already">
        Don't have an account? <Link to={ROUTES.unauthenticatedRoutes.SIGNUP.path}> Sign up</Link>
      </p>
    </div>
  )
}
