import { Operation, Wallet } from '@prisma/client'
import { LAST_OPERATIONS_COUNT, MESSAGES } from '../constants'
import { CustomContext } from '../types'
import { extractObjectId } from '../utils/extractObjectId'
import { BaseConversation, ConversationQuestion } from './BaseConversation'

interface Answers {
  operation: Operation & { wallet: Wallet }
}

export class DeleteOperation extends BaseConversation<Answers> {
  questions: ConversationQuestion[] = [
    {
      answered: () => !!this.answers.operation,
      sendMessage: async (ctx) => {
        const operations = await ctx.expense.getLastOperations({
          count: LAST_OPERATIONS_COUNT,
        })
        await ctx.replyWithMarkdown(MESSAGES.removeOperation.operation, {
          reply_markup: {
            keyboard: [...operations]
              .reverse()
              .map((operation) => [
                `${operation.description} [${operation.id}]`,
              ]),
          },
        })
      },
      handleReply: async (ctx) => {
        const operationId = extractObjectId(ctx.message?.text)
        if (operationId) {
          const operation = await ctx.expense.getOperationWithWallet(
            operationId
          )
          this.answers.operation = operation || undefined
        }
      },
    },
  ]

  async handleDone(ctx: CustomContext, answers: Answers) {
    await ctx.expense.deleteOperation(answers.operation.id)

    await ctx.replyWithMarkdown(
      MESSAGES.removeOperation.done(
        answers.operation.wallet,
        answers.operation
      ),
      { reply_markup: { remove_keyboard: true } }
    )
  }
}
