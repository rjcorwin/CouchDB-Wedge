#!/usr/bin/env node

var program = require('commander');
var RestoreDeletedDoc = require('./lib/RestoreDeletedDoc')

function puts(error, stdout, stderr) { sys.puts(stdout); sys.puts(stderr); sys.puts(error) } 

program
  .version('0.0.0')
  .option('-u, --url <url>', 'URL to CouchDB', '')
  .option('-d, --db <db>', 'Name of Database', '')
  .option('-i, --docId <docId>', 'ID of document', '')
  .option('--verbose', 'Verbose mode')

program.on('--help', function(){
  process.stdout.write('  Examples:')
  process.stdout.write('')
  process.stdout.write('    $ wedge restore-deleted-doc --url http://username:password@source-server.com:5984 --db my-db --docId 1234')
  process.stdout.write('')
});

program.parse(process.argv);

RestoreDeletedDoc(program.url, program.db, program.docId, function(err, res) {
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

