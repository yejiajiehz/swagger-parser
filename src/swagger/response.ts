import { unpackSchemaContainer } from '../utils'
import _ from 'lodash'

/**
 * 根据 path 和 operations 获取接口在 swagger 中的的返回值定义
 *
 * https://swagger.io/docs/specification/describing-responses/
 *
 * NOTE:
 * 1. 目前只处理了 200 状态，不支持其他 Status
 * 2. 只做了单层解析，未做 Media Types 解析
 * 3. 不支持 anyOf, oneOf 等高级用法
 * 4. 不支持 header
 */
export function getResponseByPath(schema: object, path: string, operation?: Operation): Schema {
  if (operation) {
    const paths = ['paths', path, operation, 'responses', '200']
    const value = _.get(schema, paths)

    return unpackSchemaContainer(value)
  }

  // 如果接口只存一个方法，自动获取
  const operations = _.keys(_.get(schema, ['paths', path])) as Operation[]
  if (operations.length === 1) {
    return getResponseByPath(schema, path, operations[0])
  }

  // 为了降低复杂度，不处理多个方法的情况
  throw new Error('该接口存在多个 operation，请使用 getAllResponseByPath 获取所有返回数据')
}

/** 根据 path 获取接口在 swagger 中的的所有返回值定义 */
export function getAllResponseByPath(schema: object, path: string): Record<Operation, Schema> {
  const operations = _.keys(_.get(schema, ['paths', path])) as Operation[]
  const response = operations.map(operation => getResponseByPath(schema, path, operation))
  return _.zipObject(operations, response) as Record<Operation, Schema>
}
