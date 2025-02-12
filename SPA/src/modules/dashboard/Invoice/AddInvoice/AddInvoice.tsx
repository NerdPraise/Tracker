import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

import { SideBarLayout } from '_Home/layout/SideBarLayout'
import { Button, Card, Modal, Spacer } from '_Home/components'
import { useAppDispatch, useAppSelector } from '_Home/common/hooks'

import BouncingBalls from '_Images/bouncing-circles.svg?react'

import { createNewCustomTemplate, setSelectedTemplate } from '../redux/actions'
import { TemplatesProcessor } from '../redux/processor'
import styles from '../Invoice.module.styl'

export const AddInvoice = () => {
  const [showModal, setShowModal] = useState<boolean>(false)
  const [createLoading, setCreateLoading] = useState<boolean>(false)
  const {
    template: { templates, selectedTemplate, isCreateLoading, errorMessage },
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
    setCreateLoading(true)
    if (selectedTemplate.category?.toLowerCase() === 'custom') {
      dispatch(createNewCustomTemplate())
    }
  }

  useEffect(() => {
    let debouncedCreateSimpleInvoice
    if (createLoading && showModal && selectedTemplate?.category?.toLowerCase() !== 'custom') {
      debouncedCreateSimpleInvoice = setTimeout(() => {
        navigate(`../edit/temp`)
        setCreateLoading(false)
        setShowModal(false)
      }, 2000)
    }

    return () => debouncedCreateSimpleInvoice && clearTimeout(debouncedCreateSimpleInvoice)
  }, [createLoading])

  useEffect(() => {
    if (createLoading && !isCreateLoading && selectedTemplate.uuid && !errorMessage.length) {
      if (selectedTemplate.category.toLowerCase() === 'custom') {
        navigate(`../custom/${selectedTemplate.uuid}`)
        setCreateLoading(false)
        return
      }
    }
  }, [isCreateLoading, selectedTemplate])

  return (
    <SideBarLayout disableHide>
      <div className={styles.InvoiceAdd}>
        <div className={styles.header}>
          <h2 className="text-2xl font-semibold">Create your invoice</h2>
          <p>
            Select from our specially curated templates&nbsp;
            <span>OR</span>
            &nbsp;<Link to="../custom">Create your template</Link>
          </p>
        </div>
        <div className={styles.templates}>
          <div className={styles.most_recent}>
            <h2 className={`${styles.template_name} ${styles.recent}`}>Recent</h2>
            <div className={`${styles.template_container}`}>
              {processed_templates.recent.map((item, ind) => (
                <Card onClick={() => onTemplateClick(item.uuid)} key={ind} className={styles.template}>
                  <img id="full" className={styles.card_image} src={item?.customImage || item?.image} />
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
            <h2 className={`${styles.template_name} ${styles.custom}`}>Custom</h2>
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
                src={selectedTemplate?.customImage || selectedTemplate?.image}
              />
            </div>
            <div>
              {!createLoading && <Button onClick={() => onTemplateSelected()} text="Select template" />}
              {createLoading && (
                <div className={styles.loadingProject}>
                  <BouncingBalls fill="#993ad5" />
                </div>
              )}
            </div>
          </div>
        </Modal>
      </div>
    </SideBarLayout>
  )
}
