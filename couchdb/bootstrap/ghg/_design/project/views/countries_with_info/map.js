function(doc) {
    emit(doc.country_code, { name: doc.name, created_by: doc.created_by, users: doc.users, country_code: doc.country_code})
}