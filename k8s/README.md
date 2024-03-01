# TSS App Initialization Guide
This guide provides step-by-step instructions for initializing the TSS app in a Kubernetes cluster.

## Prerequisites
Before you begin, ensure you have access to the Kubernetes cluster and the necessary permissions to perform the following operations.

## Steps
1. **Authenticate with the Cluster**

    Authenticate your kubectl client with the Kubernetes cluster where you want to deploy the TSS app. This typically involves setting up your kubectl context and credentials.

2. **Request `{COUCHDB_PASSWORD}`**

    Request the `{COUCHDB_PASSWORD}` value from your team lead. This password will be used to secure your CouchDB instance.

3. **Prepare CouchDB Configuration File**

    Create a `couchdb_data.yaml` file by using the provided `couchdb_data.example.yaml` as a reference. Replace the `{COUCHDB_PASSWORD}` placeholder with the actual password provided by your team lead.

4. **Deploy CouchDB**

    Deploy CouchDB to your Kubernetes cluster using the Helm chart. Replace `{COUCHDB_PASSWORD}` with the actual password:

    ```
    helm upgrade tss couchdb/couchdb --namespace tims \
    -f ./couchdb/values.yaml \
    --set adminPassword={COUCHDB_PASSWORD} \
    --version 4.5.0 \
    --install
    ```

5. **Wait for the Service Creation**

    Wait until the CouchDB service is fully deployed and operational. You can check the status using kubectl get pods -n tims.

6. **Finalize CouchDB Cluster Setup**

    Finalize the CouchDB cluster setup by executing the following command. Replace {COUCHDB_PASSWORD} with the actual password:

    ```
    kubectl exec --namespace tims -it tss-couchdb-0 -c couchdb -- \
        curl -s \
        http://tssadmin:{COUCHDB_PASSWORD}@127.0.0.1:5984/_cluster_setup \
        -X POST \
        -H "Content-Type: application/json" \
        -d '{"action": "finish_cluster"}'
    ```

7. **Apply CouchDB Data Configuration**

    Apply the CouchDB data configuration by running:

    ```
    kubectl apply -f ./k8s/couchdb_data.yaml -n tims
    ```

## Final Step
Once the above steps are completed, the Azure Pipeline will take over and finalize the app deployment process.

Please ensure that you follow these instructions carefully to avoid any issues during the app initialization process.

### Remove couchdb from k8s
helm uninstall tss --namespace tims
kubectl delete pvc -l release=tss --namespace tims

poi in un altro terminal:
kubectl patch pvc database-storage-tss-couchdb-0 --namespace tims -p '{"metadata":{"finalizers":[]}}' --type=merge


### !IMPORTANT

    helm upgrade tss couchdb/couchdb --namespace tims \
    -f ./couchdb/values.yaml \
    --set adminPassword={COUCHDB_PASSWORD} \
    --version 4.5.0 \
    --install

    kubectl exec --namespace tims -it tss-couchdb-0 -c couchdb -- \
    curl -s \
    http://tssadmin:{COUCHDB_PASSWORD}@127.0.0.1:5984/_cluster_setup \
    -X POST \
    -H "Content-Type: application/json" \
    -d '{"action": "finish_cluster"}'

    Crea manualmente da fauxton i db mancanti

    kubectl apply -f k8s/backup_pod.yaml -n tims

    ssh in tss-backup-pod

cd data

export COUCH_URL=http://tssadmin:{COUCHDB_PASSWORD}@tss-svc-couchdb:5984

Restore:
cat _replicator.txt | couchrestore --db _replicator
cat _users.txt | couchrestore --db _users
cat ghg_projects_1696578512055758.txt | couchrestore --db ghg_projects_1696578512055758
cat shelter_projects_1698666594213623.txt | couchrestore --db shelter_projects_1698666594213623
cat tokens.txt | couchrestore --db tokens

Backup:
couchbackup --db _replicator > _replicator.txt
couchbackup --db _users > _users.txt
couchbackup --db ghg_projects_1696578512055758 > ghg_projects_1696578512055758.txt
couchbackup --db shelter_projects_1698666594213623 > shelter_projects_1698666594213623.txt
couchbackup --db tokens > tokens.txt

