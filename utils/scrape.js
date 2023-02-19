const cheerio = require('cheerio')

function getScrapedPage(pageContent) {
    if (!pageContent) return []

    const baseUrl = 'https://exam.ioe.edu.np'
    const $ = cheerio.load(pageContent)
    const data = $('#datatable tbody > tr').map((_i, el) => {
        return {
            title: $(el).find('td:nth-child(2) a span').text(),
            url: baseUrl+$(el).find('td:nth-child(2) a').attr('href'),
            date: $(el).find('td:nth-child(3)').text(),
        }
    }).get()
    return data
}

module.exports = {
    getScrapedPage,
}