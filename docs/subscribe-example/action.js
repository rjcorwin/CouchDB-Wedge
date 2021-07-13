module.exports = async function (change, db) {
  console.log(change)
  const doc = await db.get(change.id)
  // Warning: If you don't check that something is done, it will be an infinite loop.
  if (doc.foo === false) {
    doc.foo = true
    db.put(doc)
  }
}
