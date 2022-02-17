function(newDoc, oldDoc, userCtx, secObj) {
    log('userCtx', userCtx);
    log(secObj);

    if (newDoc._deleted && userCtx.roles.indexOf('_admin') === -1) {
        throw ({
            forbidden: 'Only admins may delete user docs.'
        })
    }
}