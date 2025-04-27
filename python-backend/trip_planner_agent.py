import os
import json
from datetime import datetime, timedelta
import requests
import polyline
from dotenv import load_dotenv
from uagents import Agent, Context, Protocol
from uagents.setup import fund_agent_if_low
import google.generativeai as genai
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from bson import ObjectId

# Custom JSON encoder for MongoDB ObjectId
class MongoJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        elif isinstance(obj, datetime):
            return obj.isoformat()
        return super().default(obj)

# Load environment variables
load_dotenv()

# Initialize APIs
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "YOUR_GOOGLE_API_KEY")
YELP_API_KEY = os.getenv("YELP_API_KEY", "YOUR_YELP_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "YOUR_GEMINI_API_KEY")

# Configure Gemini
genai.configure(api_key=GEMINI_API_KEY)

# Vibe to interests mapping
VIBE_TO_INTERESTS = {
    "foodie": ["restaurants", "food", "cafes", "dessert", "breweries"],
    "adventure": ["hiking", "outdoor activities", "adventure sports", "parks", "beaches"],
    "culture": ["museums", "art galleries", "historical sites", "theaters", "landmarks"],
    "nightlife": ["bars", "clubs", "live music", "comedy clubs", "nightlife"],
    "relaxation": ["spas", "wellness centers", "parks", "beaches", "scenic views"],
    "family": ["family activities", "amusement parks", "aquariums", "zoos", "kid-friendly"]
}

# Define Pydantic models for request and response
class Location(BaseModel):
    address: str
    coordinates: Optional[Dict[str, float]] = None

class TripRequest(BaseModel):
    userEmail: str
    startLocation: Location
    endLocation: Location
    budget: str
    tripVibe: str
    startDate: str
    endDate: str
    _id: Optional[str] = None
    createdAt: Optional[str] = None
    __v: Optional[int] = None

class RouteInfo(BaseModel):
    origin: Dict[str, Any]
    destination: Dict[str, Any]
    distance: Dict[str, Any]
    duration: Dict[str, Any]
    polyline: str
    steps: List[Dict[str, Any]]

class DayItinerary(BaseModel):
    date: str
    day_number: int
    venues: List[Dict[str, Any]]
    narrative: str
    route: Optional[RouteInfo] = None

class TripItinerary(BaseModel):
    trip_id: str
    user_email: str
    start_location: Location
    end_location: Location
    budget: str
    trip_vibe: str
    interests: List[str]
    start_date: str
    end_date: str
    days: List[DayItinerary]
    total_venues: int
    created_at: str

class TripResponse(BaseModel):
    status: str
    message: Optional[str] = None
    itinerary: Optional[TripItinerary] = None

class TripPlannerAgent:
    """Trip Planner Agent implementation."""
    
    def __init__(self, db=None):
        """Initialize the Trip Planner Agent."""
        self.db = db
        
        # Create uAgent
        self.agent = Agent(
            name="trip_planner",
            seed=os.getenv("AGENT_SEED", "trip_planner_seed"),
        )
        
        # Fund the agent if needed (for production)
        fund_agent_if_low(self.agent.wallet.address())
        
        # Set up protocol
        class ItineraryProtocol(Protocol):
            """Protocol for itinerary generation requests."""
            
            @self.agent.on_message(model=TripRequest)
            async def process_trip_request(ctx: Context, sender: str, trip_data: TripRequest):
                """Process an incoming trip request."""
                try:
                    # Generate itinerary from the raw dict
                    itinerary = self.generate_itinerary(trip_data.dict())
                    
                    # Make sure itinerary is JSON serializable (convert ObjectIds to strings)
                    itinerary_json = json.loads(json.dumps(itinerary, cls=MongoJSONEncoder))
                    
                    await ctx.send(sender, TripResponse(status="success", itinerary=itinerary_json))
                except Exception as e:
                    await ctx.send(sender, TripResponse(status="error", message=str(e)))
        
        # Include protocol
        self.itinerary_protocol = ItineraryProtocol()
        self.agent.include(self.itinerary_protocol)
    
    def geocode_location(self, location_str):
        """Convert a location string to coordinates using Google Geocoding API."""
        url = f"https://maps.googleapis.com/maps/api/geocode/json?address={location_str}&key={GOOGLE_API_KEY}"
        response = requests.get(url)
        data = response.json()
        
        if data["status"] == "OK":
            location = data["results"][0]["geometry"]["location"]
            return {
                "lat": location["lat"],
                "lng": location["lng"],
                "formatted_address": data["results"][0]["formatted_address"]
            }
        else:
            raise Exception(f"Geocoding failed: {data['status']}")
    
    def search_venues(self, coordinates, interests, budget, radius=5000, limit=5):
        """Search for venues using Yelp Fusion API based on interests and budget."""
        headers = {
            "Authorization": f"Bearer {YELP_API_KEY}"
        }
        
        # Convert budget to Yelp price levels (1-4 where 4 is most expensive)
        price_level = min(int(budget), 4)
        price_filter = ",".join([str(i) for i in range(1, price_level + 1)])
        
        venues = []
        
        # Search for each interest category
        for interest in interests:
            url = "https://api.yelp.com/v3/businesses/search"
            params = {
                "latitude": coordinates["lat"],
                "longitude": coordinates["lng"],
                "term": interest,
                "radius": radius,
                "price": price_filter,
                "limit": limit,
                "sort_by": "rating"
            }
            
            response = requests.get(url, headers=headers, params=params)
            data = response.json()
            
            if "businesses" in data:
                for business in data["businesses"]:
                    venue = {
                        "id": business["id"],
                        "name": business["name"],
                        "category": interest,
                        "rating": business["rating"],
                        "price": business.get("price", "$"),
                        "location": {
                            "address": business["location"]["address1"],
                            "city": business["location"]["city"],
                            "coordinates": {
                                "lat": business["coordinates"]["latitude"],
                                "lng": business["coordinates"]["longitude"]
                            }
                        },
                        "image_url": business.get("image_url", ""),
                        "url": business["url"]
                    }
                    venues.append(venue)
        
        return venues
    
    def generate_daily_narrative(self, day_venues, day_number, total_days):
        """Generate a narrative for a day's itinerary using Gemini."""
        if not day_venues:
            return "A day to explore on your own or relax."
            
        prompt = f"""
        I'm planning Day {day_number} of {total_days} for a trip. Here are the places I'll visit:
        
        {json.dumps([{'name': v['name'], 'category': v['category'], 'rating': v['rating']} for v in day_venues], indent=2)}
        
        Write a friendly, concise 2-3 sentence narrative summarizing this day of activities. 
        Make it engaging and highlight what makes these spots special.
        """
        
        model = genai.GenerativeModel('gemini-1.5-pro')
        response = model.generate_content(prompt)
        
        return response.text
    
    def get_directions(self, venues):
        """Get route directions between multiple venues using Google Directions API."""
        if not venues or len(venues) < 2:
            return None
            
        # Extract waypoints
        origin = f"{venues[0]['location']['coordinates']['lat']},{venues[0]['location']['coordinates']['lng']}"
        destination = f"{venues[-1]['location']['coordinates']['lat']},{venues[-1]['location']['coordinates']['lng']}"
        
        # Format intermediate waypoints
        waypoints = []
        for venue in venues[1:-1]:
            coords = venue['location']['coordinates']
            waypoints.append(f"{coords['lat']},{coords['lng']}")
        
        waypoints_str = "|".join(waypoints) if waypoints else ""
        
        # Call Directions API
        url = "https://maps.googleapis.com/maps/api/directions/json"
        params = {
            "origin": origin,
            "destination": destination,
            "waypoints": waypoints_str,
            "key": GOOGLE_API_KEY,
            "mode": "driving",  # Can be changed to walking, transit, etc.
            "optimize": "true"  # Optimize the route order
        }
        
        response = requests.get(url, params=params)
        data = response.json()
        
        if data["status"] == "OK" and data["routes"]:
            route = data["routes"][0]
            leg = route["legs"][0]  # Get the first leg
            
            # Extract polyline
            encoded_polyline = route["overview_polyline"]["points"]
            
            route_info = {
                "origin": {
                    "address": leg["start_address"],
                    "location": leg["start_location"]
                },
                "destination": {
                    "address": leg["end_address"],
                    "location": leg["end_location"]
                },
                "distance": leg["distance"],
                "duration": leg["duration"],
                "polyline": encoded_polyline,
                "steps": leg["steps"]
            }
            
            return route_info
        else:
            return None
    
    def organize_days(self, venues, start_date, end_date):
        """Organize venues into days based on start and end dates."""
        try:
            start = datetime.fromisoformat(start_date.replace('Z', '+00:00'))
            end = datetime.fromisoformat(end_date.replace('Z', '+00:00'))
        except ValueError:
            # Try alternate format
            start = datetime.strptime(start_date.split('T')[0], "%Y-%m-%d")
            end = datetime.strptime(end_date.split('T')[0], "%Y-%m-%d")
        
        num_days = (end - start).days + 1
        if num_days < 1:
            raise ValueError("End date must be after start date")
        
        # Simple distribution of venues across days
        days = []
        venues_per_day = max(1, min(len(venues) // num_days, 5))  # Max 5 venues per day, min 1
        
        venue_index = 0
        for day_idx in range(num_days):
            current_date = start + timedelta(days=day_idx)
            day_venues = []
            
            # Add venues for this day (up to venues_per_day)
            for _ in range(venues_per_day):
                if venue_index < len(venues):
                    day_venues.append(venues[venue_index])
                    venue_index += 1
            
            # Get route information for the day
            route_info = self.get_directions(day_venues) if day_venues else None
            
            # Generate narrative for this day
            narrative = self.generate_daily_narrative(day_venues, day_idx + 1, num_days)
            
            days.append({
                "date": current_date.strftime("%Y-%m-%d"),
                "day_number": day_idx + 1,
                "venues": day_venues,
                "narrative": narrative,
                "route": route_info
            })
        
        return days
    
    def generate_itinerary(self, trip_data):
        """Generate a complete itinerary based on trip data."""
        # Extract data from the new request format
        user_email = trip_data.get("userEmail")
        start_location_data = trip_data.get("startLocation", {})
        end_location_data = trip_data.get("endLocation", {})
        budget = trip_data.get("budget", "1")
        trip_vibe = trip_data.get("tripVibe", "foodie")
        start_date = trip_data.get("startDate")
        end_date = trip_data.get("endDate")
        
        # Get addresses
        start_location_address = start_location_data.get("address")
        end_location_address = end_location_data.get("address")
        
        # Map vibe to interests
        interests = VIBE_TO_INTERESTS.get(trip_vibe, ["restaurants", "attractions", "shopping"])
        
        # Validate required fields
        if not all([start_location_address, end_location_address, start_date, end_date]):
            raise ValueError("Missing required trip information")
        
        # Convert locations to coordinates
        start_coords = self.geocode_location(start_location_address)
        end_coords = self.geocode_location(end_location_address)
        
        # Find venues that match interests and budget
        start_venues = self.search_venues(start_coords, interests, budget)
        
        # If start and end are different, get venues for end location too
        if start_location_address != end_location_address:
            end_venues = self.search_venues(end_coords, interests, budget)
            # Combine venues, removing duplicates
            all_venues = start_venues + [v for v in end_venues if v["id"] not in [sv["id"] for sv in start_venues]]
        else:
            all_venues = start_venues
        
        # Organize into daily itineraries
        days = self.organize_days(all_venues, start_date, end_date)
        
        # Build the complete itinerary
        itinerary = {
            "trip_id": f"trip_{datetime.now().strftime('%Y%m%d%H%M%S')}",
            "user_email": user_email,
            "start_location": {
                "address": start_location_address,
                "coordinates": start_coords
            },
            "end_location": {
                "address": end_location_address,
                "coordinates": end_coords
            },
            "budget": budget,
            "trip_vibe": trip_vibe,
            "interests": interests,
            "start_date": start_date,
            "end_date": end_date,
            "days": days,
            "total_venues": len(all_venues),
            "created_at": datetime.now().isoformat()
        }
        
        # Save to database (if available)
        if self.db is not None:
            result = self.db.itineraries.insert_one(itinerary)
            # Add the MongoDB ID to the response
            itinerary["_id"] = str(result.inserted_id)
        
        return itinerary 