import { ContextMessageUpdate } from 'telegraf'
import logger from '../../util/logger'
import { api } from '../../util/api'

const random = async (ctx: ContextMessageUpdate) => {
  logger.debug(ctx, 'Opens random section')
  const song = await api.random(ctx.session.excludeRandom)
  if (ctx.session.excludeRandom.length > 250) {
    ctx.session.excludeRandom.shift()
  }
  ctx.session.excludeRandom.push(song.id)
  ctx.session.song = song.id
  await ctx.scene.enter('song')
}

export default random
