function (doc) {
  
  function getPublic(doc) {
    if (!doc.public) {
      return false
    }
    return doc.public;
  }
  if (!getPublic(doc)) {
    // retrieve only draft
      emit(doc._rev, 1);
  }

}