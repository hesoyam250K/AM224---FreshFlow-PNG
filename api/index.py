import os
import sys

# Ensure repository root is in sys.path so 'backend.*' modules can be imported
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from backend.main import app

# Vercel's Python Serverless Runtime automatically detects the ASGI 'app'
# No persistent uvicorn process is used.
