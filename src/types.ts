import { Context } from 'grammy'
import { ReplyWithMarkdownFlavour } from 'grammy-reply-with-markdown'
import { ConversationState } from './classes/ConversationState'
import { ExpenseState } from './classes/ExpenseState'

export type MayBePromise<T> = Promise<T> | T

interface SessionFlavour {
  session: {
    conversation: ConversationState
    expense: ExpenseState
  }
}

export type CustomContext = Context & ReplyWithMarkdownFlavour & SessionFlavour
