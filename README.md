# CouchDB Wedge
CLI and node module for doing bulk operations like deleting all databases on a server or replicating all databases from one server to another.

## Install
```
npm install -g couchdb-wedge
```

Wedge is a command that consists of many other sub-commands, see below.
```
 λ wedge --help

  Usage: wedge [options] [command]


  Commands:

  replicate-all-dbs    replicate all databases from one couchdb to another
  delete-all-dbs       delete all databases on a couchdb
  pre-warm-views       Hit all views in a couchdb to pre-warm them
  restore-deleted-doc  Undelete a doc
  pull-json            Pull documents from a View in CouchDB returning just an array of the documents, not additional metadata that CouchDB usually does.
  push-json            Push an array of documents to a CouchDB database. Accepts STDIN over a pipe.
  doc-history          Revs with docs attached
  help [cmd]           display help for [cmd]

  Options:

    -h, --help     output usage information
    -V, --version  output the version number
```


## Example of a pull replication of all databases except for _replicator and resources
```
wedge replicate-all-dbs --worker https://username:password@serverb.cloudant.com --target https://username:password@serverb.example.com --source https://username:password@servera.example.com --exclude _replicator,resources
```


## Example of deleting all databases on a server except for _replicator and _users
```
wedge delete-all-dbs --target http://username:password@server.example.com --exclude _replicator,_users
```

This command has a prompt asking the user to confirm the action.

## Example of pre-warming CouchDB view cache, which forces generation of index for all databases on the couch server.

````
wedge pre-warm-views --target http://username:password@target-server.org
````

This command has a prompt asking the user to confirm the action.

## Develop

Get the code and set your own `wedge` command to resolve to that codebase.
```
git clone git@github.com:rjsteinert/CouchDB-Wedge.git
cd CouchDB-Wedge
npm link
```

