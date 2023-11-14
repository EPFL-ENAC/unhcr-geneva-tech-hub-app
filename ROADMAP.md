# pre unhcr migration roadmap

- [x] get rid of all architecture dependencies (EPFL)
- [ ] make it fully reproducible (no external data: what does it mean ?)
- [ ] setup kubernetes manifests : provide helm chart
- [ ] setup data-schema migration following: https://sync-tank.com/distributed-migration-strategies/
- [ ] Add a bit of documentation about the API

# Optimization
- [ ] separate the ghg and shelter app in two apps for optimisation (maybe frontend first)
- [ ] upgrade from vue2 to vue3 if possible (big problem with vuetify vue3)
- [ ] Save the s3 documents 'reference/metadata' in the couchdb database while uploading/deleting
  - no reference possible should be duplicated in documents
