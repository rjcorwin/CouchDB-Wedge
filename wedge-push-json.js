#!/usr/bin/env node

var program = require('commander');
var pushJson = require('./lib/PushJson')
var fs = require('fs')

function puts(error, stdout, stderr) { sys.puts(stdout); sys.puts(stderr); sys.puts(error) } 

program
  .option('-u, --url <url>', 'The URL of where to push documents to.', '')
  .option('-f, --file <path>', 'Path to a file of JSON data.', '')
  .option('--verbose', 'Verbose mode')

program.on('--help', function(){
  process.stdout.write('  Examples:')
  process.stdout.write('')
  process.stdout.write('    $ wedge push-json --file data.json --url http://username:password@foo.tangerinecentral.org/group-testsweet')
  process.stdout.write('')
});

program.parse(process.argv);

if (program.file) {

  program.json = fs.readFileSync(program.file, 'utf8')
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

}
else {

  var stdin = process.stdin,
      stdout = process.stdout,
      inputChunks = [];

  stdin.resume();
  stdin.setEncoding('utf8');

  stdin.on('data', function (chunk) {
      inputChunks.push(chunk);
  });

  stdin.on('end', function () {
    program.json = inputChunks.join()
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

}
