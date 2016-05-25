var request = require('request')
var _ = require('underscore')
var promptly = require('promptly')


// Using console.log instead of process.stdout.write to get a line-break after each output.
// http://stackoverflow.com/a/4984464

module.exports = function(options, callback) {
  promptly.confirm('Are you sure? y/n ', function (err, value) {
    console.log('Answer:', value);
    if (value == true) {
      request.get({uri: options.target + '/_all_dbs', json: true}, function(error, response, body) {
        if (!error && response.statusCode == 400) {
          console.log(body)
          process.stderr.write(body)
        }
        if(error) return process.stderr.write("Wedge error: " + error)
        body.forEach(function(db) {
          // console.log("db:" + db)
          request.get({uri: options.target + '/' + db + '/_all_docs?startkey="_design/"&endkey="_design0"&include_docs=true', json: true}, function(error, response, body) {
            if (error) return process.stderr.write(error)
            body.rows.forEach(function(row) {
              // console.log("row.id:" + row.id)
              request.get({uri: options.target + '/' + db + '/' + row.id, json: true}, function(error, response, body) {
                if (error) return process.stderr.write(error)
                // console.log("URL:" + options.target + '/' + db + '/' + row.id)
                if (typeof body.views != 'undefined') {
                  var views = body.views;
                  for (var name in views) {
                    // console.log("View:" + JSON.stringify(name))
                    request.get({uri: options.target + '/' + db + '/' + row.id + '/_view/' + name, json: true}, function(error, response, body) {
                      console.log("View indexed:" + options.target + '/' + db + '/_view/' + row.id + '/' + name)
                      if (typeof body.total_rows != 'undefined') {
                        console.log("Indexing complete. Total rows: " + JSON.stringify(body.total_rows))
                      } else {
                        console.log("Indexing complete.")
                      }
                    });
                  }
                } else {
                  console.log("No views for " + row.id )
                }
              })
            })
          })
        })
      }).on('error', function(err) {
        console.log(err)
      })
    } else {
      console.log('Not going to do it then. ');
    }
  });

}
