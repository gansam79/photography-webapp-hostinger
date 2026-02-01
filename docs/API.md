# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Currently, no authentication is required. Authentication will be added in future versions.

## Response Format

### Success Response
```json
{
  "id": "...",
  "name": "...",
  ...
}
```

### Error Response
```json
{
  "message": "Error description",
  "errors": ["specific error 1", "specific error 2"]
}
```

## HTTP Status Codes
- `200` - OK (successful GET, PUT)
- `201` - Created (successful POST)
- `400` - Bad Request
- `404` - Not Found
- `500` - Server Error

---

## Clients Endpoints

### Get All Clients
```
GET /clients
```

**Response:**
```json
[
  {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "category": "VIP",
    "totalBilled": 100000,
    "totalPaid": 50000,
    "pendingAmount": 50000,
    "createdAt": "2024-01-01T...",
    "updatedAt": "2024-01-01T..."
  }
]
```

### Get Single Client
```
GET /clients/:id
```

**Parameters:**
- `id` - Client ID (path parameter)

### Create Client
```
POST /clients
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001",
  "category": "VIP",
  "tags": ["wedding", "premium"],
  "notes": "Important client"
}
```

### Update Client
```
PUT /clients/:id
Content-Type: application/json
```

**Request Body:** Same as Create (all fields optional)

### Delete Client
```
DELETE /clients/:id
```

### Search Clients
```
GET /clients/search?query=john
```

**Query Parameters:**
- `query` - Search term (searches name, email, phone)

---

## Services Endpoints

### Get All Services
```
GET /services
```

**Response:**
```json
[
  {
    "_id": "...",
    "name": "Traditional Photography",
    "description": "Professional photography service",
    "category": "photography",
    "ratePerDay": 25000,
    "ratePerUnit": 0,
    "isActive": true,
    "createdAt": "2024-01-01T...",
    "updatedAt": "2024-01-01T..."
  }
]
```

### Get Single Service
```
GET /services/:id
```

### Create Service
```
POST /services
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Drone Photography",
  "description": "Aerial photography service",
  "category": "drone",
  "ratePerDay": 15000,
  "ratePerUnit": 0
}
```

### Update Service
```
PUT /services/:id
```

### Delete Service
```
DELETE /services/:id
```

---

## Quotations Endpoints

### Get All Quotations
```
GET /quotations
```

### Get Single Quotation
```
GET /quotations/:id
```

### Create Quotation
```
POST /quotations
Content-Type: application/json
```

**Request Body:**
```json
{
  "clientId": "...",
  "eventType": "Wedding",
  "eventDate": "2024-06-15",
  "validityDate": "2024-02-15",
  "services": [
    {
      "serviceId": "...",
      "serviceName": "Traditional Photography",
      "quantity": 2,
      "days": 3,
      "ratePerDay": 25000,
      "total": 150000
    }
  ],
  "subtotal": 150000,
  "discount": 10000,
  "discountType": "fixed",
  "taxPercentage": 18,
  "tax": 25200,
  "grandTotal": 165200,
  "paymentTerms": "50% advance",
  "notes": "Wedding package",
  "status": "Draft"
}
```

### Update Quotation
```
PUT /quotations/:id
```

### Delete Quotation
```
DELETE /quotations/:id
```

### Duplicate Quotation
```
POST /quotations/:id/duplicate
```

### Get Quotations by Client
```
GET /quotations/client/:clientId
```

### Get Quotations by Status
```
GET /quotations/status?status=Draft
```

**Query Parameters:**
- `status` - Draft, Sent, Accepted, or Rejected

---

## Invoices Endpoints

### Get All Invoices
```
GET /invoices
```

### Get Single Invoice
```
GET /invoices/:id
```

### Create Invoice
```
POST /invoices
Content-Type: application/json
```

**Request Body:**
```json
{
  "clientId": "...",
  "quotationId": "...",
  "eventType": "Wedding",
  "eventDate": "2024-06-15",
  "dueDate": "2024-02-15",
  "services": [
    {
      "serviceId": "...",
      "serviceName": "Traditional Photography",
      "quantity": 2,
      "days": 3,
      "ratePerDay": 25000,
      "total": 150000
    }
  ],
  "subtotal": 150000,
  "discount": 10000,
  "discountType": "fixed",
  "taxPercentage": 18,
  "tax": 25200,
  "grandTotal": 165200,
  "bankDetails": {
    "accountName": "The Patil Photography",
    "accountNumber": "1234567890",
    "ifscCode": "SBIN0001234",
    "upiId": "photography@upi"
  }
}
```

### Update Invoice
```
PUT /invoices/:id
```

### Delete Invoice
```
DELETE /invoices/:id
```

### Update Payment Status
```
PATCH /invoices/:id/payment-status
Content-Type: application/json
```

**Request Body:**
```json
{
  "paymentStatus": "Paid"
}
```

**Valid statuses:** "Paid", "Partially Paid", "Unpaid"

### Get Invoices by Client
```
GET /invoices/client/:clientId
```

### Get Invoices by Payment Status
```
GET /invoices/status?status=Unpaid
```

**Query Parameters:**
- `status` - Paid, Partially Paid, or Unpaid

### Get Overdue Invoices
```
GET /invoices/overdue
```

---

## Payments Endpoints

### Get All Payments
```
GET /payments
```

### Get Single Payment
```
GET /payments/:id
```

### Record Payment
```
POST /payments/invoice/:invoiceId
Content-Type: application/json
```

**Request Body:**
```json
{
  "amount": 50000,
  "paymentMethod": "Bank Transfer",
  "transactionId": "TXN123456",
  "notes": "Advance payment"
}
```

**Valid payment methods:**
- Cash
- Bank Transfer
- UPI
- Credit Card
- Cheque
- Other

### Get Payments for Invoice
```
GET /payments/invoice/:invoiceId
```

### Get Payments for Client
```
GET /payments/client/:clientId
```

### Get Payment Summary
```
GET /payments/summary
```

**Response:**
```json
{
  "totalBilled": 500000,
  "totalReceived": 300000,
  "pendingPayments": 200000,
  "totalInvoices": 5,
  "totalPayments": 8
}
```

### Delete Payment
```
DELETE /payments/:id
```

---

## Error Examples

### Validation Error
```json
{
  "message": "Validation error",
  "errors": ["Name is required", "Email must be valid"]
}
```

### Not Found
```json
{
  "message": "Client not found"
}
```

### Server Error
```json
{
  "message": "Server error"
}
```

---

## Rate Limiting
Currently, no rate limiting is implemented. Add rate limiting middleware for production.

## Pagination
Pagination is not yet implemented. All endpoints return all matching records.

## Sorting
Sorting is not yet implemented. Records are sorted by creation date (newest first) by default.

## Filtering
Limited filtering is supported through status and payment status queries.

## Future Enhancements
- Add pagination
- Add advanced filtering
- Add sorting options
- Add request logging
- Add rate limiting
- Add caching headers
- Add webhook support
