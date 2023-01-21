import { type ConversationFlavor } from '@grammyjs/conversations'
import { Context } from 'grammy'
import { ReplyWithMarkdownFlavour } from 'grammy-reply-with-markdown'
import { ExpenseState } from './classes/ExpenseState'

interface SessionFlavour {
  session: {
    expense: ExpenseState
  }
}

export type CustomContext = Context &
  ReplyWithMarkdownFlavour &
  ConversationFlavor &
  SessionFlavour
