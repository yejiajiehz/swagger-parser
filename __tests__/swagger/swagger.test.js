const { Swagger } = require('../../dist/es5/swagger')
const { defaultSchema } = require('../../dist/es5/utils/default-schema')

const schema = require('../fixtures/swagger.json')
const swagger = new Swagger(schema)

const requestBodySchema = require('../fixtures/request-body-swagger.json')
const requestBodySwagger = new Swagger(requestBodySchema)

describe('swagger 解析', () => {
  const path = {
    pet: '/pet',
    findPet: '/pet/findByStatus',
  }

  const findPetType = 'array'

  describe('根据路径获取返回结果定义', () => {
    describe('getResponseByPath', () => {
      it('不存在的路径', () => {
        const path = '/no/path'
        const result = swagger.getResponseByPath(path, 'get')
        expect(result).toBe(defaultSchema)
      })

      it('错误的方法', () => {
        const result = swagger.getResponseByPath(path.findPet, 'post')
        expect(result).toBe(defaultSchema)
      })

      it('正常获取数据', () => {
        const result = swagger.getResponseByPath(path.findPet, 'get')
        expect(result.type).toBe(findPetType)
      })

      describe('不提供 operation', () => {
        it('当只存在一个方法时，正常返回', () => {
          const result = swagger.getResponseByPath(path.findPet)
          expect(result.type).toBe(findPetType)
        })

        it('当存在多个方法时，抛出错误', () => {
          expect(() => swagger.getResponseByPath(path.pet)).toThrow()
        })
      })
    })

    describe('getAllResponseByPath', () => {
      it('获取所有接口定义', () => {
        const result = swagger.getAllResponseByPath(path.pet)
        expect(result.post).toEqual(defaultSchema)
        expect(result.put).toEqual(defaultSchema)
      })
    })
  })

  describe('根据路径获取参数定义', () => {
    describe('getParamterByPath', () => {
      it('不存在的路径', () => {
        const path = '/no/path'
        const mockLog = jest.fn()
        // eslint-disable-next-line no-console
        console.error = mockLog
        const result = swagger.getParamterByPath(path, 'get')
        expect(result).toEqual({})
        expect(mockLog).toBeCalled()
      })

      it('错误的方法', () => {
        const mockLog = jest.fn()
        // eslint-disable-next-line no-console
        console.error = mockLog
        const result = swagger.getParamterByPath(path.findPet, 'post')
        expect(result).toEqual({})
        expect(mockLog).toBeCalled()
      })

      it('正常获取数据', () => {
        const result = swagger.getParamterByPath(path.findPet, 'get')
        expect(result.query).toBeDefined()
        expect(result.query.status.type).toBe('array')
      })

      it('解析 requestBody', () => {
        const result = requestBodySwagger.getParamterByPath(path.pet, 'post')
        expect(result.body).toBeDefined()
        expect(result.body.type).toBe('string')
      })

      describe('不提供 operation', () => {
        it('当只存在一个方法时，正常返回', () => {
          const result = swagger.getParamterByPath(path.findPet)
          expect(result.query).toBeDefined()
          expect(result.query.status.type).toBe('array')
        })

        it('当存在多个方法时，抛出错误', () => {
          expect(() => swagger.getParamterByPath(path.pet)).toThrow()
        })
      })
    })

    describe('getAllParamterByPath', () => {
      it('获取所有接口定义', () => {
        const result = swagger.getAllParamterByPath(path.pet)
        expect(result.post.body.type).toBe('object')
        expect(result.put.body.type).toBe('object')
      })
    })
  })

  it('toSchema', () => {
    const result = requestBodySwagger.toSchema()
    const p = result['/pet'].post

    console.log(p)

    expect(p.paramter.body.type).toBe('string')
    expect(p.response.type).toBe('null')
    expect(p.summary).toBe('Add a new pet')
  })
})
