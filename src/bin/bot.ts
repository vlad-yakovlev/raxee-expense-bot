import { Bot } from 'grammy'
import * as R from 'remeda'

import { createExpenseModule } from '../modules/expense/index'
import { RaxeeBotModule } from '../types/module'
import { handleError } from '../utils/handleError'

interface RunBotOptions {
  botToken: string
  modules: RaxeeBotModule[]
}

export const runBot = async (options: RunBotOptions) => {
  const bot = new Bot(options.botToken)
  await bot.api.setMyCommands(
    R.flatten(options.modules.map((module) => module.commands))
  )
  bot.use(...options.modules.map((module) => module.composer))
  bot.catch(handleError)
  await bot.start()
}

/* istanbul ignore next */
if (require.main === module) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('dotenv-flow').config()

  runBot({
    botToken: process.env.BOT_TOKEN || '',
    modules: [createExpenseModule('db/v1')],
  })
    .then(() => {
      process.exit(0)
    })
    .catch((err) => {
      console.error(err)
      process.exit(1)
    })
}
