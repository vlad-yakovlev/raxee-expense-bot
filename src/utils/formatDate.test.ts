import { formatDate } from './formatDate'

it('should return formatted date', () => {
  expect(formatDate(new Date(2023, 0, 15, 12, 35, 47))).toBe('15.01 12:35')
})
