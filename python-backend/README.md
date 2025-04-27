# TrailMix Trip Planner uAgent

This is the backend for the Trip Planner uAgent, which generates personalized travel itineraries based on user input from the frontend.

## New Features

- **Route Planning**: Now includes full route directions between venues
- **Updated Input Format**: Compatible with the new frontend JSON format from Trip.js
- **Trip Vibe Support**: Converts vibes like "foodie" to relevant interest categories
- **Improved Output**: Returns structured day-by-day itinerary with venues, routes, and narratives
- **MongoDB Storage**: Saves complete itineraries for later retrieval

## Setup

1. Install required packages:
   ```
   pip install -r requirements.txt
   ```

2. Set up environment variables in `.env`:
   ```
   MONGO_URI=your_mongodb_connection_string
   GOOGLE_API_KEY=your_google_api_key
   YELP_API_KEY=your_yelp_api_key
   GEMINI_API_KEY=your_gemini_api_key
   AGENT_SEED=optional_agent_seed_phrase
   ```

3. Run the Flask server:
   ```
   python app.py
   ```

## API Endpoints

### Generate Itinerary
- **URL:** `/api/itinerary/generate`
- **Method:** `POST`
- **Request Body:**
  ```json
  {
    "userEmail": "test@example.com",
    "startLocation": {
      "address": "123 Main St, San Francisco, CA"
    },
    "endLocation": {
      "address": "456 Market St, San Francisco, CA"
    },
    "budget": "2",
    "tripVibe": "foodie",
    "startDate": "2024-04-01T00:00:00.000Z",
    "endDate": "2024-04-03T00:00:00.000Z",
    "_id": "680d7c463683e5675ff30e9c",
    "createdAt": "2025-04-27T00:37:26.720Z",
    "__v": 0
  }
  ```

### Retrieve Itinerary
- **URL:** `/api/itinerary/{trip_id}`
- **Method:** `GET`
- **Response:** Complete itinerary with routes and venue details

### Status Check
- **URL:** `/api/status`
- **Method:** `GET`
- **Response:** `{"ok": true}` or `{"ok": false, "error": "error message"}`

## Response Format

The trip planner response includes:
- Complete trip details
- Day-by-day breakdown of venues
- Route information between venues (distance, duration, polyline)
- Navigation steps for each day
- AI-generated narrative summaries

## Testing

Use the test_trip_planner.py script to test the API:
```
python test_trip_planner.py
```

## uAgent Communication

The trip planner can also communicate directly with other uAgents using the uAgents protocol. The agent address is derived from the seed specified in the `.env` file.

## Google Maps Integration

The route information includes polyline data that can be used to draw the route on a map in the frontend. This is compatible with Google Maps and other mapping libraries. 