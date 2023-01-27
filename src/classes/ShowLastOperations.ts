import { Wallet } from '@prisma/client'
import { LAST_OPERATIONS_COUNT, MESSAGES } from '../constants'
import { CustomContext } from '../types'
import { extractObjectId } from '../utils/extractObjectId'
import { BaseConversation, ConversationQuestion } from './BaseConversation'

interface Answers {
  wallet: Wallet
}

export class ShowLastOperations extends BaseConversation<Answers> {
  questions: ConversationQuestion[] = [
    {
      answered: () => !!this.answers.wallet,
      sendMessage: async (ctx) => {
        const wallets = await ctx.expense.getWallets()
        await ctx.replyWithMarkdown(MESSAGES.createOperation.wallet, {
          reply_markup: {
            keyboard: wallets.map((wallet) => [
              `${wallet.name} [${wallet.id}]`,
            ]),
          },
        })
      },
      handleReply: async (ctx) => {
        const walletId = extractObjectId(ctx.message?.text)
        if (walletId) {
          const wallet = await ctx.expense.getWallet(walletId)
          this.answers.wallet = wallet || undefined
        }
      },
    },
  ]

  async handleDone(ctx: CustomContext, answers: Answers) {
    await ctx.replyWithMarkdown(
      MESSAGES.showLastOperations.done(
        answers.wallet,
        await ctx.expense.getLastOperations({
          walletId: answers.wallet.id,
          count: LAST_OPERATIONS_COUNT,
        }),
        LAST_OPERATIONS_COUNT
      ),
      { reply_markup: { remove_keyboard: true } }
    )
  }
}
