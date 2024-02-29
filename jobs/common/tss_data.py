import os
import shutil
import tarfile
import time
from azure.storage.blob import BlobServiceClient

class TSSData:
    def __init__(self):
        # Inizializza le variabili di ambiente
        self.source_directory = os.getenv('SOURCE_DIR', '/data')
        self.destination_directory = os.getenv('DEST_DIR', '/data')
        self.account_name = os.getenv('AZURE_ACCOUNT_NAME')
        self.account_key = os.getenv('AZURE_ACCOUNT_KEY')
        self.container_name = os.getenv('AZURE_CONTAINER')
        self.retention_days = int(os.getenv('RETENTION_DAYS', 7))
        self.connection_string = f'DefaultEndpointsProtocol=https;AccountName={self.account_name};AccountKey={self.account_key};EndpointSuffix=core.windows.net'

    def data_dump(self):
        # Imposta il timestamp per il nome del file
        current_time_ms = int(round(time.time() * 1000))
        backup_file = f'tss/{current_time_ms}/backup.tar.gz'
        local_backup_file = f'/tmp/backup_{current_time_ms}.tar.gz'

        # Comprimi la directory source
        with tarfile.open(local_backup_file, 'w:gz') as tar:
            tar.add(self.source_directory, arcname=os.path.basename(self.source_directory))

        # Crea un client Blob Service e carica il file
        blob_service_client = BlobServiceClient.from_connection_string(self.connection_string)
        blob_client = blob_service_client.get_blob_client(container=self.container_name, blob=backup_file)

        with open(local_backup_file, 'rb') as data:
            blob_client.upload_blob(data, overwrite=True)

        print(f'Successfully uploaded {backup_file} to Azure Blob Storage.')

        # Elimina il file tar locale dopo l'upload
        os.remove(local_backup_file)

        # Pulizia dei vecchi backup
        self.cleanup_old_backups(blob_service_client)

    def cleanup_old_backups(self, blob_service_client):
        # Ottieni l'elenco di tutti i blob nel container
        container_client = blob_service_client.get_container_client(self.container_name)
        blob_list = container_client.list_blobs(name_starts_with='tss/')

        # Ordina i blob per nome (che include il timestamp)
        sorted_blobs = sorted(blob_list, key=lambda blob: blob.name, reverse=True)

        # Conserva solo i più recenti in base al valore di retention_days
        old_blobs = sorted_blobs[self.retention_days:]

        for blob in old_blobs:
            print(f'Deleting old backup: {blob.name}')
            blob_client = container_client.get_blob_client(blob=blob.name)
            blob_client.delete_blob()

    def restore_data(self, backup_name):
        # Costruisci il nome del file di backup e il percorso del file locale
        backup_file = f'tss/{backup_name}/backup.tar.gz'
        local_backup_file = os.path.join('/tmp', f'backup_{backup_name}.tar.gz')

        # Scarica e decomprimi il backup
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

        # Sposta il contenuto dalla directory estratta alla directory di destinazione
        if os.path.exists(temp_extract_dir):
            for root_dir in os.listdir(temp_extract_dir):
                intermediate_dir = os.path.join(temp_extract_dir, root_dir)
                if os.path.isdir(intermediate_dir):
                    for item in os.listdir(intermediate_dir):
                        source = os.path.join(intermediate_dir, item)
                        destination = os.path.join(self.destination_directory, item)
                        try:
                            if os.path.isdir(source):
                                if os.path.exists(destination):
                                    shutil.rmtree(destination)  # Rimuovi la directory esistente
                                shutil.move(source, destination)
                            else:
                                if os.path.exists(destination):
                                    os.remove(destination)  # Rimuovi il file esistente
                                shutil.move(source, destination)
                        except FileNotFoundError:
                            print(f"File or directory {destination} not found during removal.")
                else:  # Se non è una directory, sposta direttamente il file
                    destination = os.path.join(self.destination_directory, root_dir)
                    try:
                        if os.path.exists(destination):
                            os.remove(destination)
                        shutil.move(intermediate_dir, destination)
                    except FileNotFoundError:
                        print(f"File or directory {destination} not found during removal.")

        # Pulizia: rimuovi il file tar e la directory temporanea
        try:
            os.remove(local_backup_file)
        except FileNotFoundError:
            print(f"File {local_backup_file} not found for removal.")
        try:
            shutil.rmtree(temp_extract_dir)
        except FileNotFoundError:
            print(f"Temporary directory {temp_extract_dir} not found for removal.")

        print(f'Backup {backup_name} restored successfully.')

