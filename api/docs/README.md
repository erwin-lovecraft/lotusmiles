# AegisMiles API Documentation

## Swagger UI

API documentation được tạo tự động bằng Swagger và có thể truy cập tại:

- **Swagger UI**: http://localhost:8080/swagger/index.html
- **Swagger JSON**: http://localhost:8080/docs/swagger.json

## Cách sử dụng

### 1. Truy cập Swagger UI
Mở trình duyệt và truy cập: `http://localhost:8080/swagger/index.html`

### 2. Xem API endpoints
- **Customers**: Quản lý thông tin khách hàng
- **Mileage Accrual Requests**: Quản lý yêu cầu tích điểm

### 3. Test API
- Click vào endpoint bạn muốn test
- Click "Try it out"
- Nhập parameters và request body
- Click "Execute"

### 4. Authentication
Sử dụng JWT token trong header:
```
Authorization: Bearer <your_jwt_token>
```

## API Endpoints

### Customers
- **GET** `/api/v1/profile` - Lấy thông tin profile của customer hiện tại
- **POST** `/api/v1/customers/onboard` - Đăng ký customer mới

### Mileage Accrual Requests
- **GET** `/api/v1/mileage-accrual-requests` - Lấy danh sách yêu cầu tích điểm
- **POST** `/api/v1/mileage-accrual-requests` - Tạo yêu cầu tích điểm mới
- **PUT** `/api/v1/mileage-accrual-requests/{id}` - Cập nhật yêu cầu tích điểm
- **PUT** `/api/v1/mileage-accrual-requests/{id}/status` - Cập nhật trạng thái yêu cầu

## Request/Response Examples

### Onboard Customer
```json
POST /api/v1/customers/onboard
{
  "first_name": "John",
  "last_name": "Doe",
  "address": "123 Main St",
  "phone": "+1234567890",
  "referrer_code": "REF123"
}
```

### Update Mileage Status
```json
PUT /api/v1/mileage-accrual-requests/123/status
{
  "status": "approved"
}
```

hoặc

```json
PUT /api/v1/mileage-accrual-requests/123/status
{
  "status": "rejected",
  "reject_reason": "Thiếu thông tin chuyến bay"
}
```

## Generate documentation

Để cập nhật documentation sau khi thay đổi code:

```bash
# Sử dụng Makefile
make swagger

# Hoặc sử dụng swag CLI trực tiếp
swag init -g cmd/serverd/main.go -o docs
```

## Cấu trúc files

- `docs.go`: File Go được generate tự động
- `swagger.json`: OpenAPI specification với đầy đủ API endpoints
- `index.html`: Swagger UI interface

## Lưu ý

- Documentation được generate tự động từ annotations trong code
- Đảm bảo cập nhật annotations khi thay đổi API
- Swagger UI chỉ hoạt động khi server đang chạy
- Tất cả API endpoints đều yêu cầu JWT authentication
