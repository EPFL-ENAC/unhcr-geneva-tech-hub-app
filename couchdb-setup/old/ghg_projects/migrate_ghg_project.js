

function up(a) {
  b = a.rows.filter(x => x.id !== '_design/project').map(x => x.doc);
  return b.reduce((acc, project) => {

    // we should delete created_at, created_by, updated_at, updated_by, index (if present)
    // _id should become siteId if < 5 else drop it
    // then we remove _id and _rev
    // name should become siteName
    // then we remove name
    // assessment name should become assessmentDescription
    // we should keep assessment _id for now
    // then we delete surveys

    const cleanProject = JSON.parse(JSON.stringify(project));
    if (cleanProject._id.length < 5) {
      cleanProject.siteId = parseInt(cleanProject._id, 10);
    } else {
      cleanProject.siteId = cleanProject._id; // using uuid for now
    }
    delete cleanProject._id;
    delete cleanProject._rev;
    delete cleanProject.created_at;
    delete cleanProject.created_by;
    delete cleanProject.updated_at;
    delete cleanProject.updated_by;
    delete cleanProject["Location id"];

    cleanProject.siteName = cleanProject.name;
    delete cleanProject.name;
    delete cleanProject.surveys;

    cleanProject.countryCode = cleanProject.country_code;
    delete cleanProject.country_code;
    const newAssessmentWithProjectInfo = project.surveys.map(assessment => {

      assessment.description = assessment.name;
      delete assessment.name;
      assessment = { ...assessment, ...cleanProject };
      delete assessment.Country;
      return assessment;
    });
    return acc.concat(newAssessmentWithProjectInfo);
  }, []);

}

