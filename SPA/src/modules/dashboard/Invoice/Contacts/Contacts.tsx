import { useEffect, useRef, useState } from 'react'
import { Plus, LoaderCircle } from 'lucide-react'

import { Button, Modal, Input, Grid } from '_Home/components'
import { useAppDispatch, useAppSelector } from '_Home/common/hooks'
import { SideBarLayout } from '_Home/layout/SideBarLayout'
import { noRowRenderer } from '_Home/components/Grid/renderer'
import { StatusCode } from '_Home/common/utils'

import { createUserClient } from '../redux/actions'
import { contactColumnDefs } from '../constants'
import styles from './Contacts.module.styl'

const Contacts = () => {
  const { loading, clients, statusCode, errorMessage } = useAppSelector((state) => state.invoices.client)
  const [open, setOpen] = useState<boolean>(false)
  const formRef = useRef<HTMLFormElement>(null)
  const dispatch = useAppDispatch()

  const handleCreateContact = () => {
    const formData = new FormData(formRef.current)
    dispatch(createUserClient(formData))
  }

  useEffect(() => {
    if (!loading && statusCode === StatusCode.CREATED) {
      setOpen(false)
    }
  }, [statusCode, loading])

  return (
    <SideBarLayout disableHide>
      <div className={styles.Contacts}>
        <div className={styles.header}>
          <h2>Contacts</h2>
          <div className={styles.header_btn}>
            <Button
              className={styles.track_button}
              logo={<Plus size={18} />}
              text="Add contacts"
              onClick={() => setOpen(true)}
            />
          </div>
        </div>
        <div className={styles.contact_list}>
          <Grid
            className={`${styles.grid} ag-theme-customtracker`}
            rowHeight={80}
            columnDefs={contactColumnDefs}
            rowData={clients}
            defaultColDef={{ sortable: true }}
            overlayNoRowsTemplate={noRowRenderer('Contacts')}
          />
        </div>
      </div>
      <Modal
        isVisible={open}
        width="md"
        className={styles.ContactModal}
        handleClose={() => setOpen(false)}
      >
        <form ref={formRef} onSubmit={(e) => e.preventDefault()}>
          <div className={styles.input_group}>
            <Input
              labelName={
                <p className={styles.label_name}>
                  Email Address <span>*</span>
                </p>
              }
              type="email"
              name="email"
            />
            <Input
              labelName={
                <p className={styles.label_name}>
                  Name <span>*</span>
                </p>
              }
              type="text"
              name="name"
            />
          </div>
          <div className={styles.send_btn}>
            <Button text="Add contact" onClick={handleCreateContact} />
          </div>
          <p className="error small" dangerouslySetInnerHTML={{ __html: errorMessage }} />
        </form>
      </Modal>
    </SideBarLayout>
  )
}
export default Contacts
