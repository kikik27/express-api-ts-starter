# Express API Starter with TypeScript

A modern Express.js API starter template with TypeScript, featuring authentication, caching, email functionality, and database integration.

## Features

### Core Dependencies
* Express.js with TypeScript
* PostgreSQL with Drizzle ORM
* Redis caching with IORedis
* Email support with Nodemailer
* Template rendering with Mustache

### Authentication & Security
* JWT-based authentication with refresh tokens
* Password hashing with BCrypt
* Password reset functionality
* Email verification
* Request validation with Zod
* Security headers with Helmet
* CORS support

### Development Tools
* ESLint with Airbnb TypeScript configuration
* Jest for testing
* Supertest for API testing
* Nodemon for development
* TypeScript type checking
* Drizzle Kit for database migrations

## Quick Start

1. **Install Dependencies**
```bash
npm install
```

2. **Environment Setup**
Create a `.env` file:
```env
# Server Configuration
NODE_ENV=development
PORT=3000

# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-here
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here

# Email Configuration (Example for Gmail)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your-email@gmail.com
MAIL_PASSWORD=your-app-specific-password
FRONTEND_URL=http://localhost:3000

# Redis Cache Configuration
REDIS_PREFIX=api_cache_
REDIS_HOST=localhost
REDIS_PORT=6379
```

3. **Database Setup**
```bash
npx drizzle-kit generate:pg
npx drizzle-kit push:pg
```

4. **Start Development Server**
```bash
npm run dev
```

## API Endpoints

### Authentication
* `POST /api/auth/register` - Register new user
* `POST /api/auth/login` - User login
* `POST /api/auth/forgot-password` - Request password reset
* `POST /api/auth/reset-password` - Reset password
* `GET /api/auth/me` - Get current user

### Users
* `GET /api/users` - List users (paginated)

## Available Scripts
* `npm run dev` - Start development server
* `npm run build` - Build for production
* `npm run start:dist` - Start production server
* `npm run typecheck` - Check TypeScript types
* `npm run lint` - Run ESLint
* `npm test` - Run tests
