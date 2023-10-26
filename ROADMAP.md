# pre unhcr migration roadmap

1) get rid of all architecture dependencies (EPFL)
2) make it fully reproducible (no external data)
3) setup data-schema migration following: https://sync-tank.com/distributed-migration-strategies/
4) separate the ghg and shelter app in two apps for optimisation (maybe frontend first)
5) upgrade from vue2 to vue3 if possible (big problem with vuetify vue3)
6) Add documentation about the API
7) Save the s3 documents 'reference/metadata' in the couchdb database while uploading/deleting
  - no reference possible should be duplicated in documents