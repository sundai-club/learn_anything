@@ -0,0 +1,18 @@
#!/bin/bash

# Create backup directories if they don't exist
mkdir -p .data/backups

# Get current timestamp
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE=".data/backups/backup_${TIMESTAMP}.sql"

# Create backup
echo "Creating backup: ${BACKUP_FILE}"
docker compose exec postgres pg_dump -U postgres learn_anything > "${BACKUP_FILE}"

# Compress the backup
echo "Compressing backup..."
gzip "${BACKUP_FILE}"

echo "Backup completed: ${BACKUP_FILE}.gz"