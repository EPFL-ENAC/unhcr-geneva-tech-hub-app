function (doc,req) {
    log("update!!", doc);

    if (!doc){
        if ('name' in req && req['name']){
            // create new document
            return [{'_id': req['name']}, 'New World']
        }
        // change nothing in database
        return [null, 'Empty World']
    }
    doc['world'] = 'hello';
    var currentUser = req['userCtx']['name'];
    doc['created_by'] = currentUser;
    doc['authors'] = [currentUser]
    return [doc, 'Edited World!']
}