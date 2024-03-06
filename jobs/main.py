import os
import subprocess
import sys

from config import JOBS

def install_dependencies(dependencies):
    if len(dependencies) > 0:
        subprocess.check_call([sys.executable, "-m", "pip", "install"] + dependencies)

def execute_script(script):
    subprocess.check_call([sys.executable, script])

if __name__ == '__main__':
    job_name = os.environ.get('JOB_NAME')

    if job_name in JOBS:
        if 'dependencies' in JOBS[job_name]:
            install_dependencies(JOBS[job_name]['dependencies'])
        execute_script(f"./tasks/{job_name}/main.py")
    else:
        print(f"Job {job_name} not found.")
