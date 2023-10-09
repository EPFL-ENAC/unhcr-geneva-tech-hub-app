function (doc) {
  emit(doc.siteId, {
    id: doc._id,
    siteName: doc.siteName,
    description: doc.description,
    siteId: doc.siteId,
    name: doc.name,
    created_by: doc.created_by,
    updated_at: doc.updated_at,
    users: doc.users,
    countryCode: doc.countryCode,
    lat: doc.latitude,
    lon: doc.longitude,
  });
}
