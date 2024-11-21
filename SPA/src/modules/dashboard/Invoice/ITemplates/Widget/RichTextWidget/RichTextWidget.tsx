import { useContext, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import FontFamily from '@tiptap/extension-font-family'
import TextAlign from '@tiptap/extension-text-align'
import { Color } from '@tiptap/extension-color'
import TipUnderline from '@tiptap/extension-underline'
import TipBold from '@tiptap/extension-bold'
import TextStyle from '@tiptap/extension-text-style'
import Placeholder from '@tiptap/extension-placeholder'
import FontSize from 'tiptap-extension-font-size'
import Highlight from '@tiptap/extension-highlight'
import Superscript from '@tiptap/extension-superscript'
import Subscript from '@tiptap/extension-subscript'

import { FloatingMenu } from '../Menu/FloatingMenu/FloatingMenu'
import { BaseWidget } from '../BaseWidget'
import styles from './RichTextWidget.module.styl'
import { LayoutContext } from '../../context'

const extensions = [
  Color,
  Highlight,
  TipBold,
  TextStyle,
  TipUnderline,
  TextAlign,
  Superscript,
  Subscript,
  Placeholder.configure({
    placeholder: 'Type Here...',
  }),
  FontSize,
  FontFamily.configure({
    types: ['textStyle'],
  }),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false,
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false,
    },
  }),
]

const defaults = {
  height: 30,
  width: 170,
}

interface RichTextWidgetProps {
  name: string
  widgetId: string
  layout: Layout
  content: Omit<React.ReactNode, 'number'>
}

export const RichTextWidget = (props: RichTextWidgetProps) => {
  const { setSettings, settings } = useContext(LayoutContext)
  const [isEditMode, setIsEditMode] = useState<boolean>(true)
  const editor = useEditor({
    extensions,
    content: props.content,
    shouldRerenderOnTransaction: false,
    editable: isEditMode,
  })
  const moveableProps = {
    checkInput: isEditMode,
  }

  const handleSave = () => {
    const updatedWidgetSettings = settings.widgets.map((item) =>
      item.widgetId === props.widgetId
        ? {
            ...item,
            content: editor.getHTML(),
          }
        : item,
    )
    setSettings(updatedWidgetSettings)
  }

  return (
    <BaseWidget
      toolBar={<FloatingMenu editor={editor} isEditMode={isEditMode} setIsEditMode={setIsEditMode} />}
      moveableProps={moveableProps}
      {...props}
      defaults={defaults}
      layout={props.layout}
    >
      <div className={styles.RichTextWidget}>
        <EditorContent editor={editor} className={styles.content} />
      </div>
      <button onClick={handleSave}></button>
    </BaseWidget>
  )
}

RichTextWidget.widgetId = 'RichTextWidget'
RichTextWidget.defaultWidth = 270
RichTextWidget.defaultHeight = 125
RichTextWidget.minWidth = 2
RichTextWidget.minHeight = 2
RichTextWidget.defaults = {}
