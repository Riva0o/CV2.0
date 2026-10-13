from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from urllib.parse import urlparse
import os
ROOT = Path(__file__).resolve().parent.parent
os.chdir(ROOT)
class Handler(SimpleHTTPRequestHandler):
    def translate_path(self, path):
        parsed = urlparse(path).path
        if parsed.startswith('/media/'):
            return str(ROOT / 'public' / parsed.lstrip('/'))
        if parsed == '/vendor/model-viewer.min.js':
            return str(ROOT / 'node_modules/@google/model-viewer/dist/model-viewer.min.js')
        return super().translate_path(path)
    def do_GET(self):
        if urlparse(self.path).path.startswith('/work/'):
            self.path = '/index.html'
        super().do_GET()
print('Local: http://localhost:5173', flush=True)
ThreadingHTTPServer(('127.0.0.1', 5173), Handler).serve_forever()
