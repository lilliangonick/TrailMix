#!/usr/bin/env python3
"""Test script for the Trip Planner API"""

import requests
import json
from datetime import datetime, timedelta
from bson import ObjectId
import uuid

# The base URL for the API
API_URL = "http://localhost:5001"

# Custom JSON encoder for MongoDB ObjectId 
class MongoJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        elif isinstance(obj, datetime):
            return obj.isoformat()
        return super().default(obj)

def test_itinerary_generation():
    """Test the itinerary generation endpoint"""
    
    # Generate test trip data
    today = datetime.now()
    start_date = today + timedelta(days=7)
    end_date = start_date + timedelta(days=3)
    
    trip_data = {
        "userEmail": "test@example.com",
        "startLocation": {
            "address": "123 Main St, San Francisco, CA"
        },
        "endLocation": {
            "address": "456 Market St, San Francisco, CA"
        },
        "budget": "2",
        "tripVibe": "foodie",
        "startDate": start_date.isoformat(),
        "endDate": end_date.isoformat(),
        "_id": str(uuid.uuid4()),
        "createdAt": datetime.now().isoformat(),
        "__v": 0
    }
    
    # Send the request to the API
    response = requests.post(
        f"{API_URL}/api/itinerary/generate",
        json=trip_data,
        headers={"Content-Type": "application/json"}
    )
    
    # Print the response status code
    print(f"Status Code: {response.status_code}")
    
    # Parse the JSON response
    if response.status_code == 200:
        data = response.json()
        print("\nItinerary generated successfully!")
        print(f"Trip ID: {data['itinerary']['trip_id']}")
        print(f"Total Days: {len(data['itinerary']['days'])}")
        print(f"Total Venues: {data['itinerary']['total_venues']}")
        
        # Print summary of each day with route information
        print("\nDaily Summary:")
        for day in data['itinerary']['days']:
            print(f"\nDay {day['day_number']} ({day['date']}):")
            print(f"Venues: {len(day['venues'])}")
            
            # Print venues
            for i, venue in enumerate(day['venues'], 1):
                print(f"  {i}. {venue['name']} ({venue['category']}) - {venue['price']}")
            
            # Print route info if available
            if day.get('route'):
                route = day['route']
                print(f"\nRoute Information:")
                print(f"  Distance: {route['distance']['text']}")
                print(f"  Duration: {route['duration']['text']}")
                print(f"  Polyline Available: {'Yes' if route.get('polyline') else 'No'}")
                print(f"  Steps: {len(route.get('steps', []))} navigation steps")
            
            print(f"\nNarrative: {day['narrative']}")
        
        # Save the full response to a file for reference
        with open("itinerary_response.json", "w") as f:
            json.dump(data, f, indent=2, cls=MongoJSONEncoder)
            print("\nFull response saved to itinerary_response.json")
    else:
        print("Error:", response.text)

def test_api_status():
    """Test the API status endpoint"""
    response = requests.get(f"{API_URL}/api/status")
    print(f"API Status: {response.json()}")

def test_get_itinerary():
    """Test retrieving an itinerary by ID"""
    # Replace with a valid trip ID from your database
    trip_id = "trip_20230615123456"  
    
    response = requests.get(f"{API_URL}/api/itinerary/{trip_id}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"\nRetrieved Itinerary: {data['itinerary']['trip_id']}")
    else:
        print(f"Error getting itinerary: {response.text}")

if __name__ == "__main__":
    # Test the API status
    test_api_status()
    
    # Test the itinerary generation
    test_itinerary_generation()
    
    # Uncomment to test getting an itinerary by ID
    # test_get_itinerary() 