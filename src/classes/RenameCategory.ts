import { MESSAGES } from '../constants'
import { CustomContext } from '../types'
import { BaseConversation, ConversationQuestion } from './BaseConversation'

interface Answers {
  from: string
  to: string
}

export class RenameCategory extends BaseConversation<Answers> {
  questions: ConversationQuestion[] = [
    {
      answered: () => !!this.answers.from,
      sendMessage: async (ctx) => {
        const categories = await ctx.expense.getCategories()
        await ctx.replyWithMarkdown(MESSAGES.renameCategory.from, {
          reply_markup: { keyboard: categories.map((category) => [category]) },
        })
      },
      handleReply: (ctx) => {
        this.answers.from = ctx.message?.text
      },
    },
    {
      answered: () => !!this.answers.to,
      sendMessage: async (ctx) => {
        await ctx.replyWithMarkdown(MESSAGES.renameCategory.to, {
          reply_markup: { remove_keyboard: true },
        })
      },
      handleReply: (ctx) => {
        this.answers.to = ctx.message?.text
      },
    },
  ]

  async handleDone(ctx: CustomContext, answers: Answers) {
    await ctx.expense.renameCategory(answers.from, answers.to)

    await ctx.replyWithMarkdown(
      MESSAGES.renameCategory.done(answers.from, answers.to),
      { reply_markup: { remove_keyboard: true } }
    )
  }
}
