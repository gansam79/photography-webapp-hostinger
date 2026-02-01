# Quick Reference Guide

## 🚀 Starting the Application

### Start Both Servers (Recommended Setup)

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```
Expected output: "🚀 Server running on port 5000"

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```
Expected output: "➜ Local: http://localhost:3000"

## 📍 Important URLs

| Purpose | URL |
|---------|-----|
| Frontend App | http://localhost:3000 |
| API Base | http://localhost:5000/api |
| Health Check | http://localhost:5000/api/health |
| MongoDB | (Check .env in server/) |

## 🔧 Common Commands

### Backend Commands
```bash
# Development with auto-reload
npm run dev

# Production start
npm start

# Check dependencies
npm list

# Install new package
npm install package-name
```

### Frontend Commands
```bash
# Development with hot reload
npm run dev

# Production build
npm run build

# Preview built app
npm run preview
```

## 📝 Environment Variables

### Server (.env)
```
MONGODB_URI=mongodb+srv://user:pass@cluster...
DATABASE_NAME=photography-local
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### Client (.env)
```
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Photography Billing System
VITE_APP_VERSION=1.0.0
```

## 🗂️ File Organization Quick Map

### Adding a New Feature (Example: Add "Reports")

1. **Backend Model** → `server/models/Report.js`
2. **Backend Controller** → `server/controllers/reportController.js`
3. **Backend Routes** → `server/routes/reportRoutes.js`
4. **Register Routes** → Update `server/server.js`
5. **Client Service** → `client/src/services/reportService.js`
6. **Client Hook** → `client/src/hooks/useReport.js` (if needed)
7. **Client Page** → `client/src/pages/Reports.jsx`
8. **Update Navigation** → `client/src/components/common/Navigation.jsx`

## 💾 Database Quick Reference

### Connect to MongoDB
```bash
# From mongo shell
mongosh "mongodb+srv://cluster0.xxx.mongodb.net/" --username your_username

# View databases
show dbs

# Use specific database
use photography-local

# View collections
show collections

# View documents
db.clients.find()
```

## 🔌 API Quick Examples

### Create a Client
```bash
curl -X POST http://localhost:5000/api/clients \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "category": "VIP"
  }'
```

### Get All Clients
```bash
curl http://localhost:5000/api/clients
```

### Get Payment Summary
```bash
curl http://localhost:5000/api/payments/summary
```

## 🐛 Debugging Tips

### Check Server Logs
Look for these indicators:
- ✅ "MongoDB connected successfully"
- ✅ "🚀 Server running on port 5000"
- ❌ Port errors: "EADDRINUSE"
- ❌ MongoDB errors: Check connection string

### Check Client Console
Open DevTools in browser:
- Look for CORS errors
- Check Network tab for API calls
- Check Console for JavaScript errors

### Common Issues

| Issue | Solution |
|-------|----------|
| "EADDRINUSE: port 5000" | Kill process: `lsof -ti:5000 \| xargs kill -9` |
| "MongoDB connection error" | Verify URI in .env, check IP whitelist |
| CORS error | Verify CORS_ORIGIN in server .env |
| "Cannot find module" | Run `npm install` in that directory |
| Build fails | Clear node_modules: `rm -rf node_modules && npm install` |

## 📊 API Endpoints Cheat Sheet

### Clients
```
GET    /api/clients              # Get all
GET    /api/clients/:id          # Get one
POST   /api/clients              # Create
PUT    /api/clients/:id          # Update
DELETE /api/clients/:id          # Delete
GET    /api/clients/search?q=... # Search
```

### Quotations
```
GET    /api/quotations           # Get all
POST   /api/quotations           # Create
PUT    /api/quotations/:id       # Update
DELETE /api/quotations/:id       # Delete
POST   /api/quotations/:id/duplicate  # Duplicate
```

### Invoices
```
GET    /api/invoices             # Get all
POST   /api/invoices             # Create
PATCH  /api/invoices/:id/payment-status  # Update status
GET    /api/invoices/overdue     # Get overdue
```

### Payments
```
POST   /api/payments/invoice/:id  # Record payment
GET    /api/payments/invoice/:id  # Get invoice payments
GET    /api/payments/summary      # Get summary
```

## 🎯 Development Workflow

### 1. Making Changes

**Backend:**
```bash
1. Edit file in server/
2. Save (auto-reload with nodemon)
3. Test API in browser/Postman
```

**Frontend:**
```bash
1. Edit file in client/src/
2. Save (auto-reload with Vite)
3. See changes immediately
```

### 2. Testing a New Endpoint

```bash
# Test with curl
curl http://localhost:5000/api/your-endpoint

# Or use Postman
# Or browser: http://localhost:5000/api/your-endpoint
```

### 3. Debugging Component

```javascript
// In React component
console.log('Data:', data);
console.log('Error:', error);
console.log('Loading:', loading);
```

## 🚀 Performance Tips

1. **Check MongoDB Indexes**
   - Quotation by clientId: ✅ Added
   - Invoice by paymentStatus: ✅ Added
   - Payment by invoiceId: ✅ Added

2. **API Optimization**
   - Use specific queries instead of getAll
   - Add pagination (future enhancement)
   - Cache frequently accessed data

3. **Frontend Optimization**
   - Use useMemo for expensive calculations
   - Lazy load components
   - Optimize images

## 📚 Documentation Links

- **Full Setup Guide**: `docs/SETUP.md`
- **Architecture**: `docs/PROJECT_STRUCTURE.md`
- **API Docs**: `docs/API.md`
- **Project Overview**: `README.md`
- **Conversion Summary**: `CONVERSION_SUMMARY.md`

## 🔐 Security Checklist

Before deploying:
- [ ] Change MongoDB password
- [ ] Use strong environment variables
- [ ] Add authentication (JWT)
- [ ] Configure CORS properly
- [ ] Add rate limiting
- [ ] Enable HTTPS
- [ ] Validate all inputs
- [ ] Sanitize error messages
- [ ] Use environment-specific configs

## 📱 Testing Scenarios

### Scenario 1: Create Full Quotation
1. Add Client (name, email, phone)
2. Create Quotation (add client, services)
3. Convert to Invoice
4. Record Payment
5. View on Dashboard

### Scenario 2: Track Multiple Invoices
1. Create 3+ Invoices
2. Record partial payments
3. Check overdue invoices
4. Get payment summary
5. Verify client totals updated

### Scenario 3: Manage Clients
1. Add 5 clients with different categories
2. Search for specific client
3. Update client info
4. View client history
5. Delete a client

## 🎓 Best Practices Applied

✅ **Backend**
- Separation of concerns (Routes/Controllers/Models)
- Validation at schema level
- Error handling middleware
- Proper HTTP status codes
- CORS configuration

✅ **Frontend**
- Custom hooks for logic
- Service layer for API
- Component composition
- State management with hooks
- Responsive design

✅ **Database**
- Schema validation
- Proper indexing
- Data relationships
- Timestamps on all docs

## 💡 Pro Tips

1. **Use Postman** - Test APIs before implementing in React
2. **Check Network Tab** - Debug API calls in browser
3. **Read Error Messages** - They tell you what's wrong
4. **Use Console.log** - Simple but effective debugging
5. **Restart Servers** - After major changes
6. **Clear Cache** - If seeing stale data
7. **Check .env** - Most issues are config-related

## 🚨 Critical URLs to Remember

```
Frontend: http://localhost:3000
Backend:  http://localhost:5000
API:      http://localhost:5000/api
Health:   http://localhost:5000/api/health
```

---

**Keep this file handy for quick reference while developing! 🚀**
