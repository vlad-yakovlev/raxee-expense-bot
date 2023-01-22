import { Context } from 'grammy'
import { ReplyWithMarkdownFlavour } from 'grammy-reply-with-markdown'
import { ConversationState } from './classes/ConversationState'
import { Expense } from './classes/Expense'

export type MayBePromise<T> = Promise<T> | T

interface SessionFlavour {
  session: {
    conversation: ConversationState
  }
}

interface ExpenseFlavour {
  expense: Expense
}

export type CustomContext = Context &
  ReplyWithMarkdownFlavour &
  SessionFlavour &
  ExpenseFlavour
