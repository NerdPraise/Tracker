import ClassNames from 'classnames'
import Mustache from 'mustache'

import style from './Frame.module.styl'

interface FrameProps {
  template: MustacheHtml
  className?: string
  context: TemplateContext
}

export const Frame = ({ template, context, className }: FrameProps) => {
  return (
    <div className={ClassNames(style.Frame, className)}>
      <div dangerouslySetInnerHTML={{ __html: Mustache.render(template, context) }} />
    </div>
  )
}
