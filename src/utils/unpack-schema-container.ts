import { defaultSchema } from './default-schema'

/** 获取对象的唯一字段 */
function unWrap(wrap: { [key: string]: any }): any {
  const keys = Object.keys(wrap)

  if (keys.length === 1) {
    return wrap[keys[0]]
  }

  throw new Error('参数格式错误：只应该存在一个字段！')
}

function isSchema(container: SchemaContainer): container is SchemaContainerSample {
  return (container as SchemaContainerSample).schema !== undefined
}

function isContent(container: SchemaContainer): container is SchemaContainerContent {
  return (container as SchemaContainerContent).content !== undefined
}

/** 从容器中获取实际的 schema */
export function unpackSchemaContainer(container: SchemaContainer | any): Schema {
  if (container) {
    if (isSchema(container)) {
      return container.schema
    } else if (isContent(container)) {
      // 尝试解压
      try {
        return unpackSchemaContainer(unWrap(container.content))
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('无法识别多个 Media Types')
      }
    }
  }

  return defaultSchema
}
