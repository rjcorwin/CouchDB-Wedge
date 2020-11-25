var request = require('axios')

module.exports = async function(options, callback) {
  const response = await request.get(options.url + '?revs_info=true')
  const docs = []
  for (let rev_info of response.data._revs_info) {
    if (rev_info.status === 'available') {
      const response = await request.get(`${options.url}?rev=${rev_info.rev}`)
      docs.push({...rev_info, doc: response.data})
    } else {
      docs.push(rev_info)
    }
  }
  callback(null, JSON.stringify(docs, null, 2))
}
