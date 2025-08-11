import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "@/app/store";
import { httpClient } from "@/lib/http.ts";
import type { OnboardCustomer, Profile, UpdateProfile } from "@/types/profile";
import type { ApiError } from "@/types/auth.ts";

interface ProfileState {
  onboarding: {
    status: "idle" | "submitting" | "succeeded" | "failed";
    error?: ApiError | string;
  };
  fetchStatus: "idle" | "loading" | "succeeded" | "failed";
  data?: Profile;
  error?: ApiError | string;
}

const initialState: ProfileState = {
  onboarding: {
    status: "idle",
  },
  fetchStatus: "idle",
};

export const fetchMyProfile = createAsyncThunk<Profile, void, { rejectValue: ApiError }>(
  "profile/fetchMyProfile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await httpClient.get<Profile>("/api/v1/profile");
      return res.data;
    } catch (e) {
      return rejectWithValue(e as ApiError);
    }
  }
);

export const submitOnboarding = createAsyncThunk<Profile, OnboardCustomer, { rejectValue: ApiError }>(
  "profile/submitOnboarding",
  async (payload: OnboardCustomer, { rejectWithValue }) => {
    try {
      const res = await httpClient.post("/api/v1/customers/onboard", payload);
      return res.data;
    } catch (e) {
      return rejectWithValue(e as ApiError);
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
  reducers: {
    clearOnboardingError: (state) => {
      state.onboarding.error = undefined;
    },
    clearError: (state) => {
      state.error = undefined;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchProfile
      .addCase(fetchMyProfile.pending, (state) => {
        state.fetchStatus = "loading";
        state.error = undefined;
      })
      .addCase(fetchMyProfile.fulfilled, (state, action) => {
        state.fetchStatus = "succeeded";
        state.data = action.payload;
        state.error = undefined;
      })
      .addCase(fetchMyProfile.rejected, (state, action) => {
        state.fetchStatus = "failed";
        state.error = action.payload;
      })
      // submitOnboarding
      .addCase(submitOnboarding.pending, (state) => {
        state.onboarding.status = "submitting";
        state.onboarding.error = undefined;
      })
      .addCase(submitOnboarding.fulfilled, (state) => {
        state.onboarding.status = "succeeded";
        state.onboarding.error = undefined;
      })
      .addCase(submitOnboarding.rejected, (state, action) => {
        state.onboarding.status = "failed";
        state.onboarding.error = action.payload;
      });
  },
});

export const selectProfile = (state: RootState) => state.profile.data;

export const selectFetchProfileStatus = (state: RootState) => state.profile.fetchStatus;

export const selectOnboardingError = (state: RootState) => state.profile.onboarding.error;

export const selectIsOnboardingSubmitting = (state: RootState) => state.profile.onboarding.status === "submitting";

export const { clearOnboardingError } = slice.actions;

export default slice.reducer;
