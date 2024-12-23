import { Link } from 'react-router-dom'
import { useState, useRef } from 'react'
import { useGoogleLogin } from '@react-oauth/google'

import { API } from '_Home/store/api'
import { ROUTES } from '_Home/routing/routes'
import { Button, Input } from '_Home/components'
import { isFormValid } from '_Home/common/utils'
import { useAppSelector, useAppDispatch } from '_Home/common/hooks'
import { loginGoogleUser } from '_Module/authentication/Login/redux/actions'

import Google from '_Images/google.svg?react'
import BouncingBalls from '_Images/bouncing-circles.svg?react'

import { signUpAction } from './redux/actions'
import styles from './SignUp.module.styl'

export const SignUp = () => {
  const { loading } = useAppSelector((state) => state.user)
  const dispatch = useAppDispatch()
  const [formError, setFormError] = useState<Record<string, string>>({})
  const formRef = useRef<HTMLFormElement>(null)
  const [isGoogleLogin, setIsGoogleLogin] = useState(false)

  const onSubmit = () => {
    const form = formRef.current
    const formData = new FormData(form)

    dispatch(signUpAction(formData))
  }

  const googleLogin = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (response) => {
      API.post('auth/google/', JSON.stringify({ code: response.code })).then((response) =>
        dispatch(loginGoogleUser(response)),
      )
    },
    onError: (err) => {
      setIsGoogleLogin(false)
    },
  })

  const onHandleGoogleClick = () => {
    setIsGoogleLogin(true)
    googleLogin()
  }

  return (
    <div className={styles.SignUp}>
      <h3>Create an account</h3>
      <p className={styles.tagline}>Create, Send, and Manage Invoices in Seconds – Get Paid Faster!</p>

      <form ref={formRef} onSubmit={(e) => e.preventDefault()}>
        <div className={styles.form_group}>
          <Input
            name="firstName"
            error={formError}
            setError={setFormError}
            type="text"
            placeholder="First Name"
            className={styles.sign_input}
          />
          <Input
            name="lastName"
            error={formError}
            setError={setFormError}
            type="text"
            placeholder="Last Name"
            className={styles.sign_input}
          />
        </div>
        <Input
          type="text"
          error={formError}
          setError={setFormError}
          placeholder="Username"
          autoComplete="username"
          name="username"
          className={styles.sign_input}
        />
        <Input
          type="email"
          error={formError}
          setError={setFormError}
          placeholder="Email"
          autoComplete="email"
          name="email"
          className={styles.sign_input}
        />
        <Input
          name="password1"
          error={formError}
          setError={setFormError}
          type="password"
          autoComplete="new-password"
          placeholder="Password"
          className={styles.sign_input}
        />
        <Button
          loading={loading}
          disabled={!!Object.keys(formError).length || !isFormValid(formRef)}
          onClick={onSubmit}
          className={styles.form_btn}
          text="Create account"
        />
      </form>

      <div className={styles.divider}>Or register with</div>
      <div className={styles.other_signup}>
        <Button
          onClick={onHandleGoogleClick}
          text={
            !isGoogleLogin ? (
              <>
                <Google />
                GOOGLE
              </>
            ) : (
              <div style={{ width: 50 }}>
                <BouncingBalls fill="white" />
              </div>
            )
          }
        />
      </div>
      <p className="already">
        Already have an account? <Link to={ROUTES.unauthenticatedRoutes.LOGIN.path}> Log in</Link>
      </p>
    </div>
  )
}
