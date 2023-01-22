import { PrismaClient } from '@prisma/client'
import { Bot } from 'grammy'
import { replyWithMarkdownPlugin } from 'grammy-reply-with-markdown'
import { AddOperation } from '../classes/AddOperation'
import { AddWallet } from '../classes/AddWallet'
import { ShowBalances } from '../classes/ShowBalances'
import { ShowLastOperations } from '../classes/ShowLastOperations'
import { expenseMiddleware } from '../middleware/expense'
import { sessionMiddleware } from '../middleware/session'
import { CustomContext } from '../types'
import { handleError } from '../utils/handleError'

interface RunBotOptions {
  botToken: string
}

export const runBot = async (options: RunBotOptions) => {
  const prisma = new PrismaClient()

  const bot = new Bot<CustomContext>(options.botToken)
  bot.use(replyWithMarkdownPlugin())
  bot.use(sessionMiddleware())
  bot.use(expenseMiddleware(prisma))

  await bot.api.setMyCommands([
    {
      command: 'add_wallet',
      description: 'Добавить кошелек',
    },
    {
      command: 'add_operation',
      description: 'Добавить операцию',
    },
    {
      command: 'show_balances',
      description: 'Показать балансы кошельков',
    },
    {
      command: 'show_last_operations',
      description: 'Показать последние операции',
    },
  ])

  bot.command('cancel', async (ctx) => {
    await ctx.session.conversation.stop()
  })

  bot.command('add_wallet', async (ctx) => {
    await ctx.session.conversation.start(ctx, AddWallet)
  })

  bot.command('add_operation', async (ctx) => {
    await ctx.session.conversation.start(ctx, AddOperation)
  })

  bot.command('show_balances', async (ctx) => {
    await ctx.session.conversation.start(ctx, ShowBalances)
  })

  bot.command('show_last_operations', async (ctx) => {
    await ctx.session.conversation.start(ctx, ShowLastOperations)
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
  })
    .then(() => {
      process.exit(0)
    })
    .catch((err) => {
      console.error(err)
      process.exit(1)
    })
}
