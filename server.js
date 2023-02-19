
const fastify = require('fastify')({ logger: true })
const { getPageContent } = require('./utils/page')
const { getScrapedPage } = require('./utils/scrape')


fastify.get('/status', async (_request, _reply) => {
  return { status: 'Healthy' }
})

fastify.get('/page/:number', async (request, _reply) => {
    try {
      const pageNumber = request.params?.number
      const pageContent = await getPageContent(pageNumber);
      const scrapedData = getScrapedPage(pageContent)
      return scrapedData
    } catch (error) {
      return {error}
    }
})


const start = async () => {
  try {
    await fastify.listen({ port: 3000 })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()