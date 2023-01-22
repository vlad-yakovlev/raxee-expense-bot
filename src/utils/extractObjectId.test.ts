import { extractObjectId } from './extractObjectId'

it('should return object-id if valid object-id is presented', () => {
  expect(extractObjectId('[63cca7f772203cc11d81c57b]')).toBe(
    '63cca7f772203cc11d81c57b'
  )
  expect(extractObjectId('foo [63cca7f772203cc11d81c57b]')).toBe(
    '63cca7f772203cc11d81c57b'
  )
  expect(extractObjectId('foo [bar] [63cca7f772203cc11d81c57b]')).toBe(
    '63cca7f772203cc11d81c57b'
  )
  expect(extractObjectId('foo [bar] baz [63cca7f772203cc11d81c57b]')).toBe(
    '63cca7f772203cc11d81c57b'
  )
})

it('should return undefined if presented', () => {
  expect(extractObjectId()).toBe(undefined)
  expect(extractObjectId('foo')).toBe(undefined)
  expect(extractObjectId('foo [63cca7f]')).toBe(undefined)
  expect(extractObjectId('[63cca7f77rr03cc11d81c57b]')).toBe(undefined)
})
