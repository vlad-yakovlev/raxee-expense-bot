import { CustomContext } from '../types'
import { BaseConversation } from './BaseConversation'

export class ConversationState {
  conversation: BaseConversation | null = null

  private get nextQuestion() {
    return this.conversation?.questions.find((question) => !question.answered())
  }

  private async step(ctx: CustomContext) {
    const question = this.nextQuestion
    if (question) {
      await question.sendMessage(ctx)
    } else {
      await this.conversation?.handleDone(ctx, this.conversation.answers)
      await this.stop()
    }
  }

  async start(ctx: CustomContext, Conversation: new () => BaseConversation) {
    this.conversation = new Conversation()
    await this.step(ctx)
  }

  async stop() {
    this.conversation = null
  }

  async handleMessage(ctx: CustomContext) {
    const question = this.nextQuestion
    if (question) {
      await question.handleReply(ctx)
    }

    await this.step(ctx)
  }
}
