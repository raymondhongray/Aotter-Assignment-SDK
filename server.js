const express = require('express');
const app = express();
const data = require('./mock-data.json');
const request = require('request');
const fetch = require('node-fetch');

const { PORT = 3000 } = process.env;

app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(express.static('dist'));

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin');
  next();
});

const random = (min, max) => Math.floor(Math.random() * (max - min) ) + min;
const genAdId = () => `${+new Date()}-${random(0, 1000)}`;

//get random ad from mock data
const getAd = (type = '') => {
  const ads = type
    ? data.filter(ad => ad.type === type || !ad.success)
    : data;

  const ad = ads[random(0, ads.length)];
  return {
    ...ad,
    id: genAdId()
  };
}

// api endpoint
app.get('/ads', (req, res) => {
  /**
   * type: requested ad type
   */
  const { type = '' } = req.query;
  res.json(getAd(type.toUpperCase()));
});

// the example page
app.get('/', (req, res) => {
  res.render('index.html');
});

app.get('/iframe_api', (req, res) => {
  const {
    iframeID,
    adType,
    title,
    description,
    imgSrc = '',
    href = '',
    impressionUrl = ''
  } = req.query;

  res.render('iframe_api.html', {
    iframeID: decodeURIComponent(iframeID),
    adType: decodeURIComponent(adType),
    title: decodeURIComponent(title),
    description: decodeURIComponent(description),
    imgSrc: decodeURIComponent(imgSrc),
    href: decodeURIComponent(href),
    impressionUrl: decodeURIComponent(impressionUrl)
  });
});

app.get('/fileThumbnail', (req, res) => {
  const { url = '' } = req.query;
  request.get(decodeURIComponent(url)).pipe(res);
});

app.get('/call', async (req, res) => {
  let { url = '' } = req.query;
  url = decodeURIComponent(url);

  const success = await fetch(url, {
    method: 'GET'
  })
  .then((response)=> {
    return response.status === 200 ? true : false;
  })
  .catch(error => {
    console.error(error);
    return false;
  });
  res.json({ success });
});

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}!`);
});
