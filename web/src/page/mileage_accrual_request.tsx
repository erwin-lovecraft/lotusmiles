import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import { zodResolver } from "@hookform/resolvers/zod";
import { createValidatedForm } from "@/components/validated-form-factory.ts";
import { SelectItem } from "@/components/ui/select.tsx";
import { BOOKING_CLASSES, LOCATIONS } from "@/mocks/mocks.ts";
import { unsignedUpload } from "@/lib/cloudinary.ts";
import { type MileageAccrualRequestForm, MileageAccrualRequestSchema } from "@/types/mileage-accrual-request.ts";
import { useCreateMileageAccrualRequest } from "@/lib/hooks/use-mileage-accrual-request.ts";
import { toast } from "sonner";
import { ApiError } from "@/lib/types/api-error";
import { useNavigate } from "react-router";
import { Plane, Upload, Calendar, CreditCard } from "lucide-react";

export default function MileageAccrualRequestPage() {
  const { Form, Input, Select, DatePicker, FileUpload } = createValidatedForm<MileageAccrualRequestForm>()

  const bookingClasses = BOOKING_CLASSES;
  const iatas = LOCATIONS;

  const createMileageAccrualRequestMutation = useCreateMileageAccrualRequest();
  const navigate = useNavigate();

  const handleSubmit = async (values: MileageAccrualRequestForm) => {
    try {
      await createMileageAccrualRequestMutation.mutateAsync(values);
      toast.success('Mileage accrual request submitted successfully!');

      // Navigate to tracking page after successful submission
      navigate('/tracking');
    } catch (error) {
      if (error instanceof ApiError) {
        // Show the error_description from the API response
        toast.error(error.error_description);
      } else {
        // Fallback for internal server errors or network issues
        toast.error('An error occurred while submitting the request. Please try again.');
      }
    }
  }

  const handleUploadToCloud = async (files: File[]) => {
    const results: { url: string; display_name: string }[] = [];
    for (const file of files) {
      try {
        const res = await unsignedUpload(file)
        results.push({ url: res.secure_url, display_name: res.display_name })
      } catch (e) {
        throw new Error(`Upload failed: ${e}`);
      }
    }
    return results; // array of objects with url and display_name
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8 lg:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-purple-100 rounded-xl">
              <Plane className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                Mileage Request
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 mt-1">
                Submit flight details to earn miles
              </p>
            </div>
          </div>
        </div>

        {/* Main Form Container */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Form Section */}
          <div className="xl:col-span-2">
            <Card className="bg-white rounded-xl shadow-sm border border-gray-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl sm:text-2xl">
                  <CreditCard className="w-5 h-5 text-purple-600" />
                  Flight Information
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-6 sm:space-y-8">
                <Form
                  resolver={zodResolver(MileageAccrualRequestSchema)}
                  onSubmit={handleSubmit}
                  defaultValues={{
                    ticket_id: "",
                    pnr: "",
                    carrier: "VN",
                    booking_class: "",
                    from_code: "",
                    to_code: "",
                    departure_date: new Date(),
                    ticket_image_url: undefined,
                    boarding_pass_image_url: undefined,
                  }}
                  resetOnSuccess={true}
                >
                  {/* Ticket Information Section */}
                  <div className="space-y-6 sm:space-y-8">
                    <div className="mb-12">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                          name="ticket_id"
                          label="Ticket ID"
                          placeholder="e.g., 1234567890123"
                          className="h-12 text-base mb-6"
                        />
                        <Input
                          name="pnr"
                          label="Booking Reference"
                          placeholder="e.g., ABC123"
                          className="h-12 text-base"
                        />
                      </div>
                    </div>

                    {/* Flight Details Section */}
                    <div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <Select
                          name="carrier"
                          label="Carrier"
                          placeholder="Select airline"
                          className="w-full h-12 text-base"
                        >
                          <SelectItem value="VN">Vietnam Airlines - VN</SelectItem>
                        </Select>
                        <Select
                          name="booking_class"
                          label="Booking Class"
                          placeholder="Select class"
                          className="w-full h-12 text-base"
                        >
                          {bookingClasses.map((bookingClass) => (
                            <SelectItem key={`booking-class-${bookingClass}`} value={bookingClass}>
                              {bookingClass}
                            </SelectItem>
                          ))}
                        </Select>
                        <Select
                          name="from_code"
                          label="From"
                          placeholder="Departure airport"
                          className="w-full h-12 text-base"
                        >
                          {iatas.map((iata) => (
                            <SelectItem key={`from-${iata.code}`} value={iata.code}>
                              {iata.name} - {iata.code}
                            </SelectItem>
                          ))}
                        </Select>
                        <Select
                          name="to_code"
                          label="To"
                          placeholder="Arrival airport"
                          className="w-full h-12 text-base"
                        >
                          {iatas.map((iata) => (
                            <SelectItem key={`to-${iata.code}`} value={iata.code}>
                              {iata.name} - {iata.code}
                            </SelectItem>
                          ))}
                        </Select>
                      </div>
                    </div>

                    {/* Date Section */}
                    <div>
                      <div className="w-full">
                        <DatePicker
                          name="departure_date"
                          label="Departure Date"
                          placeholder="Select departure date"
                          className="h-12 text-base w-full"
                        />
                      </div>
                    </div>

                    {/* Document Upload Section */}
                    <div>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <FileUpload
                            name="ticket_image_url"
                            label="Flight Ticket"
                            placeholder="Upload ticket (JPG, PNG, PDF)"
                            maxFiles={1}
                            accept="image/*,.pdf"
                            onUpload={handleUploadToCloud}
                            className="min-h-[200px] sm:min-h-[240px]"
                          />
                        </div>
                        <div>
                          <FileUpload
                            name="boarding_pass_image_url"
                            label="Boarding Pass"
                            placeholder="Upload boarding pass (JPG, PNG, PDF)"
                            maxFiles={1}
                            accept="image/*,.pdf"
                            onUpload={handleUploadToCloud}
                            className="min-h-[200px] sm:min-h-[240px]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-6 sm:pt-8 border-t border-gray-200">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="text-sm text-gray-600">
                          <p>Processed within 5-7 business days</p>
                        </div>
                        <Button
                          type="submit"
                          disabled={createMileageAccrualRequestMutation.isPending}
                          className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white px-8 py-3 h-12 text-base font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto"
                        >
                          {createMileageAccrualRequestMutation.isPending ? (
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span>Submitting...</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Upload className="w-4 h-4" />
                              <span>Submit Request</span>
                            </div>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Information Sidebar */}
          <div className="xl:col-span-1">
            <div className="space-y-4 lg:space-y-6">
              {/* Required Documents Card */}
              <Card className="bg-white rounded-xl shadow-sm border border-gray-100">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Upload className="w-5 h-5 text-green-600" />
                    Required Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Flight ticket or e-ticket</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Boarding pass</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Important Notes Card */}
              <Card className="bg-white rounded-xl shadow-sm border border-gray-100">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg text-amber-700">Important Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Submit within 90 days of travel</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Provide complete information</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Only valid activities qualify</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
