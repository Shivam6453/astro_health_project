import base64
import json
import urllib.request
from pathlib import Path

# Relative to this script file.
base = Path(__file__).resolve().parent
path = base.parent.joinpath("face-expression-recoganisation", "images", "test", "happy", "10019.jpg")
with open(path, "rb") as f:
    b64 = base64.b64encode(f.read()).decode("ascii")

url = "http://localhost:5000/api/companion/mood"
req = urllib.request.Request(
    url,
    method="POST",
    data=json.dumps({"image": "data:image/jpeg;base64," + b64}).encode("utf-8"),
    headers={"Content-Type": "application/json"},
)

try:
    with urllib.request.urlopen(req, timeout=10) as resp:
        print("status", resp.status)
        print(resp.read().decode())
except Exception as e:
    print("ERROR", e)
