import { useEffect, useRef, useState } from 'react'
import LoadingBar from 'react-top-loading-bar'
import ClassNames from 'classnames'

import { Button, Input, Select, Spacer } from '_Home/components'
import { useAppDispatch, useAppSelector, useUser } from '_Home/common/hooks'
import { StatusCode } from '_Home/common/utils'

import { changePasswordAction, saveUserDetails } from './redux/actions'

import styles from './Settings.module.styl'

const preference_fields = [
  { label: 'Default Timezone', name: 'timezone', options: [] },
  {
    label: 'Date format',
    name: 'dateFormat',
    options: [
      { label: 'DD/MM/YYYY', value: 'DD/MM/YYYY' },
      { label: 'MM/DD/YYYY', value: 'MM/DD/YYYY' },
    ],
  },
]

const GeneralSettings = () => {
  const { user } = useUser()
  const formRef = useRef()
  const dispatch = useAppDispatch()
  const [editField, setEditField] = useState<string | null>(null)
  const [error, setError] = useState<Record<string, string>>({})
  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({
    username: user?.username,
    email: user?.email,
    firstName: user?.firstName,
    timezone: user?.timezone,
    dateFormat: user?.dateFormat,
  })
  // const { loading: invoiceLoading, statusCode } = useAppSelector((state) => state.invoices)
  const { loading: settingsLoading, statusCode } = useAppSelector((state) => state.settings)
  const loadingRef = useRef(null)

  useEffect(() => {
    if (!settingsLoading && statusCode === StatusCode.SUCCESS) {
      loadingRef.current?.complete()
      setEditField('')
    }
  }, [statusCode, settingsLoading])

  const validatePassword = () => {
    const form = formRef.current as HTMLFormElement
    const password = (form.elements.namedItem('new_password') as HTMLInputElement).value
    const otherPassword = (form.elements.namedItem('new_password2') as HTMLInputElement).value

    if (password !== otherPassword) {
      return 'Password is not the same'
    }
    return ''
  }

  const handleSaveSelect = (name: string, value: string) => {
    loadingRef.current?.continuousStart()
    dispatch(saveUserDetails({ [name]: value }))
  }
  const handleChangePassword = () => {
    loadingRef.current?.continuousStart()
    const form = formRef.current
    const formData = new FormData(form)
    dispatch(changePasswordAction(formData))
  }

  const handleSaveInput = (name: keyof IUser) => {
    loadingRef.current?.continuousStart()
    dispatch(saveUserDetails({ [name]: inputValues[name] }, true))
    setEditField(null)
  }
  const handleChange = (name: string, value: string) => {
    setInputValues((prev) => ({ ...prev, [name]: value }))
  }

  const basic_fields = [
    { label: 'Username', name: 'username' },
    { label: 'Email', name: 'email' },
  ]

  const renderField = ({ label, name }: { label: string; name: string }) => (
    <div className={styles.input_obj} key={name}>
      <div>{label}</div>
      <div className={styles.input}>
        {editField === name ? (
          <Input
            type="text"
            name={name}
            error={error}
            setError={setError}
            value={inputValues[name]}
            onChange={(e) => handleChange(name, e.target.value)}
          />
        ) : (
          <div>{inputValues[name]}</div>
        )}
      </div>
      <div className={styles.edit_field}>
        {editField === name ? (
          <div onClick={() => handleSaveInput(name as keyof IUser)}>Save</div>
        ) : (
          <div onClick={() => setEditField(name)}>Edit</div>
        )}
      </div>
    </div>
  )

  const preferenceRenderField = ({
    label,
    name,
    options,
  }: {
    label: string
    name: string
    options: any
  }) => (
    <div className={styles.input_obj} key={name}>
      <div>{label}</div>

      <div className={styles.select}>
        <Select
          name={name}
          defaultValue={options.find((item) => item.label === user?.[name])}
          onChange={(value: string) => handleSaveSelect(name, value)}
          className={styles.select_op}
          options={options}
        />
      </div>
    </div>
  )

  return (
    <div className={styles.General}>
      <LoadingBar ref={loadingRef} color="#c770fe" />
      <div className={styles.basic}>
        <h5>Basic</h5>
        {basic_fields.map(renderField)}
        <div className={ClassNames(styles.input_obj, styles.password)}>
          <div>Password</div>
          {editField === 'password' ? (
            <form className={styles.input} ref={formRef} onSubmit={(e) => e.preventDefault()}>
              <Input
                type="password"
                name="old_password"
                labelName={
                  <p>
                    Current Password <span className={styles.important}>&nbsp;*</span>
                  </p>
                }
              />
              <Input
                type="password"
                name="new_password"
                error={error}
                setError={setError}
                labelName={
                  <p>
                    New Password <span className={styles.important}>&nbsp;*</span>
                  </p>
                }
              />
              <Input
                type="password"
                name="new_password2"
                customValidation={validatePassword}
                error={error}
                setError={setError}
                labelName={
                  <p>
                    Rewrite Password <span className={styles.important}>&nbsp;*</span>
                  </p>
                }
              />
              <Button onClick={handleChangePassword} text="Save" />
            </form>
          ) : (
            <div className={styles.input}>* * * * * * *</div>
          )}
          <div className={styles.edit_field}>
            {!(editField === 'password') && <div onClick={() => setEditField('password')}>Edit</div>}
          </div>
        </div>
      </div>
      <div className={styles.preferences}>
        <h5>Preferences</h5>
        {preference_fields.map(preferenceRenderField)}
      </div>
      <Spacer />
    </div>
  )
}

export default GeneralSettings
