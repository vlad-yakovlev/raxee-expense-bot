import { FileAdapter } from '@grammyjs/storage-file'
import { session } from 'grammy'
import { ConversationState } from '../classes/ConversationState'
import { ExpenseState } from '../classes/ExpenseState'
import { CustomContext } from '../types'

export const sessionMiddleware = (dirName: string) => {
  return session<CustomContext['session'], CustomContext>({
    type: 'multi',
    conversation: {
      initial: () => new ConversationState(),
    },
    expense: {
      initial: () => new ExpenseState(),
      storage: new FileAdapter({
        deserializer: (input) => ExpenseState.fromRaw(JSON.parse(input)),
        dirName,
        serializer: (input) => JSON.stringify(input.toRaw()),
      }),
    },
  })
}
