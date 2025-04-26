import os
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()  

client = MongoClient(os.getenv("MONGO_URI"))
db     = client.get_database()

app = Flask(__name__)
CORS(app)

@app.route("/api/status", methods=["GET"])
def status():
    try:
        client.admin.command("ping")
        return jsonify({"ok": True}), 200
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5001, debug=True)
