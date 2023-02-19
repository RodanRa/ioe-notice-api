import { load } from 'cheerio';
import Sugar from 'sugar-date';

export default function getScrapedPage(pageContent) {
  if (!pageContent) return [];

  const baseUrl = 'https://exam.ioe.edu.np';
  const $ = load(pageContent);
  const data = $('#datatable tbody > tr').map((i, el) => {
    const displayDate = $(el).find('td:nth-child(3)').text();
    const date = Sugar.Date.create(`${displayDate.split(",")[1].trim()}, ${displayDate.split(",")[2].trim()} ${23 - parseInt(i)}:59`)
    return {
      title: $(el).find('td:nth-child(2) a span').text(),
      url: baseUrl + $(el).find('td:nth-child(2) a').attr('href'),
      displayDate,
      date,
    }
  }).get();
  return data;
}
