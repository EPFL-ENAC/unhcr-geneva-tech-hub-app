function (doc) {
    // retrieve only fields necessary for listing shelters
      emit(doc._id, doc);
}