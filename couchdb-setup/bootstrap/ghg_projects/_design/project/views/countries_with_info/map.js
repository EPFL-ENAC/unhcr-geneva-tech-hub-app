function(doc) {
    emit(doc.country_code, { id: doc._id, name: doc.name, created_by: doc.created_by, users: doc.users, country_code: doc.country_code, lat: doc.latitude, lon: doc.longitude})
}