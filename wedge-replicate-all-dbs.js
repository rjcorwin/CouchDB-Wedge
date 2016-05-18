#!/usr/bin/env node

var program = require('commander');
var replicateAllDbs = require('./lib/ReplicateAllDbs')

function puts(error, stdout, stderr) { sys.puts(stdout); sys.puts(stderr); sys.puts(error) } 

program
  .version('0.0.0')
  .option('-t, --target <target>', 'Target server', '')
  .option('-s, --source <source>', 'Source server', '')
  .option('-w, --worker <worker>', 'The Worker server that will manage a replication', '')
  .option('-x, --exclude <exclude>', 'A comma seperated list of databases to exclude', '')
  .option('--verbose', 'Verbose mode')

program.on('--help', function(){
  process.stdout.write('  Examples:')
  process.stdout.write('')
  process.stdout.write('    $ wedge replicate-all-dbs --source http://username:password@source-server.com:5984 --target http://username:password@target-server.org')
  process.stdout.write('')
});

program.parse(process.argv);

if (program.exclude) {
  program.exclude = program.exclude.split(',')
}
else {
  program.exclude = []
}

if (!program.worker) {
  program.worker = program.source
}

replicateAllDbs(program, function(err, res) {
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

