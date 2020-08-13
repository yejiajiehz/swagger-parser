import { unpackSchemaContainer } from '../utils'
import _ from 'lodash'

/**
 * 根据 path 和 operation 获取接口在 swagger 中的的返回值定义
 *
 * http://swagger.io/docs/specification/describing-parameters/
 */
export function getParamterByPath(
  schema: object,
  path: string,
  operation?: Operation,
): ParamterSchema | never {
  if (operation) {
    let result: ParamterSchema = {}

    const operationObj = _.get(schema, ['paths', path, operation])

    if (!operationObj) {
      // eslint-disable-next-line no-console
      console.error(`${path} 不存在 operation: ${operation}`)
      return {}
    }

    // 解析 body
    if (operationObj.requestBody) {
      result.body = unpackSchemaContainer(operationObj.requestBody as SchemaContainer)
    }

    // 解析 parameters
    const parameters = operationObj.parameters as Paramter[]
    if (Array.isArray(parameters)) {
      for (let parameter of parameters) {
        if (parameter.in === 'body') {
          result.body = unpackSchemaContainer(parameter)
        } else if (parameter.in === 'formData') {
          const body = (result.body = result.body || { type: 'object', properties: {} })
          const properties = (body.properties = body.properties || {})

          properties[parameter.name] = parameter
        } else {
          const location = (result[parameter.in] = result[parameter.in] || {})

          if (parameter.schema || parameter.content) {
            parameter.schema = unpackSchemaContainer(parameter)
          }

          location[parameter.name] = parameter
        }
      }
    }

    return result
  }

  // 如果接口只存一个方法，自动获取
  const operations = _.keys(_.get(schema, ['paths', path])) as Operation[]
  if (operations.length === 1) {
    return getParamterByPath(schema, path, operations[0])
  }

  // 为了降低复杂度，不处理多个方法的情况
  throw new Error('该接口存在多个 operation，请使用 getAllParamterByPath 获取所有返回数据')
}

/** 根据 path 获取接口在 swagger 中的的所有参数值定义 */
export function getAllParamterByPath(
  schema: object,
  path: string,
): Record<Operation, ParamterSchema[]> {
  const operations = _.keys(_.get(schema, ['paths', path])) as Operation[]
  const response = operations.map((operation) => getParamterByPath(schema, path, operation))
  return _.zipObject(operations, response) as Record<Operation, ParamterSchema[]>
}
