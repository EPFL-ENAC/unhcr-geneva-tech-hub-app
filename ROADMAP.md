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
  - Don't call shelter app resources/json and db if on ghg app, and vice et versa

# Other
- [ ] upgrade packages for security reasons (BONUS) #323
- [ ] Check all the todos in the code and move them to issues
- [ ] Add environment variable for sentry #324
