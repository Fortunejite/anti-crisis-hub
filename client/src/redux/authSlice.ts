import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { backendAPI } from '@/utils/backendAPI';
import errorHandler from '@/utils/errorHandler';

interface IInitialState {
  loading: boolean;
  error: string | null;
  isLoggedIn: boolean;
  user: {
    email: string;
    name: string;
    phone: string;
    profileImage?: string;
    role: 'Seeker' | 'Provider' | 'Admin';
    location: {
      type: 'Point';
      coordinates: number[];
    };
  } | null;
}

interface ICredentials {
  email: string;
  password: string;
  rememberMe: boolean;
}

// Thunks for handling async operations
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: ICredentials, { rejectWithValue }) => {
    try {
      const response = await backendAPI.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      const errorMessage = errorHandler(error);
      return rejectWithValue(errorMessage);
    }
  },
);

export const updateUserProfile = createAsyncThunk(
  '/auth/updateProfile',
  async (profileData, { dispatch, rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const res = await backendAPI.put('/auth/profile', profileData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(setUser(res.data));
      localStorage.setItem('user', JSON.stringify(res.data));
      return res.data;
    } catch (e) {
      rejectWithValue(errorHandler(e));
    }
  },
);

const initialState: IInitialState = {
  user: null,
  isLoggedIn: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isLoggedIn = !!action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    // Handle login
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isLoggedIn = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setUser, clearError, logout } = authSlice.actions;
export default authSlice.reducer;
