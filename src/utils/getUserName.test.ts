import { getUserName } from './getUserName'

it('should accept undefined', () => {
  expect(getUserName(undefined)).toBe('')
})

it('should return username when presented', () => {
  expect(
    getUserName({
      first_name: 'bar',
      id: 12345,
      is_bot: false,
      username: 'foo',
    })
  ).toBe('foo')
})

it('should return firstName + lastName when no username presented', () => {
  expect(
    getUserName({
      first_name: 'bar',
      id: 12345,
      is_bot: false,
      last_name: 'baz',
    })
  ).toBe('bar baz')

  expect(getUserName({ first_name: 'bar', id: 12345, is_bot: false })).toBe(
    'bar'
  )
})
