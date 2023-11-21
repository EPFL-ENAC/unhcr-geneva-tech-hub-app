function (doc) {
  emit([doc.countryCode, doc.siteId], {
    id: doc._id,
    siteName: doc.siteName,
    siteId: doc.siteId,
    name: doc.name,
    created_by: doc.created_by,
    updated_at: doc.updated_at,
    users: doc.users,
    countryCode: doc.countryCode,
    latitude: doc.latitude,
    longitude: doc.longitude,
  });
}
