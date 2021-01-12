# CHANGELOG

## v1.0.2
- In `pre-warm-views`, prevent out of memory errors in script by requesting zero rows when indexing views
- In `pre-warm-views`, reduce number of requests to CouchDB when it is still indexing by sleeping for 5 seconds when a request times out. 


## v1.0.1
- Make pre-warm-views less prone to crashing CouchDB by indexing one view at a time.
- Upgrade axios to 0.21.1.


