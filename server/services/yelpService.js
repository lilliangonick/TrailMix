const Yelp = require('yelp-fusion');
const client = Yelp.client(process.env.YELP_API_KEY);

async function searchPlaces({
  latitude,
  longitude,
  categories,    // e.g. "restaurants,parks"
  price,         // e.g. "1,2"  (1 = $, 4 = $$$$)
  minRating = 0, // only include businesses ≥ this rating
  limit   = 10
}) {
  const res = await client.search({
    latitude,
    longitude,
    categories,
    price,
    limit,
  });
  return res.jsonBody.businesses.filter(b => b.rating >= minRating);
}

module.exports = { searchPlaces };