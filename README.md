# Replication maps

The `draw-map` utility can save you hours of entering items in the _replicator database as well as save you from human errors in writing JSON.  

Here are some examples:

Here's an example of a one time replication of oledemo.cloudant.com to another place.

```
./install-map --to http://oledemo:***@oledemo.cloudant.com/_replicate --mapfile ./map--send-oledemo-somewhere-else.csv --create_target
```

Here' an example of configuring a BeLL to replicate as a community BeLL from OLE Demo.
```
./install-map --to http://oledemo:***@oledemo.cloudant.com/replicator_database_for_sattelites --mapfile ./map--sattelite-to-oledemo.csv.csv --create_target --continuous
```

Sattelites would then just replicate `http://oledemo:***@oledemo.cloudant.com/replicator_database_for_sattelites` database to their _replicator database and they would have all the necessary settings.


