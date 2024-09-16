import { DefaultDict } from '_Home/common/utils'

type IProcessedTemplates = {
  simple: ITemplate[]
  classy: ITemplate[]
  recent: ITemplate[]
}

export const TemplatesProcessor = (templates: ITemplate[]): IProcessedTemplates => {
  const result = new DefaultDict(Array)
  templates.forEach((item) => {
    if (item.user) {
      result['recent'].push(item)
    } else {
      result[item.category.toLowerCase()].push(item)
    }
  })
  return result as IProcessedTemplates
}
