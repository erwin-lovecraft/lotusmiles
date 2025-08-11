import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { useAppDispatch, useAppSelector } from "@/app/hook";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth0 } from "@auth0/auth0-react";
import {
  clearOnboardingError,
  fetchMyProfile,
  selectIsOnboardingSubmitting,
  selectOnboardingError,
  selectProfile,
  submitOnboarding,
} from "@/features/profile/profileSlice.ts";
import { toast } from "sonner";

const onboardingSchema = z.object({
  first_name: z.string().min(1, "First name is required").min(2, "First name must be at least 2 characters"),
  last_name: z.string().min(1, "Last name is required").min(2, "Last name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number is required"),
  address: z.string().min(5, "Please enter a complete address").optional().or(z.literal("")),
  referrer_code: z.string().min(10, "At least 10 characters").optional().or(z.literal("")),
});

type OnboardingFormData = z.infer<typeof onboardingSchema>;

export default function OnboardingPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { logout } = useAuth0();

  const isSubmitting = useAppSelector(selectIsOnboardingSubmitting);
  const error = useAppSelector(selectOnboardingError);

  const profile = useAppSelector(selectProfile);

  const form = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      phone: "",
      address: "",
      referrer_code: "",
    },
  });

  useEffect(() => {
    // Clear error when component mounts
    dispatch(clearOnboardingError());
  }, [dispatch]);

  useEffect(() => {
    if (!profile) return;

    form.setValue("first_name", profile.first_name);
    form.setValue("last_name", profile.last_name);
    form.setValue("phone", profile.phone ?? "");
    form.setValue("address", profile.address ?? "");
  }, [dispatch, form, profile]);

  const handleLogout = async () => {
    await logout({ logoutParams: { returnTo: window.location.origin } });
  };

  const onSubmit = async (data: OnboardingFormData) => {
    try {
      await dispatch(submitOnboarding(data)).unwrap();

      // If successful, navigate to home (the backend should update the onboarded claim)
      navigate("/home", { replace: true });
    } catch (e) {
      const errorText = (typeof e === "string" ? e : JSON.stringify(e)) ?? "";
      toast.error("Onboarding submission failed:" + errorText);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Onboarding Header */}
      <div className="bg-white shadow-sm px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              ></path>
            </svg>
          </div>
          <h1 className="text-lg font-semibold text-slate-800">Setup Your Profile</h1>
        </div>
        <button onClick={handleLogout} className="text-slate-500 hover:text-slate-700">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      {/* Progress Bar */}
      <div className="bg-white px-4 pb-4">
        <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
          <span>Step 1 of 1</span>
          <span>100%</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: "100%" }}></div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Welcome Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-accent to-orange-500 rounded-2xl flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
              ></path>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Welcome! 🎉</h2>
          <p className="text-slate-600">Let's get you set up to start earning rewards right away</p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-600 text-sm">
              {(typeof error === "string" ? error : error?.code) ?? "UNKNOW ERROR"}
            </p>
          </div>
        )}

        {/* Onboarding Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">Personal Information</h3>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-slate-700">First Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your first name"
                          className="px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-slate-700">Last Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your last name"
                          className="px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-slate-700">Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="+1 (555) 123-4567"
                          className="px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-slate-700">Address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter your address"
                          className="px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="referrer_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-slate-700">Referrer Code (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter referrer code if you have one"
                          className="px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-primary text-white font-semibold py-3 px-6 rounded-xl hover:bg-indigo-700 transition-colors duration-200"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </div>
                ) : (
                  "Complete Setup"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
