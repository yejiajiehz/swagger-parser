# Swagger parser

## Usage


```javascript
import { Swagger } from './src/swagger'
const swaggerSchema = {/** swagger schema */}

const swagger = new Swagger(swaggerSchema)
const schema = swagger.toSchema()
```

## API

#### load(swaggerSchema: object)

加载 swagger schema

> new Swagger 时会被自动调用

#### toSchema(): SwaggerSchema

解析 swagger

#### getResponseByPath(path: string, operation?: Operation): Schema
根据 path 和 operation 获取接口在 swagger 中的的返回值定义

#### getAllResponseByPath(path: string): Record<Operation, Schema>
根据 path 获取接口在 swagger 中的的所有返回值定义

#### getParamterByPath(path: string, operation?: Operation): ParamterSchema
根据 path 和 operation 获取接口在 swagger 中的的返回值定义

#### getAllParamterByPath(path: string): Record<Operation, ParamterSchema[]>
根据 path 获取接口在 swagger 中的的所有参数值定义

## Example

```json
{
  "paths": {
    "/pet": {
      "post": {
        "summary": "测试接口",
        "parameters": [
          {
            "in": "query",
            "name": "name",
            "required": true,
            "description": "姓名",
            "type": "string"
          },
        ],
        "requestBody": {
          "content": {
            "text/plain": { "schema": { "type": "object" } }
          }
        },
        "responses": {
          "200": {
            "schema": {
              "type": "object"
            }
          }
        }
      }
    }
  }
}

```

解析之后的结果

```js
{
  '/pet': {
    post: {
      summary: "测试接口",
      paramter: {
        body: { type: 'object' },
        query: {
          name: {
            in: 'query',
            name: 'name',
            required: true,
            description: '姓名',
            type: 'string',
          },
        },
      },
      response: { type: 'object' },
    },
  },
}
```
