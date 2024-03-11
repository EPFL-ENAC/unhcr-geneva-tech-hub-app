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
- [x] Add environment variable for sentry #324
- [ ] Replace oauth custom by microsoft js
  - https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/
  - https://github.com/AzureAD/microsoft-authentication-library-for-js
  - https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md

# Monitoring
- [ ] Add prometheus for monitoring and alerting ? https://medium.com/hackernoon/monitoring-couchdb-with-prometheus-grafana-and-docker-4693bc8408f0


# For testing purposes
- We can create a custom tenant: https://learn.microsoft.com/en-us/azure/active-directory-b2c/tutorial-create-tenant
- We can register a SPA: https://learn.microsoft.com/en-us/azure/active-directory-b2c/tutorial-register-spa


# UNHCR TENANT: 
VUE_APP_AUTH_TENANT_ID=8f8086c8-e0b7-4840-b2a3-c3dd1453c704
VUE_APP_AUTH_CLIENT_ID=6b74559f-d9d7-4fa6-a90e-da9199bf55ac

# UNHCR.2xyx
VUE_APP_AUTH_TENANT_ID=48617df8-fd3d-471b-8f71-dcf99a2ceb27
VUE_APP_AUTH_CLIENT_ID=36909dba-bdd4-435e-a2dc-f522a105ab2f
