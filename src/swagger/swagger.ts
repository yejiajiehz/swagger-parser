import { JSONRefParser, defaultSchema } from '../utils'
import { getResponseByPath, getAllResponseByPath } from './response'
import { getParamterByPath, getAllParamterByPath } from './paramter'
import _ from 'lodash'
class Swagger {
  schema!: any
  constructor(schema: any) {
    this.load(schema)
  }

  /** 加载 swagger 对象 */
  load(schema: any): void {
    this.schema = JSONRefParser(schema)
  }

  /** 解析整个对象 */
  toSchema(): SwaggerSchema {
    const schema: SwaggerSchema = {}

    for (let path in this.schema.paths) {
      const paramter = this.getAllParamterByPath(path)
      const response = this.getAllResponseByPath(path)
      const pathObj = (schema[path] = schema[path] || {})

      for (let method of Object.keys(paramter)) {
        const operation = method as Operation

        const operationObj = (pathObj[operation] = pathObj[operation] || {
          paramter: [],
          response: defaultSchema,
          summary: _.get(this.schema, ['paths', path, operation, 'summary']),
        })

        operationObj.paramter = paramter[operation]
        operationObj.response = response[operation]
      }
    }

    return schema
  }

  /** 根据 path 和 operation 获取接口在 swagger 中的的返回值定义 */
  getResponseByPath(path: string, operation?: Operation): Schema {
    return getResponseByPath(this.schema, path, operation)
  }

  /** 根据 path 获取接口在 swagger 中的的所有返回值定义 */
  getAllResponseByPath(path: string): Record<Operation, Schema> {
    return getAllResponseByPath(this.schema, path)
  }

  /** 根据 path 和 operation 获取接口在 swagger 中的的参数定义 */
  getParamterByPath(path: string, operation?: Operation): ParamterSchema {
    return getParamterByPath(this.schema, path, operation)
  }

  /** 根据 path 获取接口在 swagger 中的的所有参数值定义 */
  getAllParamterByPath(path: string): Record<Operation, ParamterSchema[]> {
    return getAllParamterByPath(this.schema, path)
  }
}

export { Swagger }
