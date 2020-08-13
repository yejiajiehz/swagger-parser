const { JSONRefParser } = require('../../dist/es5/utils')
const schema = require('../fixtures/swagger.json')

describe('测试 JSONRefParser', () => {
  let json
  beforeEach(() => {
    json = {
      definitions: {
        address: {
          properties: {
            street_address: { type: 'string' },
            city: { type: 'string' },
            state: { type: 'string' },
          },
          other: { $ref: '#/definitions/otherAddress' },
        },
        otherAddress: {
          other: 'other',
        },
      },
      myAddress: { $ref: '#/definitions/address' },
      properties: {
        address: { $ref: '#/definitions/address' },
      },
    }
  })

  it('解析 ref', () => {
    const result = JSONRefParser(json)
    expect(result.myAddress).toEqual(result.properties.address)
    expect(result.properties.address).toEqual(json.definitions.address)
    expect(result.myAddress.other.other).toBe('other')
  })

  it('解析部分 ref', () => {
    const result = JSONRefParser(json, 'properties')
    expect(result.properties.address).toEqual(json.definitions.address)
    expect(result.myAddress.$ref).toBeDefined()
  })

  it('性能测试', () => {
    let start = getCurrentTime()
    JSONRefParser(schema)
    let end = getCurrentTime()
    // 最大不超过 100 ms
    expect(end - start).toBeLessThan(100)
  })
})

// 高精度时间
function getCurrentTime() {
  var diff = process.hrtime()
  return (diff[0] * 1e9 + diff[1]) / 1e6
}
