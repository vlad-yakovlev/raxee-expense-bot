import { BotError, Context } from 'grammy'

import { handleError } from './handleError'

afterEach(() => {
  jest.spyOn(global.console, 'error').mockRestore()
})

it('should console error and send reply', () => {
  const error = new Error('some error')

  const consoleError = jest.fn()
  const reply = jest.fn()

  jest.spyOn(global.console, 'error').mockImplementation(consoleError)

  handleError(
    new BotError(error, {
      reply,
      update: { update_id: 12345 },
    } as unknown as Context)
  )

  expect(consoleError).toBeCalledTimes(1)
  expect(consoleError).toBeCalledWith(
    'Error while handling update 12345:',
    error
  )

  expect(reply).toBeCalledTimes(1)
  expect(reply).toBeCalledWith('Что-то сломалось ¯\\_(ツ)_/¯', {
    reply_markup: { remove_keyboard: true },
  })
})

it('should handle send reply error', () => {
  const error = new Error('some error')
  const replyError = new Error('reply error')

  const consoleError = jest.fn()
  const reply = jest.fn().mockImplementation(() => {
    throw replyError
  })

  jest.spyOn(global.console, 'error').mockImplementation(consoleError)

  handleError(
    new BotError(error, {
      reply,
      update: { update_id: 12345 },
    } as unknown as Context)
  )

  expect(consoleError).toBeCalledTimes(2)
  expect(consoleError.mock.calls[0]).toEqual([
    'Error while handling update 12345:',
    error,
  ])
  expect(consoleError.mock.calls[1]).toEqual([replyError])

  expect(reply).toBeCalledTimes(1)
  expect(reply).toBeCalledWith('Что-то сломалось ¯\\_(ツ)_/¯', {
    reply_markup: { remove_keyboard: true },
  })
})
