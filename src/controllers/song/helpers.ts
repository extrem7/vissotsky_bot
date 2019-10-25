import { Extra, Markup, ContextMessageUpdate, CallbackButton } from 'telegraf'
import { api, Record } from '../../util/api'
import { hideButton, isButtonHidden } from '../../util/common'
import { getBackKeyboard } from '../../util/keyboards'
import texts from '../../texts'

export function getSongKeyboard(ctx: ContextMessageUpdate) {
  const recordsText = texts.keyboards.song_keyboard.records
  const recordsButton = Markup.button(recordsText, isButtonHidden(ctx, recordsText))

  const lyricsText = texts.keyboards.song_keyboard.lyrics
  const lyricsButton = Markup.button(lyricsText, isButtonHidden(ctx, lyricsText))

  const commentText = texts.keyboards.song_keyboard.comment
  const commentButton = Markup.button(commentText, isButtonHidden(ctx, commentText))

  let favoriteText = texts.keyboards.song_keyboard.favorite
  if (ctx.session.favorites.includes(ctx.session.song)) {
    favoriteText = texts.keyboards.song_keyboard.favorite_remove
  }

  const favoriteButton = Markup.button(favoriteText)

  const { backKeyboardBack } = getBackKeyboard(ctx)

  const keyboard: any = Markup.keyboard([
    [recordsButton, lyricsButton] as any,
    [commentButton, favoriteButton],
    [backKeyboardBack]
  ])
  return keyboard.resize().extra()
}

export function getRecordsKeyboard(ctx: ContextMessageUpdate) {
  return Extra.HTML().markup((m: Markup) => {
    const buttons = api.song(ctx.session.song).records.map((record: Record, index: number): CallbackButton[] => {
      const { album, duration, year } = record
      return [m.callbackButton(
        `${year ? year + ' | ' : ''}${album} ${duration}`,
        JSON.stringify({ a: 'download', record: index, id: ctx.session.song }),
        false
      )]
    })
    return m.inlineKeyboard(buttons, {})
  })
}

export const editKeyboard = async (ctx: ContextMessageUpdate) => {
  await hideButton(ctx)
  if (Object.keys(ctx.session.keyboard).length < 3) {
    await ctx.reply('Еще можно получить:', getSongKeyboard(ctx))
  } else {
    await ctx.reply('Это все, дружище.', getSongKeyboard(ctx))
  }
}