import { MESSAGES } from '../constants'
import { CustomContext } from '../types'
import { BaseConversation, ConversationQuestion } from './BaseConversation'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Answers {}

export class ShowBalances extends BaseConversation<Answers> {
  questions: ConversationQuestion[] = []

  async handleDone(ctx: CustomContext) {
    await ctx.replyWithMarkdown(
      MESSAGES.showBalances.done(
        await ctx.expense.getBalances(String(ctx.chat?.id))
      )
    )
  }
}
