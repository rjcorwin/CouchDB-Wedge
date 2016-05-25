var request = require('request')
var sys = require('sys')
var exec = require('child_process').exec;
var _ = require('underscore')
var promptly = require('promptly')

module.exports = function(options, callback) {
  promptly.confirm('Are you sure? y/n ', function (err, value) {
    console.log('Answer:', value);
    if (value == true) {
      request.get({uri: options.target + '/_all_dbs', json: true}, function(error, response, body) {
        if(error) return process.stderr.write(error)
        var cmd = ''
        body.forEach(function(db) {
          if (options.exclude.indexOf(db) == -1) {
            if (program.exclude.indexOf(db) == -1) {
              cmd += 'curl -XDELETE ' + options.target + '/' + db + ' \n'
            }
          }
        })
        if (options.verbose) {
          process.stdout.write('Running...')
          process.stdout.write(cmd)
        }
        exec(cmd, puts)
      })
    } else {
      console.log('Not going to do it then. ');
    }
  });
}
