import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the user object type
interface AuthUser {
  id: string;
  name: string;
  email: string;
  // Add more fields if needed
}

// Define the initial state type
interface AuthState {
   user: AuthUser | null;
  accessToken: string | null;
}

// Initial state
const initialState: AuthState = {
  user: null,
  accessToken: null,
};

// Create the auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(
      state,
      action: PayloadAction<{ user: AuthUser; accessToken: string }>
    ) {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
    },
    logout(state) {
      state.user = null;
      state.accessToken = null;
    },
  },
});

// Export actions and reducer
export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
