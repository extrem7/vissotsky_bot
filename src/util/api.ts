import rp from 'request-promise'
import cheerio from 'cheerio'
import { getRandomInt } from './common'

import db from '../db.json'

export interface Song {
  id: number;
  title: string;
  lyrics: string;
  comment: string;
  records: Record[];
}

export interface Record {
  album: string,
  year: string,
  duration: string,
  href: string
}

export const api = {
  async search(query: string) {
    const regexp = new RegExp(query, 'i')
    return db.reduce((filtered, song) => {
      if (filtered.length >= 8) return filtered
      if (regexp.test(song.title + song.lyrics)) {
        filtered.push({ id: song.id, title: song.title })
      }
      return filtered
    }, [])
  },
  song(id: number): Song {
    return db.find((song: Song) => {
      return song.id == id
    })
  },
  async random(exclude: number[]) {
    const length = 507
    const random = getRandomInt(0, length)
    if (!exclude.includes(random)) {
      return db[random]
    } else {
      return this.random(exclude)
    }
  }
}

export const grabber = {
  url: 'http://v-vissotsky.ru/',
  async song(id: number): Promise<Song> {
    const url = `${this.url}song.php`,
      body = await rp.get({ url, qs: { pid: id } }),
      $: CheerioStatic = cheerio.load(body)

    $('.slova').find('h2,.god').remove()

    const title = $('h1.album').text(),
      lyrics = $('.slova').text(),
      comment = $('.prim p:not(:first-child)').toArray().reduce((text: string, item: CheerioElement) => {
        return `${text}\n\n${$(item).text()}`
      }, ''),
      rawSongs = $($('.pesny').get(0)).find('tr:not(:first-child)').toArray()

    const records: Record[] = rawSongs.map((item: CheerioElement) => {
      const album = $(item).find('.row a').text(),
        year = $($(item).find('td').get(0)).text(),
        duration = $(item).find('.dlit').text(),
        href = $(item).find('.downlo a').attr('href')
      return { album, year, duration, href }
    })
    return {
      id, title, lyrics, comment, records
    }
  }
}