import { BubbleMenu, useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import FontFamily from '@tiptap/extension-font-family'
import TextAlign from '@tiptap/extension-text-align'
import { Color } from '@tiptap/extension-color'
import TipUnderline from '@tiptap/extension-underline'
import TipBold from '@tiptap/extension-bold'
import TextStyle from '@tiptap/extension-text-style'
import Placeholder from '@tiptap/extension-placeholder'
import FontSize from 'tiptap-extension-font-size'

import { BaseWidget } from '../BaseWidget'
import { MenuBar } from './MenuBar'
import styles from './RichTextWidget.module.styl'

const extensions = [
  Color,
  TipBold,
  TextStyle,
  TipUnderline,
  TextAlign,
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

export const RichTextWidget = ({ settings, ...rest }) => {
  const editor = useEditor({ extensions, content: settings.content })

  return (
    <BaseWidget widgetId={settings.widgetId} toolBar={<MenuBar editor={editor} />} {...rest}>
      <div className={styles.RichTextWidget}>
        {/* <BubbleMenu editor={editor}>This is the bubble menu</BubbleMenu> */}
        <EditorContent editor={editor} className={styles.content} />
      </div>
    </BaseWidget>
  )
}

RichTextWidget.widgetId = 'RichTextWidget'
RichTextWidget.defaultWidth = 5
RichTextWidget.minWidth = 2
RichTextWidget.minHeight = 2
RichTextWidget.defaults = {}
