# Project Structure & Architecture

## Complete Folder Structure

```
photography-billing-app/
│
├── server/                              # Node.js + Express Backend
│   ├── config/
│   │   └── database.js                 # MongoDB connection setup
│   │
│   ├── controllers/
│   │   ├── clientController.js         # Client CRUD & business logic
│   │   ├── serviceController.js        # Service management
│   │   ├── quotationController.js      # Quotation operations
│   │   ├── invoiceController.js        # Invoice operations
│   │   └── paymentController.js        # Payment tracking
│   │
│   ├── models/
│   │   ├── Client.js                   # Client schema
│   │   ├── Service.js                  # Service schema
│   │   ├── Quotation.js                # Quotation schema
│   │   ├── Invoice.js                  # Invoice schema
│   │   └── Payment.js                  # Payment schema
│   │
│   ├── routes/
│   │   ├── clientRoutes.js             # Client endpoints
│   ��   ├── serviceRoutes.js            # Service endpoints
│   │   ├── quotationRoutes.js          # Quotation endpoints
│   │   ├── invoiceRoutes.js            # Invoice endpoints
│   │   └── paymentRoutes.js            # Payment endpoints
│   │
│   ├── middleware/
│   │   └── errorHandler.js             # Global error handling
│   │
│   ├── server.js                       # Express app entry point
│   ├── .env                            # Environment variables
│   ├── .env.example                    # Example env file
│   ├── package.json
│   └── README.md
│
├── client/                              # React Frontend
│   ├── public/
│   │   └── index.html
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Navigation.jsx      # Main navigation
│   │   │   │   └── Reminders.jsx       # Reminders widget
│   │   │   │
│   │   │   ├── forms/
│   │   │   │   ├── ClientForm.jsx
│   │   │   │   ├── QuotationForm.jsx
│   │   │   │   └── InvoiceForm.jsx
│   │   │   │
│   │   │   ├── modals/
│   │   │   │   └── PaymentModal.jsx
│   │   │   │
│   │   │   └── UI/
│   │   │       ├── Card.jsx
│   │   │       ├── Button.jsx
│   │   │       └── Modal.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx           # Main dashboard
│   │   │   ├── Clients.jsx             # Client management
│   │   │   ├── Quotations.jsx          # Quotation management
│   │   │   ├── Invoices.jsx            # Invoice management
│   │   │   └── NotFound.jsx            # 404 page
│   │   │
│   │   ├── services/
│   │   │   ├── api.js                  # Axios instance
│   │   │   ├── clientService.js        # Client API calls
│   │   │   ├── serviceService.js       # Service API calls
│   │   │   ├── quotationService.js     # Quotation API calls
│   │   │   ├── invoiceService.js       # Invoice API calls
│   │   │   └── paymentService.js       # Payment API calls
│   │   │
│   │   ├── hooks/
│   │   │   ├── useFetch.js             # Data fetching hook
│   │   │   ├── useApi.js               # API operations hook
│   │   │   └── useLocalStorage.js      # Local storage hook
│   │   │
│   │   ├── utils/
│   │   │   ├── pdfGenerator.js         # PDF generation
│   │   │   ├── formatters.js           # Date/number formatting
│   │   │   ├── validators.js           # Form validation
│   │   │   └── helpers.js              # Utility functions
│   │   │
│   │   ├── styles/
│   │   │   ├── globals.css             # Global styles
│   │   │   ├── tailwind.css            # Tailwind directives
│   │   │   └── variables.css           # CSS variables
│   │   │
│   │   ├── App.jsx                     # Main app component
│   │   ├── index.js                    # React entry point
│   │   └── main.jsx                    # Vite entry point
│   │
│   ├── .env
│   ├── .env.example
│   ├── index.html
│   ├── vite.config.js                  # Vite configuration
│   ├── tailwind.config.js              # Tailwind configuration
│   ├── package.json
│   └── README.md
│
├── docs/
│   ├── SETUP.md                        # Setup & installation guide
│   ├── PROJECT_STRUCTURE.md            # This file
│   └── API.md                          # API documentation
│
└── .gitignore
```

## Architecture Patterns

### Server Architecture (MVC)

```
Request → Routes → Controllers → Models → Database
                  ↓
            Error Handler
                  ↓
Response
```

**Flow Example:**
1. **Routes** receive HTTP request
2. **Controllers** process business logic
3. **Models** interact with MongoDB
4. **Error Handler** catches and formats errors
5. Response sent back to client

### Client Architecture (React Hooks)

```
Component → Hook (useFetch/useApi) → Service (Axios) → API
                                                      ↓
                                                   Backend
```

**Flow Example:**
1. **Component** renders and calls hook
2. **Hook** manages state (data, loading, error)
3. **Service** handles API communication
4. **Axios** intercepts requests/responses
5. **API** processes request

## Key Design Decisions

### 1. Separation of Concerns
- **Server**: Backend logic in controllers
- **Client**: Business logic in hooks and services
- **Database**: Data validation in models

### 2. Reusable Services
All API calls are encapsulated in service files, making it easy to:
- Change API structure
- Add caching
- Handle errors globally
- Add authentication tokens

### 3. Custom Hooks
Common operations abstracted into hooks:
- `useFetch` - For initial data loading
- `useApi` - For operations (create, update, delete)
- `useLocalStorage` - For client-side persistence

### 4. Error Handling
- **Server**: Centralized error middleware
- **Client**: Service layer catches errors
- **UI**: Components display errors to users

## Data Flow Example: Creating a Client

### Client-Side
```javascript
// Component calls hook
const { loading, error, execute } = useApi();

// Hook calls service
const response = await execute(clientService.createClient, clientData);

// Service makes API call
await api.post('/clients', clientData);
```

### Server-Side
```javascript
// Route receives request
router.post('/', createClient);

// Controller processes
export const createClient = async (req, res) => {
  // Validate input
  // Create instance
  const client = new Client(req.body);
  // Save to DB
  const savedClient = await client.save();
  // Send response
  res.status(201).json(savedClient);
}

// Model validates schema
const clientSchema = new mongoose.Schema({...})
```

## Database Relationships

```
Client (1) ─────── (Many) Quotation
  │                         │
  │                         └── (Many) Invoice
  │                                     │
  └────────────────────────────────────┘

Invoice (1) ─────── (Many) Payment

Service (Many) ─── (Many) Quotation (through services array)
Service (Many) ─── (Many) Invoice (through services array)
```

## API Response Format

All endpoints return JSON in this format:

**Success Response:**
```javascript
{
  id: "...",
  name: "...",
  ...data
}
```

**Error Response:**
```javascript
{
  message: "Error description",
  errors: [...] // Optional
}
```

## Environment Variables

### Server (.env)
- `MONGODB_URI` - MongoDB connection string
- `DATABASE_NAME` - Database name
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `CORS_ORIGIN` - Allowed client URL

### Client (.env)
- `VITE_API_URL` - Backend API URL
- `VITE_APP_NAME` - App name
- `VITE_APP_VERSION` - App version

## Security Considerations

1. **Environment Variables**
   - Never commit `.env` files
   - Use `.env.example` for reference

2. **Database**
   - Use MongoDB URI with strong passwords
   - Enable IP whitelist in MongoDB Atlas

3. **CORS**
   - Restrict to specific origins
   - Never use `*` in production

4. **Validation**
   - Validate on both client and server
   - Use Mongoose schema validation

5. **Error Messages**
   - Don't expose sensitive info in errors
   - Log errors securely

## Scaling Considerations

### For Growth:

1. **Add Authentication**
   - JWT tokens
   - Role-based access control

2. **Add Caching**
   - Redis for frequently accessed data
   - Client-side caching strategies

3. **Add Queuing**
   - Bull/RabbitMQ for async tasks
   - Background job processing

4. **Add Monitoring**
   - Error tracking (Sentry)
   - Performance monitoring (New Relic)

5. **Add Testing**
   - Unit tests (Jest)
   - Integration tests
   - E2E tests (Cypress)

6. **Database Optimization**
   - Indexing strategy
   - Query optimization
   - Data archiving

## Future Enhancements

1. **Authentication System**
   - User registration/login
   - Email verification
   - Password reset

2. **Payment Integration**
   - Stripe/Razorpay
   - Payment webhooks
   - Recurring invoices

3. **File Management**
   - Cloud storage (AWS S3)
   - File uploads
   - Document versioning

4. **Notifications**
   - Email notifications
   - SMS alerts
   - In-app notifications

5. **Analytics**
   - Dashboard metrics
   - Revenue reports
   - Client performance

6. **Integrations**
   - Google Drive sync
   - WhatsApp integration
   - Accounting software
