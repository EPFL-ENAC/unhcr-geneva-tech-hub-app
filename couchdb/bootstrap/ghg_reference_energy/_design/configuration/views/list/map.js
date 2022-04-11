function (doc) {
    // retrieve only fields necessary for listing shelters
      emit(doc._id, {description: doc.description, value: doc.value, type: doc.type, source: doc.source, _id: doc._id});
}