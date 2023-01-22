import { parseAmount } from './parseAmount'

it('should return parsedAmount', () => {
  expect(parseAmount('1234.56789')).toBe(12345679)
  expect(parseAmount('1234.56')).toBe(12345600)
  expect(parseAmount('1234')).toBe(12340000)
})
