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
  subscribe            Subscribe to the changes feed of a database and act on it.
  help [cmd]           display help for [cmd]

  Options:

    -h, --help     output usage information
    -V, --version  output the version number
```

## Example of subscribing to a changes feed and changing every foo property that is false to true
The subscribe command can help with schema transformations and progressive data updates. When running, the subscribe command listens for new changes, and when new changes are detected, processes them in batches. With each change, you can have a custom action performed. If the processing is interrupted at any point, the command stores a state file on disk to track where it last left in the changes feed.

If the following example, any doc that has a property of `foo` with a value of `false` will be set to `true`. 

Place the following in an `action.js` file in the directory you run the command:
```
module.exports = async function (change, db) {
  console.log(change)
  const doc = await db.get(change.id)
  // Warning: If you don't check that something is done, it will be an infinite loop.
  if (doc.foo === false) {
    doc.foo = true
    db.put(doc)
  }
}
```

```
wedge subscribe --url http://admin:some-password@lexample.com:5984/some-database
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

