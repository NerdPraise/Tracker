import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

import { SideBarLayout } from '_Home/layout/SideBarLayout'
import { Button, Card, Modal, Spacer } from '_Home/components'
import { useAppDispatch, useAppSelector } from '_Home/common/hooks'

import { setSelectedTemplate } from '../redux/actions'
import { TemplatesProcessor } from '../redux/processor'
import styles from '../Invoice.module.styl'

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
    if (selectedTemplate.category.toLowerCase() === 'custom') {
      navigate(`../custom/${selectedTemplate.uuid}`)
      return
    }
    navigate(`./${selectedTemplate.uuid}`)
  }

  return (
    <SideBarLayout disableHide>
      <div className={styles.InvoiceAdd}>
        <div className={styles.header}>
          <h2>Create your invoice</h2>
          <p>
            Select from our specially curated templates&nbsp;
            <span>OR</span>
            &nbsp;<Link to="../custom">Create your template</Link>
          </p>
        </div>
        <div className={styles.templates}>
          <div className={styles.most_recent}>
            <h2 className={styles.template_name}>Recent</h2>
            <div className={`${styles.template_container}`}>
              {processed_templates.recent.map((item, ind) => (
                <Card onClick={() => onTemplateClick(item.uuid)} key={ind} className={styles.template}>
                  <img id="full" className={styles.card_image} src={item?.image || item?.customImage} />
                  {item.category.toLowerCase() === 'custom' && (
                    <div className={styles.custom_backdrop}>CUSTOM</div>
                  )}
                </Card>
              ))}
              {!processed_templates.recent.length && "You don't have any custom templates yet!"}
            </div>
          </div>
          <div className={styles.simple}>
            <h2 className={styles.template_name}>Simple</h2>
            <div className={`${styles.simple_container} ${styles.template_container}`}>
              {processed_templates.simple.map((item, ind) => (
                <Card onClick={() => onTemplateClick(item.uuid)} key={ind} className={styles.template}>
                  <img id="full" className={styles.card_image} src={item?.image} />
                </Card>
              ))}
            </div>
          </div>
          <div className={styles.simple}>
            <h2 className={styles.template_name}>Custom</h2>
            <div className={`${styles.simple_container} ${styles.template_container}`}>
              {processed_templates.custom.map((item, ind) => (
                <Card onClick={() => onTemplateClick(item.uuid)} key={ind} className={styles.template}>
                  <img id="full" className={styles.card_image} src={item?.image} />
                </Card>
              ))}
              {!processed_templates.custom.length && 'FEATURE - INCOMING DRAG & DROP'}
            </div>
          </div>
          <Spacer />
        </div>
        <Modal
          isVisible={showModal}
          className={styles.TemplateModal}
          width="md"
          handleClose={() => setShowModal(false)}
        >
          <div className={styles.modal_content}>
            <div className={styles.template_image}>
              <img
                id="full"
                className={styles.card_image}
                src={selectedTemplate?.image || selectedTemplate?.customImage}
              />
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
