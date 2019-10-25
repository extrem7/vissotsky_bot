import { Song, grabber } from './util/api'
import fs from 'fs'
import * as readline from 'readline'
import { sleep } from './util/common'

async function grab() {
  let songs: Song[] = []
  const promises = []
  console.log('Grabber has been started')
  for (let i = 1; i <= 554; i++) {
    await sleep(0.01)
    promises.push(grabber.song(i))
    readline.clearLine(process.stdout, 0)
    readline.cursorTo(process.stdout, 0)
    process.stdout.write(`${i}th connection`)
  }
  readline.clearLine(process.stdout, 0)
  readline.cursorTo(process.stdout, 0)

  console.log(`${promises.length} connections has been opened`)
  await Promise.all(promises).then(values => {
    songs = values
    console.log(`${promises.length} connections has been closed`)
  })
  return songs.filter(song => {
    return song.title && song.records.length
  })
}

grab().then(songs => {
  const json = JSON.stringify(songs, undefined, 1)
  fs.writeFile('db.json', json, 'utf-8', () => {
    console.log(`Total count of songs: ${songs.length}`)
  })
})
