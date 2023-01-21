import { CustomContext, MayBePromise } from '../types'

export interface ConversationQuestion {
  answered: () => boolean
  sendMessage: (ctx: CustomContext) => MayBePromise<void>
  handleReply: (ctx: CustomContext) => MayBePromise<void>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export abstract class BaseConversation<Answers extends object = any> {
  answers: Partial<Answers> = {}
  abstract questions: ConversationQuestion[]
  abstract handleDone(ctx: CustomContext, answers: Answers): MayBePromise<void>
}
