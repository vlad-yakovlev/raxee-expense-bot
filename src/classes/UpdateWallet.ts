import { Wallet } from '@prisma/client'
import { DO_NOT_CHANGE, MESSAGES } from '../constants'
import { CustomContext } from '../types'
import { extractObjectId } from '../utils/extractObjectId'
import { BaseConversation, ConversationQuestion } from './BaseConversation'

interface Answers {
  wallet: Wallet
  name: string
  currency: string
}

export class UpdateWallet extends BaseConversation<Answers> {
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
    {
      answered: () => !!this.answers.name,
      sendMessage: async (ctx) => {
        await ctx.replyWithMarkdown(MESSAGES.updateWallet.name, {
          reply_markup: { keyboard: [[DO_NOT_CHANGE]] },
        })
      },
      handleReply: (ctx) => {
        this.answers.name =
          ctx.message?.text === DO_NOT_CHANGE
            ? this.answers.wallet?.name
            : ctx.message?.text
      },
    },
    {
      answered: () => !!this.answers.currency,
      sendMessage: async (ctx) => {
        await ctx.replyWithMarkdown(MESSAGES.updateWallet.currency, {
          reply_markup: { keyboard: [[DO_NOT_CHANGE]] },
        })
      },
      handleReply: (ctx) => {
        this.answers.currency =
          ctx.message?.text === DO_NOT_CHANGE
            ? this.answers.wallet?.currency
            : ctx.message?.text
      },
    },
  ]

  async handleDone(ctx: CustomContext, answers: Answers) {
    const wallet = await ctx.expense.updateWallet(answers.wallet.id, {
      name: answers.name,
      currency: answers.currency,
    })

    await ctx.replyWithMarkdown(MESSAGES.updateWallet.done(wallet), {
      reply_markup: { remove_keyboard: true },
    })
  }
}
