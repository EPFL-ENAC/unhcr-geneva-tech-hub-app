function (newDoc, oldDoc, userCtx, secObj) {
    var isDBAdmin = userCtx.roles.indexOf('_admin') !== -1;
    var isAdmin = userCtx.roles.indexOf('admin') !== -1;
    var isSpecialist = userCtx.roles.indexOf('specialist') !== -1;

    if (!oldDoc) {
        if (!newDoc.users) {
            throw ({
                forbidden: 'users field should be present'
            })
        }
        if (!newDoc.created_by) {
            throw ({
                forbidden: 'created_by field should be present'
            })
        }
        return;
    }
    if (!!newDoc && !!oldDoc && !newDoc._deleted) {
        var isUser = oldDoc.users.indexOf(userCtx.name) !== -1;
        if (isUser || isSpecialist || isAdmin || isDBAdmin) {
            return;
        } else {
            throw ({
                forbidden: 'Only users may update shelter docs.'
            })
        }
    }
    if (newDoc._deleted) {
        var isUser = oldDoc.users.indexOf(userCtx.name) !== -1;
        if (isUser || isSpecialist || isAdmin || isDBAdmin) {
            return;
        } else {
            log("THROW ERROR");
            throw ({
                forbidden: 'Only admins or DB admins may delete user docs.'
            })
        }
    }
}

// for an CREATE -> argument oldDoc === null
// for an UPDATE -> newDoc and OldDoc exist and _deleted does not
// for an DELETE -> field '_deleted' présent dans newDoc
// for an READ -> we don't go through this function