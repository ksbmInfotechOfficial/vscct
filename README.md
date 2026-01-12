# VSSCT - Vishwa Shanti Sewa Charitable Trust

A complete full-stack application for VSSCT devotees featuring:
- 📱 **Mobile App** - React Native CLI (Premium UI/UX)
- 🖥️ **Admin Panel** - React + Vite + Tailwind CSS
- 🔧 **Backend API** - Node.js + Express + MongoDB

## 🚀 Quick Start

### 1. Start Backend Server
```bash
cd server
npm install
npm run dev
```
Server will start at: `http://localhost:5000`

### 2. Start Admin Panel
```bash
cd admin
npm install
npm run dev
```
Admin Panel: `http://localhost:3000`

### 3. Start Mobile App
```bash
cd mobile
npm install
npx react-native run-android
# or
npx react-native run-ios
```

## 🔐 Admin Credentials

| Field | Value |
|-------|-------|
| **URL** | http://localhost:3000 |
| **Email** | admin@vssct.com |
| **Password** | Ksbm@12345 |

## 📱 Mobile App Features

- **OTP Login** via MSG91
- **Premium 2026 UI/UX** (Cred/Paytm inspired)
- **Smooth Animations**
- **Content from WordPress** (vssct.com)
- **Push Notifications** (Firebase FCM)
- **Profile Management**
- **Content Gating** (login required for full content)

## 🖥️ Admin Panel Features

- **Dashboard** with user stats
- **User Management** - search, filter, view
- **Push Notifications** - send to all/specific users
- **Content Moderation**

## 📁 Project Structure

```
vssct-app/
├── server/          # Node.js Backend
│   ├── src/
│   │   ├── config/      # DB & env config
│   │   ├── models/      # Mongoose schemas
│   │   ├── controllers/ # Request handlers
│   │   ├── routes/      # API routes
│   │   ├── services/    # Business logic
│   │   └── middlewares/ # Auth middleware
│   └── .env
├── admin/           # React Admin Panel
│   └── src/
│       ├── pages/       # Dashboard, Users, Notifications
│       ├── components/  # Layout, ProtectedRoute
│       └── lib/         # API client
├── mobile/          # React Native App
│   └── src/
│       ├── screens/     # Auth & Main screens
│       ├── navigation/  # React Navigation
│       ├── store/       # Zustand stores
│       └── lib/         # API & constants
└── README.md
```

## 🔑 Environment Variables

### Server (.env)
```env
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret
OTP_API_KEY=msg91_widget_id
OTP_DEBUG=true
ADMIN_EMAIL=admin@vssct.com
ADMIN_PASSWORD=Ksbm@12345
```

### Admin (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

### Mobile (constants.js)
```js
API_URL = 'http://YOUR_LOCAL_IP:5000/api'
```

## 📞 API Endpoints

### Auth
- `POST /api/auth/send-otp` - Send OTP
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/admin/login` - Admin login
- `POST /api/auth/refresh-token` - Refresh JWT

### User
- `GET /api/user/profile` - Get profile
- `PUT /api/user/profile` - Update profile
- `POST /api/user/fcm-token` - Register FCM token

### Content
- `GET /api/content/posts` - Get posts
- `GET /api/content/categories` - Get categories
- `GET /api/content/events` - Get events

### Admin
- `GET /api/admin/stats` - Dashboard stats
- `GET /api/admin/users` - List users
- `POST /api/admin/notifications` - Send notification

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Mobile | React Native CLI 0.73 |
| Admin | React 18 + Vite + Tailwind |
| Backend | Node.js + Express |
| Database | MongoDB Atlas |
| OTP | MSG91 |
| Push | Firebase FCM |
| Auth | JWT (Access + Refresh) |

## 📄 License

© 2026 VSSCT - Vishwa Shanti Sewa Charitable Trust
