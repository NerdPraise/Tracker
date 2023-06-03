import { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'

import { Button, Input } from '_Home/components'

import { AuthLayout } from '../AuthLayout'
import { ROUTES } from '_Home/routes'
import styles from './SignUp.styl'
import { signUpAction } from './redux/actions'
import { useUser } from '_Home/hooks'
import { isFormValid } from '_Home/utils'

export const SignUp = () => {
  const { isLoggedIn, isCheckingLoginStatus } = useUser()
  const { loading } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const [formError, setFormError] = useState({})
  const navigate = useNavigate()
  const formRef = useRef(null)

  const validatePassword = () => {
    const form = formRef.current
    const {
      password1: { value: password1 },
      password2: { value: password2 },
    } = form.elements

    if (password1 !== password2) {
      return 'Password is not the same'
    }
    return ''
  }

  const onSubmit = () => {
    const form = formRef.current

    const {
      username: { value: username },
      email: { value: email },
      password1: { value: password },
    } = form.elements

    const signUpData = {
      username,
      email,
      password,
    }
    dispatch(signUpAction(signUpData))
  }

  useEffect(() => {
    if (isLoggedIn && !isCheckingLoginStatus) {
      const redirectPath = ROUTES.OVERVIEW_TRACK.path
      navigate(redirectPath)
    }
  }, [isLoggedIn])

  return (
    <AuthLayout>
      <div className={styles.SignUpContainer}>
        <form ref={formRef} onSubmit={(e) => e.preventDefault()}>
          <Input
            type="email"
            error={formError}
            setError={setFormError}
            labelName="Email"
            autoComplete="email"
            name="email"
          />
          <Input
            name="username"
            error={formError}
            setError={setFormError}
            type="text"
            autoComplete="username"
            labelName="Username"
          />
          <Input
            name="password1"
            error={formError}
            setError={setFormError}
            type="password"
            autoComplete="new-password"
            labelName="Password"
          />
          <Input
            name="password2"
            type="password"
            autoComplete="new-password"
            labelName="Password again"
            customValidation={validatePassword}
            error={formError}
            setError={setFormError}
          />
          <Button
            loading={loading}
            disabled={loading || Object.keys(formError).length || !isFormValid(formRef)}
            onClick={onSubmit}
            text="SignUp"
          />
        </form>
        {/* {!loading && (errorMessage || 'passwordError') && (
          <div className="error-message">{'passwordError'}</div>
        )} */}
      </div>
    </AuthLayout>
  )
}
