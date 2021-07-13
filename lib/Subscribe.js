const PouchDB = require('pouchdb')
const sleep = (mseconds) => new Promise((res) => setTimeout(() => res(), mseconds))
const util = require('util');
const exec = util.promisify(require('child_process').exec)
const log = require('tangy-log').log
const subscribeWorker = require('./subscribe-worker.js')

module.exports = async function(options = {
    url: '',
    actionPath: '',
    statePath: '',
    verbose: false,
    batchSize: 100, 
    delayWhenNothingToProcess: 60*1000,
    delayBetweenBatches: 0
}) {
  await subscribeWorker.prepare(options)
  // Keep alive.
  while (true) {
    try {
      let workerState = await subscribeWorker.getWorkerState(options.statePath)
      const result = await exec(`${__dirname}/subscribe-worker-batch.js ${workerState.statePath}`)
      if (result.stderr) {
        // Sometimes CouchDB gives up and we'll have an error. Sleep it off.
        log.error(result.stderr)
        await sleep(3*1000)
      } else {
        workerState = await subscribeWorker.getWorkerState(workerState.statePath)
        if (workerState.hasOwnProperty('processed') === false || workerState.processed === 0) {
          await sleep(workerState.delayWhenNothingToProcess)
        } else {
          log.info(`Processed ${workerState.processed} changes.`)
          await sleep(workerState.delayBetweenBatches)
        }
      }
    } catch (error) {
      log.error('Processing had a critical error and may not recover.')
      console.log(error)
      await sleep(3*1000)
    }
  }
}
