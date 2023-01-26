import { PrismaClient } from '@prisma/client'
import { Bot } from 'grammy'
import { replyWithMarkdownPlugin } from 'grammy-reply-with-markdown'
import { CreateOperation } from '../classes/CreateOperation'
import { CreateWallet } from '../classes/CreateWallet'
import { UpdateOperation } from '../classes/UpdateOperation'
import { UpdateWallet } from '../classes/UpdateWallet'
import { DeleteOperation } from '../classes/DeleteOperation'
import { RenameCategory } from '../classes/RenameCategory'
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
      command: 'create_wallet',
      description: 'Добавить кошелек',
    },
    {
      command: 'update_wallet',
      description: 'Редактировать кошелек',
    },
    {
      command: 'create_operation',
      description: 'Добавить операцию',
    },
    {
      command: 'update_operation',
      description: 'Редактировать операцию',
    },
    {
      command: 'delete_operation',
      description: 'Удалить операцию',
    },
    {
      command: 'rename_category',
      description: 'Переименовать категорию',
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

  bot.command('create_wallet', async (ctx) => {
    await ctx.session.conversation.start(ctx, CreateWallet)
  })

  bot.command('update_wallet', async (ctx) => {
    await ctx.session.conversation.start(ctx, UpdateWallet)
  })

  bot.command('create_operation', async (ctx) => {
    await ctx.session.conversation.start(ctx, CreateOperation)
  })

  bot.command('update_operation', async (ctx) => {
    await ctx.session.conversation.start(ctx, UpdateOperation)
  })

  bot.command('delete_operation', async (ctx) => {
    await ctx.session.conversation.start(ctx, DeleteOperation)
  })

  bot.command('rename_category', async (ctx) => {
    await ctx.session.conversation.start(ctx, RenameCategory)
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
