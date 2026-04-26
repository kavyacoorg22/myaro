import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLocation, setLocationLoading, setLocationError } from '../redux/LocationSlice/locationSlice';
import { locationService } from '../services/locationService';
import type { RootState } from '../redux/appStore';

export const useUserLocation = () => {
  const dispatch = useDispatch();
  const location = useSelector((state: RootState) => state.location);

  const CACHE_KEY = 'user_location';
  const CACHE_DURATION = 1000 * 60 * 30; // 30 minutes

  const fetchLocation = async () => {
    try {
      dispatch(setLocationLoading(true));

      // 1. Check cache first — no API call needed
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          dispatch(setLocation(data));
          return; // ✅ stop here, skip GPS and IP calls
        }
      }

      // 2. Try GPS
      try {
        const coords = await locationService.getCurrentLocation();
        const locationName = await locationService.getLocationName(
          coords.latitude,
          coords.longitude
        );
        const result = { ...locationName, latitude: coords.latitude, longitude: coords.longitude };

        localStorage.setItem(CACHE_KEY, JSON.stringify({ data: result, timestamp: Date.now() }));
        dispatch(setLocation(result));

      } catch (gpsError) {
        // 3. Fallback to IP
        const ipLocation = await locationService.getLocationByIP();

        localStorage.setItem(CACHE_KEY, JSON.stringify({ data: ipLocation, timestamp: Date.now() }));
        dispatch(setLocation(ipLocation));
      }

    } catch (error) {
      console.error('Location fetch failed:', error);
      dispatch(setLocationError('Failed to fetch location'));
    }
  };

  // Clear cache on manual refetch so fresh data is fetched
  const refetchLocation = () => {
    localStorage.removeItem(CACHE_KEY);
    fetchLocation();
  };

  useEffect(() => {
    if (!location.city && !location.isLoading && !location.error) {
      fetchLocation();
    }
  }, []);

  return {
    location,
    refetchLocation, // clears cache then fetches fresh
  };
};