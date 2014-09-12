# CouchDB Wedge
Node scripts for doing bulk operations like deleting all databases on a server or replicating all databases from one server to another.


## Example of a pull replication of all databases except for _replicator and resources
```
./replicate-all-dbs --worker https://username:password@serverb.cloudant.com --target https://username:password@serverb.example.com --source https://username:password@servera.example.com --exclude _replicator,resources
```


## Example of deleting all databases on a server except for _replicator and _users
```
./delete-all-dbs --server http://username:password@server.example.com --exclue _replicator,_users
```
