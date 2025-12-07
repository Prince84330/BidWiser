# 🎯 BidWiser - Online Auction Platform

BidWiser is a full-stack online auction platform that connects auctioneers and bidders in a seamless, secure environment. The platform enables users to create auctions, place bids, manage payments, and track commissions with automated workflows.

![BidWiser](https://img.shields.io/badge/BidWiser-Auction%20Platform-red)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![React](https://img.shields.io/badge/React-19-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-8.10-green)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Project](#-running-the-project)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [User Roles](#-user-roles)
- [Super Admin Setup](#-super-admin-setup)
- [Email Configuration](#-email-configuration)
- [Features in Detail](#-features-in-detail)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🔐 Authentication & Security
- **User Registration** with role-based access (Auctioneer/Bidder)
- **OTP Email Verification** for account security
- **JWT-based Authentication** with secure cookie storage
- **Password Hashing** using bcrypt
- **Role-based Authorization** (Auctioneer, Bidder, Super Admin)

### 🏛️ Auction Management
- **Create Auctions** with images, descriptions, and time-based bidding
- **Real-time Bidding** with automatic highest bidder tracking
- **Auction Categories** (Electronics, Furniture, Art, Jewelry, etc.)
- **Auction Status Tracking** (Active, Ended, Republished)
- **Automated Auction Ending** with cron jobs

### 💰 Payment & Commission System
- **5% Commission** on successful auctions
- **Payment Proof Submission** with image upload
- **Commission Verification** by Super Admin
- **Automated Commission Tracking** via cron jobs
- **Payment Methods** (Bank Transfer, Razorpay, PayPal)

### 📊 Dashboard & Analytics
- **User Dashboard** with statistics and graphs
- **Leaderboard** showing top bidders
- **Monthly Revenue Tracking**
- **User Analytics** (Bidders vs Auctioneers)
- **Payment Proof Management**

### 🔔 Automated Notifications
- **Email Notifications** for auction winners
- **OTP Delivery** via email
- **Commission Settlement Notifications**
- **Automated Cron Jobs** for auction endings

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Redux Toolkit** - State management
- **React Router** - Routing
- **Tailwind CSS** - Styling
- **Chart.js** - Data visualization
- **Axios** - HTTP client
- **React Toastify** - Notifications

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Cloudinary** - Image storage
- **Nodemailer** - Email service
- **node-cron** - Scheduled tasks
- **express-fileupload** - File handling

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local or Atlas)
- **Git**

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd BidWiser
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

---

## ⚙️ Configuration

### Backend Configuration

1. Navigate to `backend/config/` directory
2. Create or edit `config.env` file:

```env
# MongoDB Connection
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority

# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# JWT Configuration
JWT_SECRET_KEY=your-secret-key-here-make-it-long-and-random
JWT_EXPIRE=7d
COOKIE_EXPIRE=7

# Cloudinary (Image Storage)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SERVICE=gmail
SMTP_EMAIL=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

### Frontend Configuration

The frontend is configured to connect to `http://localhost:5000` by default. If your backend runs on a different port, update the API URLs in:
- `frontend/src/store/slices/*.js`

---

## 🏃 Running the Project

### Development Mode

#### Start Backend Server

```bash
cd backend
npm run dev
```

Backend will run on `http://localhost:5000`

#### Start Frontend Server

```bash
cd frontend
npm run dev
```

Frontend will run on `http://localhost:5173`

### Production Build

#### Build Frontend

```bash
cd frontend
npm run build
```

#### Start Backend (Production)

```bash
cd backend
npm start
```

---

## 📁 Project Structure

```
BidWiser/
├── backend/
│   ├── automation/          # Cron jobs for auctions and commissions
│   ├── config/              # Environment configuration
│   ├── controllers/         # Request handlers
│   ├── database/            # MongoDB connection
│   ├── middlewares/         # Authentication, error handling
│   ├── models/              # Mongoose schemas
│   ├── router/              # API routes
│   ├── scripts/             # Utility scripts (createSuperAdmin)
│   ├── utils/               # Helper functions (JWT, Email)
│   ├── app.js               # Express app configuration
│   └── server.js            # Server entry point
│
├── frontend/
│   ├── src/
│   │   ├── pages/           # React page components
│   │   ├── store/           # Redux store and slices
│   │   ├── layout/          # Layout components
│   │   ├── custom-components/  # Reusable components
│   │   └── lib/             # Utility functions
│   ├── public/              # Static assets
│   └── package.json
│
└── README.md
```

---

## 🔌 API Endpoints

### Authentication
- `POST /api/v1/users/register` - Register new user
- `POST /api/v1/users/login` - User login
- `GET /api/v1/users/me` - Get current user profile
- `GET /api/v1/users/logout` - User logout
- `POST /api/v1/users/verify` - Verify OTP
- `POST /api/v1/users/resend-otp` - Resend OTP
- `GET /api/v1/users/leaderboard` - Get leaderboard

### Auctions
- `POST /api/v1/auctionitem/create` - Create new auction (Auctioneer only)
- `GET /api/v1/auctionitem/allitems` - Get all auctions
- `GET /api/v1/auctionitem/auction/:id` - Get auction details
- `GET /api/v1/auctionitem/myitems` - Get my auctions (Auctioneer only)
- `DELETE /api/v1/auctionitem/delete/:id` - Delete auction (Auctioneer only)
- `PUT /api/v1/auctionitem/item/republish/:id` - Republish auction (Auctioneer only)

### Bidding
- `POST /api/v1/bid/place/:id` - Place a bid on auction

### Commission
- `POST /api/v1/commission/proof` - Submit payment proof (Auctioneer only)

### Super Admin
- `GET /api/v1/superadmin/paymentproofs/getall` - Get all payment proofs
- `GET /api/v1/superadmin/paymentproof/:id` - Get payment proof details
- `PUT /api/v1/superadmin/paymentproof/status/update/:id` - Update proof status
- `DELETE /api/v1/superadmin/paymentproof/delete/:id` - Delete payment proof
- `DELETE /api/v1/superadmin/auctionitem/delete/:id` - Delete any auction
- `GET /api/v1/superadmin/users/getall` - Get all users statistics
- `GET /api/v1/superadmin/monthlyincome` - Get monthly revenue

---

## 👥 User Roles

### 🎭 Auctioneer
- Create and manage auctions
- View their own auctions
- Submit payment proof for commission
- Republish items if bidder doesn't pay
- Pay 5% commission on successful auctions

### 🎯 Bidder
- Browse and search auctions
- Place bids on items
- View auction details
- Track bidding history
- View leaderboard

### 👑 Super Admin
- Access admin dashboard
- Approve/reject payment proofs
- View all users and statistics
- Delete any auction
- View monthly revenue
- Manage commission settlements

---

## 👑 Super Admin Setup

### Method 1: Using Script (Recommended)

```bash
cd backend
npm run create-admin
```

This creates a Super Admin with default credentials:
- **Email**: `bidwiser3@gmail.com`
- **Password**: `Bidwiser@10`

### Method 2: Custom Credentials

```bash
node scripts/createSuperAdmin.js "Your Name" "your-email@example.com" "YourPassword" "1234567890" "Your Address"
```

**⚠️ Important**: Change the default password immediately after first login!

---

## 📧 Email Configuration

Email is required for:
- OTP verification
- Auction winner notifications
- Commission settlement notifications

### Gmail Setup (Recommended)

1. Enable **2-Step Verification** on your Google Account
2. Generate **App Password**: https://myaccount.google.com/apppasswords
3. Add to `backend/config/config.env`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SERVICE=gmail
SMTP_EMAIL=your-email@gmail.com
SMTP_PASSWORD=your-16-character-app-password
```

**📖 Detailed Guide**: See [EMAIL_SETUP_GUIDE.md](./EMAIL_SETUP_GUIDE.md)

**💡 Development Mode**: If email is not configured, OTP will be logged to console for testing.

---

## 🎯 Features in Detail

### How It Works

1. **Registration**: Users register as Auctioneer or Bidder
2. **OTP Verification**: Account verification via email OTP
3. **Auction Creation**: Auctioneers create auctions with images and details
4. **Bidding**: Bidders place bids on active auctions
5. **Auction Ending**: Automated cron job ends auctions and calculates winners
6. **Payment**: Winner receives email with payment instructions
7. **Commission**: Auctioneer pays 5% commission to platform
8. **Verification**: Super Admin verifies payment proofs
9. **Settlement**: Commission is settled automatically

### Automated Processes

- **Auction Ending**: Cron job runs every minute to check and end expired auctions
- **Commission Calculation**: Automatically calculates 5% commission on ended auctions
- **Commission Verification**: Cron job processes approved payment proofs
- **Email Notifications**: Automated emails for winners and settlements

---

## 🧪 Testing

### Test User Registration

1. Register as **Auctioneer** or **Bidder**
2. Verify OTP (check email or console)
3. Login with credentials

### Test Auction Flow

1. Login as **Auctioneer**
2. Create an auction
3. Login as **Bidder**
4. Place bids on the auction
5. Wait for auction to end (or manually update endTime in database)
6. Check email for winner notification

### Test Super Admin

1. Create Super Admin using script
2. Login with Super Admin credentials
3. Access `/dashboard` route
4. View payment proofs and manage system

---

## 🐛 Troubleshooting

### MongoDB Connection Error

- Check `MONGO_URI` in `config.env`
- Verify MongoDB is running
- Check network connectivity

### Email Not Sending

- Verify SMTP configuration in `config.env`
- Check App Password (Gmail) is correct
- Check spam folder
- OTP is logged to console in development mode

### Authentication Issues

- Clear browser cookies
- Check JWT_SECRET_KEY is set
- Verify CORS settings match frontend URL

### Image Upload Fails

- Verify Cloudinary credentials
- Check image file size and format
- Ensure Cloudinary account is active

---

## 📝 Environment Variables Reference

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET_KEY` | Secret for JWT tokens | `your-secret-key` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `your-cloud-name` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `123456789` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `secret-key` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Backend server port | `3000` |
| `NODE_ENV` | Environment mode | `development` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |
| `JWT_EXPIRE` | JWT token expiration | `7d` |
| `COOKIE_EXPIRE` | Cookie expiration (days) | `7` |

### Email Variables (Optional for Development)

| Variable | Description | Example |
|----------|-------------|---------|
| `SMTP_HOST` | SMTP server host | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP server port | `587` |
| `SMTP_SERVICE` | Email service name | `gmail` |
| `SMTP_EMAIL` | Sender email address | `your-email@gmail.com` |
| `SMTP_PASSWORD` | Email password/app password | `app-password` |

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License.

---

## 👨‍💻 Author

**BidWiser Development Team**

---

## 🙏 Acknowledgments

- MongoDB for database services
- Cloudinary for image storage
- All open-source contributors

---

## 📞 Support

For support, email support@bidwiser.com or open an issue in the repository.

---

## 🔄 Version History

- **v1.0.0** - Initial release
  - User authentication with OTP
  - Auction creation and bidding
  - Commission system
  - Super Admin dashboard
  - Automated cron jobs

---

**Made with ❤️ by the BidWiser Team**

