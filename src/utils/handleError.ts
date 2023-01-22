import { BotError } from 'grammy'

export const handleError = async (err: BotError) => {
  try {
    const { ctx, error } = err
    console.error(`Error while handling update ${ctx.update.update_id}:`, error)
    await ctx.reply('Что-то сломалось ¯\\_(ツ)_/¯', {
      reply_markup: { remove_keyboard: true },
    })
  } catch (error) {
    console.error(error)
  }
}
