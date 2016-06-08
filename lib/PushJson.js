var unirest = require('unirest')

module.exports = function(options, callback) {

  if (options.verbose) console.log('Posting...')
  unirest.post(options.url + '/_bulk_docs')
  .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
  .send({'docs': options.json})
  .end(function(res) {
    if (options.verbose) console.log(res)
    return callback(null, res)
  })

}
