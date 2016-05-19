#!/usr/bin/env node

var program = require('commander');
var preWarmViews = require('./lib/PreWarmViews')

function puts(error, stdout, stderr) { sys.puts(stdout); sys.puts(stderr); sys.puts(error) } 

program
  .version('0.0.0')
  .option('-t, --target <target>', 'Target server', '')

program.on('--help', function(){
  process.stdout.write('  Examples:')
  process.stdout.write('')
  process.stdout.write('    $ wedge pre-warm-views --target http://username:password@target-server.org')
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

preWarmViews(program, function(err, res) {
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

