

function up(a) {

  b = a.rows.filter(x => x.id !== '_design/project').map(x => x.doc);
  return b.map((project) => {

    const cleanProject = JSON.parse(JSON.stringify(project));
    delete cleanProject._rev;
    cleanProject.version = "1.0.0";
    cleanProject.schema = "shelter_project"
    return cleanProject;
  });
}
