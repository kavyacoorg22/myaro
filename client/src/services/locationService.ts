export const locationService = {
  // Get user's current location using browser geolocation
  async getCurrentLocation(): Promise<GeolocationCoordinates> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => resolve(position.coords),
        (error) => reject(error),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  },

  // Reverse geocoding: Convert coordinates to location name
  async getLocationName(lat: number, lon: number): Promise<{
    city: string;
    state: string;
    country: string;
  }> {
    try {
      
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'en',
          },
        }
      );

      const data = await response.json();
      
      return {
        city: data.address?.city || data.address?.town || data.address?.village || 'Unknown',
        state: data.address?.state || '',
        country: data.address?.country || 'Unknown',
      };
    } catch (error) {
      console.error('Error fetching location name:', error);
      throw new Error('Failed to fetch location details');
    }
  },

  // Alternative: Use IP-based location (fallback if GPS denied)
  async getLocationByIP(): Promise<{
    city: string;
    state: string;
    country: string;
    latitude: number;
    longitude: number;
  }> {
    try {
      
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      return {
        city: data.city || 'Unknown',
        state: data.region || '',
        country: data.country_name || 'Unknown',
        latitude: data.latitude,
        longitude: data.longitude,
      };
    } catch (error) {
      console.error('Error fetching IP location:', error);
      throw new Error('Failed to fetch location by IP');
    }
  },
};
