import { ContextMessageUpdate } from 'telegraf'
import { getSongKeyboard } from '../song/helpers'
import texts from '../../texts'

export const favorite = async (ctx: ContextMessageUpdate) => {
  const id = ctx.session.song
  if (!ctx.session.favorites.includes(id)) ctx.session.favorites.push(id)
  await ctx.reply(texts.scenes.favorite.added, getSongKeyboard(ctx))
}

export const favoriteRemove = async (ctx: ContextMessageUpdate) => {
  const id = ctx.session.song
  if (ctx.session.favorites.includes(id))
    ctx.session.favorites = ctx.session.favorites.filter(favorite => favorite !== id)
  await ctx.reply(texts.scenes.favorite.removed, getSongKeyboard(ctx))
}