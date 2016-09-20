#!/usr/bin/env node

var program = require('commander');
var revertDocs = require('./lib/ReverDocs')

function puts(error, stdout, stderr) { sys.puts(stdout); sys.puts(stderr); sys.puts(error) } 

program
  .option('-u, --url <url>', 'The URL of where to get JSON from.', '')
  .option('-k, --keys <keys>', 'An array of keys. Will perform an HTTP POST because keys can be too long for urls.', '')
  .option('--verbose', 'Verbose mode')

program.on('--help', function(){
  process.stdout.write('  Examples:')
  process.stdout.write('')
  process.stdout.write('    $ wedge pull-json --url http://username:password@foo.tangerinecentral.org/group-testsweet/_all_docs?include_docs=true --keys \'["settings"]\'')
  process.stdout.write('')
});

program.parse(process.argv);

if (program.keys) {
  program.keys = JSON.parse(program.keys)
  if (program.verbose) console.log(program.keys)
}

revertDocs(program, function(err, res) {
  if(err) {
    process.stderr.write(err)
    process.stderr.write(res)
    process.exit(1)
  }
  else {
    process.stdout.write(res)
    process.exit(0)
  }   
})

