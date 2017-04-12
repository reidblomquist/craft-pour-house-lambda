var scraper = require('./scraper');

exports.handler = function(event, context, callback) {
    scraper.scrape(function(err, result) {
      if (err) {
        return callback(null, {error: result});
      }
      callback(null, {result: result});
    })
  }
  else {
    callback(null, {error: 'whoopsiedaisy'});
  }
};
