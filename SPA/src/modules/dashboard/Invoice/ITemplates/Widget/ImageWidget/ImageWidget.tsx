import { Camera } from 'lucide-react'

import { BaseWidget } from '../BaseWidget'

import styles from '../BaseWidget.module.styl'

interface ImageWidgetProps {
  settings: {
    widgetId: string
    img?: string
  }
  children: React.ReactNode
}

export const ImageWidget = ({ settings, ...rest }: ImageWidgetProps) => {
  return (
    <BaseWidget widgetId={settings.widgetId} {...rest}>
      <div className={styles.ImageWidget}>
        {!settings.img?.length && (
          <div className={styles.img_cont}>
            <div className={styles.logo} onClick={() => null}>
              <Camera stroke="#fff" />
            </div>
          </div>
        )}
      </div>
    </BaseWidget>
  )
}

ImageWidget.widgetId = 'ImageWidget'
ImageWidget.defaultWidth = 5
ImageWidget.minWidth = 2
ImageWidget.minHeight = 2
ImageWidget.defaults = {}
