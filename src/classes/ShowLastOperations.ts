import { MESSAGES } from '../constants'
import { CustomContext } from '../types'
import { BaseConversation, ConversationQuestion } from './BaseConversation'
import { Wallet } from './ExpenseState'

interface Answers {
  wallet: Wallet
}

export class ShowLastOperations extends BaseConversation<Answers> {
  questions: ConversationQuestion[] = [
    {
      answered: () => !!this.answers.wallet,
      sendMessage: async (ctx) => {
        await ctx.replyWithMarkdown(MESSAGES.showLastOperations.wallet, {
          reply_markup: {
            keyboard: ctx.session.expense.wallets.map((wallet) => [
              wallet.name,
            ]),
          },
        })
      },
      handleReply: (ctx) => {
        this.answers.wallet = ctx.session.expense.getWallet(
          ctx.message?.text || ''
        )
      },
    },
  ]

  async handleDone(ctx: CustomContext, answers: Answers) {
    await ctx.replyWithMarkdown(
      MESSAGES.showLastOperations.done(
        answers.wallet,
        ctx.session.expense.getLastOperations(answers.wallet, 10),
        10
      ),
      { reply_markup: { remove_keyboard: true } }
    )
  }
}
