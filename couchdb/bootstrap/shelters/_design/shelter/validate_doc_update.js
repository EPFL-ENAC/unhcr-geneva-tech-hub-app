function(newDoc, oldDoc, userCtx, secObj) {
    // log('userCtx', userCtx);
    // log(secObj);

    if (newDoc._deleted && userCtx.roles.indexOf('_admin') === -1) {
        throw ({
            forbidden: 'Only admins may delete user docs.'
        })
    }
    if (!oldDoc) {
        log("CREATE NEW DOCUMENT SUCCESS");
        return;
    }
    if (!!newDoc && !!oldDoc && !newDoc._deleted) {
        
        if (oldDoc.users.indexOf(userCtx.name) === -1) {
            throw ({
                forbidden: 'Only users may update shelter docs.'
            })
        }
        log("UPDATE DOCUMENT SUCCESS");
        return;
        // only users may update document
    }
}

// for an CREATE -> argument oldDoc === null
// for an UPDATE -> newDoc and OldDoc exist and _deleted does not
// for an DELETE -> field '_deleted' présent dans newDoc
// for an READ -> we don't go through this function