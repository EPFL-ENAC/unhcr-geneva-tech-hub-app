import os
from common import TSSData

if __name__ == "__main__":
    tss_data = TSSData()
    backup_name = os.getenv('BACKUP_NAME')
    tss_data.restore(backup_name)
