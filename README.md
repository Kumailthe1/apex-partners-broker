# Apex Wealth Partners - Broker Platform

A modern, secure trading platform built with Next.js and PHP backend.

 Repository: [https://github.com/Kumailthe1/broker](https://github.com/Kumailthe1/broker)

## 🚀 Features

- **User Authentication**: Secure registration and login system
- **Dashboard**: Interactive trading dashboard with real-time data
- **Deposit & Withdrawal**: Manage funds with ease
- **Admin Panel**: Full user management and balance control
- **Interactive Charts**: TradingView integration for market analysis
- **Responsive Design**: Beautiful UI that works on all devices

## 📁 Project Structure

```
Broker/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Homepage
│   ├── login/             # Login page
│   ├── signup/            # Registration page
│   └── dashboard/         # Dashboard pages
├── backend/               # PHP backend
│   ├── api.php           # Main API endpoint
│   ├── classes/          # PHP classes (Model, Controller, etc.)
│   └── autoloader.inc.php
├── components/            # React components
│   ├── Navigation.tsx
│   ├── Footer.tsx
│   ├── TradingChart.tsx
│   └── DashboardLayout.tsx
├── lib/                   # Utilities
│   ├── api.ts            # API client
│   └── store/            # Redux store
├── database/
│   └── schema.sql        # Database schema
└── public/
    └── images/           # Logo and assets
```

## 🗄️ Database Setup

1. Create a MySQL database named `broker_db`
2. Import the schema:
```bash
mysql -u your_username -p broker_db < database/schema.sql
```

3. Update database credentials in `backend/classes/Dbh.class.php`:
```php
private $host = 'localhost';
private $user = 'your_username';
private $pwd = 'your_password';
private $dbName = 'broker_db';
```

## 🔧 Installation

1. **Install Node dependencies**:
```bash
npm install
```

2. **Configure API endpoint**:
Update `lib/api.ts` with your backend URL:
```typescript
export const API_BASE_URL = 'https://yourdomain.com/backend/api.php';
```

3. **Run development server**:
```bash
npm run dev
```

## 📡 API Endpoints

All requests go through `backend/api.php` with an `action` parameter:

### User Actions
- `register` - Create new user account
- `login` - Authenticate user
- `get_user_data` - Fetch user information
- `deposit` - Submit deposit request
- `withdraw` - Submit withdrawal request

### Admin Actions
- `admin_get_users` - List all users
- `admin_update_balance` - Update user balance
- `admin_delete_user` - Delete user account

### Example Request
```javascript
const response = await apiPostJson('', {
  email: 'user@example.com',
  password: 'password123'
}, { action: 'login' });
```

## 🎨 Customization

### Logo
Replace logo files in `public/images/`:
- `white-logo.png` - Dark mode logo
- `black-logo.png` - Light mode logo

### Colors
Edit `tailwind.config.ts` to customize the color scheme.

### Company Name
Update branding in:
- `components/Navigation.tsx`
- `components/Footer.tsx`
- `app/page.tsx`

## 🔐 Security Notes

- Passwords are hashed using PHP's `password_hash()`
- Always use HTTPS in production
- Update database credentials before deployment
- Enable CORS only for trusted domains in production

## 📦 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
```

### Backend (cPanel)
1. Upload `backend/` folder to your server
2. Ensure PHP 7.4+ is installed
3. Configure database connection
4. Set proper file permissions

## 🛠️ Tech Stack

- **Frontend**: Next.js 13, React, TypeScript, TailwindCSS
- **Backend**: PHP, MySQL
- **State Management**: Redux Toolkit with Redux Persist
- **Charts**: TradingView Widgets
- **Icons**: Lucide React

## 📄 License

Proprietary - All rights reserved © 2026 Apex Wealth Partners

## 🤝 Support

For support, email support@apexwealth.com
