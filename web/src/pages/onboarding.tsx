import {useEffect, useState} from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ThemeToggle } from "@/components/theme-toggle";

import { httpClient } from "@/lib/http";
import { config } from "@/config/env";
import type { ApiError } from "@/types/auth";
import { toast } from "sonner";

type OnboardingFormData = {
  first_name: string;
  last_name: string;
  phone: string;
  address: string;
  referrer_code: string;
};

export function OnboardingPage() {
  const { getAccessTokenSilently, user } = useAuth0();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<OnboardingFormData>({
    defaultValues: {
      first_name: "",
      last_name: "",
      phone: "",
      address: "",
      referrer_code: "",
    },
  });

  useEffect(() => {
    if (!user) return;

    form.setValue("first_name", user.given_name ?? '')
    form.setValue("last_name", user.family_name ?? '')
    form.setValue("address", user.address ?? '')
    form.setValue("phone", user.phone_number ?? '')

  }, [form, user])

  const onSubmit = async (data: OnboardingFormData) => {
    setIsSubmitting(true);

    try {
      // Clean up referrer_code if empty
      const submitData = {
        ...data,
        referrer_code: data.referrer_code || undefined,
      };

      await httpClient.post(`${config.api.baseUrl}/api/v1/profile/onboarding`, submitData);

      toast("Welcome!", {
        description: "Your profile has been set up successfully.",
      });

      try {
        await getAccessTokenSilently();
      } catch (error) {
        console.warn("Token renewal failed, proceeding anyway:", error);
      }

      navigate("/home");
    } catch (error) {
      const apiError = error as ApiError;

      toast("Setup Failed", {
        description: apiError.message,
      });

      // Set field-level errors if provided
      if (apiError.fields) {
        Object.entries(apiError.fields).forEach(([field, messages]) => {
          form.setError(field as keyof OnboardingFormData, {
            message: messages[0],
          });
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="flex justify-end p-4">
        <ThemeToggle />
      </header>

      <div className="flex-1 flex items-center justify-center p-4 mb-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
            <CardDescription>We need a few details to set up your loyalty account</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="first_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
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
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+1234567890" {...field} />
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
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Textarea placeholder="123 Main St, City, State, ZIP" className="resize-none" {...field} />
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
                      <FormLabel>Referrer Code (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="FRIEND123" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full h-12" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Complete Setup
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
