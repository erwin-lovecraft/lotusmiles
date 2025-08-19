import { Card, CardContent } from "@/components/ui/card.tsx";
import { Button } from "@/components/ui/button.tsx";
import { zodResolver } from "@hookform/resolvers/zod";
import { type MileageAccrualRequestForm, MileageAccrualRequestSchema } from "@/types/mileage_accrual_request.ts";
import { createValidatedForm } from "@/components/validated-form-factory.ts";
import { SelectItem } from "@/components/ui/select.tsx";
import { BOOKING_CLASSES, LOCATIONS } from "@/mocks/mocks.ts";
import { unsignedUpload } from "@/lib/cloudinary.ts";

export default function MileageAccrualRequestPage() {
  const {Form, Input, Select, DatePicker, FileUpload} = createValidatedForm<MileageAccrualRequestForm>()

  const bookingClasses = BOOKING_CLASSES;
  const iatas = LOCATIONS;

  const handleSubmit = (values: MileageAccrualRequestForm) => {
    console.log(JSON.stringify(values));
  }

  const handleUploadToCloud = async (files: File[]) => {
    const results: string[] = [];
    for (const file of files) {
      try {
        const res = await unsignedUpload(file)
        results.push(res.display_name)
      } catch (e) {
        throw new Error(`Upload failed: ${e}`);
      }
    }
    return results; // array of URLs
  }

  return (
    <div className="space-y-4 sm:space-y-6 mb-20">
      {/*<Alert>*/}
      {/*  <AlertCircle className="h-4 w-4"/>*/}
      {/*  <AlertDescription className="text-sm">*/}
      {/*    Yêu cầu tích dặm thủ công sẽ được xử lý trong vòng 5-7 ngày làm việc. Vui lòng cung cấp đầy đủ thông tin và*/}
      {/*    tài liệu chứng minh.*/}
      {/*  </AlertDescription>*/}
      {/*</Alert>*/}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <Form resolver={zodResolver(MileageAccrualRequestSchema)} onSubmit={handleSubmit} className="lg:col-span-2">
          <Card>
            <CardContent className="space-y-4 sm:space-y-6 pt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input name="ticket_id" label="Ticket ID"/>
                <Input name="pnr" label="PNR"/>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select name="carrier" label="Carrier" className="w-full">
                  <SelectItem value="VN">Vietnam Airlines - VN</SelectItem>
                </Select>
                <Select name="booking_class" label="Booking Class" className="w-full h-1/4VH">
                  {bookingClasses.map((bookingClass) => (
                    <SelectItem value={bookingClass}>{bookingClass}</SelectItem>
                  ))}
                </Select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select name="from_code" label="From" className="w-full">
                  {iatas.map((iata) => (
                    <SelectItem value={iata.code}>{iata.name} - {iata.code}</SelectItem>
                  ))}
                </Select>
                <Select name="to_code" label="To" className="w-full">
                  {iatas.map((iata) => (
                    <SelectItem value={iata.code}>{iata.name} - {iata.code}</SelectItem>
                  ))}
                </Select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DatePicker name="departure_date" label="Departure Date"/>
              </div>

              <FileUpload
                name="ticket_image_url"
                label="Ticket Image"
                maxFiles={1}
                accept="image/*,.pdf"
                onUpload={handleUploadToCloud}
              />

              <FileUpload
                name="boarding_pass_image_url"
                label="Boarding Pass Image"
                maxFiles={1}
                accept="image/*,.pdf"
                onUpload={handleUploadToCloud}
              />

              <div className="pt-4 border-t">
                <Button
                  className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 w-full sm:w-auto text-sm sm:text-base">
                  Gửi yêu cầu
                </Button>
              </div>
            </CardContent>
          </Card>
        </Form>

        {/*<div>*/}
        {/*  <Card>*/}
        {/*    <CardHeader className="pb-3 sm:pb-6">*/}
        {/*      <CardTitle className="text-lg sm:text-xl">Hướng dẫn</CardTitle>*/}
        {/*    </CardHeader>*/}
        {/*    <CardContent className="space-y-4 pt-0">*/}
        {/*      <div>*/}
        {/*        <h4 className="font-medium mb-2 text-sm sm:text-base">Tài liệu cần thiết:</h4>*/}
        {/*        <ul className="text-xs sm:text-sm text-gray-600 space-y-1">*/}
        {/*          <li>• Boarding pass (chuyến bay)</li>*/}
        {/*          <li>• Hóa đơn thanh toán</li>*/}
        {/*          <li>• Xác nhận đặt chỗ</li>*/}
        {/*          <li>• Biên lai giao dịch</li>*/}
        {/*        </ul>*/}
        {/*      </div>*/}

        {/*      <div>*/}
        {/*        <h4 className="font-medium mb-2 text-sm sm:text-base">Thời gian xử lý:</h4>*/}
        {/*        <ul className="text-xs sm:text-sm text-gray-600 space-y-1">*/}
        {/*          <li>• Chuyến bay: 3-5 ngày</li>*/}
        {/*          <li>• Khách sạn: 5-7 ngày</li>*/}
        {/*          <li>• Đối tác khác: 7-10 ngày</li>*/}
        {/*        </ul>*/}
        {/*      </div>*/}

        {/*      <div>*/}
        {/*        <h4 className="font-medium mb-2 text-sm sm:text-base">Lưu ý quan trọng:</h4>*/}
        {/*        <ul className="text-xs sm:text-sm text-gray-600 space-y-1">*/}
        {/*          <li>• Yêu cầu phải gửi trong 90 ngày</li>*/}
        {/*          <li>• Cung cấp đầy đủ thông tin</li>*/}
        {/*          <li>• Chỉ tích dặm cho hoạt động hợp lệ</li>*/}
        {/*        </ul>*/}
        {/*      </div>*/}
        {/*    </CardContent>*/}
        {/*  </Card>*/}
        {/*</div>*/}
      </div>
    </div>
  );
}
