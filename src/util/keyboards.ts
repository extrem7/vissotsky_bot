import { Markup, ContextMessageUpdate, Extra } from 'telegraf'
import texts from '../texts'

export const getBackKeyboard = (ctx: ContextMessageUpdate) => {
  const backKeyboardBack = texts.keyboards.back_keyboard.back
  let backKeyboard: any = Markup.keyboard([backKeyboardBack])

  backKeyboard = backKeyboard.resize().extra()

  return {
    backKeyboard,
    backKeyboardBack
  }
}

export const getMainKeyboard = (ctx: ContextMessageUpdate) => {
  const mainKeyboardSearch = texts.keyboards.main_keyboard.search
  const mainKeyboardRandom = texts.keyboards.main_keyboard.random
  const mainKeyboardFavorite = texts.keyboards.main_keyboard.favorite
  let mainKeyboard: any = Markup.keyboard([
    [mainKeyboardSearch] as any,
    [mainKeyboardRandom],
    [mainKeyboardFavorite]
  ])
  mainKeyboard = Extra.HTML().markup(mainKeyboard.resize())

  return {
    mainKeyboard,
    mainKeyboardSearch
  }
}
