import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { SideBarLayout } from '_Home/layout/SideBarLayout'
import { Button, Card, Modal } from '_Home/components'
import { useAppDispatch, useAppSelector } from '_Home/common/hooks'
import { ROUTES } from '_Home/routing/routes'

import { getAllTemplates, setSelectedTemplate } from '../redux/actions'
import styles from '../Invoice.module.styl'
import { ITemplate, TemplatesProcessor } from '../redux/processor'

export const AddInvoice = () => {
  const [showModal, setShowModal] = useState<boolean>(false)
  const {
    template: { templates, selectedTemplate },
  } = useAppSelector((state) => state.invoices)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const processed_templates = TemplatesProcessor(templates)
  const dispatchedSetSelectedTemplates = (uuid: string) => dispatch(setSelectedTemplate(uuid))

  const onTemplateClick = (uuid: string) => {
    dispatchedSetSelectedTemplates(uuid)
    setShowModal(true)
  }

  const onTemplateSelected = () => {
    setShowModal(false)
    navigate(`./${selectedTemplate.uuid}`)
  }

  return (
    <SideBarLayout selectedKey={ROUTES.authenticatedRoutes.INVOICE.key} disableHide>
      <div className={styles.InvoiceAdd}>
        <div className={styles.header}>
          <h2>Create invoice</h2>
          <p>Select your most preferred templates</p>
        </div>
        <div className={styles.templates}>
          <div className={styles.most_recent}>
            <h2 className={styles.template_name}>Recent</h2>
            <div className={`${styles.template_container}`}>
              {processed_templates.recent.map((item, ind) => (
                <Card onClick={() => onTemplateClick(item.uuid)} key={ind} className={styles.template}>
                  <img className={styles.card_image} src={item?.image} />
                </Card>
              ))}
            </div>
          </div>
          <div className={styles.simple}>
            <h2 className={styles.template_name}>Simple</h2>
            <div className={`${styles.simple_container} ${styles.template_container}`}>
              {processed_templates.simple.map((item, ind) => (
                <Card onClick={() => onTemplateClick(item.uuid)} key={ind} className={styles.template} />
              ))}
            </div>
          </div>
          <div className={styles.simple}>
            <h2 className={styles.template_name}>Classy</h2>
            <div className={`${styles.simple_container} ${styles.template_container}`}>
              {processed_templates.classy.map((item, ind) => (
                <Card onClick={() => onTemplateClick(item.uuid)} key={ind} className={styles.template} />
              ))}
            </div>
          </div>
        </div>
        <Modal
          isVisible={showModal}
          className={styles.TemplateModal}
          width="md"
          handleClose={() => setShowModal(false)}
        >
          <div className={styles.modal_content}>
            <div className={styles.template_image}>
              <img className={styles.card_image} src={selectedTemplate?.image} />
            </div>
            <div>
              <Button onClick={() => onTemplateSelected()} text="Select template" />
            </div>
          </div>
        </Modal>
      </div>
    </SideBarLayout>
  )
}
