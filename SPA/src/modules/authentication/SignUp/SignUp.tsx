import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router'

import { ROUTES } from '_Home/routing/routes'
import { Button, Input } from '_Home/components'
import { isFormValid } from '_Home/common/utils'
import { useUser, useAppSelector, useAppDispatch } from '_Home/common/hooks'

import { signUpAction } from './redux/actions'
import styles from './SignUp.module.styl'

export const SignUp = () => {
  const { isLoggedIn, isCheckingLoginStatus } = useUser()
  const { loading } = useAppSelector((state) => state.user)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [formError, setFormError] = useState<Record<string, string>>({})
  const formRef = useRef<HTMLFormElement>(null)

  const validatePassword = () => {
    const form = formRef.current
    const password = (form.elements.namedItem('password1') as HTMLInputElement).value
    const otherPassword = (form.elements.namedItem('password2') as HTMLInputElement).value

    if (password !== otherPassword) {
      return 'Password is not the same'
    }
    return ''
  }

  const onSubmit = () => {
    const form = formRef.current
    const formData = new FormData(form)

    dispatch(signUpAction(formData))
  }

  useEffect(() => {
    if (isLoggedIn && !isCheckingLoginStatus) {
      const redirectPath = ROUTES.authenticatedRoutes.OVERVIEW.path
      navigate(redirectPath)
    }
  }, [isLoggedIn])

  return (
    <div className={styles.SignUpContainer}>
      <h3>Register</h3>
      <form ref={formRef} onSubmit={(e) => e.preventDefault()}>
        <Input
          type="email"
          error={formError}
          setError={setFormError}
          labelName="Email"
          autoComplete="email"
          name="email"
          className={styles.sign_input}
        />
        <Input
          name="username"
          error={formError}
          setError={setFormError}
          type="text"
          autoComplete="username"
          labelName="Username"
          className={styles.sign_input}
        />
        <Input
          name="password1"
          error={formError}
          setError={setFormError}
          type="password"
          autoComplete="new-password"
          labelName="Password"
          className={styles.sign_input}
        />
        <Input
          name="password2"
          type="password"
          autoComplete="new-password"
          labelName="Password again"
          customValidation={validatePassword}
          error={formError}
          setError={setFormError}
          className={styles.sign_input}
        />
        <Button
          loading={loading}
          disabled={!!Object.keys(formError).length || !isFormValid(formRef)}
          onClick={onSubmit}
          text="SignUp"
        />
      </form>
      {/* {!loading && (errorMessage || 'passwordError') && (
          <div className={styles.error-message}>{'passwordError'}</div>
        )} */}
    </div>
  )
}
