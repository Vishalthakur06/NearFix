# NearFix - On-Demand Local Service Hiring Platform

A full-stack MERN application for hiring nearby service providers like electricians, plumbers, cleaners, drivers, etc.

## Tech Stack

- **Frontend:** React.js + Tailwind CSS
- **Backend:** Node.js + Express.js
- **Database:** MongoDB
- **Authentication:** JWT + bcrypt
- **Real-time:** Socket.io

## Features

- 🔐 JWT-based authentication
- 👥 Three user roles: Customer, Worker, Admin
- 📍 Location-based worker search
- 💼 Service booking system
- ⭐ Rating and review system
- 💬 Real-time chat (Socket.io)
- 📊 Admin dashboard
- 💰 Payment integration ready

## Setup Instructions

### Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/nearfix
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

4. Start the server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

## Project Structure

```
NearFix/
├── backend/
│   ├── src/
│   │   ├── models/          # MongoDB models
│   │   ├── controllers/     # Route controllers
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Auth middleware
│   │   └── config/          # Database config
│   ├── server.js            # Entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/      # React components
    │   ├── pages/           # Page components
    │   ├── context/         # Context API
    │   ├── services/        # API services
    │   └── App.js
    └── package.json
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register user/worker
- POST `/api/auth/login` - Login

### Workers
- GET `/api/workers/nearby` - Get nearby workers
- GET `/api/workers/profile` - Get worker profile
- PUT `/api/workers/availability` - Update availability

### Bookings
- POST `/api/bookings` - Create booking
- GET `/api/bookings` - Get user bookings
- PUT `/api/bookings/:id/status` - Update booking status
- PUT `/api/bookings/:id/rate` - Rate booking

### Admin
- GET `/api/admin/dashboard` - Dashboard stats
- GET `/api/admin/workers` - All workers
- PUT `/api/admin/workers/:id/approve` - Approve worker

## Default Credentials

Create an admin user manually in MongoDB:
```javascript
{
  name: "Admin",
  phone: "1234567890",
  password: "admin123", // Will be hashed
  role: "admin"
}
```

## Future Enhancements

- Google Maps integration
- Payment gateway (Razorpay/Stripe)
- Real-time location tracking
- Push notifications
- Mobile app (React Native)

## License

MIT
