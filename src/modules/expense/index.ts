import { Composer, Context } from 'grammy'
import { replyWithMarkdownPlugin } from 'grammy-reply-with-markdown'
import { RaxeeBotModule } from '../../types/module'
import { expenseStateMiddleware } from './middleware/expenseState'

const createComposer = (stateDirName: string) => {
  const bot = new Composer(
    replyWithMarkdownPlugin(),
    expenseStateMiddleware(stateDirName)
  )

  bot.command('test', async (ctx) => {
    await ctx.replyWithMarkdown('test', {
      reply_markup: { remove_keyboard: true },
    })
  })

  return bot as unknown as Composer<Context>
}

export const createExpenseModule = (stateDirName: string): RaxeeBotModule => ({
  commands: [
    {
      command: 'test',
      description: 'test',
    },
  ],
  composer: createComposer(stateDirName),
})
