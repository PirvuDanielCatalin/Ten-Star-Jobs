const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.get('/api/jobs', async (req, res) => {
  try {
    const response = await axios.get('https://careers.adobe.com/us/en/search-results');
    const $ = cheerio.load(response.data);
    
    const jobs = [];
    
    // This selector might need to be updated based on Adobe's actual HTML structure
    $('.job-tile').each((i, element) => {
      const title = $(element).find('.job-title').text().trim();
      const location = $(element).find('.job-location').text().trim();
      const department = $(element).find('.job-department').text().trim();
      const url = $(element).find('a').attr('href');
      
      jobs.push({
        id: i + 1,
        title,
        location,
        department,
        url: url.startsWith('http') ? url : `https://careers.adobe.com${url}`
      });
    });
    
    res.json(jobs);
  } catch (error) {
    console.error('Error scraping jobs:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
