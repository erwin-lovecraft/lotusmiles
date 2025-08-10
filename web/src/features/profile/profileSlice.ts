import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";
import { httpClient } from "@/lib/http.ts";
import type { OnboardCustomer, Profile, UpdateProfile } from "@/types/profile";

interface State {
  data?: Profile;
  loading: boolean;
  error?: string;
}

const initialState: State = {
  loading: false,
};

export const fetchMyProfile = createAsyncThunk("profile/fetchMyProfile", async (_, { rejectWithValue }) => {
  try {
    const res = await httpClient.get<Profile>("/api/v1/profile");
    return res.data;
  } catch (e) {
    return rejectWithValue(e);
  }
});

export const onboardCustomer = createAsyncThunk(
  "profile/onboardCustomer",
  async (payload: OnboardCustomer, { rejectWithValue }) => {
    try {
      const res = await httpClient.post("/api/v1/customers/onboard", payload);
      return res.data;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async (payload: UpdateProfile, { rejectWithValue }) => {
    try {
      const res = await httpClient.patch("/api/v1/customers", payload);
      return res.data;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const slice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyProfile.pending, (s) => {
        s.loading = true;
        s.error = undefined;
      })
      .addCase(fetchMyProfile.fulfilled, (s, a) => {
        s.loading = false;
        s.data = a.payload;
      })
      .addCase(fetchMyProfile.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload ? JSON.stringify(a.payload) : "Unknown error";
      })
      .addCase(onboardCustomer.pending, (s) => {
        s.loading = true;
        s.error = undefined;
      })
      .addCase(onboardCustomer.fulfilled, (s, a) => {
        s.loading = false;
        s.data = a.payload as Profile;
      })
      .addCase(onboardCustomer.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload ? JSON.stringify(a.payload) : "Unknown error";
      })
      .addCase(updateProfile.pending, (s) => {
        s.loading = true;
        s.error = undefined;
      })
      .addCase(updateProfile.fulfilled, (s, a) => {
        s.loading = false;
        s.data = a.payload as Profile;
      })
      .addCase(updateProfile.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload ? JSON.stringify(a.payload) : "Unknown error";
      });
  },
});

export const selectProfile = (state: RootState) => state.profile.data;

export default slice.reducer;
