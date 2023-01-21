import { Bot } from 'grammy'
import { replyWithMarkdownPlugin } from 'grammy-reply-with-markdown'
import { AddOperationConversation } from '../classes/AddOperationConversation'
import { AddWalletConversation } from '../classes/AddWalletConversation'
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
    {
      command: 'add_operation',
      description: 'Добавить операцию',
    },
  ])

  bot.command('cancel', async (ctx) => {
    await ctx.session.conversation.stopConversation()
  })

  bot.command('add_wallet', async (ctx) => {
    await ctx.session.conversation.startConversation(ctx, AddWalletConversation)
  })

  bot.command('add_operation', async (ctx) => {
    await ctx.session.conversation.startConversation(
      ctx,
      AddOperationConversation
    )
  })

  bot.on('message:text', async (ctx) => {
    await ctx.session.conversation.handleMessage(ctx)
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
