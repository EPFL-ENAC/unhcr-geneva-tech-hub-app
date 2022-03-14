function (newDoc, oldDoc, userCtx, secObj) {
    var isDBAdmin = userCtx.roles.indexOf('_admin') !== -1;
    var isAdmin = userCtx.roles.indexOf('admin') !== -1;

    if (newDoc._deleted) {
        if (isDBAdmin || isAdmin) {
            return;
        } else {
            log("THROW ERROR");
            throw ({
                forbidden: 'Only admins or DB admins may delete configuration'
            })
        }
    }
}