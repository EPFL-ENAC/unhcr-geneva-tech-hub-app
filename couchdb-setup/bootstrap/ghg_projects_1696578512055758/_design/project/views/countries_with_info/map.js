function (doc) {
  function isPublic(doc) {
    if (doc.public === undefined) return false
    return doc.public
  }

  var newDoc = {
    id: doc._id,
    rev: doc._rev,
    siteName: doc.siteName,
    siteId: doc.siteId,
    name: doc.name,
    created_by: doc.created_by,
    updated_at: doc.updated_at,
    users: doc.users,
    public: isPublic(doc),
    countryCode: doc.countryCode,
    latitude: doc.latitude,
    longitude: doc.longitude,
  }
  emit([doc.countryCode, doc.siteId], newDoc);
}
