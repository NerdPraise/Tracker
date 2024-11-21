import { CopyX, Frame, Circle as CircleIcon, Square, Ban, Blend } from 'lucide-react'
import Circle from '@uiw/react-color-circle'

import { HoverCard, SliderT } from '_Home/components'

import styles from './ImageWidget.module.styl'
import { memo } from 'react'

export const ImageToolbar = memo(
  ({
    img,
    handleClear,
    setShape,
    setAttribute,
    color,
    opacity,
  }: {
    img?: string
    handleClear: VoidFunction
    setShape: (e: string) => void
    setAttribute: (e: any) => void
    color?: string
    opacity?: number
  }) => {
    return (
      <div className={styles.ImageToolBar}>
        <div onClick={img ? handleClear : null}>
          <CopyX
            stroke={img ? '#d2d5d9' : '#4f4f4f'}
            style={{ cursor: img ? 'pointer' : 'not-allowed' }}
            size={18}
          />
        </div>
        <div>
          <HoverCard
            side="top"
            className={styles.color_list}
            trigger={
              <CircleIcon
                size={18}
                stroke={img ? color || '#d2d5d9' : '#4f4f4f'}
                style={{ cursor: img ? 'pointer' : 'not-allowed' }}
              />
            }
            item={
              <div
                style={{
                  padding: '12px 0px 12px 9px',
                  margin: '0 5px',
                  background: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: '5px',
                  boxShadow:
                    '0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)',
                }}
              >
                <Circle
                  colors={[
                    'transparent',
                    '#fff',
                    '#000',
                    '#f44336',
                    '#e91e63',
                    '#9c27b0',
                    '#673ab7',
                    '#3f51b5',
                    '#2196f3',
                  ]}
                  className={styles.circle_color}
                  pointProps={{
                    style: {
                      marginRight: 12,
                      height: 25,
                      borderRadius: '50%',
                      border: '1px solid #00000030',
                      width: 25,
                    },
                  }}
                  onChange={(color) => setAttribute({ background: color.hex })}
                />
              </div>
            }
          />
        </div>
        <div>
          <HoverCard
            side="top"
            className={styles.color_list}
            trigger={<Frame size={18} />}
            item={
              <div
                style={{
                  padding: '12px 9px 12px 9px',
                  margin: '0 5px',
                  background: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: '5px',
                  boxShadow:
                    '0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)',
                }}
                className={styles.shape_styler}
              >
                <div onClick={() => setShape('')}>
                  <Ban />
                </div>
                <div onClick={() => setShape('circle')}>
                  <CircleIcon />
                </div>
                <div onClick={() => setShape('borders')}>
                  <Square />
                </div>
                <div onClick={() => setShape('rectangle')}>
                  <div className={styles.hard_square} />
                </div>
              </div>
            }
          />
        </div>
        <div>
          <HoverCard
            side="top"
            trigger={<Blend size={18} />}
            item={
              <div
                style={{
                  padding: '12px 9px 12px 9px',
                  margin: '0 5px',
                  background: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: '5px',
                  boxShadow:
                    '0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)',
                }}
              >
                <SliderT
                  rootClassName={styles.SliderT}
                  thumbClassName={styles.Thumb}
                  rangeClassName={styles.Range}
                  onValueChange={(e) => setAttribute({ opacity: e[0] })}
                  defaultValue={1}
                  max={1}
                  min={0}
                  step={0.1}
                  value={opacity}
                />
              </div>
            }
          />
        </div>
      </div>
    )
  },
)
