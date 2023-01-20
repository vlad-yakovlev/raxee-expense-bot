import { getMention } from './getMention'

it('should accept undefined', () => {
  expect(getMention(undefined).value).toBe('tg://user?id\\=undefined')
})

it('should return simple mention when username is presented', () => {
  expect(
    getMention({ first_name: 'bar', id: 12345, is_bot: false, username: 'foo' })
      .value
  ).toBe('@foo')
})

it('should return simple mention with escaped username', () => {
  expect(
    getMention({
      first_name: 'bar',
      id: 12345,
      is_bot: false,
      username: 'foo_foo',
    }).value
  ).toBe('@foo\\_foo')
})

it('should return link mention when no username presented', () => {
  expect(
    getMention({
      first_name: 'bar',
      id: 12345,
      is_bot: false,
      last_name: 'baz',
    }).value
  ).toBe('[bar baz](tg://user?id\\=12345)')

  expect(
    getMention({ first_name: 'bar', id: 12345, is_bot: false }).value
  ).toBe('[bar](tg://user?id\\=12345)')
})
