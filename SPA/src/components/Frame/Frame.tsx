import ClassNames from 'classnames'
import Mustache from 'mustache'

import style from './Frame.module.styl'
import { MutableRefObject } from 'react'

interface FrameProps {
  template: MustacheHtml
  className?: string
  context: TemplateContext
  frameRef?: MutableRefObject<HTMLDivElement>
}

export const Frame = ({ template, context, className, frameRef }: FrameProps) => {
  return (
    <div className={ClassNames(style.Frame, className)} id="frame">
      <div ref={frameRef} dangerouslySetInnerHTML={{ __html: Mustache.render(template, context) }} />
    </div>
  )
}
