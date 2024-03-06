# TSS App Initialization Guide
This guide provides step-by-step instructions for initializing the TSS app in a Kubernetes cluster.

## Prerequisites
Before you begin, ensure you have access to the Kubernetes cluster and the necessary permissions to perform the following operations.

## Steps
1. **Authenticate with the Cluster**

    Authenticate your kubectl client with the Kubernetes cluster where you want to deploy the TSS app. This typically involves setting up your kubectl context and credentials.

2. **Request `{COUCHDB_PASSWORD}`**

    Request the `{COUCHDB_PASSWORD}` value from your team lead. This password will be used to secure your CouchDB instance.

3. **Deploy CouchDB**

    Deploy CouchDB to your Kubernetes cluster using the Helm chart. Replace `{COUCHDB_PASSWORD}` with the actual password:

    ```
    helm upgrade tss couchdb/couchdb --namespace tims \
    -f ./couchdb/values.yaml \
    --set adminPassword={COUCHDB_PASSWORD} \
    --version 4.5.0 \
    --install
    ```

4. **Wait for the Service Creation**

    Wait until the CouchDB service is fully deployed and operational. You can check the status using kubectl get pods -n tims.

5. **Finalize CouchDB Cluster Setup**

    Finalize the CouchDB cluster setup by executing the following command. Replace {COUCHDB_PASSWORD} with the actual password:

    ```
    kubectl exec --namespace tims -it tss-couchdb-0 -c couchdb -- \
        curl -s \
        http://tssadmin:{COUCHDB_PASSWORD}@127.0.0.1:5984/_cluster_setup \
        -X POST \
        -H "Content-Type: application/json" \
        -d '{"action": "finish_cluster"}'
    ```

6. **Restore CouchDB Data**

    Create the Request the `couchdb_restore.yaml` file (based on `couchdb_restore.example.yaml`). Request `{BACKUP_NAME}` value from your team lead, replace the `{BACKUP_NAME}` value in `couchdb_restore.yaml`. Then restore the `{BACKUP_NAME}` by running:

    ```
    kubectl apply -f ./k8s/couchdb_restore.yaml -n tims
    ```

## Final Step
Once the above steps are completed, the Azure Pipeline will take over and finalize the app deployment process.

Please ensure that you follow these instructions carefully to avoid any issues during the app initialization process.

### Remove CouchDB from Kubernetes

This section describes the process for removing a CouchDB instance deployed in Kubernetes using Helm and kubectl commands.

1. **Uninstalling CouchDB with Helm:**
    Execute the command below to uninstall the CouchDB release from your Kubernetes cluster. This instructs Helm, the Kubernetes package manager, to delete all components associated with the CouchDB deployment named 'tss' located in the 'tims' namespace.

    ```bash
    helm uninstall tss --namespace tims
    ```

2. **Deleting Persistent Volume Claims (PVCs):**

    Following the uninstallation of CouchDB, you should remove the associated persistent volume claims to free up storage resources. The command below deletes all PVCs tagged with release=tss within the 'tims' namespace. These PVCs were originally created as part of the CouchDB deployment for persistently storing database data.

    ```bash
    kubectl delete pvc -l release=tss --namespace tims
    ```

3. **Removing Finalizers from PVC (in a new terminal):**

    If necessary, in a new terminal window, manually remove the finalizers from the PVC `database-storage-tss-couchdb-0` to allow for its proper deletion in Kubernetes. Finalizers are mechanisms used by Kubernetes to block the deletion of a resource until specific conditions are met. In certain situations, these can inadvertently prevent the removal of a no longer needed resource.

    Apply the following command to edit the PVC by erasing any existing finalizers. This is achieved by setting the `finalizers` array to empty. The `--type=merge` flag is used to apply this change while preserving the other attributes of the PVC.

    ```bash
    kubectl patch pvc database-storage-tss-couchdb-0 --namespace tims -p '{"metadata":{"finalizers":[]}}' --type=merge
    ```

    Following these steps ensures the complete removal of all CouchDB deployment components from your Kubernetes cluster.
