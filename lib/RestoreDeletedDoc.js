var request = require('axios')

module.exports = async function(url, db, docId, callback) {
  try {
    const docUrl = `${url}/${db}/${docId}`
    const response = await request.get(`${docUrl}?revs=true&open_revs=all`)
    // Parse CouchDB's response which includes 3 lines of junk before the actual JSON starts.
    const docInfo = JSON.parse(response.data.split('\n')[3])
    // Calculate the and construct the revision id before the delete. Assuming it's the revision before last.
    const revBeforeDelete = `${docInfo._revisions.start - 1}-${docInfo._revisions.ids[1]}`
    await request({
      method: 'copy',
      url: `${docUrl}?rev=${revBeforeDelete}`,
      headers: {
        'Destination': docId
      }
    })
  } catch (e) {
    console.log(e)
  }
  callback(null, 'ok')
}
