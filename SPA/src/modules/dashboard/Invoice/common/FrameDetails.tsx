import ClassNames from 'classnames'
import { useEffect, useRef, useState } from 'react'

import { useAppDispatch, useAppSelector } from '_Home/common/hooks'
import { Frame } from '_Home/components'

import styles from '../Invoice.module.styl'

interface FrameDetailsProps {
  template: MustacheHtml
  context: TemplateContext
}

export const FrameDetails = ({ template, context }: FrameDetailsProps) => {
  const editFrameClassName = ClassNames(styles.frame_box)

  return (
    <div className={styles.FrameDetails}>
      <div className={editFrameClassName}>
        <Frame className={styles.preview_frame} template={template} context={context} />
      </div>
    </div>
  )
}
