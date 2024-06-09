import os
import subprocess


current_directory = os.path.dirname(os.path.abspath(__file__))


command = f"cd /d {current_directory} && venv\\Scripts\\activate && python manage.py runserver 8080"


subprocess.Popen(command, shell=True)
