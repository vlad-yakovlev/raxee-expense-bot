import { Composer, Context } from 'grammy'
import { BotCommand } from 'grammy/types'

export interface RaxeeBotModule {
  commands: BotCommand[]
  composer: Composer<Context>
}
