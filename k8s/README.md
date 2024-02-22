https://github.com/apache/couchdb-helm/

helm install tss couchdb/couchdb --namespace tims\
    --set couchdbConfig.couchdb.uuid=2f5eee76-91f6-4000-9348-b8847e4542ec \
    --set clusterSize=1 \
    --set adminUsername=tssadmin \
    --set adminPassword=JTq3ynWrOC0hQim \
    --set ingress.enabled=true \
    --set persistentVolume.enabled=true
    
kubectl exec --namespace tims -it tss-couchdb-0 -c couchdb -- \
    curl -s \
    http://127.0.0.1:5984/_cluster_setup \
    -X POST \
    -H "Content-Type: application/json" \
    -d '{"action": "finish_cluster"}' \
    -u tssadmin
    
curl -X PUT http://tssadmin:JTq3ynWrOC0hQim@localhost:5984/_users/org.couchdb.user:lala@lala.com      -H "Accept: application/json"      -H "Content-Type: application/json"      -d '{"name": "lala@lala.com", "password": "123123123", "roles": [], "type": "user"}'


helm delete papari -n tims




curl -X PUT http://tssadmin:JTq3ynWrOC0hQim@tss-couchdb:5984/_users/org.couchdb.user:fauxtonuser \
-H "Accept: application/json" \
-H "Content-Type: application/json" \
-d '{"name": "fauxtonuser", "password": "userpass", "roles": [], "type": "user"}'
