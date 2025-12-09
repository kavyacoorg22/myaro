import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLocation, setLocationLoading, setLocationError } from '../redux/LocationSlice/locationSlice';
import { locationService } from '../services/locationService';
import type { RootState } from '../redux/appStore';

export const useUserLocation = () => {
  const dispatch = useDispatch();
  const location = useSelector((state: RootState) => state.location);

  const fetchLocation = async () => {
    try {
      dispatch(setLocationLoading(true));

     
      try {
        const coords = await locationService.getCurrentLocation();
        const locationName = await locationService.getLocationName(
          coords.latitude,
          coords.longitude
        );

        dispatch(setLocation({
          ...locationName,
          latitude: coords.latitude,
          longitude: coords.longitude,
        }));
      } catch (gpsError) {
        // Fallback to IP-based location
        console.log('GPS failed, using IP location...');
        const ipLocation = await locationService.getLocationByIP();
        dispatch(setLocation(ipLocation));
      }
    } catch (error) {
      console.error('Location fetch failed:', error);
      dispatch(setLocationError('Failed to fetch location'));
    }
  };


  useEffect(() => {
    if (!location.city && !location.isLoading && !location.error) {
      fetchLocation();
    }
  }, []);

  return {
    location,
    refetchLocation: fetchLocation,
  };
};