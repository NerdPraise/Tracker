import { useCallback, useState, memo } from 'react'
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
  AlignRight,
  AlignLeft,
  AlignCenter,
} from 'lucide-react'
import { useEditorState, type Editor } from '@tiptap/react'

import { Dropdown, HoverCard, Popover, SliderT } from '_Home/components'
import { capitalise } from '_Home/common/utils'

import { ColorPicker } from '../components/ColorPicker'
import styles from './Menu.module.styl'

const fontAlignment = {
  left: <AlignLeft size={19} />,
  center: <AlignCenter size={19} />,
  right: <AlignRight size={19} />,
}

export const Menu = memo(
  ({
    editor,
    extras,
    prefixExtras,
  }: {
    editor: Editor
    extras?: React.ReactNode
    prefixExtras?: React.ReactNode
  }) => {
    const [fontAlign, setFontAlign] = useState<string>('left')

    const { currentColor, currentFontSize, currentFontFamily } = useEditorState({
      editor,
      selector: (ctx) => {
        return {
          currentFontFamily:
            ctx.editor.getAttributes('textStyle')?.fontFamily || capitalise('Inter, sans-serif'),
          currentColor: ctx.editor.getAttributes('textStyle')?.color || undefined,
          currentFontSize: ctx.editor.getAttributes('textStyle')?.fontSize || '16px',
        }
      },
    })

    const handleColor = useCallback((color) => {
      editor.chain().setColor(color.hex).run()
    }, [])

    const handleFontFamilyChange = useCallback(
      (value: string) => {
        editor.chain().focus().setFontFamily(value).run()
      },
      [editor],
    )
    const handleFontAlign = useCallback(
      (value: string) => {
        editor.chain().focus().setTextAlign(value).run()
        setFontAlign(value)
      },
      [editor],
    )
    const handleFontSize = useCallback(
      (value: number[]) => {
        editor.chain().focus().setFontSize(`${value[0]}px`).run()
      },
      [editor],
    )
    const handleSuperscript = useCallback(
      () => editor.chain().focus().toggleSuperscript().run(),
      [editor],
    )
    const handleSubscript = useCallback(() => editor.chain().focus().toggleSubscript().run(), [editor])

    if (!editor) {
      return null
    }
    const setBold = useCallback(() => editor.chain().focus().toggleBold().run(), [editor])
    const setItalic = useCallback(() => editor.chain().focus().toggleItalic().run(), [editor])
    const setStrikeThrough = useCallback(() => editor.chain().focus().toggleStrike().run(), [editor])
    const setUnderline = useCallback(() => editor.chain().focus().toggleUnderline().run(), [editor])

    return (
      <div
        className={styles.MenuBar}
        onMouseDown={(e) => {
          e.stopPropagation()
          e.preventDefault()
        }}
      >
        {prefixExtras}
        <div className={styles.font_bar}>
          <div onClick={setBold} className={ClassNames({ [styles.active]: editor.isActive('bold') })}>
            <Bold size={19} />
          </div>
          <div
            onClick={setItalic}
            className={ClassNames({ [styles.active]: editor.isActive('italic') })}
          >
            <Italic size={19} />
          </div>
          <div
            onClick={setStrikeThrough}
            className={ClassNames({ [styles.active]: editor.isActive('strike') })}
          >
            <Strikethrough size={19} />
          </div>
          <div onClick={setUnderline}>
            <Underline size={19} />
          </div>
          <div onClick={handleSuperscript}>
            <Superscript size={19} />
          </div>
          <div onClick={handleSubscript}>
            <Subscript size={19} />
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
                    whiteSpace: 'nowrap',
                  }}
                >
                  {capitalise(currentFontFamily)}
                </span>
                <ChevronDown size={12} />
              </div>
            }
            modal={false}
            items={[
              {
                child: (
                  <div
                    onClick={() => handleFontFamilyChange('Inter, sans-serif')}
                    style={{ fontFamily: '"Inter", sans-serif' }}
                  >
                    Inter
                  </div>
                ),
              },
              {
                child: (
                  <div
                    onClick={() => handleFontFamilyChange('Comic Sans MS, Comic Sans')}
                    style={{ fontFamily: 'Comic Sans MS, Comic Sans' }}
                  >
                    Comic Sans
                  </div>
                ),
              },
              {
                child: (
                  <div onClick={() => handleFontFamilyChange('serif')} style={{ fontFamily: 'serif' }}>
                    Serif
                  </div>
                ),
              },
              {
                child: (
                  <div
                    onClick={() => handleFontFamilyChange('monospace')}
                    style={{ fontFamily: 'monospace' }}
                  >
                    Monospace
                  </div>
                ),
              },
              {
                child: (
                  <div
                    onClick={() => handleFontFamilyChange('cursive')}
                    style={{ fontFamily: 'cursive' }}
                  >
                    Cursive
                  </div>
                ),
              },
              {
                child: (
                  <div onClick={() => handleFontFamilyChange('market')} style={{ fontFamily: 'market' }}>
                    Market
                  </div>
                ),
              },
              {
                child: (
                  <div onClick={() => handleFontFamilyChange('rox')} style={{ fontFamily: 'rox' }}>
                    Rox
                  </div>
                ),
              },
              {
                child: (
                  <div
                    onClick={() => handleFontFamilyChange('fantasy')}
                    style={{ fontFamily: 'fantasy' }}
                  >
                    Fantasy
                  </div>
                ),
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
                <ChevronDown size={12} />
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
            <HoverCard
              side="top"
              trigger={<div style={{ cursor: 'pointer' }}>{currentFontSize}</div>}
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
                    defaultValue={16}
                    max={180}
                    min={8}
                    step={2}
                    value={parseInt(currentFontSize.split('px')[0])}
                  />
                </div>
              }
            />
          </div>
          <ColorPicker setColor={handleColor} color={currentColor} />
        </div>
        {extras}
      </div>
    )
  },
)
