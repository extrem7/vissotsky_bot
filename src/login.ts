import rp from 'request-promise'
import cheerio from 'cheerio'

rp.get('https://stand.order.lviv.ua/stand-schedule/', {
  headers: {
    'Cookie': '_csrf=5c8d9e079190fa68d13b9fb9c2f6222d542c8a0c2c9976878178a0004838fa36a%3A2%3A%7Bi%3A0%3Bs%3A5%3A%22_csrf%22%3Bi%3A1%3Bs%3A32%3A%22X0rjQ7kbv72x0feTm8z0mhL3Z1lP4B-r%22%3B%7D; PHPSESSID=q2sm6rufalopla8h3ch8uhhpf4; _identity=1e171c347425fb6382ad9ec520c50c35be57875d0e8e549150a913563cf2bcf5a%3A2%3A%7Bi%3A0%3Bs%3A9%3A%22_identity%22%3Bi%3A1%3Bs%3A47%3A%22%5B22%2C%22klf0muIcYVv28Vdlk3MTz7g3m2i8Gzv2%22%2C2592000%5D%22%3B%7D'
  }
}).then(res => {
  const $: CheerioStatic = cheerio.load(res),
    tr = $('.table tbody tr:not(:first-child)'),
    tds = $(tr).find('td:first-child,td:nth-child(2)').toArray()

  tds.forEach((td: CheerioElement, index: number) => {
    process.stdout.write($(td).text() + ' ')
    if ((index + 1) % 2 == 0) process.stdout.write('\n')
  })
})