import { useEffect, useRef, useState } from 'react'
import { Plus, ArrowLeft } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { CellClickedEvent } from 'ag-grid-community'
import { AgGridReact } from 'ag-grid-react'

import { Button, Modal, Input, Grid, TextArea, Spacer } from '_Home/components'
import { useAppDispatch, useAppSelector } from '_Home/common/hooks'
import { SideBarLayout } from '_Home/layout/SideBarLayout'
import { noRowRenderer } from '_Home/components/Grid/renderer'
import { StatusCode } from '_Home/common/utils'

import { createUserClient, setSelectedClient } from '../redux/actions'
import { contactColumnDefs } from '../constants'
import styles from './Contacts.module.styl'

const Contacts = () => {
  const { loading, clients, statusCode, errorMessage } = useAppSelector((state) => state.invoices.client)
  const [open, setOpen] = useState<boolean>(false)
  const formRef = useRef<HTMLFormElement>(null)
  const dispatch = useAppDispatch()
  const gridRef = useRef<AgGridReact>(null)
  const navigate = useNavigate()

  const handleCreateContact = () => {
    const formData = new FormData(formRef.current)
    dispatch(createUserClient(formData))
  }

  const onCellClick = (event: CellClickedEvent<IClient>) => {
    if (event.column.getColId().toLowerCase() === 'name') {
      dispatch(setSelectedClient(event.data))
      navigate(`./history/`)
    }
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
          <h2>
            <Link to="..">
              <ArrowLeft />
            </Link>
            Contacts
          </h2>
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
            innerRef={gridRef}
            className={`${styles.grid} ag-theme-customtracker`}
            rowHeight={80}
            columnDefs={contactColumnDefs}
            rowData={clients}
            defaultColDef={{ sortable: true }}
            overlayNoRowsTemplate={noRowRenderer('Contacts')}
            onCellClicked={onCellClick}
          />
        </div>
        <Spacer />
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
            <TextArea
              className={styles.textarea}
              placeholder="Add client's address and other info. (Optional)"
              name="address"
              rows={10}
              cols={40}
              labelName={<p className={styles.label_name}>Address</p>}
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
