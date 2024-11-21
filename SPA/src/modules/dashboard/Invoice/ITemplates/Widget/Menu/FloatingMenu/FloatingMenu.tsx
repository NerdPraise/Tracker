import { Lock, LockKeyholeOpen, ChevronDown, SquarePilcrow } from 'lucide-react'
import { type Editor } from '@tiptap/react'

import { Dropdown } from '_Home/components'
import { Menu } from '../Menu'

import styles from './FloatingMenu.module.styl'

interface FloatingMenuProps {
  editor: Editor
  isEditMode: boolean
  setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>
}

export const FloatingMenu = ({ editor, isEditMode, setIsEditMode }: FloatingMenuProps) => {
  return (
    <div className={styles.FloatingMenuBar}>
      <Menu
        editor={editor}
        prefixExtras={
          <div className={styles.font_variant}>
            <Dropdown
              className={styles.dropdown}
              sideOffset={10}
              trigger={
                <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', width: '35px' }}>
                  <SquarePilcrow size={19} />
                  <ChevronDown size={12} />
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
                  child: (
                    <div onClick={() => editor.chain().focus().setParagraph().run()}>Paragraph</div>
                  ),
                },
                {
                  child: (
                    <div onClick={() => editor.chain().focus().toggleBlockquote().run()}>Blockquote</div>
                  ),
                },
                {
                  child: (
                    <div onClick={() => editor.chain().focus().toggleBulletList().run()}>
                      Bullet list
                    </div>
                  ),
                },
                {
                  child: (
                    <div onClick={() => editor.chain().focus().toggleOrderedList().run()}>
                      Ordered list
                    </div>
                  ),
                },
              ]}
            />
          </div>
        }
        extras={
          <div className={styles.font_variant} onClick={() => setIsEditMode(!isEditMode)}>
            {isEditMode ? <LockKeyholeOpen size={19} /> : <Lock size={19} />}
          </div>
        }
      />
    </div>
  )
}
