import os
import requests
import shutil
import subprocess
import tarfile
import time
import urllib.parse
from azure.storage.blob import BlobServiceClient

class TSSData:
    def __init__(self):
        self.source_directory = os.getenv('SOURCE_DIR', '/data')
        self.destination_directory = os.getenv('DEST_DIR', '/data')
        self.couch_url = os.getenv('COUCH_URL', 'http://admin:couchdb@couchdb:5984')
        self.couchdb_user = os.getenv('COUCHDB_USER', 'admin')
        self.couchdb_password = os.getenv('COUCHDB_PASSWORD', 'couchdb')
        self.couchdb_host = os.getenv('COUCHDB_HOST', 'couchdb')
        self.account_name = os.getenv('AZURE_ACCOUNT_NAME')
        self.account_key = os.getenv('AZURE_ACCOUNT_KEY')
        self.container_name = os.getenv('AZURE_CONTAINER')
        self.retention_days = int(os.getenv('RETENTION_DAYS', 7))
        self.connection_string = f'DefaultEndpointsProtocol=https;AccountName={self.account_name};AccountKey={self.account_key};EndpointSuffix=core.windows.net'

    def cleanup_old_backups(self, blob_service_client):
        container_client = blob_service_client.get_container_client(self.container_name)
        blob_list = container_client.list_blobs(name_starts_with='tss/')

        sorted_blobs = sorted(blob_list, key=lambda blob: blob.name, reverse=True)

        old_blobs = sorted_blobs[self.retention_days:]

        for blob in old_blobs:
            print(f'Deleting old backup: {blob.name}')
            blob_client = container_client.get_blob_client(blob=blob.name)
            blob_client.delete_blob()

    def backup(self):
        current_time_ms = int(round(time.time() * 1000))
        backup_directory = f'/tmp/backup_{current_time_ms}'
        os.makedirs(backup_directory, exist_ok=True)

        # List of all databases
        databases_raw = subprocess.check_output(
            f'curl -s -u {self.couchdb_user}:{self.couchdb_password} http://{self.couchdb_host}:5984/_all_dbs',
            shell=True
        ).decode('utf-8')
        databases = databases_raw.strip('[] \n').replace('"', '').split(',')

        # Backup each database
        for db in databases:
            safe_db_name = urllib.parse.quote_plus(db)  # Codifica il nome del database per gestire caratteri speciali
            print(safe_db_name)
            print(self.couch_url)
            backup_file_path = f'{backup_directory}/{safe_db_name}.txt'
            subprocess.call(
                f'couchbackup --db {db} > {backup_file_path}',
                shell=True
            )

        # Compress the backup
        local_backup_file = f'/tmp/backup_{current_time_ms}.tar.gz'
        with tarfile.open(local_backup_file, 'w:gz') as tar:
            tar.add(backup_directory, arcname=os.path.basename(backup_directory))

        # Load the backup to Azure Blob Storage
        blob_service_client = BlobServiceClient.from_connection_string(self.connection_string)
        backup_blob_name = f'tss/{current_time_ms}/backup.tar.gz'
        blob_client = blob_service_client.get_blob_client(container=self.container_name, blob=backup_blob_name)
        with open(local_backup_file, 'rb') as data:
            blob_client.upload_blob(data, overwrite=True)
        print(f'Successfully uploaded {backup_blob_name} to Azure Blob Storage.')

        # Remove the local backup
        shutil.rmtree(backup_directory)
        os.remove(local_backup_file)

        # Clean up old backups
        self.cleanup_old_backups(blob_service_client)

    def restore(self, backup_name):
        # Define the paths for the backup and the temporary directory
        backup_file = f'tss/{backup_name}/backup.tar.gz'
        local_backup_file = os.path.join('/tmp', f'backup_{backup_name}.tar.gz')

        # Download and extract the backup from Azure Blob Storage to the temporary directory
        blob_service_client = BlobServiceClient.from_connection_string(self.connection_string)
        blob_client = blob_service_client.get_blob_client(container=self.container_name, blob=backup_file)
        print(f'Downloading {backup_file} from Azure Blob Storage...')
        os.makedirs(self.destination_directory, exist_ok=True)
        with open(local_backup_file, 'wb') as download_file:
            download_blob = blob_client.download_blob()
            download_blob.readinto(download_file)
        print(f'Extracting {local_backup_file} to temporary directory...')
        temp_extract_dir = os.path.join('/tmp', f'extract_{backup_name}')
        os.makedirs(temp_extract_dir, exist_ok=True)
        with tarfile.open(local_backup_file, 'r:gz') as tar:
            tar.extractall(path=temp_extract_dir)

        # Iterate through the files in the temporary directory and restore each database
        for root, dirs, files in os.walk(temp_extract_dir):
            for file in files:
                if file.endswith('.txt'):
                    db_name = file[:-4]  # Remove the '.txt' extension to get the database name
                    db_url = f'http://{self.couchdb_user}:{self.couchdb_password}@{self.couchdb_host}:5984/{db_name}'

                    # Remove the database if it already exists and re-create it
                    requests.delete(db_url)
                    requests.put(db_url)

                    # Restore the database
                    restore_file_path = os.path.join(root, file)
                    print(f'Restoring {db_name} from {restore_file_path}')
                    subprocess.call(
                        f'cat "{restore_file_path}" | couchrestore --db {db_name}',
                        shell=True
                    )

        # Remove the local backup and the temporary directory
        os.remove(local_backup_file)
        shutil.rmtree(temp_extract_dir)

        print(f'Backup {backup_name} restored successfully.')
