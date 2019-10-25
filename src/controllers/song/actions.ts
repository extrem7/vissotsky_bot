import { ContextMessageUpdate } from 'telegraf'
import { editKeyboard, getRecordsKeyboard, getSongKeyboard } from './helpers'
import { hideButton } from '../../util/common'
import { api } from '../../util/api'

export const records = async (ctx: ContextMessageUpdate) => {
  if (api.song(ctx.session.song).records.length) {
    await ctx.reply('Список доступных записей песни:', getRecordsKeyboard(ctx))
    await editKeyboard(ctx)
  }
}

export const lyrics = async (ctx: ContextMessageUpdate) => {
  const { lyrics } = api.song(ctx.session.song)
  await hideButton(ctx)
  await ctx.reply(lyrics, getSongKeyboard(ctx))
}

export const comment = async (ctx: ContextMessageUpdate) => {
  const { comment } = api.song(ctx.session.song)
  await hideButton(ctx)
  await ctx.reply(comment, getSongKeyboard(ctx))
}

export const download = async (ctx: ContextMessageUpdate) => {
  const { id, record } = JSON.parse(ctx.callbackQuery.data),
    song = api.song(id)
  const { album, year, href } = song.records[record]
  await ctx.replyWithAudio(href, {
    caption: `${album}${year ? ' | ' + year : ''}`
  })
  /*song.records = song.records.filter((value, i) => {
    return index !== i
  })
  await editMessage(ctx, 'Список доступных записей песни:', getRecordsKeyboard(ctx))*/
  await ctx.answerCbQuery()
}