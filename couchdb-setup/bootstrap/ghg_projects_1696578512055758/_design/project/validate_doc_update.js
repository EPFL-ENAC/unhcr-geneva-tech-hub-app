function (newDoc, oldDoc, userCtx, secObj) {
    if (userCtx.name === null) {
        throw ({
            unauthorized: 'unhcr-tss:couchdb:ghg:project -> user ctx has no name: probably no authentication provided'
        })
    }
    function checkIfAdmin(userCtx)
    {
        // either we have the role 'admin' or '_admin'
        // or we are in a custom list of unhcr users sub
        var unhcrAdmins = [
            "TBxz7Wb3aSrQGeFx1EbBtrtaKPht-4M87pznkWC2BYE" // nimri
        ];
        var isDBAdmin = userCtx.roles.indexOf('_admin') !== -1;
        var isAdmin = userCtx.roles.indexOf('admin') !== -1;

        return isAdmin || isDBAdmin || unhcrAdmins.includes(userCtx.name || "");
    }
    var isAdmin = checkIfAdmin(userCtx);
    var isSpecialist = userCtx.roles.indexOf('specialist') !== -1;


    if (!oldDoc) {
        if (!newDoc.users) {
            throw ({
                forbidden: 'unhcr-tss:couchdb:ghg:project -> users field should be present'
            })
        }
        if (!newDoc.created_by) {
            throw ({
                forbidden: 'unhcr-tss:couchdb:ghg:project -> created_by field should be present'
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
        var usersObject = // : CouchUser[]
            users.filter(
          (x) => typeof x === "object" && x !== null
        );
        var usersString = users.filter((x) => typeof x == "string");
        var usersName = usersObject
          .map((x) => x.name)
          .filter((x) => x !== undefined);
        var usersSub = usersObject
          .map((x) => x.sub)
          .filter((x) => x !== undefined);
        var allPossibleUsers = usersString.concat(usersName).concat(usersSub);
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
        if (isUser || isSpecialist || isAdmin) {
            log("unhcr-tss:couchdb:ghg:project -> UPDATE DOCUMENT SUCCESS");
            return;
        } else {
            log("unhcr-tss:couchdb:ghg:project -> UPDATE DOCUMENT ERROR");
            throw ({
                forbidden: 'unhcr-tss:couchdb:ghg:project -> Only users may update shelter docs.'
            })
        }
    }
    if (newDoc._deleted) {
        var isUser = checkIfUserExist(userCtx, oldDoc.users);
        if (isUser || isSpecialist || isAdmin) {
            log("unhcr-tss:couchdb:ghg:project -> DELETE DOCUMENT SUCCESS");
            return;
        } else {
            log("unhcr-tss:couchdb:ghg:project -> DELETE DOCUMENT ERROR");
            throw ({
                forbidden: 'unhcr-tss:couchdb:ghg:project -> Only admins or DB admins may delete user docs.'
            })
        }
    }
}

// for an CREATE -> argument oldDoc === null
// for an UPDATE -> newDoc and OldDoc exist and _deleted does not
// for an DELETE -> field '_deleted' présent dans newDoc
// for an READ -> we don't go through this function