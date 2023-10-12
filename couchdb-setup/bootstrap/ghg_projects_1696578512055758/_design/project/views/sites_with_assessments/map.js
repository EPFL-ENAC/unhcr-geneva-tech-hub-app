function (doc) {
  emit(doc.siteId, {
    id: doc._id,
    siteName: doc.siteName,
    description: doc.description,
    siteId: doc.siteId,
    name: doc.name,
    created_by: doc.created_by,
    created_at: doc.created_at,
    updated_at: doc.updated_at,
    updated_by: doc.updated_by,
    users: doc.users,
    countryCode: doc.countryCode,
    lat: doc.latitude,
    lon: doc.longitude,
  });
}