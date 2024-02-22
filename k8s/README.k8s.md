helm install tss couchdb/couchdb --namespace tims\
    --set couchdbConfig.couchdb.uuid=2f5eee76-91f6-4000-9348-b8847e4542ec \
    --set clusterSize=1 \
    --set adminUsername=tssadmin \
    --set adminPassword=JTq3ynWrOC0hQim \
    --set ingress.enabled=true \
    --set persistentVolume.enabled=true

kubectl exec --namespace tims -it tss-couchdb-0 -c couchdb -- \
    curl -s \
    http://tssadmin:JTq3ynWrOC0hQim@127.0.0.1:5984/_cluster_setup \
    -X POST \
    -H "Content-Type: application/json" \
    -d '{"action": "finish_cluster"}' 

kubectl apply -f ./k8s/setup_couchdb_data.yaml -n tims
kubectl apply -f ./k8s/tss-configmap.yaml -n tims
kubectl apply -f ./k8s/tss-secrets.yaml -n tims
kubectl apply -f ./k8s/frontend.yaml -n tims
kubectl apply -f ./k8s/restapi.yaml -n tims