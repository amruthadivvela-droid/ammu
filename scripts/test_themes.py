import os
import subprocess

EDGE_PATH = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

with open("index.html", "r", encoding="utf-8") as f:
    content = f.read()

# Replace data-theme attribute
content_lav = content.replace('data-theme="sakura"', 'data-theme="lavender"')
with open("index_lav.html", "w", encoding="utf-8") as f:
    f.write(content_lav)

content_mid = content.replace('data-theme="sakura"', 'data-theme="midnight"')
with open("index_mid.html", "w", encoding="utf-8") as f:
    f.write(content_mid)

subprocess.run([EDGE_PATH, '--headless', '--disable-gpu', '--window-size=1440,1400', '--screenshot=' + os.path.abspath('snap_theme_lavender.png'), 'http://localhost:8000/index_lav.html'])
subprocess.run([EDGE_PATH, '--headless', '--disable-gpu', '--window-size=1440,1400', '--screenshot=' + os.path.abspath('snap_theme_midnight.png'), 'http://localhost:8000/index_mid.html'])

if os.path.exists("index_lav.html"):
    os.remove("index_lav.html")
if os.path.exists("index_mid.html"):
    os.remove("index_mid.html")

print("Theme captures completed successfully!")
