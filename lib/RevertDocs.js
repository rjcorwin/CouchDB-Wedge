var unirest = require('unirest')

  /*
  TODO: This is not done. Here is an example of reverting a document.
     _.each docsToRevert, (docToRevert) ->
        $.couch.db("databaseName").openDoc docToRevert.id,
          revs_info: true
        ,
          success: (doc) ->
            $.couch.db("databaseName").openDoc docToRevert.id,
              rev: doc._revs_info[1].rev #1 gives us the previous revision
            ,
              success: (previousDoc) ->
                newDoc = previousDoc
                newDoc._rev = doc._rev
                result.save newDoc
  */


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
