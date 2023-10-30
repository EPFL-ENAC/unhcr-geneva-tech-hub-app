function (doc) {
  // retrieve only fields necessary for listing shelters
  emit(doc.created_at.substr(0,4),1);
}