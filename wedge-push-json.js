#!/usr/bin/env node

var program = require('commander');
var pushJson = require('./lib/PushJson')

function puts(error, stdout, stderr) { sys.puts(stdout); sys.puts(stderr); sys.puts(error) } 

program
  .option('-u, --url <url>', 'The URL of where to push documents to.', '')
  .option('--verbose', 'Verbose mode')

program.on('--help', function(){
  process.stdout.write('  Examples:')
  process.stdout.write('')
  process.stdout.write('    $ wedge push-json --url http://username:password@foo.tangerinecentral.org/group-testsweet')
  process.stdout.write('')
});

program.parse(process.argv);

var stdin = process.stdin,
    stdout = process.stdout,
    inputChunks = [];

stdin.resume();
stdin.setEncoding('utf8');

stdin.on('data', function (chunk) {
    inputChunks.push(chunk);
});

stdin.on('end', function () {

  var inputJSON = inputChunks.join(),
      parsedData = JSON.parse(inputJSON),
      program.json = JSON.stringify(parsedData, null, '    ');

  pushJson(program, function(err, res) {
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

});

