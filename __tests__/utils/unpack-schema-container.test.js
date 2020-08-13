const { unpackSchemaContainer, defaultSchema } = require('../../dist/es5/utils')

describe('测试 unpackSchemaContainer', () => {
  const schema = {
    type: 'object',
    properties: { type: { type: 'string' }, color: { type: 'string' } },
  }

  let packObj, unPackObj
  beforeEach(() => {
    packObj = {
      in: 'query',
      name: 'filter',
      content: {
        'application/json': {
          schema,
        },
      },
    }

    unPackObj = {
      schema,
    }
  })
  it('解压 schema', () => {
    const result = unpackSchemaContainer(unPackObj)
    expect(result).toBe(schema)
  })

  it('解压 content', () => {
    const result = unpackSchemaContainer(packObj)
    expect(result).toBe(schema)
  })

  it('解压 content 字段过多，返回默认 schema', () => {
    packObj.content.x = {}
    const mockLog = jest.fn()
    // eslint-disable-next-line no-console
    console.error = mockLog
    expect(unpackSchemaContainer(packObj)).toBe(defaultSchema)
    expect(mockLog).toBeCalled()
  })

  it('不存在 shema 字段，返回默认 schema', () => {
    expect(unpackSchemaContainer()).toBe(defaultSchema)
    expect(unpackSchemaContainer({})).toBe(defaultSchema)
  })
})
