function (doc) {
  function findShelterImage(images) {
    if (!images || typeof images !== 'object' || !Array.isArray(images)) {
      return ''
    }
    var firstImage = images.find(function (image) {
      return image.type === 'Image'
    })
    if (!firstImage) {
      return ''
    }
    return firstImage
  }
  function isPublic(doc) {
    if (doc.public === undefined) return true
    return doc.public
  }

  function isCompleted(doc) {
    if (doc.completed === undefined) return true
    return doc.completed
  }

  function getUserName(user) {
    return user.name || user || ''
  }
  // retrieve only fields necessary for listing shelters
  var newDoc = {
    name: doc.name,
    shelter_type: doc.shelter_type,
    location_name: doc.location_name,
    location_country: doc.location_country,
    latitude: doc.latitude,
    longitude: doc.longitude,
    _id: doc._id,
    users: doc.users,
    created_by: doc.created_by,
    created_at: doc.created_at,
    updated_at: doc.updated_at,
    public: isPublic(doc),
    completed: isCompleted(doc),
    image: findShelterImage(doc.images),
  }

  if (doc.public === null || doc.public === undefined || doc.public) {
    emit('public', newDoc)
  } else {
    emit('private', newDoc)
    for (var user in doc.users) {
      emit('private_' + getUserName(doc.users[user]), newDoc)
    }
  }
}
