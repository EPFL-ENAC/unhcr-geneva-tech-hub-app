# **Intro**
We removed the roles in the _security policy of every databse, so every user may be able to read the databases
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
- It should be setup by env variable via kubernetes or mounting the local.ini file as a volume

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
    - TODO

## implementation
    - TODO

# more information
Pour un CREATE -> argument oldDoc === null
Pour un DELETE -> champ '_deleted' présent dans newDoc
Pour un UPDATE -> newDoc and OldDoc existe et pas de _deleted
Pour un READ -> on ne passe pas dans la fonction update


## examples of _design/shelter/updates directory (addUser.js, removeUser.js and shelter.js)
Cf couchdb documentation: https://guide.couchdb.org/draft/validation.html
https://docs.couchdb.org/en/stable/ddocs/ddocs.html#validate-document-update-functions
