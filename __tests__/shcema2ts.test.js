const { parseSchemaToTS, swaggerDataTypes } = require('../dist/es5/schema2ts')

describe('swagger 解析', () => {
  describe('swagger 转为 ts 类型', () => {
    it('基础类型', () => {
      for (let [key, value] of Object.entries(swaggerDataTypes)) {
        expect(parseSchemaToTS({ type: key })).toBe(value)
      }
    })

    describe('数组类型', () => {
      let arrayType
      beforeEach(() => {
        arrayType = { type: 'array' }
      })

      it('默认数组类型', () => {
        expect(parseSchemaToTS(arrayType)).toBe('[]')
      })

      it('基础类型数组', () => {
        arrayType.item = { type: 'string' }
        expect(parseSchemaToTS(arrayType)).toBe('string[]')
      })
    })

    describe('对象类型', () => {
      let objectType, properties
      beforeEach(() => {
        objectType = { type: 'object' }
        properties = {
          key: {
            type: 'string',
          },
        }
      })

      it('基础对象类型', () => {
        expect(parseSchemaToTS(objectType)).toBe('object')
      })

      it('复杂类型', () => {
        objectType.properties = properties
        expect(parseSchemaToTS(objectType)).toBe('{\n  key: string\n}')
      })

      it('复杂类型数组', () => {
        expect(
          parseSchemaToTS({
            type: 'array',
            item: {
              ...objectType,
              properties,
            },
          }),
        ).toBe(`{\n  key: string\n}[]`)
      })

      it('多层嵌套类型', () => {
        let type = objectType

        for (let i = 0; i < 5; i++) {
          type.properties = {
            ['key' + i]: {
              type: i === 4 ? 'string' : 'object',
            },
          }
          type = type.properties['key' + i]
        }

        expect(parseSchemaToTS(objectType)).toBe(`{
  key0: {
    key1: {
      key2: {
        key3: {
          key4: string
        }
      }
    }
  }
}`)
      })
    })

    it('其他类型', () => {
      const mockLog = jest.fn()
      // eslint-disable-next-line no-console
      console.error = mockLog
      expect(parseSchemaToTS({ type: 'other' })).toBe('other')
      expect(mockLog).toBeCalled()
    })
  })
})
