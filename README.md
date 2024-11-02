# Express API Starter with TypeScript

A modern Express.js API starter template with TypeScript, featuring authentication, email functionality, and database integration.

## Features

### Core Dependencies
* Express.js with TypeScript
* PostgreSQL with Drizzle ORM
* Email support with Nodemailer
* Template rendering with Mustache

### Authentication & Security
* JWT-based authentication
* Password reset functionality
* Email verification
* Request validation with Zod
* Security headers with Helmet
* CORS support

### Development Tools
* ESLint with TypeScript support
* Jest for testing
* Nodemon for development
* TypeScript type checking

## Quick Start

1. **Install Dependencies**
```bash
npm install
```

2. **Environment Setup**
Create a `.env` file:
```env
# Server
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL="your-postgresql-connection-string"

# JWT
JWT_SECRET="your-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret-key"

# Email
MAIL_HOST="your-smtp-host"
MAIL_PORT=2525
MAIL_USER="your-mail-user"
MAIL_PASSWORD="your-mail-password"
FRONTEND_URL="http://localhost:3000"
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
