#!/usr/bin/env node

var program = require('commander');
var subscribe = require('./lib/Subscribe.js')

function puts(error, stdout, stderr) { sys.puts(stdout); sys.puts(stderr); sys.puts(error) } 

program
  .option('-u, --url <url>', 'The Database URL with credentials.', '')
  .option('-a, --actionPath <actionPath>', 'Path to an action file that contains JS for acting on each change.', process.cwd() + '/action.js')
  .option('-u, --statePath <statePath>', 'Path to a state file used for continuing an interrupted subscription.', process.cwd() + '/state.json')
  .option('-s, --batchSize <batchSize>', 'Number of changes to process in a batch.', 100)
  .option('-b, --delayBetweenBatches <delayBetweenBatches>', 'Delay between each batch.', 0)
  .option('-n, --delayWhenNothingToProcess <delayWhenNothingToProcess>', 'Delay when there is no new changes.', 60*1000)
  .option('--verbose', 'Verbose mode', false)

program.on('--help', function(){
  process.stdout.write('  Examples:')
  process.stdout.write('')
  process.stdout.write('To start a subscription:')
  process.stdout.write('    $ wedge subscribe --url http://username:password@foo.example.com/group-testsweet --actionPath ./action.js --statePath ./state.json')
  process.stdout.write('')
  process.stdout.write('To restart a subscription, you just need an existing state path:')
  process.stdout.write('    $ wedge subscribe --statePath ./state.json')
  process.stdout.write('')
});

program.parse(process.argv);

if (program.keys) {
  program.keys = JSON.parse(program.keys)
  if (program.verbose) console.log(program.keys)
}

subscribe({
  url: program.url,
  actionPath: program.actionPath,
  statePath: program.statePath,
  batchSize: program.batchSize,
  delayBetweenBatches: program.delayBetweenBatches,
  delayWhenNothingToProcess: program.delayWhenNothingToProcess,
  verbose: program.verbose
}).catch(function(err) {
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

