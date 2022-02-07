#!/bin/env sh

export ADMIN_COUCHDB=admin:couchdb
export ADMIN_DATABASE_SHELTERS=pierre:pierre

export HOST=http://127.0.0.1:5984

# export ADMIN_ROLE="admin"
# export STAFF_ROLE="staff"


# create users with roles
curl -X PUT $HOST/_users/org.couchdb.user:jan \
     -u $ADMIN_COUCHDB \
     -H "Accept: application/json" \
     -H "Content-Type: application/json" \
     -d '{"name": "jan", "password": "apple", "roles": [], "type": "user"}'

curl -X PUT $HOST/_users/org.couchdb.user:pierre \
     -u $ADMIN_COUCHDB \
     -H "Accept: application/json" \
     -H "Content-Type: application/json" \
     -d '{"name": "pierre", "password": "pierre", "roles": ["admin"], "type": "user"}'

curl -X PUT $HOST/_users/org.couchdb.user:paul \
     -u $ADMIN_COUCHDB \
     -H "Accept: application/json" \
     -H "Content-Type: application/json" \
     -d '{"name": "paul", "password": "paul", "roles": ["staff"], "type": "user"}'

curl -X PUT $HOST/_users/org.couchdb.user:jack \
     -u $ADMIN_COUCHDB \
     -H "Accept: application/json" \
     -H "Content-Type: application/json" \
     -d '{"name": "jack", "password": "jack", "roles": ["staff"], "type": "user"}'


# create databases
export SHELTERS_DATABASE_NAME=shelters
curl -X PUT $HOST/$SHELTERS_DATABASE_NAME \
     -u $ADMIN_COUCHDB

# add roles to dabatase shelters

curl -X PUT $HOST/$SHELTERS_DATABASE_NAME/_security \
     -u $ADMIN_COUCHDB \
     -H "Content-Type: application/json" \
     -d '{"admins": { "names": [], "roles": ["admin"] }, "members": { "names": [], "roles": ["staff"] } }'
