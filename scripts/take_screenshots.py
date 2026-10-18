import os
import subprocess
import time

EDGE_PATH = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
URL = "http://localhost:8000/"

def capture(filename, width, height, delay=1):
    output_path = os.path.abspath(filename)
    args = [
        EDGE_PATH,
        "--headless",
        "--disable-gpu",
        f"--window-size={width},{height}",
        f"--screenshot={output_path}",
        URL
    ]
    subprocess.run(args, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    if os.path.exists(output_path):
        print(f"Captured {filename} ({width}x{height}) - Size: {os.path.getsize(output_path)} bytes")
    else:
        print(f"Failed to capture {filename}")

if __name__ == '__main__':
    capture("screenshot_desktop.png", 1440, 900)
    capture("screenshot_mobile.png", 390, 844)
