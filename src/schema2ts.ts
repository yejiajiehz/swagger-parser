// http://swagger.io/docs/specification/data-models/data-types/

/** swagger 基本类型 */
export const swaggerDataTypes = {
  boolean: 'boolean',
  file: 'string',
  string: 'string',
  integer: 'number',
  number: 'number',
  null: 'null',
}

/** 解析 swagger 类型定义 */
export function parseSchemaToTS(struct: Schema, level = 0): string {
  if ((swaggerDataTypes as any)[struct.type]) {
    return (swaggerDataTypes as any)[struct.type]
  } else if (struct.type === 'array') {
    let arrayType = ''
    if (struct.item && struct.item.type) {
      arrayType = parseSchemaToTS(struct.item)
    }
    return `${arrayType}[]`
  } else if (struct.type === 'object') {
    const keyWhiteSpace = ' '.repeat((level + 1) * 2)
    const backBraceWhiteSpace = ' '.repeat(level * 2)

    if (struct.properties) {
      let type = ['{']
      // XXX: key 应该是正常的 js 格式
      for (let [key, value] of Object.entries(struct.properties)) {
        type.push(`${keyWhiteSpace}${key}: ${parseSchemaToTS(value, level + 1)}`)
      }
      type.push(`${backBraceWhiteSpace}}`)
      return type.join('\n')
    }
    return 'object'
  }

  // eslint-disable-next-line no-console
  console.error(`Swagger type ${struct.type} 无法转为 typescript 类型`)
  return struct.type
}
