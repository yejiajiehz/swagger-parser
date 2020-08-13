import { get, isObject } from 'lodash'

export function JSONRefParser(json: any, path?: string): any {
  function parser(data: any): any {
    if (isObject(data)) {
      const el = data as any

      if (el.$ref) {
        const path = el.$ref
        const value = get(json, path.slice(2).split('/'))

        Object.assign(el, parser(value))
        delete el.$ref
      }

      for (let value of Object.values(data)) {
        parser(value)
      }
    }

    return data
  }

  parser(path ? get(json, path) : json)

  return json
}
