function (doc, req) {
    // https://docs.couchdb.org/en/stable/json-structure.html#userctx-object
    var fields = JSON.parse(req.body);
    // log(fields);
    // log(req.userCtx);
    // log(req['secObj'])
    /*

     curl -X POST http://paul%40epfl.ch:secure@localhost:5984/shelters/_design/shelter/_update/shelter \
     -H "Accept: application/json" \
     -H "Content-Type: application/json" \
     -d '{ "name": "kikooopaul@epfl.ch"}'

    */

    var currentUser = req['userCtx']['name'];

    if (!doc){
        if ('name' in fields && fields['name']){
            log("NEW DOCUMENT")
            // create new document
            // fields._id = fields['name'];
            fields.created_by = currentUser;
            fields.users = [currentUser]
            return [fields, 'New created document']
        }
        log("NEW DOCUMENT BUT name not in fields")
        // change nothing in database
        return [null, 'Change nothing in database']
    }
    log("UPDATE DOCUMENT with new fields // if _id is specified in the url");
    var blackListFields = ["_id", "created_by", "users"];
    for (var i in fields) {
        // read only field even for users
        // _id, created_b
        if (blackListFields.indexOf(i) === -1) {
            // we are allowed to update
            doc[i] = fields[i]
        }
    }
    doc['updated_by'] = currentUser;
    return [doc, 'Edited document!']
}