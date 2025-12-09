import { createSlice,type PayloadAction } from '@reduxjs/toolkit';

interface LocationState {
  city: string | null;
  state: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: LocationState = {
  city: null,
  state: null,
  country: null,
  latitude: null,
  longitude: null,
  isLoading: false,
  error: null,
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setLocation: (state, action: PayloadAction<{
      city: string;
      state: string;
      country: string;
      latitude: number;
      longitude: number;
    }>) => {
      state.city = action.payload.city;
      state.state = action.payload.state;
      state.country = action.payload.country;
      state.latitude = action.payload.latitude;
      state.longitude = action.payload.longitude;
      state.isLoading = false;
      state.error = null;
    },
    setLocationLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setLocationError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearLocation: (state) => {
      state.city = null;
      state.state = null;
      state.country = null;
      state.latitude = null;
      state.longitude = null;
      state.error = null;
    },
  },
});

export const { 
  setLocation, 
  setLocationLoading, 
  setLocationError, 
  clearLocation 
} = locationSlice.actions;

export default locationSlice.reducer;