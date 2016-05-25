var unirest = require('unirest')

module.exports = function(options, callback) {

  var responseToJson = function(res) {
    var data = []
    if (options.verbose) console.log(res.body)
    res.body.rows.forEach(function(row) {
      data.push(row.doc)
    })
    return JSON.stringify(data, null, 2)
  }

  if (options.keys) {
    if (options.verbose) console.log('Posting...')
    unirest.post(options.url)
    .headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
    .send({'keys': options.keys})
    .end(function(res) {
      if (options.verbose) console.log(res)
      return callback(null, responseToJson(res))
    })
  }
  else {
    if (options.verbose) console.log('Getting...')
    unirest.get(options.url)
    .header('Accept', 'application/json')
    .header('Content-Type', 'application/json')
    .end(function(res) {
      if (options.verbose) console.log(res)
      return callback(null, responseToJson(res))
    })
  }

}
