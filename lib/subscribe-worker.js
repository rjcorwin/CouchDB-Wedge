const util = require('util')
const fs = require('fs')
const unlink = util.promisify(fs.unlink)
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const pathExists = require('fs-extra').pathExists
const sleep = (milliseconds) => new Promise((res) => setTimeout(() => res(true), milliseconds))

const PouchDB = require('pouchdb')
const log = require('tangy-log').log
const defaultState = { 
  "tally": 0, 
  "processed": 0,
  "startTime": 0,
  "endTime": 0,
  "batchSize": 5,
  "url": ""
}

/*
 * Getter and setters for worker state.
 */

async function getWorkerState(path) {
  return JSON.parse(await readFile(path, 'utf-8'))
}

async function setWorkerState(workerState) {
  await writeFile(workerState.statePath, JSON.stringify(workerState, null, 2), 'utf-8')
}

/*
 * Ensure we have a state file.
 */

async function prepare(options) {
  let workerState = {}
  try {
    workerState = await getWorkerState(options.statePath)
  } catch(err) {
    Object.assign(workerState, options)
  }
  await setWorkerState(workerState)
  return workerState
}

/*
 * Run a reporting worker batch.
 */

async function batch(statePath) {
  try {
    workerState = await getWorkerState(statePath)
    const action = require(workerState.actionPath)
    workerState = Object.assign({} , defaultState, workerState)
    const startTime = new Date().toISOString()
    let processed = 0
    // Process batch.
    const db = new PouchDB(workerState.url)
    const changes = await db.changes({ since: workerState.sequence, limit: workerState.batchSize, include_docs: false })
    if (changes.results.length > 0) {
      for (let change of changes.results) {
        try {
          await action(change, db)
          processed++
        } catch (error) {
          let errorMessage = JSON.stringify(error)
          let errorMessageText = error.message

          // Sometimes JSON.stringify wipes out the error.
          console.log("typeof error message: " + typeof error.message + " errorMessage: " + errorMessage + " errorMessageText: " + errorMessageText)
          if (typeof error.message === 'object') {
            errorMessageText = JSON.stringify(error.message)
          }
          if (errorMessage === '{}') {
            errorMessage = "Error : " +  " message: " + errorMessageText
          } else {
            errorMessage = "Error : " +  " message: " + errorMessageText + " errorMessage: " + errorMessage
          }
          log.error(`Error on change sequence ${change.seq} with id ${change.id} - Error: ${errorMessage} ::::: `)
        }
      }
      // Even if an error was thrown, continue on with the next sequences.
      workerState.sequence = changes.results[changes.results.length-1].seq
    }
    // Persist state to disk.
    await setWorkerState(Object.assign({}, workerState, {
      tally: workerState.tally + processed,
      endTime: new Date().toISOString(),
      processed,
      startTime
    }))
    return 
  } catch(e) {
    console.error(e)
  }
}

module.exports.getWorkerState = getWorkerState
module.exports.setWorkerState = setWorkerState
module.exports.prepare = prepare
module.exports.batch = batch
