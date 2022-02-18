function (doc, req) {
    // https://docs.couchdb.org/en/stable/json-structure.html#userctx-object
    var user = JSON.parse(req.body);
    /*
        we only remove user if document already exist
        json payload should be {name: "toto@email.com"} // which is the unique id
        of the user, we should not remove ourself, and we should not remove last user
    */

    var currentUser = req['userCtx']['name'];

    if (!doc){
        throw ({
            forbidden: 'Only able to add user if doc exist'
        })
    }
    log("UPDATE DOCUMENT with new fields // if _id is specified in the url");
    // remove user only if users.length > 1 and not himself
    if (doc.users.length > 1) {
        if (user.name === currentUser) {
            throw ({
                forbidden: 'You are not supposed to remove yourself from your project'
            })
        }
        var previousLength = doc.users.length;
        doc.users = doc.users.filter(el => el !== user.name);
        var newLength = doc.users.length;
        if (newLength === previousLength) {
            throw ({
                forbidden: 'User was not in the list'
            })
        }
    } else {
        throw ({
            forbidden: 'Cannot remove last user from users list'
        })
    }
    doc['updated_by'] = currentUser;
    return [doc, 'Edited document with one less user!']
}