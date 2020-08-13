/** swagger 类型定义 */
interface Schema {
  type: string
  item?: { type: string }
  properties?: Record<string, any>
  required?: string[]
}

/** Swagger Paramter http://swagger.io/docs/specification/describing-parameters/ */

/** 操作类型 */
type Operation = 'get' | 'post' | 'put' | 'patch' | 'delete' | 'head' | 'options' | 'trace'

/** 参数位置 */
type ParamterLocation = 'path' | 'query' | 'header' | 'cookie'

/** swaggger 请求参数 */
interface Paramter {
  name: string
  in: ParamterLocation | 'body' | 'formData'
  type?: string
  schema?: Schema
  content?: { [key: string]: { schema: Schema } }
  required?: boolean
  description?: string
}

// /** schema 容器格式 */
interface SchemaContainerSample {
  schema: Schema
}

/** content 容器格式 */
interface SchemaContainerContent {
  content: { [key: string]: { schema: Schema } }
}

type SchemaContainer = SchemaContainerSample | SchemaContainerContent

/** 任意函数类型 */
type AnyFunction = (...args: any[]) => any

/** 请求 body */
interface RequestBodySchema {
  body?: Schema
}

/**
 * 请求参数
 * 格式参考 { get: { query: { name: 'user', type: 'string' } } }
 */
type RequestParamterSchema = Partial<Record<ParamterLocation, Record<string, Paramter>>>

/** post 请求中可能包含 body */
type ParamterSchema = RequestBodySchema & RequestParamterSchema

type SwaggerSchema = Record<
  string,
  Partial<
    Record<
      Operation,
      {
        paramter: ParamterSchema[]
        response: Schema
        summary: string
      }
    >
  >
>
