function (doc, req) {
    // https://docs.couchdb.org/en/stable/json-structure.html#userctx-object
    var user = JSON.parse(req.body);
    /*
        we only add user if document already exist
        json payload should be {name: "toto@email.com"} // which is the unique id
        of the user
    */

    var currentUser = req['userCtx']['name'];

    if (!doc){
        throw ({
            forbidden: 'Only able to add user if doc exist'
        })
    }
    log("UPDATE DOCUMENT with new fields // if _id is specified in the url");
    // add new user only if it does not exist in users field
    if (doc.users.indexOf(user.name) === -1) {
        doc.users.push(user.name);
    } else {
        throw ({
            forbidden: 'User already exist in "users" field'
        })
    }
    doc['updated_by'] = currentUser;
    return [doc, 'Edited document with new user!']
}