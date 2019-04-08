const {send} = require('micro');
const {URL, URLSearchParams} = require('url');
const fetch = require('node-fetch');

module.exports = async function (req, res) {
  var url = 'http://' + req.headers.host + req.url;
  const myURL = new URL(url);
  const newSearchParams = new URLSearchParams(myURL.searchParams);
  // const id = newSearchParams.get('id');
  var callback = newSearchParams.get('callback');

  if (callback) {
    console.log('Callback:', callback);
    const response = await fetch(callback);
    const json = await response.text();
    console.log(json);
  }

  send(res, 200, 'Got it');
};
