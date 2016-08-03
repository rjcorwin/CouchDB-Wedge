var request = require('request')
var sys = require('sys')
var exec = require('child_process').exec;
var _ = require('underscore')

function puts(error, stdout, stderr) { sys.puts(stdout); sys.puts(stderr); sys.puts(error) } 

module.exports = function(options, callback) {
  request.get({uri: options.source + '/_all_dbs', json: true}, function(error, response, body) {
    if(error) return process.stderr.write(error)
    var cmd = ''
    body.forEach(function(db) {
      if (options.exclude.indexOf(db) == -1) {
        var doc = {
          "create_target":true, 
          "source": options.source + '/' + db, 
          "target": options.target + '/' + db
        }
        cmd += 'curl -XPOST -H "Content-Type: application/json" ' + options.worker + '/_replicator -d \'' + JSON.stringify(doc) + '\' ; \n'
      }
    })
    if (options.verbose) {
      process.stdout.write('Running...')
      process.stdout.write(cmd)
    }
    exec(cmd, puts)
  })
}
