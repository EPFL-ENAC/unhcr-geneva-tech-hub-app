function (doc) {
  // retrieve only fields necessary for listing shelters
  var score = doc.scorecard || {};
    emit(doc._id, {
      name: doc.name || "",
      weight: score.weight || 0,
      co2: score.co2 || 0,
      h2o: score.h2o || 0,
      techPerf: score.techPerf || 0,
      habitability: score.habitability || 0,
      affordability: score.affordability || 0,
      shelter_type: doc.shelter_type || "",
      created_by: doc.created_by || "",
      created_at: doc.created_at || "",
      year: (doc.created_at || "").substr(0,4),
      updated_at: doc.updated_at || "",
      updated_by: doc.updated_by || "",
      location_country: doc.location_country || "",
      organisation: doc.organisation || "",
    });
}