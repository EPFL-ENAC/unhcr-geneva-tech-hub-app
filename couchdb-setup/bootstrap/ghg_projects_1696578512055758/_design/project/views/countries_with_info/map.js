function (doc) {
  function isPublic(doc) {
    if (doc.public === undefined) return false
    return doc.public
  }

  var newDoc = {
    id: doc._id,
    siteName: doc.siteName,
    siteId: doc.siteId,
    location_pcode: doc.location_pcode,
    countryCode: doc.countryCode,
    latitude: doc.latitude,
    longitude: doc.longitude,
  }
  emit([doc.countryCode, doc.siteId], newDoc);
}
