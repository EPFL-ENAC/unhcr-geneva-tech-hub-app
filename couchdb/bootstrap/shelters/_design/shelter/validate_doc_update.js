function (newDoc, oldDoc, userCtx, secObj) {
    var isDBAdmin = userCtx.roles.indexOf('_admin') !== -1;
    var isAdmin = userCtx.roles.indexOf('admin') !== -1;
    var isSpecialist = userCtx.roles.indexOf('specialist') !== -1;

    if (newDoc._deleted) {
        log("___DELETE DOCUMENT")
        log(newDoc)
        log(userCtx.roles)
        log(isDBAdmin)
        log(isAdmin)
        log(isSpecialist)
        log(isDBAdmin || isAdmin)
        log("___END_DELETE")
        if (isDBAdmin || isAdmin) {
            return;
        } else {
            log("THROW ERROR");
            throw ({
                forbidden: 'Only admins or DB admins may delete user docs.'
            })
        }
    }
    if (!oldDoc) {
        log("CREATE NEW DOCUMENT");
        log(newDoc);
        // field to check (validation)
        if (!newDoc.users) {
            log("Throw error NEW DOCUMENT users field should be present");
            throw ({
                forbidden: 'users field should be present'
            })
        }
        if (!newDoc.created_by) {
            log("Throw error NEW DOCUMENT created_by field should be present");
            throw ({
                forbidden: 'created_by field should be present'
            })
        }
        return;
    }
    if (!!newDoc && !!oldDoc && !newDoc._deleted) {
        var isUser = oldDoc.users.indexOf(userCtx.name) !== -1;
        if (isUser || isSpecialist || isAdmin || isDBAdmin) {
            // only users may update document
            log("UPDATE DOCUMENT SUCCESS");
            return;
        } else {
            throw ({
                forbidden: 'Only users may update shelter docs.'
            })
        }
    }
}

// for an CREATE -> argument oldDoc === null
// for an UPDATE -> newDoc and OldDoc exist and _deleted does not
// for an DELETE -> field '_deleted' présent dans newDoc
// for an READ -> we don't go through this function