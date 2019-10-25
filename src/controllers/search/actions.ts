import { ContextMessageUpdate } from 'telegraf'
import logger from '../../util/logger'

export const song = async (ctx: ContextMessageUpdate) => {
  logger.debug(ctx, 'Search action song')
  const { id } = JSON.parse(ctx.callbackQuery.data)
  await ctx.scene.leave()
  ctx.session.song = id
  await ctx.answerCbQuery()
  await ctx.scene.enter('song')
}