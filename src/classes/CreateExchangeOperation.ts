import { Wallet } from '@prisma/client'
import { EXCHANGE, MESSAGES } from '../constants'
import { CustomContext } from '../types'
import { extractObjectId } from '../utils/extractObjectId'
import { parseAmount } from '../utils/parseAmount'
import { BaseConversation, ConversationQuestion } from './BaseConversation'

interface Answers {
  walletFrom: Wallet
  walletTo: Wallet
  amountFrom: number
  amountTo: number
}

export class CreateExchangeOperation extends BaseConversation<Answers> {
  questions: ConversationQuestion[] = [
    {
      answered: () => !!this.answers.walletFrom,
      sendMessage: async (ctx) => {
        const wallets = await ctx.expense.getWallets()
        await ctx.replyWithMarkdown(
          MESSAGES.createExchangeOperation.walletFrom,
          {
            reply_markup: {
              keyboard: wallets.map((wallet) => [
                `${wallet.name} [${wallet.id}]`,
              ]),
            },
          }
        )
      },
      handleReply: async (ctx) => {
        const walletId = extractObjectId(ctx.message?.text)
        if (walletId) {
          const wallet = await ctx.expense.getWallet(walletId)
          this.answers.walletFrom = wallet || undefined
        }
      },
    },
    {
      answered: () => !!this.answers.walletTo,
      sendMessage: async (ctx) => {
        const wallets = await ctx.expense.getWallets()
        await ctx.replyWithMarkdown(MESSAGES.createExchangeOperation.walletTo, {
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
          this.answers.walletTo = wallet || undefined
        }
      },
    },
    {
      answered: () => !isNaN(this.answers.amountFrom ?? NaN),
      sendMessage: async (ctx) => {
        await ctx.replyWithMarkdown(
          MESSAGES.createExchangeOperation.amountFrom,
          { reply_markup: { remove_keyboard: true } }
        )
      },
      handleReply: (ctx) => {
        this.answers.amountFrom = parseAmount(ctx.message?.text)
      },
    },
    {
      answered: () => !isNaN(this.answers.amountTo ?? NaN),
      sendMessage: async (ctx) => {
        await ctx.replyWithMarkdown(MESSAGES.createExchangeOperation.amountTo, {
          reply_markup: { remove_keyboard: true },
        })
      },
      handleReply: (ctx) => {
        this.answers.amountTo = parseAmount(ctx.message?.text)
      },
    },
  ]

  async handleDone(ctx: CustomContext, answers: Answers) {
    const description = `${answers.walletFrom.currency} → ${answers.walletTo.currency}`

    await ctx.expense.createOperation({
      description,
      amount: -1 * Math.abs(answers.amountFrom),
      category: EXCHANGE,
      walletId: answers.walletFrom.id,
    })

    await ctx.expense.createOperation({
      description,
      amount: Math.abs(answers.amountTo),
      category: EXCHANGE,
      walletId: answers.walletTo.id,
    })

    await ctx.replyWithMarkdown(
      MESSAGES.createExchangeOperation.done(
        answers.walletFrom,
        answers.walletTo,
        answers.amountFrom,
        answers.amountTo
      ),
      { reply_markup: { remove_keyboard: true } }
    )
  }
}
