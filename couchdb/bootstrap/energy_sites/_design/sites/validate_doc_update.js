function(newDoc, oldDoc, userCtx, secObj) {
    log(`Validating ${newDoc._id} for user ${JSON.stringify(userCtx)}`);
    const isAdmin = userCtx.roles.includes('_admin') || userCtx.roles.includes('admin');
    const hasUser = oldDoc ? oldDoc.users.includes(userCtx.name) : false;

    // create
    if (!oldDoc) {
        if (Array.isArray(newDoc.users) && newDoc.users.includes(userCtx.name)) {
            return;
        } else {
            throw ({ forbidden: 'users field should contain current user' });
        }
    }

    // delete
    if (newDoc._deleted) {
        if (isAdmin || hasUser) {
            return;
        } else {
            throw ({ forbidden: 'Forbidden to delete' });
        }
    }

    // update
    if (isAdmin || hasUser) {
        return;
    } else {
        throw ({ forbidden: 'Forbidden to update' });
    }
}
