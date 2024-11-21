import { memo } from 'react'
import {
  ArrowDownToLine,
  ArrowLeftToLine,
  ArrowRightToLine,
  ArrowUpToLine,
  ChevronDown,
  Circle as CircleIcon,
  LockKeyhole,
  LockKeyholeOpen,
  TableCellsMerge,
  TableCellsSplit,
  Trash2,
} from 'lucide-react'
import Circle from '@uiw/react-color-circle'

import { type Editor } from '@tiptap/react'

import { Dropdown, HoverCard } from '_Home/components'

import Grid2x2Plus from '_Images/grid_plus.svg?react'
import styles from './TableWidget.module.styl'
import { ColorPicker } from '../components/ColorPicker'

interface TableWidgetToolBarProps {
  editor: Editor
  isEditMode: boolean
  setColor?: (e: string) => void
  color?: string
  setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>
}

export const TableWidgetToolBar = memo(
  ({ editor, isEditMode, setIsEditMode, color, setColor }: TableWidgetToolBarProps) => {
    const onSelectColor = (hex: string) => {
      editor.chain().focus().setCellAttribute('backgroundColor', hex).run()
      setColor(hex)
    }

    const onChangeBorderColor = (hex: string) => {
      editor.chain().focus().setCellAttribute('border', hex).run()
    }

    return (
      <div className={styles.TableWidgetToolBar}>
        <div>
          <Dropdown
            sideOffset={10}
            className={styles.dropdown}
            trigger={
              <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', width: '35px' }}>
                <Grid2x2Plus />
                <ChevronDown size={12} />
              </div>
            }
            modal={false}
            items={[
              {
                child: (
                  <div onClick={() => editor.chain().focus().addColumnBefore().run()}>
                    <ArrowRightToLine size={15} />
                    Add column before
                  </div>
                ),
              },
              {
                child: (
                  <div onClick={() => editor.chain().focus().addColumnAfter().run()}>
                    <ArrowLeftToLine size={15} />
                    Add column after
                  </div>
                ),
              },
              {
                child: (
                  <div onClick={() => editor.chain().focus().deleteColumn().run()}>
                    <Trash2 size={15} />
                    Delete column
                  </div>
                ),
              },
              {
                child: (
                  <div onClick={() => editor.chain().focus().addRowBefore().run()}>
                    <ArrowUpToLine size={15} />
                    Add row before
                  </div>
                ),
              },
              {
                child: (
                  <div onClick={() => editor.chain().focus().addRowAfter().run()}>
                    <ArrowDownToLine size={15} />
                    Add row after
                  </div>
                ),
              },
              {
                child: (
                  <div onClick={() => editor.chain().focus().deleteRow().run()}>
                    <Trash2 size={15} />
                    Delete row
                  </div>
                ),
              },
            ]}
          />
          <Dropdown
            sideOffset={10}
            className={styles.dropdown}
            trigger={
              <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', width: '35px' }}>
                <TableCellsMerge size={19} />
                <ChevronDown size={12} />
              </div>
            }
            modal={false}
            items={[
              {
                child: (
                  <div onClick={() => editor.chain().focus().mergeCells().run()}>
                    <TableCellsMerge size={15} />
                    Merge Cells
                  </div>
                ),
              },
              {
                child: (
                  <div onClick={() => editor.chain().focus().splitCell().run()}>
                    <TableCellsSplit size={15} />
                    Split cells
                  </div>
                ),
              },
              {
                child: (
                  <div onClick={() => editor.chain().focus().setCellAttribute('border', 'none').run()}>
                    Remove all borders
                  </div>
                ),
              },
              {
                child: (
                  <div onClick={() => editor.chain().focus().toggleHeaderColumn().run()}>
                    Toggle header column
                  </div>
                ),
              },
              {
                child: (
                  <div onClick={() => editor.chain().focus().toggleHeaderRow().run()}>
                    Toggle header row
                  </div>
                ),
              },
              {
                child: (
                  <div onClick={() => editor.chain().focus().toggleHeaderCell().run()}>
                    Toggle header cell
                  </div>
                ),
              },
            ]}
          />
          <HoverCard
            side="top"
            className={styles.color_list}
            trigger={<CircleIcon size={18} fill={color || '#d2d5d9'} />}
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
                  onChange={(color) => onSelectColor(color.hex)}
                />
              </div>
            }
          />

          <ColorPicker setColor={null} iconSize={19} />

          {/* <HoverCard
            side="top"
            className={styles.color_list}
            trigger={<CircleIcon size={18} stroke={color || '#d2d5d9'} />}
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
                  onChange={(color) => onChangeBorderColor(color.hex)}
                />
              </div>
            }
          /> */}
        </div>

        <div className={styles.locked} onClick={() => setIsEditMode(!isEditMode)}>
          {isEditMode ? <LockKeyholeOpen size={19} /> : <LockKeyhole size={19} />}
        </div>
      </div>
    )
  },
)
