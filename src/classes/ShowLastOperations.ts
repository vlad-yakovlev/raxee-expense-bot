import { Wallet } from '@prisma/client'
import { LAST_OPERATIONS_COUNT, MESSAGES } from '../constants'
import { CustomContext } from '../types'
import { BaseConversation, ConversationQuestion } from './BaseConversation'

interface Answers {
  wallet: Wallet
}

export class ShowLastOperations extends BaseConversation<Answers> {
  questions: ConversationQuestion[] = [
    {
      answered: () => !!this.answers.wallet,
      sendMessage: async (ctx) => {
        const wallets = await ctx.expense.getWallets(String(ctx.chat?.id))
        await ctx.replyWithMarkdown(MESSAGES.showLastOperations.wallet, {
          reply_markup: { keyboard: wallets.map((wallet) => [wallet.name]) },
        })
      },
      handleReply: async (ctx) => {
        const wallet = await ctx.expense.getWallet(
          String(ctx.chat?.id),
          ctx.message?.text || ''
        )
        this.answers.wallet = wallet || undefined
      },
    },
  ]

  async handleDone(ctx: CustomContext, answers: Answers) {
    await ctx.replyWithMarkdown(
      MESSAGES.showLastOperations.done(
        answers.wallet,
        await ctx.expense.getLastOperations(
          answers.wallet.id,
          LAST_OPERATIONS_COUNT
        ),
        LAST_OPERATIONS_COUNT
      ),
      { reply_markup: { remove_keyboard: true } }
    )
  }
}
