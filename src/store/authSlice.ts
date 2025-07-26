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
  isLoading: boolean;
  error: string | null;
}

// Initial state
const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
};

// Create the auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    logout(state) {
      state.user = null;
      state.isLoading = false;
      state.error = null;
    },
    setAuthLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
    setAuthError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
  },
});

// Export actions and reducer
export const { login, logout, setAuthLoading, setAuthError } = authSlice.actions;
export default authSlice.reducer;
