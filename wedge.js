#!/usr/bin/env node
var program = require('commander')

program
  .version('0.0.1')
  .command('replicate-all-dbs', 'replicate all databases from one couchdb to another')
  .command('delete-all-dbs', 'delete all databases on a couchdb')
  .command('pre-warm-views', 'Hit all views in a couchdb to pre-warm them')
  .parse(process.argv);
