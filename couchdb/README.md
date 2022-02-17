# **User**

## definition
    - A user _MUST_ be a logged in user
    - _MUST_ be able to list and access all projects in a ‘read’ only mode
    - _MUST_ be able to create projects and hence becaume a 'project admin or author'

## implementation
    - we add a role "user" to all new users
    - we add the role "user" to the privacy members of the database
        - energy projects
        - shelter projects
        - ghg projects
    - We add a validate_update_doc to all those three database to refuse update/delete if:
        - only have 'user' role
        - is not an 'author' or is not in the list of 'project admins' define in the project document
 
# **Author: Project admin**
## definition
    - *Example: lead on the field*
    - _MUST_ be able to Edit Project data
    - _SHOULD_ be able to Add/del other project admins
    
## implementation
    - when the project is created we have the following fields set up for role/rights management
        - authors: ["usera", "userb"], which is a list of emails (unique id of user)
        - created_by: "usera" //  which is the email of the user
        - updated_by: [] // list of all the users that created/updated the document
        - last_updated_by: "userb" // user that last updated the document 
    - authors field _MUST_ have at least one user
    - authors field check should be done on 'oldDocument' on update/delete action, so a user may not be able to escalate his rights
    - authors _MUST_ not be able to delete project
    - authors _MUST_ not be able to remove himself from project admins

# **Specialist: Global admin (”specialist” for Tool3)**
## definition
    - *Example : EPFL(André, Cara, Edgard) + UNHCR Headquarter*
    - _Edit/Add/Remove project data
    - _Edit DB constants

## implementation
    - for every projects (ghg, shelter, energy) we have a correspondant database that holds some constant
        - that database is read only for everyone but, if a user have the role 'specialist'
    - every one is able to read (every database has the role 'user')
    - only the users with the roles 'specialist' are able to edit
        - every database have also the roles specialist

# **Admin**
## definition
    - *Example : Greg*
    - Add/Remove users

## implementation

    - 


# vue helpers
## create directives
 - admin
    : v-show-if-admin
        = admin + specialist + author + user
 - specialist
    : v-show-if-specialist
        = specialist + author + user
 - author
    : v-show-if-author
        = author + user
 - user
    : v-show-if-user
 

# more information
Pour un CREATE -> argument oldDoc === null
Pour un DELETE -> champ '_deleted' présent dans newDoc
Pour un UPDATE -> newDoc and OldDoc existe et pas de _deleted
Pour un READ -> on ne passe pas dans la fonction update