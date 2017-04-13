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
        var obj = {};
        var tapNum = $(this).find('.tap-number-hideable').text().trim();

        if (tapNum !== '') {
          obj.tap = tapNum.replace('.', '');
          obj.brewery = $(this).find('.brewery').find('a').text();
          obj.abv = $(this).find('.abv').text().replace('%', '').replace(' ABV', '');
          obj.desc = $(this).find('.item-description').children('p').text().replace(/\n/g, '');
          obj.name = $(this).find('.beer-name').children('a').text().replace(/\n/g, '').replace(tapNum, '').trim();
          obj.type = $(this).find('.beer-style').text();

          parseResults.push(obj);
        }
      });

      return callback(null, parseResults);
    })
    .catch(function (error) {
      callback(true, error);
    });
};
