# Usa l'ultima versione dell'immagine Node.js come base
FROM node:20

# Imposta la directory di lavoro nel container
WORKDIR /backup

# Copia il contenuto della directory corrente nel container nella directory /backup
COPY . .

# Installa il pacchetto @cloudant/couchbackup
RUN npm install -g @cloudant/couchbackup

# Mantiene il container in esecuzione
CMD ["tail", "-f", "/dev/null"]
