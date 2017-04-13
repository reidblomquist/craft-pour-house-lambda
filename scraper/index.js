var axios = require('axios');
var cheerio = require('cheerio');
var vm = require('vm');

exports.scrape = function(callback) {
  axios.get('https://business.untappd.com/locations/1321/themes/1327/js')
    .then(function (response) {
      var str = response.data;
      var fnStr = str.split('var container = document.getElementById(containerId);').pop().split('    (function (){').shift();

      var container = {
        innerHTML: ''
      };

      var sandbox = { container: container };
      var context = vm.createContext(sandbox);
      var script = new vm.Script(fnStr);

      script.runInContext(context);

      var $ = cheerio.load(container.innerHTML);
      var parseResults = [];

      $('.beer').each(function(i, element) {
        var str = '';
        var tapNum = $(this).find('.tap-number-hideable').text().trim();

        if (tapNum !== '') {
          str += $(this).find('.beer-name').children('a.item-title-color').text();
          str += ' ' + $(this).find('.abv').text();

          var cleanStr = str.replace(/\n           /g, '').replace(/\n          /g, '').replace(/\n        /g, '')

          parseResults.push(cleanStr);
        }
      });

      return callback(null, parseResults);
    })
    .catch(function (error) {
      callback(true, error);
    });
};
