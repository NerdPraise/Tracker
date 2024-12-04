import { useContext, useMemo, useState } from 'react'
import { Camera } from 'lucide-react'

import { BaseWidget } from '../BaseWidget'
import { ImageToolbar } from './ImageToolbar'
import { LayoutContext } from '../../context'

import styles from './ImageWidget.module.styl'

interface ImageWidgetProps {
  img?: string
  frame?: string
  background?: string
  opacity?: number
  widgetId: string
  layout: Layout
}

const defaults = {
  height: 70,
  width: 70,
  opacity: 1,
}

export const ImageWidget = (props: ImageWidgetProps) => {
  const { setSettings, settings } = useContext(LayoutContext)
  const [shape, setShape] = useState<string>('')
  const rectParams = {
    height: props.layout.height || defaults.height,
    width: props.layout.width || defaults.width,
  }

  const getSvgPathData = (shape: string) => {
    switch (shape) {
      case 'rectangle':
        return `M 0 0 H ${rectParams.width} V ${rectParams.height} H 0 Z`
      case 'circle':
        const radius = Math.min(rectParams.width, rectParams.height) / 2
        return `M ${rectParams.width / 2} ${
          rectParams.height / 2
        } m -${radius}, 0 a ${radius},${radius} 0 1,0 ${radius * 2},0 a ${radius},${radius} 0 1,0 -${
          radius * 2
        },0`
      case 'rectangleWithBorders':
        return `M 0 0 H ${rectParams.width} V ${rectParams.height} H 0 Z`
      default:
        return ''
    }
  }

  const setAttribute = (value: any) => {
    const updatedWidgetSettings = settings.widgets.map((item) =>
      item.widgetId === props.widgetId
        ? {
            ...item,
            ...value,
          }
        : item,
    )
    setSettings(updatedWidgetSettings)
  }

  const handleImageChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const updatedWidgetSettings = settings.widgets.map((item) =>
          item.widgetId === props.widgetId
            ? {
                ...item,
                img: reader.result as string,
              }
            : item,
        )
        setSettings(updatedWidgetSettings)
      }
      reader.readAsDataURL(file)
    }
  }

  const clearImage = () => {
    const updatedWidgetSettings = settings.widgets.map((item) =>
      item.widgetId === props.widgetId
        ? {
            ...item,
            img: null,
            layout: {
              ...item.layout,
              ...defaults,
            },
          }
        : item,
    )
    setSettings(updatedWidgetSettings)
  }

  const getClipPath = useMemo(() => {
    if (shape === 'circle') {
      return `circle(${rectParams.width / 2}px at ${rectParams.width / 2}px ${rectParams.width / 2}px)`
    }
    if (shape === 'borders') {
      return `inset(0px round 15px)`
    }
  }, [shape, rectParams.width])

  const moveableProps = useMemo(() => {
    if (shape === 'circle') {
      return {
        scalable: { edge: [], renderDirections: ['nw', 'ne', 'se', 'sw'] },
        keepRatio: true,
        triggerAblesSimultaneously: true,
      }
    }
  }, [shape])

  const selectShape = (value: string) => {
    if (value === 'circle') {
      const updatedWidgetSettings = settings.widgets.map((item) =>
        item.widgetId === props.widgetId
          ? {
              ...item,
              layout: {
                ...item.layout,
                ...defaults,
              },
            }
          : item,
      )
      setSettings(updatedWidgetSettings)
    }
    setShape(value)
  }
  const { img, ...rest } = props

  return (
    <BaseWidget
      {...rest}
      layout={props.layout}
      defaults={defaults}
      moveableProps={moveableProps}
      toolBar={
        <ImageToolbar
          img={img}
          handleClear={clearImage}
          setShape={selectShape}
          setAttribute={setAttribute}
          opacity={props?.opacity || defaults?.opacity}
        />
      }
    >
      <div className={styles.ImageWidget}>
        <div className={styles.background}>
          <svg
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              left: '0px',
              top: '0px',
              overflow: 'visible',
              zIndex: 30,
            }}
          >
            <path
              id="background"
              x="0"
              d={getSvgPathData(shape)}
              y="0"
              width="100%"
              height="100%"
              style={{ stroke: props?.background, border: '1px dashed #83aee6', fill: 'transparent' }}
            ></path>
          </svg>
        </div>
        {!img?.length && (
          <div className={styles.img_cont}>
            <div className={styles.logo}>
              <label htmlFor={props.widgetId}>
                <input
                  type="file"
                  id={props.widgetId}
                  accept="image/*"
                  onChange={handleImageChange}
                  className={styles.file_upload}
                />
                <Camera stroke="#fff" size={30} />
              </label>
            </div>
          </div>
        )}
        {!!img?.length && (
          <div
            style={{
              width: '100%',
              height: '100%',
              clipPath: getClipPath,
            }}
          >
            <img
              id="full"
              src={props.img}
              style={{ maxWidth: '100%', maxHeight: '100%', opacity: props?.opacity }}
            />
          </div>
        )}
      </div>
    </BaseWidget>
  )
}

ImageWidget.widgetId = 'ImageWidget'
