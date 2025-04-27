const UNSPLASH_ACCESS_KEY = 'YOUR_UNSPLASH_ACCESS_KEY'; // You'll need to get this from Unsplash

export const getLocationImage = async (location: string): Promise<string> => {
  try {
    console.log('Fetching image for location:', location);
    const response = await fetch(`http://localhost:4000/api/places/image/${encodeURIComponent(location)}`);
    
    if (!response.ok) {
      console.error('Failed to fetch image:', response.status, response.statusText);
      throw new Error('Failed to fetch location image');
    }

    const data = await response.json();
    console.log('Received image URL:', data.imageUrl);
    return data.imageUrl || '/assets/explorer.jpg';
  } catch (error) {
    console.error('Error getting location image:', error);
    return '/assets/explorer.jpg';
  }
}; 