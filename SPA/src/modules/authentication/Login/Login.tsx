import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'

import { Button, Input } from '_Home/components'
import { ROUTES } from '_Home/routing/routes'
import { useUser, useAppSelector, useAppDispatch } from '_Home/common/hooks'

import { loginAction } from './redux/actions'
import styles from './Login.module.styl'

export const Login = () => {
  const dispatch = useAppDispatch()
  const { isLoggedIn } = useUser()
  const navigate = useNavigate()
  const location = useLocation()
  const { loading, errorMessage } = useAppSelector((state) => state.user)
  const [formLoginData, setFormLoginData] = useState<Record<string, string>>({})

  const onSubmit = () => {
    dispatch(loginAction(formLoginData))
  }

  useEffect(() => {
    if (isLoggedIn) {
      const queryParams = new URLSearchParams(location.search)
      const redirectPath = queryParams.get('rdr') ?? ROUTES.authenticatedRoutes.OVERVIEW.path
      navigate(redirectPath)
    }
  })

  return (
    <div className={styles.LoginContainer}>
      <div className={styles.header}>
        <h2>LOGIN</h2>
        <p>Welcome back! Sign in to your account</p>
      </div>
      <Input
        labelName="Email"
        type="email"
        name="email"
        value={formLoginData?.email}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setFormLoginData((prev) => ({ ...prev, email: e.target.value }))
        }}
      />
      <Input
        labelName="Password"
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
      />
      {!loading && errorMessage && <div className={styles.error_message}>{errorMessage}</div>}
    </div>
  )
}
