import { conversations, createConversation } from '@grammyjs/conversations'
import { Bot } from 'grammy'
import { replyWithMarkdownPlugin } from 'grammy-reply-with-markdown'
import { MESSAGES } from '../constants'
import { sessionMiddleware } from '../middleware/session'
import { CustomContext } from '../types'
import { handleError } from '../utils/handleError'

interface RunBotOptions {
  botToken: string
  stateDirName: string
}

export const runBot = async (options: RunBotOptions) => {
  const bot = new Bot<CustomContext>(options.botToken)
  bot.use(replyWithMarkdownPlugin())
  bot.use(sessionMiddleware(options.stateDirName))

  await bot.api.setMyCommands([
    {
      command: 'add_wallet',
      description: 'Добавить кошелек',
    },
  ])

  bot.use(conversations())

  bot.command('cancel', async (ctx) => {
    await ctx.conversation.exit()
  })

  bot.use(
    createConversation(async (conversation, ctx) => {
      await ctx.replyWithMarkdown(MESSAGES.addWallet.start)

      await ctx.replyWithMarkdown(MESSAGES.addWallet.name)
      const nameResponse = await conversation.waitFor('message:text')
      const name = nameResponse.msg.text

      await ctx.replyWithMarkdown(MESSAGES.addWallet.currency)
      const currencyResponse = await conversation.waitFor('message:text')
      const currency = currencyResponse.msg.text

      let balance = NaN
      while (isNaN(balance)) {
        await ctx.replyWithMarkdown(MESSAGES.addWallet.balance)
        const balanceResponse = await conversation.waitFor('message:text')
        balance = Number(balanceResponse.msg.text)
      }

      conversation.session.expense.createWallet(name, currency, balance)
      await ctx.replyWithMarkdown(
        MESSAGES.addWallet.done(name, currency, balance)
      )
    }, 'add_wallet')
  )

  bot.command('add_wallet', async (ctx) => {
    await ctx.conversation.enter('add_wallet')
  })

  bot.catch(handleError)
  await bot.start()
}

/* istanbul ignore next */
if (require.main === module) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('dotenv-flow').config()

  runBot({
    botToken: process.env.BOT_TOKEN || '',
    stateDirName: 'db/v1',
  })
    .then(() => {
      process.exit(0)
    })
    .catch((err) => {
      console.error(err)
      process.exit(1)
    })
}
