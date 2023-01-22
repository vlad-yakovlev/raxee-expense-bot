import { Wallet } from '@prisma/client'
import { MESSAGES } from '../constants'
import { CustomContext } from '../types'
import { extractObjectId } from '../utils/extractObjectId'
import { BaseConversation, ConversationQuestion } from './BaseConversation'

interface Answers {
  wallet: Wallet
  name: string
  currency: string
}

export class EditWallet extends BaseConversation<Answers> {
  questions: ConversationQuestion[] = [
    {
      answered: () => !!this.answers.wallet,
      sendMessage: async (ctx) => {
        const wallets = await ctx.expense.getWallets()
        await ctx.replyWithMarkdown(MESSAGES.addOperation.wallet, {
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
        await ctx.replyWithMarkdown(MESSAGES.editWallet.name, {
          reply_markup: { keyboard: [[this.answers.wallet?.name || '']] },
        })
      },
      handleReply: (ctx) => {
        this.answers.name = ctx.message?.text
      },
    },
    {
      answered: () => !!this.answers.currency,
      sendMessage: async (ctx) => {
        await ctx.replyWithMarkdown(MESSAGES.editWallet.currency, {
          reply_markup: { keyboard: [[this.answers.wallet?.currency || '']] },
        })
      },
      handleReply: (ctx) => {
        this.answers.currency = ctx.message?.text
      },
    },
  ]

  async handleDone(ctx: CustomContext, answers: Answers) {
    const wallet = await ctx.expense.updateWallet(answers.wallet.id, {
      name: answers.name,
      currency: answers.currency,
    })

    await ctx.replyWithMarkdown(MESSAGES.editWallet.done(wallet), {
      reply_markup: { remove_keyboard: true },
    })
  }
}
