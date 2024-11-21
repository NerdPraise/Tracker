import { memo, useState } from 'react'
import ClassNames from 'classnames'
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Superscript,
  Subscript,
  WholeWord,
  ChevronDown,
  SquarePilcrow,
  AlignRight,
  AlignLeft,
  AlignCenter,
  Palette,
  Lock,
  LockKeyholeOpen,
} from 'lucide-react'
import Circle from '@uiw/react-color-circle'
import { type Editor } from '@tiptap/react'

import { Dropdown, Popover, SliderT } from '_Home/components'
import { capitalise } from '_Home/common/utils'

import styles from './RichTextWidget.module.styl'

const fontAlignment = {
  left: <AlignLeft />,
  center: <AlignCenter />,
  right: <AlignRight />,
}

interface RichTextToolBarProps {
  editor: Editor
  isEditMode: boolean
  setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>
}

export const RichTextToolBar = memo(({ editor, isEditMode, setIsEditMode }: RichTextToolBarProps) => {
  const [fontFamily, setFontFamily] = useState<string>('Inter')
  const [fontAlign, setFontAlign] = useState<string>('left')
  const [fontSize, setFontSize] = useState<number>(16)

  if (!editor) {
    return null
  }
  const handleFontFamilyChange = (value: string) => {
    editor.chain().focus().setFontFamily(value).run()
    setFontFamily(value)
  }

  const handleFontAlign = (value: string) => {
    editor.chain().focus().setTextAlign(value).run()
    setFontAlign(value)
  }

  const handleFontSize = (value: number[]) => {
    editor.chain().focus().setFontSize(`${value[0]}px`).run()
    setFontSize(value[0])
  }

  return (
    <div className={styles.MenuBar}>
      <div className={styles.font_variant}>
        <Dropdown
          className={styles.dropdown}
          trigger={
            <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', width: '35px' }}>
              <SquarePilcrow />
              <ChevronDown size={14} />
            </div>
          }
          modal={false}
          items={[
            {
              child: (
                <div onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
                  <h1>Header 1</h1>
                </div>
              ),
            },
            {
              child: (
                <div onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
                  <h2>Header 2 </h2>
                </div>
              ),
            },
            {
              child: (
                <div onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
                  <h3> Header 3</h3>
                </div>
              ),
            },
            {
              child: <div onClick={() => editor.chain().focus().setParagraph().run()}>Paragraph</div>,
            },
            {
              child: (
                <div onClick={() => editor.chain().focus().toggleBlockquote().run()}> Blockquote</div>
              ),
            },
            {
              child: (
                <div onClick={() => editor.chain().focus().toggleBulletList().run()}>Bullet list</div>
              ),
            },
            {
              child: (
                <div onClick={() => editor.chain().focus().toggleOrderedList().run()}> Ordered list</div>
              ),
            },
          ]}
        />
      </div>
      <div className={styles.font_bar}>
        <div
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={ClassNames({ [styles.active]: editor.isActive('bold') })}
        >
          <Bold />
        </div>
        <div
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={ClassNames({ [styles.active]: editor.isActive('italic') })}
        >
          <Italic />
        </div>
        <div
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={ClassNames({ [styles.active]: editor.isActive('strike') })}
        >
          <Strikethrough />
        </div>
        <div onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <Underline />
        </div>
        <div>
          <Superscript />
        </div>
        <div>
          <Subscript />
        </div>
      </div>

      <div className={styles.font_desc}>
        <Dropdown
          className={styles.dropdown}
          trigger={
            <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', width: '95px' }}>
              <WholeWord />
              <span
                style={{
                  margin: '0 5px',
                  opacity: 0.5,
                  wordBreak: 'normal',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                }}
              >
                {capitalise(fontFamily)}
              </span>
              <ChevronDown size={14} />
            </div>
          }
          modal={false}
          items={[
            {
              child: <div onClick={() => handleFontFamilyChange('Inter')}>Inter</div>,
            },
            {
              child: (
                <div onClick={() => handleFontFamilyChange('Comic Sans MS, Comic Sans')}>Comic Sans</div>
              ),
            },
            {
              child: <div onClick={() => handleFontFamilyChange('serif')}>Serif</div>,
            },
            {
              child: <div onClick={() => handleFontFamilyChange('monospace')}>Monospace</div>,
            },
            {
              child: <div onClick={() => handleFontFamilyChange('cursive')}>Cursive</div>,
            },
            {
              child: <div onClick={() => handleFontFamilyChange('market')}>Market</div>,
            },
          ]}
        />
        <Dropdown
          className={styles.align_dropdown}
          trigger={
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                borderLeft: '1px solid #ccc',
                paddingLeft: '10px',
                marginLeft: 10,
              }}
            >
              <span
                style={{
                  margin: '0 5px',
                  opacity: 0.5,
                  wordBreak: 'normal',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                }}
              >
                {fontAlignment[fontAlign]}
              </span>
              <ChevronDown size={14} />
            </div>
          }
          modal={false}
          items={[
            {
              child: (
                <div onClick={() => handleFontAlign('left')}>
                  <AlignLeft />
                </div>
              ),
            },
            {
              child: (
                <div onClick={() => handleFontAlign('center')}>
                  <AlignCenter />
                </div>
              ),
            },
            {
              child: (
                <div onClick={() => handleFontAlign('right')}>
                  <AlignRight />
                </div>
              ),
            },
          ]}
        />
        <div style={{ width: 55, marginLeft: 5 }}>
          <Popover
            side="top"
            trigger={<div>{fontSize} px</div>}
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
                  onValueChange={(e) => handleFontSize(e)}
                  defaultValue={24}
                  max={180}
                  min={8}
                  step={2}
                  value={fontSize}
                />
              </div>
            }
          />
        </div>
        <Popover
          side="top"
          className={styles.color_list}
          trigger={
            <div className={styles.trigger}>
              <Palette />
            </div>
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
                onChange={(color) => editor.chain().focus().setColor(color.hex).run()}
              />
            </div>
          }
        />
      </div>
      <div className={styles.font_variant} onClick={() => setIsEditMode(!isEditMode)}>
        {isEditMode ? <LockKeyholeOpen /> : <Lock />}
      </div>
    </div>
  )
})
