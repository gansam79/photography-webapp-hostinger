# Setup Guide - Photography Billing & Quotation System (MERN Stack)

## Project Overview

This is a full-stack MERN application for managing photography quotations, invoices, and payments. The project is split into two separate applications:

- **Server**: Node.js + Express API (Port 5000)
- **Client**: React.js Frontend (Port 3000)

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager
- MongoDB Atlas account (free tier available)
- Git (optional, for cloning)

## Installation Steps

### 1. Install Server Dependencies

Navigate to the server directory and install dependencies:

```bash
cd server
npm install
# or
yarn install
```

### 2. Configure Server Environment

Create a `.env` file in the server directory (copy from `.env.example`):

```bash
cp .env.example .env
```

Edit `.env` with your MongoDB credentials:

```
MONGODB_URI=mongodb+srv://your_username:your_password@cluster0.abd8q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
DATABASE_NAME=photography-local
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### 3. Install Client Dependencies

Navigate to the client directory and install dependencies:

```bash
cd client
npm install
# or
yarn install
```

### 4. Configure Client Environment

Create a `.env` file in the client directory (copy from `.env.example`):

```bash
cp .env.example .env
```

The default configuration should work:

```
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Photography Billing System
VITE_APP_VERSION=1.0.0
```

## Running the Application

### Option 1: Run Both in Separate Terminals

**Terminal 1 - Start Backend Server:**

```bash
cd server
npm run dev
```

Output should show:
```
✅ MongoDB connected successfully
🚀 Server running on port 5000
📍 API Base URL: http://localhost:5000/api
```

**Terminal 2 - Start Frontend Development Server:**

```bash
cd client
npm run dev
```

Output should show:
```
VITE v4.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

### Option 2: Run Both Simultaneously (from root)

If you're in the root directory, you can use a tool like `concurrently` (optional):

```bash
npm install -g concurrently
concurrently "cd server && npm run dev" "cd client && npm run dev"
```

## Accessing the Application

Once both servers are running:

- **Frontend**: http://localhost:3000 (Note: Vite may use a different port, check terminal output)
- **API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

## API Endpoints

### Clients
- `GET /api/clients` - Get all clients
- `GET /api/clients/:id` - Get single client
- `POST /api/clients` - Create client
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client
- `GET /api/clients/search?query=...` - Search clients

### Services
- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get single service
- `POST /api/services` - Create service
- `PUT /api/services/:id` - Update service
- `DELETE /api/services/:id` - Delete service

### Quotations
- `GET /api/quotations` - Get all quotations
- `GET /api/quotations/:id` - Get single quotation
- `POST /api/quotations` - Create quotation
- `PUT /api/quotations/:id` - Update quotation
- `DELETE /api/quotations/:id` - Delete quotation
- `POST /api/quotations/:id/duplicate` - Duplicate quotation
- `GET /api/quotations/client/:clientId` - Get quotations by client
- `GET /api/quotations/status?status=...` - Get quotations by status

### Invoices
- `GET /api/invoices` - Get all invoices
- `GET /api/invoices/:id` - Get single invoice
- `POST /api/invoices` - Create invoice
- `PUT /api/invoices/:id` - Update invoice
- `DELETE /api/invoices/:id` - Delete invoice
- `GET /api/invoices/client/:clientId` - Get invoices by client
- `GET /api/invoices/status?status=...` - Get invoices by payment status
- `PATCH /api/invoices/:id/payment-status` - Update payment status
- `GET /api/invoices/overdue` - Get overdue invoices

### Payments
- `GET /api/payments` - Get all payments
- `GET /api/payments/:id` - Get payment by ID
- `POST /api/payments/invoice/:invoiceId` - Record payment
- `GET /api/payments/invoice/:invoiceId` - Get payments for invoice
- `GET /api/payments/client/:clientId` - Get payments for client
- `GET /api/payments/summary` - Get payment summary
- `DELETE /api/payments/:id` - Delete payment

## Database Models

### Client
```javascript
{
  name: String,
  email: String,
  phone: String,
  address: String,
  city: String,
  state: String,
  zipCode: String,
  category: String (Regular, VIP, New Inquiry),
  tags: [String],
  notes: String,
  totalBilled: Number,
  totalPaid: Number,
  pendingAmount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Service
```javascript
{
  name: String,
  description: String,
  category: String (photography, video, drone, product, other),
  ratePerDay: Number,
  ratePerUnit: Number,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Quotation
```javascript
{
  quotationNumber: String,
  clientId: ObjectId,
  eventType: String (Wedding, Pre-wedding, Other),
  quotationDate: Date,
  eventDate: Date,
  validityDate: Date,
  services: [{ serviceId, serviceName, quantity, days, ratePerDay, total }],
  subtotal: Number,
  discount: Number,
  discountType: String (fixed, percentage),
  taxPercentage: Number,
  tax: Number,
  grandTotal: Number,
  paymentTerms: String,
  notes: String,
  thankYouMessage: String,
  status: String (Draft, Sent, Accepted, Rejected),
  convertedToInvoice: Boolean,
  invoiceId: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

### Invoice
```javascript
{
  invoiceNumber: String,
  clientId: ObjectId,
  quotationId: ObjectId,
  eventType: String,
  invoiceDate: Date,
  eventDate: Date,
  dueDate: Date,
  services: [{ serviceId, serviceName, quantity, days, ratePerDay, total }],
  subtotal: Number,
  discount: Number,
  discountType: String,
  taxPercentage: Number,
  tax: Number,
  grandTotal: Number,
  paymentStatus: String (Paid, Partially Paid, Unpaid),
  bankDetails: { accountName, accountNumber, ifscCode, upiId },
  notes: String,
  thankYouMessage: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Payment
```javascript
{
  invoiceId: ObjectId,
  clientId: ObjectId,
  amount: Number,
  paymentDate: Date,
  paymentMethod: String (Cash, Bank Transfer, UPI, Credit Card, Cheque, Other),
  transactionId: String,
  notes: String,
  isRecorded: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## Troubleshooting

### MongoDB Connection Error
- Verify your MongoDB URI in `.env`
- Check if MongoDB Atlas IP whitelist includes your IP
- Ensure database name matches in the URI

### Port Already in Use
```bash
# Kill process on port 5000 (Server)
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000 (Client)
lsof -ti:3000 | xargs kill -9
```

### CORS Errors
- Ensure `CORS_ORIGIN` in server `.env` matches your client URL
- Default is `http://localhost:3000`

### Dependencies Installation Issues
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

## Building for Production

### Build Server
```bash
# Server is already in production format
# Just ensure NODE_ENV=production in .env
```

### Build Client
```bash
cd client
npm run build
```

The built files will be in `client/dist/`

## Next Steps

1. **Add Authentication** - Implement user login/signup
2. **Add Email Integration** - Send quotations/invoices via email
3. **Add Payment Gateway** - Integrate Stripe/Razorpay
4. **Add File Upload** - Store documents in cloud storage
5. **Add Notifications** - Real-time notifications
6. **Deploy** - Deploy to Netlify (frontend) and Heroku/Railway (backend)

## Support

For issues or questions:
1. Check the API documentation
2. Review console logs in terminal
3. Verify environment configuration
