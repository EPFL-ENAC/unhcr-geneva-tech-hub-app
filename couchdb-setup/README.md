# **Intro**
We removed the roles in the _security policy of every databse, so every use may be able to read the databases
Here is an example of policy json

Bottom line: We don't use any roles for our users

```json
{
  "members": {
    "roles": [],
    "names": []
  },
  "admins": {
    "roles": ["_admin"],
    "names": []
  }
}
```

Since CouchDB 3.x newly created databases have by default the _admin role to prevent unintentional access.

If there are any member names or roles defined for a database, then only authenticated users having a matching name or role are allowed to read documents from the database
cf [https://docs.couchdb.org/en/3.2.0/api/database/security.html#db-security]

# Config file
- We used to generate config file in json. But the database was starting without the proper jwt. And that does not work properly without a full restart which takes too much time
- We decided to translate manually the json to a .ini file in
`couchdb/config.ini` for now

# **User**

## definition
    - A user _MUST_ be a logged in user
    - _MUST_ be able to list and access all projects in a ‘read’ only mode
    - _MUST_ be able to create projects and hence become a 'project admin or author'

## implementation
    - We add a validate_update_doc to all those database to refuse update/delete if:
        - is not an 'author' or is not an admin
 
# **Author: Project admin**
## definition
    - *Example: any user part of the users list of a project/creator of the project*
    - _MUST_ be able to Edit Project data
    - _MUST_ be able to Add/Del other project admins
    - _MUST_ be able to delete project
    
## implementation
    - when the project is created we have the following fields set up for role/rights management
        - users: ["usera", "userb"], which is a list of emails (unique id of users)
        - created_by: "usera" //  which is the email of the user
        - updated_by: "userb" // user that last updated the document 
    - users field _MUST_ have at least one user
    - users field check should be done on 'oldDocument' on update/delete action, so a user may not be able to escalate his rights
    - users _MUST_ be able to delete project
    - users _MUST_ not be able to remove himself from project users

# **Admin**
## definition
    - *Example : Greg*
    - Add/Remove users at the application level

## implementation
    - We will use Azure


# more information
Pour un CREATE -> argument oldDoc === null
Pour un DELETE -> champ '_deleted' présent dans newDoc
Pour un UPDATE -> newDoc and OldDoc existe et pas de _deleted
Pour un READ -> on ne passe pas dans la fonction update


## JWT
### Refresh tokens
- https://learn.microsoft.com/en-us/azure/energy-data-services/how-to-generate-refresh-token
- https://learn.microsoft.com/en-us/azure/energy-data-services/how-to-convert-segy-to-zgy


## examples of _design/shelter/updates directory (addUser.js, removeUser.js and shelter.js)
Cf couchdb documentation: https://guide.couchdb.org/draft/validation.html
https://docs.couchdb.org/en/stable/ddocs/ddocs.html#validate-document-update-functions

### addUser.js
```javascript
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
```

### removeUser.js
```javascript
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
```

### shelter.js
```javascript
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
```
## example of _design/shelter/validate_doc_update.js
### validate_doc_update.js
```javascript
function (newDoc, oldDoc, userCtx, secObj) {
    var isDBAdmin = userCtx.roles.indexOf('_admin') !== -1;
    var isAdmin = userCtx.roles.indexOf('admin') !== -1;
    var isSpecialist = userCtx.roles.indexOf('specialist') !== -1;

    if (!oldDoc) {
        if (!newDoc.users) {
            log("unhcr-tss:couchdb:shelters:shelter -> users field DOCUMENT ERROR");
            throw ({
                forbidden: 'unhcr-tss:couchdb:shelters:shelter -> users field should be present'
            })
        }
        if (!newDoc.created_by) {
            log("unhcr-tss:couchdb:shelters:shelter -> created_by field DOCUMENT ERROR");
            throw ({
                forbidden: 'unhcr-tss:couchdb:shelters:shelter -> created_by field should be present'
            })
        }
        return;
    }

    function checkIfUserExist(
        userCtx, // : CouchUser | string
        users // : (CouchUser | string)[]
      ) // : boolean
      {
        // Try for name or sub
        // filter users with object style
        const usersObject = // : CouchUser[]
            users.filter(
          (x) => typeof x === "object" && x !== null
        );
        const usersString = users.filter((x) => typeof x == "string");
        const usersName = usersObject
          .map((x) => x.name)
          .filter((x) => x !== undefined);
        const usersSub = usersObject
          .map((x) => x.sub)
          .filter((x) => x !== undefined);
        const allPossibleUsers = usersString.concat(usersName).concat(usersSub);
        if (typeof userCtx === "string") {
          return allPossibleUsers.includes(userCtx);
        }
        // in our case user
        return (
          allPossibleUsers.includes(userCtx.name || "")
        );
      }

    if (!!newDoc && !!oldDoc && !newDoc._deleted) {
        var isUser = checkIfUserExist(userCtx, oldDoc.users);
        if (isUser || isSpecialist || isAdmin || isDBAdmin) {
            // only users may update document
            log("unhcr-tss:couchdb:shelters:shelter -> UPDATE DOCUMENT SUCCESS");
            return;
        } else {
            log("unhcr-tss:couchdb:shelters:shelter -> UPDATE DOCUMENT ERROR" + JSON.stringify(userCtx) + '__' + JSON.stringify(oldDoc.users) + '__' + '<--');
            throw ({
                forbidden: 'unhcr-tss:couchdb:shelters:shelter -> Only users may update shelter docs.'
            })
        }
    }

     if (newDoc._deleted) {
        var isUser = checkIfUserExist(userCtx, oldDoc.users);
        if (isUser || isSpecialist || isAdmin || isDBAdmin) {
            log("unhcr-tss:couchdb:shelters:shelter -> DELETE DOCUMENT SUCCESS");
            return;
        } else {
            log("unhcr-tss:couchdb:shelters:shelter -> DELETE DOCUMENT ERROR");
            throw ({
                forbidden: 'unhcr-tss:couchdb:shelters:shelter -> Only admins or DB admins may delete user docs.'
            })
        }
    }
}

// for an CREATE -> argument oldDoc === null
// for an UPDATE -> newDoc and OldDoc exist and _deleted does not
// for an DELETE -> field '_deleted' présent dans newDoc
// for an READ -> we don't go through this function
```