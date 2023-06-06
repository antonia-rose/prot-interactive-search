const express = require('express')
var http = require('https');
const app = express()
const port = 3030

app.get('/de/suggestions', (req, res) => {
    var query = req.query.query;
    var url = 'https://www.springermedizin.de/de/suggestions?query=' + query + '&searchType=StandardSearchType';
    http.request(url, function(response) {
        res.set('Content-Type', 'application/json');
        res.set('Access-Control-Allow-Origin', '*');
        response.pipe(res);
    }).on('error', function(e) {
        res.sendStatus(500);
    }).end();
})

app.get('/de/advancedSuggestions', (req, res) => {
    var query = req.query.query;
    var url = 'https://www.springermedizin.de/de/advancedSuggestions?query=' + query + '&searchType=StandardSearchType';
    http.request(url, function(response) {
        res.set('Content-Type', 'application/json');
        res.set('Access-Control-Allow-Origin', '*');
        response.pipe(res);
    }).on('error', function(e) {
        res.sendStatus(500);
    }).end();
})

app.get('/learning/course/status/:id', (req, res) => {
  var url = 'https://www.springermedizin.de/learning/course/status/' + req.params.id;
  http.request(url, function(response) {
      res.set('Content-Type', 'application/json');
      res.set('Access-Control-Allow-Origin', '*');
      response.pipe(res);
  }).on('error', function(e) {
      res.sendStatus(500);
  }).end();
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
