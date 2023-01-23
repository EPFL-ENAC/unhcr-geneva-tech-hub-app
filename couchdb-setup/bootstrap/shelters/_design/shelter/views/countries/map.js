function(doc) {
  // retrieve only fields necessary for listing shelters
  emit(doc.location_country,1);
}