#!/usr/bin/env node
const subscribeWorker = require('./subscribe-worker.js')
async function go() {
  const statePath = process.argv[2]
  await subscribeWorker.batch(statePath)
}
go()
