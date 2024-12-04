import { useCallback, useContext, useEffect, useState } from 'react'
import { BubbleMenu, EditorContent, useEditor, useEditorState } from '@tiptap/react'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import StarterKit from '@tiptap/starter-kit'
import TipBold from '@tiptap/extension-bold'
import Table from '@tiptap/extension-table'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import { Color } from '@tiptap/extension-color'
import TableRow from '@tiptap/extension-table-row'
import TextAlign from '@tiptap/extension-text-align'
import Text from '@tiptap/extension-text'
import Highlight from '@tiptap/extension-highlight'
import TextStyle from '@tiptap/extension-text-style'
import FontSize from 'tiptap-extension-font-size'
import TipUnderline from '@tiptap/extension-underline'
import Superscript from '@tiptap/extension-superscript'
import Subscript from '@tiptap/extension-subscript'

import { isTextSelected } from '_Home/common/utils'

import { BaseWidget } from '../BaseWidget'
import { LayoutContext } from '../../context'
import { TableWidgetToolBar } from './TableWidgetToolBar'
import styles from './TableWidget.module.styl'
import { Menu } from '../Menu/Menu'

const defaults = {
  height: 150,
  width: 550,
}

export const TableWidget = (props) => {
  const { setSettings, settings } = useContext(LayoutContext)
  const [isEditMode, setIsEditMode] = useState<boolean>(false)
  const [color, setColor] = useState<string>('')
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
  const editor = useEditor({
    shouldRerenderOnTransaction: false,
    editable: true,
    extensions: [
      Color,
      Document,
      FontSize,
      Paragraph,
      Highlight,
      Text,
      TextAlign,
      TipUnderline,
      TextStyle,
      TipBold,
      Superscript,
      Subscript,
      Table.configure({
        resizable: true,
      }),
      StarterKit.configure(),
      TableRow.extend({
        allowGapCursor: false,
      }),
      TableHeader.extend({
        allowGapCursor: false,
        addAttributes() {
          return {
            ...this.parent?.(),
            backgroundColor: {
              default: null,
              parseHTML: (element) => element.getAttribute('data-background-color'),
              renderHTML: (attributes) => {
                return {
                  'data-background-color': attributes.backgroundColor,
                  style: `background-color: ${attributes.backgroundColor}`,
                }
              },
            },
            border: {
              default: null,
              parseHTML: (element) => element.getAttribute('data-border'),
              renderHTML: (attributes) => {
                return {
                  'data-border': attributes.border,
                  style: `border: ${
                    attributes.border === 'none' ? 'none' : `1px solid ${attributes.border}`
                  }`,
                }
              },
            },
          }
        },
      }),
      TableCell.extend({
        allowGapCursor: false,
        addAttributes() {
          return {
            ...this.parent?.(),
            backgroundColor: {
              default: null,
              parseHTML: (element) => element.getAttribute('data-background-color'),
              renderHTML: (attributes) => {
                return {
                  'data-background-color': attributes.backgroundColor,
                  style: `background-color: ${attributes.backgroundColor}`,
                }
              },
            },
            border: {
              default: null,
              parseHTML: (element) => element.getAttribute('data-border'),
              renderHTML: (attributes) => {
                return {
                  'data-border': attributes.border,
                  style: `border: ${
                    attributes.border === 'none' ? 'none' : `1px solid ${attributes.border}`
                  }`,
                }
              },
            },
          }
        },
      }),
    ],
    onUpdate: handleSave,
    content:
      props.content ||
      `<table style="min-width: 75px">
    <colgroup>
      <col />
      <col />
      <col />
    </colgroup>
    <tbody>
      <tr>
        <th colspan="1" rowspan="1">
          <p><br class="ProseMirror-trailingBreak" /></p>
        </th>
        <th colspan="1" rowspan="1">
          <p><br class="ProseMirror-trailingBreak" /></p>
        </th>
        <th colspan="1" rowspan="1">
          <p><br class="ProseMirror-trailingBreak" /></p>
        </th>
        <th colspan="1" rowspan="1">
          <p><br class="ProseMirror-trailingBreak" /></p>
        </th>
      </tr>
      <tr>
        <td colspan="1" rowspan="1">
          <p><br class="ProseMirror-trailingBreak" /></p>
        </td>
        <td colspan="1" rowspan="1">
          <p><br class="ProseMirror-trailingBreak" /></p>
        </td>
        <td colspan="1" rowspan="1">
          <p><br class="ProseMirror-trailingBreak" /></p>
        </td>
        <td colspan="1" rowspan="1">
          <p><br class="ProseMirror-trailingBreak" /></p>
        </td>
      </tr>
      <tr>
        <td colspan="1" rowspan="1">
          <p><br class="ProseMirror-trailingBreak" /></p>
        </td>
        <td colspan="1" rowspan="1">
          <p><br class="ProseMirror-trailingBreak" /></p>
        </td>
        <td colspan="1" rowspan="1">
          <p><br class="ProseMirror-trailingBreak" /></p>
        </td>
         <td colspan="1" rowspan="1">
          <p><br class="ProseMirror-trailingBreak" /></p>
        </td>
      </tr>
    </tbody>
  </table>`,
  })

  if (!editor) {
    return null
  }

  useEffect(() => {
    // https://github.com/ueberdosis/tiptap/issues/5365#issuecomment-2266652338
    editor.setEditable(false)
    console.log('wheen done')
  }, [])

  const moveableProps = {
    checkInput: isEditMode,
  }

  const shouldShow = useCallback(
    ({ view }: any) => {
      if (!view || editor.view.dragging) {
        return false
      }

      return isTextSelected({ editor })
    },
    [editor],
  )
  const { currentBorderColor, currentBgColor } = useEditorState({
    editor,
    selector: (ctx) => {
      console.log(ctx.editor.getAttributes('tableCell'))
      return {
        currentBorderColor: ctx.editor.getAttributes('tableCell').border || undefined,
        currentBgColor: ctx.editor.getAttributes('tableCell').backgroundColor || undefined,
        currentHeaderBgColor: ctx.editor.getAttributes('tableHeader').backgroundColor || undefined,
      }
    },
  })

  return (
    <BaseWidget
      {...props}
      layout={props.layout}
      defaults={defaults}
      moveableProps={moveableProps}
      toolBar={
        <TableWidgetToolBar
          editor={editor}
          isEditMode={isEditMode}
          setIsEditMode={setIsEditMode}
          color={color}
          setColor={setColor}
          currentBorderColor={currentBorderColor}
          currentBgColor={currentBgColor}
        />
      }
    >
      <div className={styles.TableWidget}>
        <EditorContent editor={editor} className={styles.editor} />
        <BubbleMenu
          className="text-white"
          editor={editor}
          shouldShow={shouldShow}
          tippyOptions={{
            duration: 400,
            delay: 500,
            zIndex: 9999999,
            popperOptions: {
              placement: 'bottom-start',
            },
          }}
        >
          <Menu editor={editor} />
        </BubbleMenu>
      </div>
    </BaseWidget>
  )
}
