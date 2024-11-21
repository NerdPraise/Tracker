import { useCallback, useState } from 'react'
import { BubbleMenu, EditorContent, useEditor } from '@tiptap/react'
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

import { BaseWidget } from '../BaseWidget'
import { TableWidgetToolBar } from './TableWidgetToolBar'
import styles from './TableWidget.module.styl'
import { Menu } from '../Menu/Menu'
import { isTextSelected } from '_Home/common/utils'

const defaults = {
  height: 150,
  width: 550,
}

export const TableWidget = (props) => {
  const [isEditMode, setIsEditMode] = useState<boolean>(false)
  const [color, setColor] = useState<string>('')
  const editor = useEditor({
    shouldRerenderOnTransaction: false,
    editable: isEditMode,
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
    content: `
    <table style="min-width: 75px">
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
  </table>
      `,
  })

  if (!editor) {
    return null
  }
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
        />
      }
    >
      <div className={styles.TableWidget}>
        <EditorContent editor={editor} className={styles.editor} />
        <BubbleMenu
          editor={editor}
          shouldShow={shouldShow}
          tippyOptions={{
            duration: 500,
            delay: 500,
            zIndex: 9999999,
            popperOptions: {
              placement: 'right',
              modifiers: [
                {
                  name: 'preventOverflow',
                  options: {
                    boundary: 'viewport',
                    padding: 8,
                  },
                },
                {
                  name: 'flip',
                  options: {
                    fallbackPlacements: ['top-start', 'top-end', 'bottom-end'],
                  },
                },
              ],
            },
          }}
        >
          <Menu editor={editor} />
        </BubbleMenu>
      </div>
    </BaseWidget>
  )
}
