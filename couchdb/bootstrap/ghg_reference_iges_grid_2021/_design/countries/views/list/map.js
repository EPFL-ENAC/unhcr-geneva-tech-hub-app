function (doc) {
    // retrieve only fields necessary for listing shelters
      emit(doc._id, {name: doc.name, value: doc.value, _id: doc._id});
}