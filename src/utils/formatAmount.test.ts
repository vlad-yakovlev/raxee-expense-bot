import { formatAmount } from './formatAmount'

it('should return formatted amount', () => {
  expect(formatAmount(12345678, '$')).toBe('1234.57$')
  expect(formatAmount(12340000, '$')).toBe('1234.00$')
})
