import { session } from 'grammy'
import { ConversationState } from '../classes/ConversationState'
import { CustomContext } from '../types'

export const sessionMiddleware = () => {
  return session<CustomContext['session'], CustomContext>({
    type: 'multi',
    conversation: {
      initial: () => new ConversationState(),
    },
  })
}
