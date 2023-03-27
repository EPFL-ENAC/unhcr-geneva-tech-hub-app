function (doc) {
  // retrieve only fields necessary for listing projects
  emit(doc._id, {
    name: doc.name, location_name: doc.location_name,
    _id: doc._id, users: doc.users, created_by: doc.created_by, updated_by: doc.updated_by
    , created_at: doc.created_at, updated_at: doc.updated_at
  });
}