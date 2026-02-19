# Menbere Tours (Natours)

A full-featured tour booking application built with Node.js, Express, MongoDB, and more.

![Node.js](https://img.shields.io/badge/Node.js-20.x-green)
![Express](https://img.shields.io/badge/Express-4.x-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-8.0-green)
![License](https://img.shields.io/badge/License-ISC-yellow)

## Features

- � Tours listing with search and filtering
- 👤 User authentication (signup, login, password reset)
- 📱 Responsive design
- ⭐ Tour ratings and reviews
- 🛒 Tour booking with Stripe integration
- 🔒 Secure payment processing
- 📧 Email notifications
- 🎫 Booking management

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT, bcrypt
- **Payments:** Stripe
- **Email:** MailerSend
- **Frontend:** Pug templates, CSS
- **Security:** Helmet, express-mongo-sanitize, xss-clean

## Installation

### Prerequisites

- Node.js 20.x or higher
- MongoDB (local or Atlas)
- npm or yarn

### Clone the Repository

```bash
git clone https://github.com/Natnael-74/MENBERE-TOUR.git
cd MENBERE-TOUR
```

### Install Dependencies

```bash
npm install
```

### Configuration

Create a `config.env` file in the root directory:

```env
NODE_ENV=development
PORT=3000

# Database (use DATABASE_LOCAL for local MongoDB)
DATABASE=mongodb+srv://<username>:<password>@cluster0.xxxxxx.mongodb.net/?appName=Cluster0
DATABASE_PASSWORD=<your_password>

# Or use local database
DATABASE_LOCAL=mongodb://localhost:27017/Menbere-Tour

# JWT
JWT_SECRET=<your_secure_random_string>
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90

# Email
EMAIL_HOST=sandbox.smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USERNAME=<your_mailtrap_username>
EMAIL_PASSWORD=<your_mailtrap_password>
EMAIL_FROM=your_email@example.com

# Stripe (for payments)
STRIPE_SECRET_KEY=sk_test_xxx
```

### Run the Application

```bash
# Development
npm run start:dev

# Production
npm start
```

Visit `http://localhost:3000` in your browser.

### Import Sample Data

```bash
cd dev-data/data
node importDevData.js --import
```

## Project Structure

```
├── config/
│   └── env.js              # Environment configuration
├── controllers/
│   ├── authController.js   # Authentication logic
│   ├── bookingController.js # Booking management
│   ├── errorController.js  # Error handling
│   ├── tourController.js   # Tour operations
│   ├── userController.js   # User management
│   └── viewsController.js  # View rendering
├── models/
│   ├── bookingModel.js     # Booking schema
│   ├── reviewModel.js      # Review schema
│   ├── tourModel.js        # Tour schema
│   └── userModel.js        # User schema
├── public/
│   ├── css/               # Stylesheets
│   ├── img/               # Images
│   └── js/                # Frontend JavaScript
├── routes/
│   ├── bookingRoutes.js    # Booking API routes
│   ├── reviewRoutes.js     # Review API routes
│   ├── tourRoutes.js      # Tour API routes
│   ├── userRoutes.js      # User API routes
│   └── viewRoutes.js      # Page routes
├── utils/
│   ├── APIFeatures.js     # Query features
│   ├── appError.js       # Custom error class
│   ├── catchAsync.js      # Async error handler
│   ├── directory.js       # Directory utilities
│   ├── email.js           # Email sending
│   └── signToken.js       # JWT signing
├── views/                 # Pug templates
├── dev-data/             # Development data
├── app.js               # Express app setup
├── server.js            # Server entry point
└── package.json         # Dependencies
```

## Author

Natnael Endale
