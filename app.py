from flask import Flask, render_template, request, jsonify
from pathlib import Path
import json
from datetime import datetime

app = Flask(__name__)
DATA_FILE = Path(__file__).with_name("wishes.json")

def load_wishes():
    if not DATA_FILE.exists():
        return []
    try:
        return json.loads(DATA_FILE.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return []

@app.get("/")
def home():
    return render_template("index.html", wishes=load_wishes())

@app.post("/api/wishes")
def add_wish():
    data = request.get_json(silent=True) or {}
    name = str(data.get("name", "")).strip()[:40]
    message = str(data.get("message", "")).strip()[:300]
    if not name or not message:
        return jsonify({"ok": False, "error": "Please enter your name and a birthday wish."}), 400
    wishes = load_wishes()
    wishes.insert(0, {
        "name": name,
        "message": message,
        "created_at": datetime.now().strftime("%d %b %Y")
    })
    DATA_FILE.write_text(json.dumps(wishes[:100], ensure_ascii=False, indent=2), encoding="utf-8")
    return jsonify({"ok": True, "wishes": wishes[:100]})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
