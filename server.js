import Fastify from 'fastify';
import * as dotenv from 'dotenv';
import getPageContent from './utils/page.js';
import getScrapedPage from './utils/scrape.js';
import mongodb from '@fastify/mongodb'

dotenv.config();

const fastify = Fastify({ logger: true });

fastify.register(mongodb, {
  forceClose: true,
  url: "mongodb+srv://ioenotice:Ck7IYBrhOknbN5oa@ioenotice-mumbai.5ewfpss.mongodb.net/?retryWrites=true&w=majority",
})

fastify.get('/status', async () => ({ status: 'Healthy' }));

// fastify.get('/page/:number', async (request) => {
//   try {
//     const pageNumber = request.params?.number;
//     const pageContent = await getPageContent(pageNumber);
//     const scrapedData = getScrapedPage(pageContent);
//     const notices = fastify.mongo.db.collection("notices");
//     await notices.insertMany(scrapedData);
//     return scrapedData;
//   } catch (error) {
//     console.log(error);
//     return { error };
//   }
// });

fastify.get('/fetch', async (request) => {
  try {
    const notices = fastify.mongo.db.collection("notices");
    const existingData = await notices.findOne();
    const newData = [];
    if (!existingData) {
      for (let pageNumber of Array.from(Array(60).keys()).reverse()) {
        const pageContent = await getPageContent(pageNumber);
        const scrapedData = getScrapedPage(pageContent);
        newData.push(...scrapedData);
      }
      const dbRes = notices.insertMany(newData);
      return dbRes
    }
    else {
      const pageContent = await getPageContent(1);
      const scrapedData = getScrapedPage(pageContent);
      newData.push(...scrapedData);
      const dbRes = notices.insertMany(newData);
      return dbRes
    }
  } catch (error) {
    console.log(error);
    return { error };
  }
});

fastify.get('/notices', async (request) => {
  try {
    const notices = fastify.mongo.db.collection("notices");
    const { limit = 10, skip = 0 } = request.query;
    const results = await notices.find({}, { limit: parseInt(limit), skip: parseInt(skip), sort: { date: -1 } }).toArray();
    return results;
  } catch (error) {
    console.log(error);
    return { error };
  }
})

const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
