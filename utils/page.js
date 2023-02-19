const axios = require('axios')

async function getPageContent(pageNumber) {
  try {
    const response = await axios.get(`https://exam.ioe.edu.np/?page=${pageNumber}`)
    return response.data
  } catch (error) {
    return new Error(error)
  }
}

module.exports = {
  getPageContent,
}