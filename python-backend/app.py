import os
import argparse
import threading
import json
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
from pymongo import MongoClient
from bson import ObjectId
from trip_planner_agent import TripPlannerAgent, MongoJSONEncoder

load_dotenv()  

# Initialize MongoDB connection
client = MongoClient(os.getenv("MONGO_URI"))
db = client.get_database()

# Create Flask app
app = Flask(__name__)
CORS(app)

# Configure Flask to use custom JSON encoder
app.json_encoder = MongoJSONEncoder

# Initialize the Trip Planner Agent
trip_planner = TripPlannerAgent(db)

@app.route("/api/status", methods=["GET"])
def status():
    try:
        client.admin.command("ping")
        return jsonify({"ok": True}), 200
    except Exception as e:
        return jsonify({"ok": False, "error": str(e)}), 500

@app.route("/api/itinerary/generate", methods=["POST"])
def create_itinerary():
    """API endpoint to generate an itinerary."""
    try:
        # Get trip data from request
        trip_data = request.json
        
        # Generate itinerary
        itinerary = trip_planner.generate_itinerary(trip_data)
        
        # Convert the itinerary to JSON-serializable format
        itinerary_json = json.loads(json.dumps(itinerary, cls=MongoJSONEncoder))
        
        return jsonify({"status": "success", "itinerary": itinerary_json}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 400

@app.route("/api/itinerary/<trip_id>", methods=["GET"])
def get_itinerary(trip_id):
    """API endpoint to retrieve a stored itinerary by ID."""
    try:
        # Look up itinerary in MongoDB
        itinerary = db.itineraries.find_one({"trip_id": trip_id})
        
        if not itinerary:
            # Try by MongoDB ObjectId
            try:
                itinerary = db.itineraries.find_one({"_id": ObjectId(trip_id)})
            except:
                pass
                
        if not itinerary:
            return jsonify({"status": "error", "message": "Itinerary not found"}), 404
            
        # Convert the itinerary to JSON-serializable format
        itinerary_json = json.loads(json.dumps(itinerary, cls=MongoJSONEncoder))
        
        return jsonify({"status": "success", "itinerary": itinerary_json}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 400

def run_agent():
    """Run the uAgent in a separate thread"""
    trip_planner.agent.run()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Run Trip Planner Backend")
    parser.add_argument("--agent-only", action="store_true", help="Run only the uAgent without Flask")
    parser.add_argument("--no-agent", action="store_true", help="Run only the Flask server without uAgent")
    args = parser.parse_args()
    
    if args.agent_only:
        print("Running Trip Planner uAgent only (no Flask server)")
        # Just run the agent - it will listen for messages
        trip_planner.agent.run()
    elif args.no_agent:
        print(f"Running only Flask server on port 5001 (no uAgent)")
        app.run(port=5001, debug=True)
    else:
        print(f"Running Trip Planner uAgent with Flask server on port 5001")
        # Run the agent in a separate thread
        agent_thread = threading.Thread(target=run_agent)
        agent_thread.daemon = True  # This ensures the thread will exit when the main program exits
        agent_thread.start()
        
        # Run Flask
        app.run(port=5001, debug=True)
