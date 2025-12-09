import { createSlice,type PayloadAction } from "@reduxjs/toolkit";
import type { UserRoleType } from "../../constants/types/User";

interface AuthState {
  userId?: string | null;
  userName?: string | null;
  fullName?: string | null;
  role?: UserRoleType ;
  isAuthenticated: boolean;
  profileImg?: string ;
   isVerified?: boolean; 
}

interface UserSliceState {
  currentUser: AuthState;
}

const initialCurrentUser: AuthState = {
  userId: null,
  userName: null,
  fullName: null,
  role: undefined,
  isAuthenticated: false,
  profileImg: '',
   isVerified: false, 
};

const loadUserFromStorage = (): AuthState => {
  try {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      return JSON.parse(storedUser);
    }
  } catch (error) {
    console.error('Error loading user from localStorage:', error);
    localStorage.removeItem('currentUser'); 
  }
  return initialCurrentUser;
};

const initialState: UserSliceState = {
  currentUser: loadUserFromStorage(),
};

const UserSlice = createSlice({
  name: "User",
  initialState,
  reducers: {
    setCurrentUser: (state, action:PayloadAction<Omit<AuthState, 'isAuthenticated'>>) => {
      state.currentUser = {
        ...state.currentUser,
        ...action.payload,
        isAuthenticated: true,
      };
        try {
        localStorage.setItem('currentUser', JSON.stringify(state.currentUser));
        console.log(`localstoreage ${localStorage.getItem("currentUser")}`)
      } catch (error) {
        console.error('Error saving user to localStorage:', error);
      }
    },

    logout: (state) => {
      state.currentUser = { ...initialCurrentUser };
        try {
        localStorage.removeItem('currentUser');
      } catch (error) {
        console.error('Error removing user from localStorage:', error);
      }
    },
  },
});

export const { setCurrentUser, logout} = UserSlice.actions;

export default UserSlice.reducer;
