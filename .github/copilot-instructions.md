# VSSCT Project - Copilot Instructions

## Project Overview
Full-stack monorepo for Vishwa Shanti Sewa Charitable Trust (VSSCT):
- **Mobile**: React Native CLI (bare, NO Expo)
- **Admin**: React + Vite + Tailwind CSS  
- **Server**: Node.js + Express + MongoDB

## Credentials

### MongoDB Atlas
```
Database User: ksbmadmin
Password: adminadmin
URI: mongodb+srv://ksbmadmin:adminadmin@cluster0.uc4vjmv.mongodb.net/vssct?appName=Cluster0
```

### MSG91 OTP
```
AuthKey: 481994AVkkRO81zQp3694162dbP1
Sender ID: MYFUTK
Template ID: 1207176537962047175
DLT Entity/PE ID: 1201175738634400589
```

### Admin Login
```
Email: admin@vssct.com
Password: Ksbm@12345
```

### JWT Secrets
```
JWT_SECRET: vssct_jwt_secret_key_2026_super_secure_random_string
JWT_REFRESH_SECRET: vssct_refresh_jwt_secret_key_2026
```

## AWS Production Server (Lightsail)

### Server Details
```
IP: 13.235.94.56
Username: ubuntu
PEM Key: /Users/mac/Downloads/bharatdarshanls (1).pem
Region: ap-south-1 (Mumbai)
```

### SSH Command
```bash
ssh -i "/Users/mac/Downloads/bharatdarshanls (1).pem" ubuntu@13.235.94.56
```

### AWS Console Login
```
Email: vijaysharma786453@gmail.com
Password: Bharat@Darshan#121$
```

### Deployment URLs (Production)
- Admin Panel: http://13.235.94.56:3000
- Backend API: http://13.235.94.56:5001/api

### PM2 Commands
```bash
pm2 list                    # List all processes
pm2 restart vssct-api       # Restart API
pm2 restart vssct-admin     # Restart Admin
pm2 logs vssct-api          # View API logs
```

## Local Development

### Server: http://localhost:5001
### Admin: http://localhost:3001
### Mobile API: http://192.168.31.93:5001/api (local IP)

## Environment Variables (.env)

### Server .env
```
PORT=5001
NODE_ENV=production
MONGODB_URI=mongodb+srv://ksbmadmin:adminadmin@cluster0.uc4vjmv.mongodb.net/vssct?appName=Cluster0
JWT_SECRET=vssct_jwt_secret_key_2026_super_secure_random_string
JWT_REFRESH_SECRET=vssct_refresh_jwt_secret_key_2026
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d
OTP_PROVIDER=msg91
OTP_API_KEY=481994AVkkRO81zQp3694162dbP1
OTP_DEBUG=false
MSG91_SENDER_ID=MYFUTK
MSG91_TEMPLATE_ID=1207176537962047175
MSG91_EXPIRY=5
ADMIN_EMAIL=admin@vssct.com
ADMIN_PASSWORD=Ksbm@12345
WP_API_URL=https://vssct.com/wp-json/wp/v2
```

## Code Conventions

- ES6+ JavaScript (no TypeScript)
- async/await over Promises
- camelCase for variables/functions
- PascalCase for components
- SCREAMING_SNAKE_CASE for constants

## Key Patterns

### API Response Format
```javascript
{ success: true, data: {...}, message: 'Success' }
```

### Auth Flow
1. User enters phone → Send OTP via MSG91
2. Verify OTP → Return JWT tokens
3. Complete profile (mandatory)
4. Access main content

### Content Gating
- Non-authenticated: Only see excerpts
- Authenticated: Full content access

## File Structure

```
/server/src/
  config/     - DB, env configuration
  models/     - User, Otp, Admin, Notification
  controllers/ - Request handlers
  routes/     - Express routes
  services/   - OTP, JWT, WordPress
  middlewares/ - Auth middleware

/admin/src/
  pages/      - Login, Dashboard, Users, Notifications
  components/ - Layout, ProtectedRoute
  store/      - Zustand auth store
  lib/        - API client

/mobile/src/ (VSSCTApp)
  screens/auth/   - Login, CompleteProfile
  screens/main/   - Home, Events, Profile
  navigation/     - AppNavigator
  store/          - authStore
  lib/            - api, constants
```

## Premium UI/UX Guidelines

- Color scheme: Orange gradient (#FF6B00 → #FF8A3D)
- Typography: Clean, modern, readable
- Animations: Smooth fade/slide transitions
- Cards: Rounded corners (16-24px), subtle shadows
- Buttons: Gradient backgrounds with press effects

## Deployment Notes

### Mobile App
- APK Location: /Users/mac/vssct-app/VSSCTApp/android/app/build/outputs/apk/release/app-release.apk
- Package: com.vssctapp
- API URL in app: http://13.235.94.56:5001/api

### Lightsail Firewall Ports
- SSH: 22
- HTTP: 80
- HTTPS: 443
- Custom TCP: 3000 (Admin)
- Custom TCP: 5001 (API)
